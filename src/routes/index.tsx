import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { PageShell } from "@/components/pawbook/SiteChrome";
import {
  useCMS,
  updateCMSData,
  type Mood,
  type KindnessPost,
  type Animal,
} from "@/lib/pawbook-data";
import { PetQuizModal } from "@/components/pawbook/PetQuizModal";
import { InstagramStories } from "@/components/pawbook/InstagramStories";
import { playPop, playMeow, playBark, playPageFlip } from "@/lib/sound";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";
import confetti from "canvas-confetti";

import { useServerFn } from "@tanstack/react-start";
import { resolveAsset } from "@/lib/storage";
import {
  submitFoundFriend,
  uploadGuestPhoto,
  submitGuestFriend,
} from "@/lib/submissions.functions";
import { weaveStory } from "@/lib/ai-story.functions";
import { useSession } from "@/hooks/use-session";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

// Import extracted components
import { HeroSection } from "@/components/pawbook/HeroSection";
import { PawPlayroom } from "@/components/pawbook/PawPlayroom";
import { PawBookGrid } from "@/components/pawbook/PawBookGrid";
import { StoriesSection } from "@/components/pawbook/StoriesSection";
import { CommunityFriends } from "@/components/pawbook/CommunityFriends";
import { ExploreSection } from "@/components/pawbook/ExploreSection";

type FoundFriendRow = Database["public"]["Tables"]["found_friends"]["Row"];
type WeaverMode = "story" | "pov" | "caption" | "adoption";

export const Route = createFileRoute("/")({
  loader: async () => {
    try {
      const { data, error } = await supabase
        .from("found_friends")
        .select("*")
        .eq("status", "approved")
        .order("created_at", { ascending: false });
      if (error) console.error("[loader] Supabase error:", error.message);
      return { approved: data || [] };
    } catch (err) {
      console.error("[loader] Supabase threw during SSR:", err);
      return { approved: [] };
    }
  },
  head: () => ({
    meta: [
      { title: "PawBook — Little Paws. Big Stories." },
      {
        name: "description",
        content:
          "Meet Coco, Moti, Kitty, Tommy and Chetak — a cozy village of beloved animals whose stories live forever in PawBook.",
      },
    ],
  }),
  component: HomePage,
});

// Floating paw decorations that react to scroll position
function ScrollFlowDecor() {
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 40, damping: 20 });

  const y1 = useTransform(smoothProgress, [0, 1], ["0%", "-180%"]);
  const y2 = useTransform(smoothProgress, [0, 1], ["0%", "-120%"]);
  const y3 = useTransform(smoothProgress, [0, 1], ["0%", "-240%"]);
  const y4 = useTransform(smoothProgress, [0, 1], ["0%", "-90%"]);
  const rotate1 = useTransform(smoothProgress, [0, 1], [0, 360]);
  const rotate2 = useTransform(smoothProgress, [0, 1], [0, -280]);
  const opacity1 = useTransform(smoothProgress, [0, 0.15, 0.85, 1], [0, 0.18, 0.18, 0]);
  const opacity2 = useTransform(smoothProgress, [0, 0.1, 0.9, 1], [0, 0.12, 0.12, 0]);
  const scale1 = useTransform(smoothProgress, [0, 0.5, 1], [0.6, 1.2, 0.8]);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      <motion.div
        style={{ y: y1, rotate: rotate1, opacity: opacity1, scale: scale1 }}
        className="absolute -top-8 left-[8%] text-5xl select-none"
      >
        🐾
      </motion.div>
      <motion.div
        style={{ y: y2, rotate: rotate2, opacity: opacity2 }}
        className="absolute top-[12%] right-[6%] text-7xl select-none"
      >
        🐾
      </motion.div>
      <motion.div
        style={{ y: y3, opacity: opacity1 }}
        className="absolute top-[35%] left-[3%] text-3xl select-none"
      >
        🐾
      </motion.div>
      <motion.div
        style={{ y: y4, rotate: rotate1, opacity: opacity2 }}
        className="absolute top-[55%] right-[10%] text-2xl select-none"
      >
        🐾
      </motion.div>
      <motion.div
        style={{ y: y2, rotate: rotate2, opacity: opacity1 }}
        className="absolute top-[75%] left-[15%] text-4xl select-none"
      >
        🐾
      </motion.div>
      <motion.div
        className="fixed top-0 left-0 right-0 h-0.5 bg-linear-to-r from-peach via-yellow to-peach origin-left z-50"
        style={{ scaleX: smoothProgress }}
      />
    </div>
  );
}

function HomePage() {
  const router = useRouter();
  const { approved } = Route.useLoaderData() as { approved: FoundFriendRow[] };
  const { animals, memories } = useCMS();
  const [featuredSlug, setFeaturedSlug] = useState("coco");
  const [quizOpen, setQuizOpen] = useState(false);

  // Community submissions pagination & filter
  const CARDS_PER_PAGE = 6;
  const [visibleCount, setVisibleCount] = useState(CARDS_PER_PAGE);
  const [speciesFilter, setSpeciesFilter] = useState<"all" | string>("all");

  // Scrapbook animation refs & states
  const villageRef = useRef<HTMLDivElement>(null);
  const [envelopeOpen, setEnvelopeOpen] = useState<Record<string, boolean>>({});

  const [flashActive, setFlashActive] = useState(false);

  useEffect(() => {
    const triggerFlash = () => {
      setFlashActive(true);
      setTimeout(() => setFlashActive(false), 600);
    };
    window.addEventListener("pawbook-trigger-flash", triggerFlash);
    return () => window.removeEventListener("pawbook-trigger-flash", triggerFlash);
  }, []);

  const parseHelpBoardItem = (r: FoundFriendRow) => {
    const storyStr = r.story || "";
    const typeMatch = storyStr.match(/\[type:([^\]]+)\]/);
    const statusMatch = storyStr.match(/\[status:([^\]]+)\]/);

    const needType = typeMatch ? typeMatch[1] : "Just sharing memory";
    const needStatus = statusMatch ? statusMatch[1] : "open";

    const cleanStory = storyStr
      .replace(/\[type:[^\]]+\]/g, "")
      .replace(/\[status:[^\]]+\]/g, "")
      .trim();

    return { needType, needStatus, cleanStory };
  };

  const handleHelpItem = async (friend: FoundFriendRow) => {
    const { needStatus } = parseHelpBoardItem(friend);
    let nextStatus = "helping";
    if (needStatus === "helping") {
      nextStatus = "resolved";
    } else if (needStatus === "resolved") {
      nextStatus = "open";
    }

    let updatedStory = friend.story;
    if (updatedStory.includes("[status:")) {
      updatedStory = updatedStory.replace(/\[status:[^\]]+\]/, `[status:${nextStatus}]`);
    } else {
      updatedStory = `${updatedStory} [status:${nextStatus}]`;
    }

    try {
      const { error } = await supabase
        .from("found_friends")
        .update({ story: updatedStory })
        .eq("id", friend.id);

      if (error) throw error;

      toast.success(
        `Status updated to: ${nextStatus === "helping" ? "Someone Helping 🟡" : "Help Completed 💚"}`,
      );
      router.invalidate();
    } catch (err) {
      const saved = localStorage.getItem("pawbook-local-submissions");
      if (saved) {
        const localList = JSON.parse(saved) as FoundFriendRow[];
        const updatedLocal = localList.map((item) => {
          if (item.id === friend.id) {
            let story = item.story;
            if (story.includes("[status:")) {
              story = story.replace(/\[status:[^\]]+\]/, `[status:${nextStatus}]`);
            } else {
              story = `${story} [status:${nextStatus}]`;
            }
            return { ...item, story };
          }
          return item;
        });
        localStorage.setItem("pawbook-local-submissions", JSON.stringify(updatedLocal));
        window.dispatchEvent(new Event("pawbook-local-sub-updated"));
        toast.success(
          `Local post updated to: ${nextStatus === "helping" ? "Someone Helping 🟡" : "Help Completed 💚"}`,
        );
      }
    }
  };

  const [isFlipped, setIsFlipped] = useState(false);
  const [currentBookPage, setCurrentBookPage] = useState(0);
  const [isBookFlipping, setIsBookFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<"next" | "prev">("next");
  const [flippedSlugs, setFlippedSlugs] = useState<Record<string, boolean>>({});

  const toggleFlip = (slug: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFlippedSlugs((prev) => ({
      ...prev,
      [slug]: !prev[slug],
    }));
  };

  useEffect(() => {
    setIsFlipped(false);
  }, [featuredSlug]);

  const featured = animals.find((a) => a.slug === featuredSlug) ?? animals[0];
  const others = animals.filter((a) => a.slug !== featured.slug);

  const [likes, setLikes] = useState<Record<string, number>>({});

  const [newCommentAuthor, setNewCommentAuthor] = useState("");
  const [newCommentText, setNewCommentText] = useState("");
  const [mapFilter, setMapFilter] = useState<
    "all" | "safe" | "needs-food" | "needs-care" | "new-friend"
  >("all");

  const handleAddComment = async (memoryId: string) => {
    if (!newCommentAuthor.trim() || !newCommentText.trim()) {
      toast.error("Please enter your name and comment!");
      return;
    }

    const updatedMemories = memories.map((mem) => {
      if (mem.id === memoryId) {
        const existingComments = mem.comments || [];
        return {
          ...mem,
          comments: [
            ...existingComments,
            {
              id: `c-${Date.now()}`,
              author: newCommentAuthor.trim(),
              text: newCommentText.trim(),
              date: new Date().toLocaleDateString(),
            },
          ],
        };
      }
      return mem;
    });

    await updateCMSData({ memories: updatedMemories });
    setNewCommentText("");
    toast.success("Kind comment added to memory! ❤️");
  };

  const [activePlayroomIndex, setActivePlayroomIndex] = useState(0);
  const handlePlayroomScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const scrollLeft = target.scrollLeft;
    const children = target.children;
    if (children.length > 0) {
      const cardWidth = children[0].clientWidth + 24;
      const index = Math.round(scrollLeft / cardWidth);
      setActivePlayroomIndex(Math.min(Math.max(0, index), 2));
    }
  };

  const [actionParticles, setActionParticles] = useState<
    { id: number; x: number; y: number; emoji: string }[]
  >([]);

  const handleAction = (
    memoryId: string,
    type: string,
    animalName: string,
    e?: React.MouseEvent<HTMLButtonElement>,
  ) => {
    setLikes((prev) => ({
      ...prev,
      [memoryId]: (prev[memoryId] || 0) + 1,
    }));
    const emojiMap: Record<string, string> = { Boop: "❤️", Treat: "🍪", Hug: "🐾" };
    const emoji = emojiMap[type] || "✨";
    toast.success(`${type} sent! ${animalName} received your love ${emoji}`);

    if (animalName.toLowerCase().includes("kitty")) {
      playMeow();
    } else {
      playBark();
    }

    if (e) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top;

      const newParticles = Array.from({ length: 4 }).map((_, i) => ({
        id: Date.now() + i,
        x: x + (Math.random() * 30 - 15),
        y: y - 5,
        emoji,
      }));
      setActionParticles((prev) => [...prev, ...newParticles]);

      setTimeout(() => {
        setActionParticles((prev) =>
          prev.filter((p) => !newParticles.find((np) => np.id === p.id)),
        );
      }, 2000);
    }
  };

  // Paw cursor trail animation for desktop
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (Math.random() > 0.08) return;

      const trail = document.createElement("div");
      trail.className =
        "pointer-events-none fixed z-50 text-base select-none transition-all duration-700 opacity-60";
      trail.innerText = "🐾";
      trail.style.left = `${e.clientX}px`;
      trail.style.top = `${e.clientY}px`;
      const rot = Math.random() * 40 - 20;
      trail.style.transform = `translate(-50%, -50%) rotate(${rot}deg) scale(0.8)`;

      document.body.appendChild(trail);

      setTimeout(() => {
        trail.style.opacity = "0";
        trail.style.transform = `translate(-50%, -50%) rotate(${rot}deg) scale(0.2) translateY(10px)`;
      }, 50);

      setTimeout(() => {
        trail.remove();
      }, 700);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Hash scroll observer
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash) {
      const hash = window.location.hash.substring(1);
      setTimeout(() => {
        const el = document.getElementById(hash);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }, 300);
    }
  }, []);

  // Local community submissions state
  const [localSubmissions, setLocalSubmissions] = useState<FoundFriendRow[]>([]);
  const loadLocalSubmissions = () => {
    const saved = localStorage.getItem("pawbook-local-submissions");
    if (saved) {
      try {
        setLocalSubmissions(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  };

  useEffect(() => {
    loadLocalSubmissions();
    window.addEventListener("pawbook-local-sub-updated", loadLocalSubmissions);
    return () => {
      window.removeEventListener("pawbook-local-sub-updated", loadLocalSubmissions);
    };
  }, []);

  const allSubmissions = [...localSubmissions, ...approved];

  // Explore tab states
  const [exploreTab, setExploreTab] = useState<"map" | "weaver">("map");

  // Map internal states
  const [foundPlaceAnimal, setFoundPlaceAnimal] = useState<string | null>(null);
  const mapAnimal = foundPlaceAnimal ? animals.find((a) => a.slug === foundPlaceAnimal) : null;

  // Story Weaver internal states
  const weave = useServerFn(weaveStory);
  const [weaverSlug, setWeaverSlug] = useState(animals[0]?.slug || "coco");
  useEffect(() => {
    if (animals.length > 0) {
      setWeaverSlug(animals[0].slug);
    }
  }, [animals]);

  const [weaverMode, setWeaverMode] = useState<WeaverMode>("pov");
  const [weaverMood, setWeaverMood] = useState("happy");
  const [weaverResult, setWeaverResult] = useState("");
  const [weaverLoading, setWeaverLoading] = useState(false);
  const [weaverError, setWeaverError] = useState<string | null>(null);

  const [isReunion, setIsReunion] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [showCertificate, setShowCertificate] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("reunion") === "true") {
        setIsReunion(true);
        setExploreTab("weaver");
        setWeaverResult("Click the Weave Reunion button to gather the village friends! 🌟");
      }
    }
  }, []);

  async function onWeaveGenerate() {
    setWeaverLoading(true);
    setWeaverError(null);
    setWeaverResult("");
    try {
      if (isReunion) {
        await new Promise((r) => setTimeout(r, 1200));
        setWeaverResult(
          `It was a perfect afternoon in the flower meadow. Bruno arrived first, proudly carrying a packet of Parle-G biscuits. Coco trotted along, looking like a friendly tiger. Moti joined next, wagging his tail happily. Kitty watched them gracefully from the low branch of a mango tree, Tommy came sprinting through the grass chasing a yellow butterfly, and Chetak walked in majestically, his jet-black coat shining under the sun. For the first time, all six friends shared a sunny spot together under the warm sky, happy to be part of the same loving village. 💮🐕🐶🐈🎒🍪🐎`,
        );
        setShowCertificate(true);
      } else {
        const res = await weave({
          data: { animalSlug: weaverSlug, mode: weaverMode, mood: weaverMood },
        });
        setWeaverResult(res.text);
      }
    } catch (e) {
      setWeaverError(e instanceof Error ? e.message : "Something went wrong. Try again.");
    } finally {
      setWeaverLoading(false);
    }
  }

  const currentWeaveAnimal = animals.find((a) => a.slug === weaverSlug) || animals[0];

  return (
    <PageShell>
      <ScrollFlowDecor />
      {flashActive && <div className="camera-flash animate-flash" />}

      {/* ==================== HOME SECTION ==================== */}
      <motion.div
        id="home"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="scroll-mt-24"
      >
        <section className="mx-auto max-w-5xl px-4 pt-4">
          <InstagramStories />
        </section>

        <HeroSection
          animals={animals}
          featured={featured}
          others={others}
          isFlipped={isFlipped}
          setIsFlipped={setIsFlipped}
          setFeaturedSlug={setFeaturedSlug}
          handleAction={handleAction}
          memoriesLength={memories.length}
        />

        <PawPlayroom
          featured={featured}
          animals={animals}
          handlePlayroomScroll={handlePlayroomScroll}
          handleAction={handleAction}
          setQuizOpen={setQuizOpen}
          activePlayroomIndex={activePlayroomIndex}
        />
      </motion.div>

      <PawBookGrid
        animals={animals}
        flippedSlugs={flippedSlugs}
        toggleFlip={toggleFlip}
        villageRef={villageRef}
      />

      <StoriesSection
        memories={memories}
        animals={animals}
        likes={likes}
        envelopeOpen={envelopeOpen}
        setEnvelopeOpen={setEnvelopeOpen}
        currentBookPage={currentBookPage}
        setCurrentBookPage={setCurrentBookPage}
        isBookFlipping={isBookFlipping}
        setIsBookFlipping={setIsBookFlipping}
        flipDirection={flipDirection}
        setFlipDirection={setFlipDirection}
        handleAction={handleAction}
        handleAddComment={handleAddComment}
        newCommentAuthor={newCommentAuthor}
        setNewCommentAuthor={setNewCommentAuthor}
        newCommentText={newCommentText}
        setNewCommentText={setNewCommentText}
      />

      <CommunityFriends
        allSubmissions={allSubmissions}
        speciesFilter={speciesFilter}
        setSpeciesFilter={setSpeciesFilter}
        visibleCount={visibleCount}
        setVisibleCount={setVisibleCount}
        CARDS_PER_PAGE={CARDS_PER_PAGE}
        handleHelpItem={handleHelpItem}
      />

      <ExploreSection
        animals={animals}
        exploreTab={exploreTab}
        setExploreTab={setExploreTab}
        mapFilter={mapFilter}
        setMapFilter={setMapFilter}
        setFoundPlaceAnimal={setFoundPlaceAnimal}
        foundPlaceAnimal={foundPlaceAnimal}
        mapAnimal={mapAnimal}
        isReunion={isReunion}
        weaverSlug={weaverSlug}
        setWeaverSlug={setWeaverSlug}
        weaverMode={weaverMode}
        setWeaverMode={setWeaverMode}
        weaverMood={weaverMood}
        setWeaverMood={setWeaverMood}
        onWeaveGenerate={onWeaveGenerate}
        weaverLoading={weaverLoading}
        weaverError={weaverError}
        weaverResult={weaverResult}
        currentWeaveAnimal={currentWeaveAnimal}
        showCertificate={showCertificate}
        playerName={playerName}
        setPlayerName={setPlayerName}
      />

      <PetQuizModal forceOpen={quizOpen} onClose={() => setQuizOpen(false)} />

      <style>{`
        @keyframes particleUp {
          0% { transform: translateY(0) scale(0.6); opacity: 0; }
          20% { opacity: 1; }
          100% { transform: translateY(-75px) scale(1.3) rotate(var(--rot-deg, 0deg)); opacity: 0; }
        }
        .animate-particle-up {
          animation: particleUp 1.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
        }
      `}</style>

      {actionParticles.map((p) => {
        const rot = Math.random() * 60 - 30;
        return (
          <span
            key={p.id}
            className="fixed pointer-events-none text-2xl z-50 animate-particle-up"
            style={
              {
                left: `${p.x}px`,
                top: `${p.y}px`,
                "--rot-deg": `${rot}deg`,
              } as React.CSSProperties & { [key: string]: string | number }
            }
          >
            {p.emoji}
          </span>
        );
      })}
    </PageShell>
  );
}
