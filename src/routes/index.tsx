import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { PageShell, SectionHeading } from "@/components/pawbook/SiteChrome";
import {
  useCMS,
  getAnimal,
  mapPlaces,
  updateCMSData,
  type Mood,
  type KindnessPost,
} from "@/lib/pawbook-data";
import { PetQuizModal } from "@/components/pawbook/PetQuizModal";
import { SpinWheel } from "@/components/pawbook/SpinWheel";
import { InstagramStories } from "@/components/pawbook/InstagramStories";
import { playPop, playRustle, playBark, playMeow } from "@/lib/sound";

import { useServerFn } from "@tanstack/react-start";
import { uploadToBucket } from "@/lib/storage";
import { submitFoundFriend } from "@/lib/submissions.functions";
import { weaveStory } from "@/lib/ai-story.functions";
import { useSession } from "@/hooks/use-session";
import { SignedImage, SignedVideo } from "@/components/pawbook/SignedImage";
import { copyToClipboard, shareContent } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import type { User } from "@supabase/supabase-js";

type FoundFriendRow = Database["public"]["Tables"]["found_friends"]["Row"];

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
          "Meet Coco, Moti, Kitty and Tommy — a cozy village of street friends whose stories live forever in PawBook.",
      },
    ],
  }),
  component: HomePage,
});

const orbitClasses = [
  { top: "0%", left: "10%", delay: "0s", size: "w-20 h-20" },
  { top: "10%", right: "0%", delay: "-1s", size: "w-16 h-16" },
  { bottom: "5%", right: "10%", delay: "-2s", size: "w-20 h-20" },
  { bottom: "15%", left: "0%", delay: "-3s", size: "w-16 h-16" },
];

type WeaverMode = "story" | "pov" | "caption" | "adoption";

function HomePage() {
  const router = useRouter();
  const { approved } = Route.useLoaderData() as { approved: FoundFriendRow[] };
  const { animals, memories } = useCMS();
  const [featuredSlug, setFeaturedSlug] = useState("coco");
  const [quizOpen, setQuizOpen] = useState(false);

  // Scrapbook animation refs & states
  const villageRef = useRef<HTMLDivElement>(null);
  const [villageInView, setVillageInView] = useState(false);
  const [envelopeOpen, setEnvelopeOpen] = useState<Record<string, boolean>>({});
  const [scrollProgress, setScrollProgress] = useState(0);

  // Observe village entering screen
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVillageInView(true);
        }
      },
      { threshold: 0.1 },
    );
    if (villageRef.current) observer.observe(villageRef.current);
    return () => observer.disconnect();
  }, []);

  // Track page scroll to expand memories thread/string line
  useEffect(() => {
    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      const progress = window.scrollY / docHeight;
      setScrollProgress(Math.min(progress * 1.5, 1)); // scale up speed slightly
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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

  const [extraLove, setExtraLove] = useState<Record<string, number>>({});
  const [extraTreats, setExtraTreats] = useState<Record<string, number>>({});
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
      const cardWidth = children[0].clientWidth + 24; // width + gap
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

  useEffect(() => {
    // Load dynamic extra stats from localStorage
    const love: Record<string, number> = {};
    const treats: Record<string, number> = {};
    animals.forEach((a) => {
      love[a.slug] = parseInt(localStorage.getItem(`pawbook-extra-love-${a.slug}`) || "0", 10);
      treats[a.slug] = parseInt(localStorage.getItem(`pawbook-extra-treats-${a.slug}`) || "0", 10);
    });
    setExtraLove(love);
    setExtraTreats(treats);
  }, [animals]);

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

  const [kindnessPosts, setKindnessPosts] = useState<KindnessPost[]>([]);
  const [newKindnessAuthor, setNewKindnessAuthor] = useState("");
  const [newKindnessText, setNewKindnessText] = useState("");
  const [newKindnessBadge, setNewKindnessBadge] = useState("Food Friend 🍲");
  const [kindnessPoints, setKindnessPoints] = useState(120);

  const handleSubmitKindness = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKindnessAuthor.trim() || !newKindnessText.trim()) return;

    const newPost: KindnessPost = {
      id: `kp-${Date.now()}`,
      author: newKindnessAuthor.trim(),
      text: newKindnessText.trim(),
      badge: newKindnessBadge,
      date: "Just now",
      points: 10,
    };

    const updated = [newPost, ...kindnessPosts];
    setKindnessPosts(updated);
    localStorage.setItem("pawbook-kindness-posts", JSON.stringify(updated));

    const nextPoints = kindnessPoints + 10;
    setKindnessPoints(nextPoints);
    localStorage.setItem("pawbook-kindness-points", nextPoints.toString());

    setNewKindnessAuthor("");
    setNewKindnessText("");

    toast.success("Kindness registered! You earned +10 Kindness Points! 🎉");
  };

  useEffect(() => {
    loadLocalSubmissions();
    window.addEventListener("pawbook-local-sub-updated", loadLocalSubmissions);

    const savedPosts = localStorage.getItem("pawbook-kindness-posts");
    if (savedPosts) {
      try {
        setKindnessPosts(JSON.parse(savedPosts));
      } catch (e) {
        console.error(e);
      }
    } else {
      const defaults: KindnessPost[] = [
        {
          id: "kp1",
          author: "Sejal",
          text: "Shared biscuits with Moti near College Gate today!",
          badge: "Food Friend 🍲",
          date: "Just now",
          points: 10,
        },
        {
          id: "kp2",
          author: "Aarav",
          text: "Cleaned Tommy's outdoor shelter and checked on his bandage.",
          badge: "Care Hero 🏥",
          date: "3 hours ago",
          points: 10,
        },
        {
          id: "kp3",
          author: "Sneha",
          text: "Uploaded Coco's cute childhood photos to the digital memory book.",
          badge: "Memory Keeper 📖",
          date: "1 day ago",
          points: 10,
        },
      ];
      setKindnessPosts(defaults);
      localStorage.setItem("pawbook-kindness-posts", JSON.stringify(defaults));
    }

    const savedPoints = localStorage.getItem("pawbook-kindness-points");
    if (savedPoints) {
      setKindnessPoints(parseInt(savedPoints, 10));
    }

    return () => {
      window.removeEventListener("pawbook-local-sub-updated", loadLocalSubmissions);
    };
  }, []);

  const allSubmissions = [...localSubmissions, ...approved];

  // Kindness garden states & logic
  const totalMemories = memories.length;
  const [flowerStates, setFlowerStates] = useState<Record<number, string>>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("pawbook-flower-states");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error(e);
        }
      }
    }
    return {};
  });
  const [beeParticles, setBeeParticles] = useState<
    { id: number; x: number; y: number; delay: number }[]
  >([]);

  const handleFlowerClick = (index: number, e: React.MouseEvent<HTMLButtonElement>) => {
    const flowerList = ["🌸", "🌻", "🌼", "🌺", "🌷", "🌹", "🏵️", "💮", "🦄", "🌈"];
    const currentEmoji = flowerStates[index] || ["🌸", "🌻", "🌼", "🌺", "🌷"][index % 5];
    const nextIndex = (flowerList.indexOf(currentEmoji) + 1) % flowerList.length;
    const nextEmoji = flowerList[nextIndex];

    setFlowerStates((prev) => {
      const next = {
        ...prev,
        [index]: nextEmoji,
      };
      localStorage.setItem("pawbook-flower-states", JSON.stringify(next));
      return next;
    });
    playPop();

    // Trigger drifting bees
    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top;

    const newBees = Array.from({ length: 3 }).map((_, i) => ({
      id: Date.now() + i,
      x: x + (Math.random() * 40 - 20),
      y: y - 10,
      delay: i * 200,
    }));
    setBeeParticles((prev) => [...prev, ...newBees]);

    // Cleanup particles
    setTimeout(() => {
      setBeeParticles((prev) => prev.filter((b) => !newBees.find((nb) => nb.id === b.id)));
    }, 2500);

    const messages = [
      "A seed of kindness has sprouted! 🌱",
      "Love is blooming in the meadow! 🌸",
      "You grew a gorgeous flower! 🌻",
      "Your treat to Coco grew this daisy! 🍪",
      "A butterfly sat on your flower! 🦋",
      "The meadow is glowing with colors! 🌈",
    ];
    toast.success(messages[index % messages.length]);
  };
  const totalLove = animals.reduce((s, a) => s + a.stats.pawPrints, 0);
  const totalTreats = animals.reduce((s, a) => s + a.stats.treats, 0);

  const growth =
    totalMemories >= 100
      ? { label: "Paw Forest 🌲", desc: "The village has grown into a full forest of memories." }
      : totalMemories >= 50
        ? { label: "Rainbow 🌈", desc: "The garden is glowing with color today." }
        : totalMemories >= 10
          ? { label: "A big tree 🌳", desc: "Your kindness has grown a whole tree." }
          : { label: "A little flower 🌸", desc: "Every memory adds another petal." };

  // Explore tab states
  const [exploreTab, setExploreTab] = useState<"map" | "weaver">("map");

  // Map internal states
  const [foundPlaceAnimal, setFoundPlaceAnimal] = useState<string | null>(null);
  const mapAnimal = foundPlaceAnimal ? getAnimal(foundPlaceAnimal) : null;

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
          `It was a perfect afternoon in the flower meadow. Coco arrived first, looking like a tiger but wagging his tail too friendly. Moti trotted in next, wagging his tail happily. Kitty watched them gracefully from the low branch of a mango tree, and Tommy came sprinting through the grass chasing a yellow butterfly. For the first time, all four friends shared a sunny spot together under the warm sky, happy to be part of the same loving village. 💮🐕🐶🐈🎒🍪`,
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
      {/* ==================== HOME SECTION ==================== */}
      <div id="home" className="scroll-mt-24">
        {/* Instagram Stories Row */}
        <section className="mx-auto max-w-5xl px-4 pt-4">
          <InstagramStories />
        </section>

        {/* HERO */}
        <header className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 pt-10 pb-16 lg:grid-cols-2 lg:gap-16 lg:pt-16 lg:pb-24">
          <div
            className="space-y-6 lg:space-y-8"
            style={{ animation: "fade-up 0.9s var(--ease-soft) both" }}
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-yellow px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] scrapbook-shadow">
              🐾 Welcome to PawBook World
            </div>
            <h1 className="font-display text-4xl leading-[1.05] text-balance sm:text-5xl md:text-6xl lg:text-7xl">
              Every street friend has a
              <br />
              <span className="text-peach">story worth remembering 🐾</span>
            </h1>
            <p className="max-w-md text-base leading-relaxed text-coffee/85 sm:text-lg">
              Create memories, follow journeys, and celebrate the little paws that make our streets
              feel like home.
            </p>
            <div className="flex flex-row gap-3 pt-2 sm:gap-4">
              <button
                onClick={() =>
                  document.getElementById("paw-book")?.scrollIntoView({ behavior: "smooth" })
                }
                className="squish flex-1 sm:flex-initial rounded-2xl bg-coffee px-4 py-3 sm:px-8 sm:py-3.5 text-sm sm:text-base font-bold text-cream scrapbook-shadow cursor-pointer text-center"
              >
                🐶 Meet Paw Friends
              </button>
              <button
                onClick={() =>
                  document.getElementById("found-friends")?.scrollIntoView({ behavior: "smooth" })
                }
                className="squish flex-1 sm:flex-initial rounded-2xl border-2 border-coffee/10 bg-white px-4 py-3 sm:px-8 sm:py-3.5 text-sm sm:text-base font-bold text-coffee cursor-pointer text-center hover:bg-cream/60"
              >
                ❤️ Share a Paw Moment
              </button>
            </div>

            {/* Scrapbook Community Statistics Sticky Notes */}
            <div className="grid grid-cols-2 gap-3 pt-4 max-w-sm">
              <div className="bg-[#fefae0] border border-coffee/10 p-3 rounded-2xl -rotate-2 scrapbook-shadow text-center">
                <span className="text-2xl">🐾</span>
                <p className="text-base font-bold text-coffee mt-1">{animals.length} Friends</p>
                <p className="text-[9px] text-coffee/60 font-bold uppercase tracking-wider">
                  Paw Friends Added
                </p>
              </div>
              <div className="bg-[#fcf3ef] border border-coffee/10 p-3 rounded-2xl rotate-[1.5deg] scrapbook-shadow text-center">
                <span className="text-2xl">❤️</span>
                <p className="text-base font-bold text-coffee mt-1">{memories.length} Saved</p>
                <p className="text-[9px] text-coffee/60 font-bold uppercase tracking-wider">
                  Memories Saved
                </p>
              </div>
              <div className="bg-[#e8f0fe] border border-coffee/10 p-3 rounded-2xl rotate-1 scrapbook-shadow text-center">
                <span className="text-2xl">🍲</span>
                <p className="text-base font-bold text-coffee mt-1">420 Shared</p>
                <p className="text-[9px] text-coffee/60 font-bold uppercase tracking-wider">
                  Meals Shared
                </p>
              </div>
              <div className="bg-[#e6f4ea] border border-coffee/10 p-3 rounded-2xl rotate-[-1.5deg] scrapbook-shadow text-center">
                <span className="text-2xl">🏥</span>
                <p className="text-base font-bold text-coffee mt-1">94 Care</p>
                <p className="text-[9px] text-coffee/60 font-bold uppercase tracking-wider">
                  Care Moments
                </p>
              </div>
            </div>
          </div>

          {/* Live showcase */}
          <div className="relative flex h-[520px] items-center justify-center sm:h-[560px]">
            <div className="pointer-events-none absolute inset-0">
              {others.map((a, i) => {
                const pos = orbitClasses[i % orbitClasses.length];
                return (
                  <button
                    key={a.slug}
                    onClick={() => setFeaturedSlug(a.slug)}
                    className={`pointer-events-auto group absolute ${pos.size} animate-floaty overflow-hidden rounded-full border-4 border-white bg-${a.color} scrapbook-shadow cursor-pointer transition-all duration-300 hover:scale-105 hover:rotate-3 hover:paused`}
                    style={{
                      top: pos.top,
                      left: pos.left,
                      right: pos.right,
                      bottom: pos.bottom,
                      animationDelay: pos.delay,
                    }}
                    aria-label={`Feature ${a.name}`}
                  >
                    <img src={a.image} alt={a.name} className="h-full w-full object-cover" />
                    <span className="absolute inset-x-0 bottom-1 mx-auto w-fit rounded bg-white/95 px-2 py-0.5 text-[10px] font-bold opacity-0 transition-opacity group-hover:opacity-100">
                      {a.name}
                    </span>
                  </button>
                );
              })}
            </div>

            <div
              key={featured.slug}
              className="relative z-10 w-full max-w-sm h-[560px] perspective-1000 animate-sway"
              style={{
                animation: "sway 6s ease-in-out infinite, fade-up 0.6s var(--ease-soft) both",
              }}
            >
              <div
                onClick={() => {
                  setIsFlipped(!isFlipped);
                  playRustle();
                }}
                className={`w-full h-full transform-style-3d transition-all duration-500 ease-soft relative cursor-pointer hover:-translate-y-1 ${
                  isFlipped ? "rotate-y-180" : ""
                }`}
              >
                {/* FRONT SIDE */}
                <div className="absolute inset-0 w-full h-full backface-hidden">
                  <div className="relative -rotate-2 border border-coffee/5 bg-white p-4 pb-7 scrapbook-shadow h-full flex flex-col justify-between">
                    <div className="washi-tape absolute -top-3 left-1/2 z-20 h-8 w-24 -translate-x-1/2 rotate-2" />

                    {/* Polaroid Picture */}
                    <div className="relative aspect-square overflow-hidden rounded-sm bg-cream shrink-0">
                      <PetPhoto slug={featured.slug} image={featured.image} />
                      <div className="absolute right-3 bottom-3 flex flex-wrap justify-end gap-2">
                        {featured.badges.slice(0, 2).map((b) => (
                          <span
                            key={b}
                            className="rounded-full bg-yellow/90 px-3 py-1 text-[10px] font-bold shadow-sm"
                          >
                            {b}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Text Details */}
                    <div className="mt-3 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-end justify-between gap-2">
                          <div className="min-w-0">
                            <h3 className="font-display text-2xl">
                              {featured.name} {featured.emoji}
                            </h3>
                            <p className="font-hand text-lg text-peach">"{featured.nickname}"</p>
                          </div>
                          <div className="shrink-0 text-right">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-coffee/40">
                              Status
                            </p>
                            <p className="flex items-center justify-end gap-1 font-bold text-sage">
                              ●{" "}
                              {featured.status === "safe"
                                ? "Safe"
                                : featured.status === "needs-care"
                                  ? "Needs care"
                                  : "Emergency"}
                            </p>
                          </div>
                        </div>
                        <p className="rounded-lg bg-cream/60 p-2.5 text-xs italic leading-relaxed text-coffee/70 mt-2">
                          "{featured.story}"
                        </p>
                      </div>

                      <div className="space-y-3 pt-2">
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { v: featured.stats.pawPrints, l: "Paw Prints" },
                            { v: featured.stats.treats, l: "Treats" },
                            { v: featured.stats.memories, l: "Memories" },
                          ].map((s) => (
                            <div key={s.l} className="rounded bg-cream p-1.5 text-center">
                              <p className="text-sm font-bold">{s.v}</p>
                              <p className="text-[8px] uppercase tracking-tight text-coffee/60">
                                {s.l}
                              </p>
                            </div>
                          ))}
                        </div>

                        <div className="text-center text-[10px] font-bold text-coffee/40 animate-pulse">
                          🖱️ Tap card to reveal secret facts! ✨
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* BACK SIDE */}
                <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
                  <div className="relative rotate-2 border-2 border-coffee/10 bg-cream/95 p-5 pb-7 scrapbook-shadow h-full flex flex-col justify-between text-left">
                    <div className="washi-tape absolute -top-3 left-1/2 z-20 h-8 w-24 -translate-x-1/2 rotate-1" />

                    <div>
                      <div className="flex items-center justify-between border-b border-coffee/10 pb-3">
                        <div>
                          <h3 className="font-display text-2xl text-coffee">
                            {featured.name}'s Secrets 🤫
                          </h3>
                          <p className="text-[10px] text-coffee/40 font-bold uppercase tracking-wider">
                            Creator Files
                          </p>
                        </div>
                        <span className="text-3xl">{featured.emoji}</span>
                      </div>

                      <div className="mt-4 space-y-3.5 text-xs">
                        <div className="flex justify-between items-baseline border-b border-coffee/5 pb-1">
                          <span className="font-bold text-coffee/50 uppercase text-[9px] tracking-wider">
                            Official Title
                          </span>
                          <span className="font-bold text-coffee">{featured.nickname}</span>
                        </div>
                        <span className="block border-b border-coffee/5 pb-1">
                          <span className="font-bold text-coffee/50 uppercase text-[9px] tracking-wider block mb-0.5">
                            Secret Weakness / Habit
                          </span>
                          <span className="font-medium text-coffee italic">
                            "Acts hungry even after eating a full meal" 🍪
                          </span>
                        </span>
                        <div className="flex justify-between items-baseline border-b border-coffee/5 pb-1">
                          <span className="font-bold text-coffee/50 uppercase text-[9px] tracking-wider">
                            Favorite Snack
                          </span>
                          <span className="font-bold text-coffee">
                            {featured.favoriteFood || "Parle-G Biscuits"}
                          </span>
                        </div>
                        <div className="flex justify-between items-baseline border-b border-coffee/5 pb-1">
                          <span className="font-bold text-coffee/50 uppercase text-[9px] tracking-wider">
                            First Met Date
                          </span>
                          <span className="font-bold text-coffee">
                            {featured.firstMet || "12 Jan 2025"}
                          </span>
                        </div>
                        <div className="flex justify-between items-baseline border-b border-coffee/5 pb-1">
                          <span className="font-bold text-coffee/50 uppercase text-[9px] tracking-wider">
                            Primary Basecamp
                          </span>
                          <span className="font-bold text-coffee">{featured.home}</span>
                        </div>
                        <div className="flex justify-between items-baseline border-b border-coffee/5 pb-1">
                          <span className="font-bold text-coffee/50 uppercase text-[9px] tracking-wider">
                            Personality Tag
                          </span>
                          <span className="font-bold text-peach">{featured.personality}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={(e) => handleAction("feat-love", "Boop", featured.name, e)}
                          className="squish flex-1 rounded-xl bg-peach py-2 text-xs font-bold text-coffee scrapbook-shadow cursor-pointer"
                        >
                          ❤️ Boop Nose
                        </button>
                        <button
                          onClick={(e) => handleAction("feat-treat", "Treat", featured.name, e)}
                          className="squish flex-1 rounded-xl bg-sage py-2 text-xs font-bold text-coffee scrapbook-shadow cursor-pointer"
                        >
                          🍪 Give Cookie
                        </button>
                      </div>

                      <Link
                        to="/paw-friends/$slug"
                        params={{ slug: featured.slug }}
                        onClick={(e) => e.stopPropagation()}
                        className="block rounded-xl bg-coffee py-2.5 text-center text-xs font-bold text-cream transition hover:opacity-90"
                      >
                        Explore Full Pet Diary & Timeline →
                      </Link>

                      <div className="text-center text-[9px] font-bold text-coffee/30">
                        🖱️ Click card to return profile
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* PAW PLAYROOM ARCADE */}
        <section className="mx-auto max-w-7xl px-6 py-12 border-t border-b border-coffee/5 bg-cream/10 rounded-3xl mb-16">
          <SectionHeading
            eyebrow="Updates & Interactive Playroom"
            title="🐾 The Paw Playroom & Board"
          />

          {/* Today's Updates Widget */}
          <div className="mt-8 mb-10 p-5 rounded-3xl border border-coffee/10 bg-white/70 backdrop-blur-md scrapbook-shadow">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-bold uppercase tracking-widest text-coffee/50 flex items-center gap-1.5">
                <span>Today's Updates 🐾</span>
                <span className="h-2 w-2 rounded-full bg-peach animate-ping" />
              </p>
              <span className="text-[10px] text-coffee/40 font-bold uppercase">Status Stories</span>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none snap-x">
              {animals.map((a) => (
                <div
                  key={a.slug}
                  className="flex items-center gap-3 shrink-0 snap-center bg-[#FDFBF7]/60 border border-coffee/5 rounded-2xl p-2 pr-4 shadow-2xs"
                >
                  <div className="relative size-12 rounded-full border-2 border-peach overflow-hidden shrink-0">
                    <img src={a.image} alt={a.name} className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-coffee flex items-center gap-1">
                      {a.name} {a.emoji}{" "}
                      <span className="text-[9px] text-coffee/40 font-normal">
                        · {a.lastUpdated}
                      </span>
                    </p>
                    <p className="text-[11px] text-coffee/85 italic">
                      "{a.dailyThought.slice(0, 45)}..."
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            id="playroom-container"
            onScroll={handlePlayroomScroll}
            className="mt-4 flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory no-scrollbar md:grid md:grid-cols-2 lg:grid-cols-4 md:overflow-x-visible md:pb-0 items-start"
          >
            {/* Daily Thoughts Card */}
            <div
              className="w-[85vw] sm:w-[360px] md:w-auto shrink-0 snap-center bg-white rounded-3xl p-6 border border-coffee/10 scrapbook-shadow h-[545px] flex flex-col justify-between overflow-hidden animate-[fade-up_0.5s_ease-out_both]"
              style={{ animationDelay: "100ms" }}
            >
              <div className="text-center w-full">
                <span className="text-4xl block my-2">📝</span>
                <h3 className="font-display text-2xl mb-1 text-coffee">Daily Thoughts</h3>
                <p className="text-xs text-coffee/60 mb-4 max-w-xs mx-auto">
                  What is on {featured.name}'s mind today?
                </p>
              </div>
              <div className="flex-1 flex items-center justify-center p-3 my-2 relative">
                {/* Cozy Post-It Sticky note */}
                <div className="bg-[#fefae0] border border-coffee/10 p-5 rounded-2xl -rotate-2 scrapbook-shadow text-center max-w-[280px] relative">
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-12 h-3.5 bg-peach/30 border border-coffee/5" />
                  <p className="font-hand text-base text-coffee/95 leading-relaxed">
                    "
                    {featured.dailyThought ||
                      `Today my friends visited again. The treats were nice, but the head pats were better ❤️`}
                    "
                  </p>
                  <div className="text-[9px] text-coffee/50 font-bold uppercase mt-4">
                    — {featured.name} {featured.emoji}
                  </div>
                </div>
              </div>
              <button
                onClick={(e) => {
                  handleAction("thought-love", "Boop", featured.name, e);
                  toast.success(`You sent a heart to ${featured.name}! ❤️`);
                }}
                className="squish w-full rounded-2xl bg-peach py-3 text-sm font-bold text-coffee border border-coffee/5 scrapbook-shadow cursor-pointer mt-auto"
              >
                Send a Heart ❤️🐾
              </button>
            </div>

            {/* Care Reminders Card */}
            <div
              className="w-[85vw] sm:w-[360px] md:w-auto shrink-0 snap-center bg-white rounded-3xl p-6 border border-coffee/10 scrapbook-shadow h-[545px] flex flex-col justify-between overflow-hidden animate-[fade-up_0.5s_ease-out_both]"
              style={{ animationDelay: "200ms" }}
            >
              <div className="text-center w-full">
                <span className="text-4xl block my-2">🏥</span>
                <h3 className="font-display text-2xl mb-1 text-coffee">Upcoming Care</h3>
                <p className="text-xs text-coffee/60 mb-4 max-w-xs mx-auto">
                  Keep track of vaccination due dates and veterinary checkups.
                </p>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 my-2 pr-1 text-left scrollbar-none">
                {animals.map((a) => {
                  const dueReminders = (a.healthRecords || []).map((r, i) => ({
                    id: `${a.slug}-rem-${i}`,
                    petName: a.name,
                    emoji: a.emoji,
                    type:
                      r.type === "Vaccination"
                        ? "💉"
                        : r.type === "Checkup"
                          ? "🏥"
                          : r.type === "Medicine"
                            ? "💊"
                            : "🩹",
                    label: `${a.name}'s ${r.type}`,
                    note: r.note,
                    dueDate: r.date,
                  }));

                  return dueReminders.slice(0, 1).map((rem) => (
                    <div
                      key={rem.id}
                      className="bg-cream/40 border border-coffee/5 p-3 rounded-2xl flex gap-3 items-start shadow-3xs animate-fade-in"
                    >
                      <span className="text-lg mt-0.5">{rem.type}</span>
                      <div>
                        <p className="text-xs font-bold text-coffee">{rem.label}</p>
                        <p className="text-[10px] text-coffee/70">{rem.note}</p>
                        <p className="text-[9px] text-peach font-bold uppercase mt-1">
                          Due Date: {rem.dueDate}
                        </p>
                      </div>
                    </div>
                  ));
                })}
              </div>

              <div className="bg-cream/40 border border-coffee/5 rounded-2xl p-2.5 text-center text-[9px] text-coffee/50 mt-auto">
                💡 Reminders are updated automatically from health records.
              </div>
            </div>

            {/* Spin Wheel Card */}
            <div
              className="w-[85vw] sm:w-[360px] md:w-auto shrink-0 snap-center bg-white rounded-3xl p-6 border border-coffee/10 scrapbook-shadow h-[545px] flex flex-col justify-between items-center overflow-hidden animate-[fade-up_0.5s_ease-out_both]"
              style={{ animationDelay: "280ms" }}
            >
              <SpinWheel />
            </div>

            {/* Match Quiz Card */}
            <div
              className="w-[85vw] sm:w-[360px] md:w-auto shrink-0 snap-center bg-white rounded-3xl p-6 border border-coffee/10 scrapbook-shadow text-center flex flex-col justify-between h-[545px] overflow-hidden animate-[fade-up_0.5s_ease-out_both]"
              style={{ animationDelay: "350ms" }}
            >
              <div>
                <span className="text-6xl block my-4 animate-bounce">🐾</span>
                <h3 className="font-display text-2xl mb-2 text-coffee">
                  Find Your Paw Best Friend
                </h3>
                <p className="text-xs text-coffee/70 max-w-xs mx-auto leading-relaxed">
                  Take our viral 5-question personality matching game to find out which street
                  friend shares your soul energy!
                </p>
                <div className="mt-6 space-y-2 bg-cream/30 p-4 rounded-2xl border border-coffee/5 text-left max-w-xs mx-auto">
                  <p className="text-[10px] font-bold text-coffee/50 uppercase tracking-wider">
                    Matched Affinity:
                  </p>
                  <p className="text-xs text-coffee/85">🐯 Coco (Friendly Tiger) - 98% Affinity</p>
                  <p className="text-xs text-coffee/85">❤️ Moti (Belly Rub Believer) - 99% Love</p>
                </div>
              </div>
              <button
                onClick={() => setQuizOpen(true)}
                className="squish w-full rounded-2xl bg-[#fcf3ef] hover:bg-peach py-3 text-sm font-bold text-coffee scrapbook-shadow cursor-pointer mt-auto border border-coffee/5"
              >
                Play Match Quiz 🎮🐾
              </button>
            </div>
          </div>

          {/* Carousel indicator dots (mobile only) */}
          <div className="flex flex-col items-center gap-2 mt-4 md:hidden">
            <div className="flex gap-2">
              {[0, 1, 2, 3].map((i) => (
                <button
                  key={i}
                  onClick={() => {
                    const el = document.getElementById("playroom-container");
                    if (el) {
                      const children = el.children;
                      if (children[i]) {
                        children[i].scrollIntoView({
                          behavior: "smooth",
                          block: "nearest",
                          inline: "center",
                        });
                      }
                    }
                  }}
                  className={`h-2 rounded-full transition-all duration-300 ${activePlayroomIndex === i ? "w-6 bg-coffee scale-x-110" : "w-2 bg-coffee/20"} cursor-pointer`}
                  aria-label={`Go to game ${i + 1}`}
                />
              ))}
            </div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-coffee/30 animate-pulse mt-1">
              Swipe left / right to play other games 🐾
            </p>
          </div>
        </section>
      </div>

      {/* ==================== PAWBOOK SECTION ==================== */}
      <section
        id="paw-book"
        className="mx-auto max-w-7xl px-6 pt-20 pb-16 scroll-mt-24 border-b border-coffee/5"
      >
        <div className="mb-2 text-sm font-bold uppercase tracking-widest text-coffee/50">
          🐾 The Village
        </div>
        <h2 className="font-display text-4xl sm:text-5xl md:text-6xl">
          Meet the <span className="text-peach">PawBook Friends</span>
        </h2>
        <p className="mt-3 max-w-xl text-lg text-coffee/70">
          Every card here is a real little life. Tap a friend's card to flip it and see their
          community love stats, or explore their full passport and diary.
        </p>

        <div
          ref={villageRef}
          className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {animals.map((a, i) => {
            const isFlipped = !!flippedSlugs[a.slug];
            const randomTilt = (i % 3) * 2.4 - 2.4; // random rotation degree for scrapbook feel

            return (
              <div
                key={a.slug}
                onClick={(e) => toggleFlip(a.slug, e)}
                style={
                  {
                    "--random-rotate": `${randomTilt}deg`,
                    transitionDelay: `${i * 120}ms`,
                  } as React.CSSProperties
                }
                className={`polaroid-card ${villageInView ? "landed" : ""} relative w-full h-[390px] perspective-1000 cursor-pointer select-none group transition-transform duration-300 hover:scale-104 hover:-translate-y-2`}
              >
                <div
                  className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${
                    isFlipped ? "rotate-y-180" : ""
                  }`}
                >
                  {/* FRONT SIDE */}
                  <div className="absolute inset-0 w-full h-full backface-hidden rounded-3xl border border-coffee/10 bg-white p-3 pb-5 flex flex-col justify-between scrapbook-shadow z-10">
                    {/* Washi tape */}
                    <div className="absolute -top-3.5 left-1/2 z-20 h-6 w-16 -translate-x-1/2 bg-yellow/40 border border-dashed border-yellow/20 opacity-75 shadow-xs" />

                    {/* Pet Image */}
                    <div className="relative w-full aspect-square overflow-hidden rounded-2xl bg-cream border border-coffee/5">
                      {/* Heart hover sticker */}
                      <div className="absolute top-2.5 right-2.5 rounded-full bg-peach/95 p-1.5 text-xs shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100 z-30 select-none">
                        ❤️
                      </div>
                      <PetPhoto
                        slug={a.slug}
                        image={a.image}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-2.5 left-2.5 rounded-full bg-white/95 px-2.5 py-0.5 text-[9px] font-bold shadow-xs">
                        {a.mood}
                      </div>
                    </div>

                    {/* Pet Text Info */}
                    <div className="mt-2.5 space-y-1 px-1 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <h3 className="font-display text-lg text-coffee font-bold">
                            {a.name} {a.emoji}
                          </h3>
                          <span
                            className={
                              "text-[10px] font-bold flex items-center gap-1 " +
                              (a.status === "safe"
                                ? "text-sage"
                                : a.status === "needs-care"
                                  ? "text-yellow-700"
                                  : "text-destructive")
                            }
                          >
                            <span className="text-xs">●</span>
                            {a.status === "safe"
                              ? "Safe 💚"
                              : a.status === "needs-care"
                                ? "Needs Care 🏥"
                                : "Emergency 🚨"}
                          </span>
                        </div>
                        <p className="font-hand text-base text-peach mt-0.5">"{a.nickname}"</p>
                      </div>

                      <div className="border-t border-coffee/5 pt-2 text-[10px] space-y-0.5 text-coffee/70">
                        <p>
                          📍 <span className="font-semibold">Home:</span> {a.home}
                        </p>
                        <p>
                          👀 <span className="font-semibold">Last Seen:</span> {a.lastSeenLocation}
                        </p>
                        <p>
                          ⏰ <span className="font-semibold">Updated:</span> {a.lastUpdated}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* BACK SIDE */}
                  <div className="absolute inset-0 w-full h-full rotate-y-180 backface-hidden rounded-3xl border border-coffee/10 bg-white p-4 pb-5 flex flex-col justify-between scrapbook-shadow bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[16px_16px]">
                    {/* Washi tape */}
                    <div className="absolute -top-3.5 left-1/2 z-20 h-6 w-16 -translate-x-1/2 bg-peach/40 border border-dashed border-peach/20 opacity-75 shadow-xs" />

                    <div className="space-y-3.5 flex-1">
                      <div className="text-center border-b border-coffee/5 pb-2">
                        <h4 className="font-display text-base font-bold text-coffee">
                          {a.name}'s Love
                        </h4>
                        <p className="text-[10px] text-coffee/50">Community Care Card</p>
                      </div>

                      {/* Community Love metrics */}
                      <div className="grid grid-cols-3 gap-1 bg-[#FDFBF7] p-2.5 rounded-2xl border border-coffee/5 text-center">
                        <div>
                          <p className="text-[11px] font-bold text-coffee">
                            {a.communityLove?.followers || 0}
                          </p>
                          <p className="text-[8px] text-coffee/50 uppercase font-bold tracking-wider">
                            Love
                          </p>
                        </div>
                        <div>
                          <p className="text-[11px] font-bold text-coffee">
                            {a.communityLove?.memories || 0}
                          </p>
                          <p className="text-[8px] text-coffee/50 uppercase font-bold tracking-wider">
                            Memories
                          </p>
                        </div>
                        <div>
                          <p className="text-[11px] font-bold text-coffee">
                            {a.communityLove?.helpers || 0}
                          </p>
                          <p className="text-[8px] text-coffee/50 uppercase font-bold tracking-wider">
                            Helpers
                          </p>
                        </div>
                      </div>

                      {/* Info details */}
                      <div className="text-[11px] space-y-1 text-left">
                        <p>
                          <span className="font-bold text-coffee/70">🧬 Breed:</span>{" "}
                          <span className="text-coffee/85 font-medium">{a.breedType}</span>
                        </p>
                        <p>
                          <span className="font-bold text-coffee/70">🍪 Fav Snack:</span>{" "}
                          <span className="text-coffee/85 font-medium">
                            {a.favoriteFood.slice(0, 35)}
                          </span>
                        </p>
                      </div>

                      {/* Badges list */}
                      <div className="flex flex-wrap gap-1 mt-1">
                        {a.badges.slice(0, 3).map((badge, idx) => (
                          <span
                            key={idx}
                            className="bg-peach/10 border border-peach/25 text-[8px] font-bold text-coffee px-2 py-0.5 rounded-full"
                          >
                            {badge}
                          </span>
                        ))}
                      </div>
                    </div>

                    <Link
                      to="/paw-friends/$slug"
                      params={{ slug: a.slug }}
                      onClick={(e) => e.stopPropagation()}
                      className="squish block w-full rounded-2xl bg-coffee text-cream text-center py-2.5 text-xs font-bold scrapbook-shadow transition hover:opacity-90 mt-2"
                    >
                      Open Passport & Stories 📖 →
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ==================== STORIES SECTION ==================== */}
      <section
        id="stories"
        className="mx-auto max-w-4xl px-6 pt-20 pb-16 scroll-mt-24 border-b border-coffee/5"
      >
        <div className="mb-2 text-sm font-bold uppercase tracking-widest text-coffee/50 text-center">
          📖 Paw Feed
        </div>
        <h2 className="font-display text-4xl sm:text-5xl text-center">Today in the village</h2>
        <p className="mt-3 text-lg text-coffee/70 text-center max-w-xl mx-auto">
          Little updates written from a paw's point of view — belly rubs, butterflies, rainy
          afternoons and everything in between.
        </p>

        {/* CSS 3D flip animation styles */}
        <style>{`
          @keyframes pageFlipNext {
            0% { transform: rotateY(0deg); opacity: 1; }
            50% { transform: rotateY(-90deg); opacity: 0.5; }
            100% { transform: rotateY(-180deg); opacity: 0; }
          }
          @keyframes pageFlipPrev {
            0% { transform: rotateY(0deg); opacity: 1; }
            50% { transform: rotateY(90deg); opacity: 0.5; }
            100% { transform: rotateY(180deg); opacity: 0; }
          }
          .animate-page-flip-next {
            animation: pageFlipNext 0.4s ease-in-out forwards;
            transform-origin: left center;
          }
          .animate-page-flip-prev {
            animation: pageFlipPrev 0.4s ease-in-out forwards;
            transform-origin: right center;
          }
        `}</style>

        {(() => {
          const m = memories[currentBookPage];
          if (!m) return null;
          const a = animals.find((an) => an.slug === m.animalSlug)!;
          const currentPrints = m.pawPrints + (likes[m.id] || 0);

          const handlePrev = () => {
            if (isBookFlipping || currentBookPage <= 0) return;
            setFlipDirection("prev");
            setIsBookFlipping(true);
            playRustle();
            setTimeout(() => {
              setCurrentBookPage((prev) => prev - 1);
              setIsBookFlipping(false);
            }, 400);
          };

          const handleNext = () => {
            if (isBookFlipping || currentBookPage >= memories.length - 1) return;
            setFlipDirection("next");
            setIsBookFlipping(true);
            playRustle();
            setTimeout(() => {
              setCurrentBookPage((prev) => prev + 1);
              setIsBookFlipping(false);
            }, 400);
          };

          return (
            <div className="relative mt-12 bg-[#7f5539] p-3 sm:p-5 rounded-3xl scrapbook-shadow max-w-4xl mx-auto flex items-stretch">
              {/* Outer Left Ribbon Bookmarks */}
              {currentBookPage > 0 && (
                <button
                  onClick={handlePrev}
                  className="absolute -left-4 sm:-left-6 top-1/2 -translate-y-1/2 bg-peach border-2 border-coffee py-3 px-2 sm:px-3 text-xs font-bold text-coffee rounded-l-xl scrapbook-shadow cursor-pointer transition hover:-translate-x-1 flex flex-col items-center gap-1 leading-none z-30"
                  aria-label="Previous Page"
                >
                  <span>◀</span>
                  <span className="writing-mode-vertical text-[10px] tracking-wider uppercase font-bold sm:block hidden">
                    Prev
                  </span>
                </button>
              )}

              {/* Outer Right Ribbon Bookmarks */}
              {currentBookPage < memories.length - 1 && (
                <button
                  onClick={handleNext}
                  className="absolute -right-4 sm:-right-6 top-1/2 -translate-y-1/2 bg-peach border-2 border-coffee py-3 px-2 sm:px-3 text-xs font-bold text-coffee rounded-r-xl scrapbook-shadow cursor-pointer transition hover:translate-x-1 flex flex-col items-center gap-1 leading-none z-30"
                  aria-label="Next Page"
                >
                  <span>▶</span>
                  <span className="writing-mode-vertical text-[10px] tracking-wider uppercase font-bold sm:block hidden">
                    Next
                  </span>
                </button>
              )}

              {/* Opened Booklet Page Container */}
              <div className="relative w-full bg-[#f4ebd0] border-2 border-coffee/20 rounded-2xl p-4 sm:p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-8 min-h-[480px] shadow-inner overflow-hidden">
                {/* Book Binding Crease / Sewn Spine Thread Binder */}
                <div className="absolute left-1/2 top-0 h-full w-[2px] bg-peach/40 hidden md:block" />
                <div className="absolute left-1/2 top-0 h-full w-0.5 border-l border-dashed border-coffee/35 hidden md:block" />

                {/* LEFT PAGE - PHOTO BLOCK */}
                <div
                  className={`flex-1 flex flex-col justify-center items-center ${
                    isBookFlipping
                      ? flipDirection === "next"
                        ? "animate-page-flip-next"
                        : "animate-page-flip-prev"
                      : ""
                  }`}
                >
                  {/* Polaroid Card Wrapper */}
                  <div className="relative border border-coffee/10 bg-white p-3 pb-8 scrapbook-shadow rotate-1 w-full max-w-[280px]">
                    {/* Corner photo tabs style */}
                    <div className="absolute -top-1.5 -left-1.5 w-6 h-6 border-t-2 border-l-2 border-coffee/40" />
                    <div className="absolute -top-1.5 -right-1.5 w-6 h-6 border-t-2 border-r-2 border-coffee/40" />

                    <div className="overflow-hidden rounded bg-cream aspect-4/3 w-full relative">
                      <img
                        src={m.image}
                        alt={m.title}
                        loading="eager"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="mt-4 text-center">
                      <p className="font-hand text-lg text-peach leading-none">"{m.title}"</p>
                      <p className="text-[10px] text-coffee/50 mt-1 uppercase font-bold tracking-widest">
                        Page {currentBookPage + 1} of {memories.length}
                      </p>
                    </div>
                  </div>
                </div>

                {/* RIGHT PAGE - DIARY & COMMENTS BLOCK */}
                <div
                  className={`flex-1 flex flex-col justify-between ${
                    isBookFlipping
                      ? flipDirection === "next"
                        ? "animate-page-flip-next"
                        : "animate-page-flip-prev"
                      : ""
                  }`}
                >
                  <div>
                    {/* Header */}
                    <header className="mb-3 flex items-center justify-between gap-3 pb-2 border-b border-coffee/5">
                      <div className="flex min-w-0 items-center gap-2.5">
                        <img
                          src={a.image}
                          alt=""
                          className="size-8 shrink-0 rounded-full border border-white object-cover"
                        />
                        <div className="min-w-0">
                          <p className="truncate font-bold text-sm">
                            {a.name} {a.emoji}
                          </p>
                          <p className="text-[9px] text-coffee/50">
                            {m.date} · {m.location}
                          </p>
                        </div>
                      </div>
                      <span className="rounded-full bg-cream px-2 py-0.5 text-[8px] font-bold uppercase tracking-widest text-coffee/60">
                        {moodLabel(m.mood)}
                      </span>
                    </header>

                    {/* Magic Letter Envelope Reveal */}
                    {!envelopeOpen[m.id] ? (
                      <div
                        onClick={() => {
                          setEnvelopeOpen((prev) => ({ ...prev, [m.id]: true }));
                          playPageFlip();
                        }}
                        className="mb-4 cursor-pointer rounded-2xl border border-dashed border-peach/50 bg-[#FDFBF7] p-5 text-center flex flex-col items-center justify-center gap-2 hover:bg-[#FAF4ED] hover:scale-102 active:scale-98 transition-all shadow-xs"
                      >
                        <span className="text-4xl animate-float">💌</span>
                        <p className="font-display text-sm font-bold text-coffee">
                          Open {a.name}&apos;s Memory Letter
                        </p>
                        <p className="text-[10px] text-coffee/40 font-bold uppercase">
                          Tap to open letter
                        </p>
                      </div>
                    ) : (
                      <div className="animate-fade-in relative">
                        {/* Lined Notebook Paper Story */}
                        <div className="mb-2 bg-[radial-gradient(circle_at_0px_0px,transparent_8px,transparent_8px),linear-gradient(#00000008_1px,transparent_1px)] bg-size-[100%_24px] pl-1 py-1">
                          <p className="font-hand text-xl leading-relaxed text-coffee/85">
                            "{m.story}"
                          </p>
                        </div>
                        <button
                          onClick={() => setEnvelopeOpen((prev) => ({ ...prev, [m.id]: false }))}
                          className="text-[9px] font-bold uppercase tracking-wider text-[#A06040] hover:text-peach cursor-pointer mb-2"
                        >
                          Close Letter ✕
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Actions & Comment list */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-t border-coffee/5 pt-2">
                      <div className="flex flex-wrap gap-2.5">
                        <ActionButton
                          icon="❤️"
                          label="Boop"
                          onClick={(e) => handleAction(m.id, "Boop", a.name, e)}
                        />
                        <ActionButton
                          icon="🍪"
                          label="Treat"
                          onClick={(e) => handleAction(m.id, "Treat", a.name, e)}
                        />
                        <ActionButton
                          icon="🐾"
                          label="Hug"
                          onClick={(e) => handleAction(m.id, "Hug", a.name, e)}
                        />
                      </div>
                      <p className="text-[9px] font-bold uppercase tracking-widest text-coffee/50">
                        {currentPrints} Paw Prints
                      </p>
                    </div>

                    {/* Comments */}
                    <div className="space-y-2.5">
                      <div className="space-y-1.5 rounded-xl bg-cream/40 p-2.5 border border-coffee/5 max-h-[110px] overflow-y-auto pr-1 scrollbar-thin">
                        {sampleComments(m.animalSlug).map((c) => (
                          <p key={c.author} className="text-xs">
                            <span className="font-bold">{c.author}:</span>{" "}
                            <span className="text-coffee/80">{c.text}</span>
                          </p>
                        ))}
                        {(m.comments || []).map((c) => (
                          <p key={c.id} className="text-xs animate-fade-in">
                            <span className="font-bold">{c.author}:</span>{" "}
                            <span className="text-coffee/80">{c.text}</span>
                            <span className="text-[8px] text-coffee/40 block leading-tight">
                              {c.date}
                            </span>
                          </p>
                        ))}
                      </div>

                      {/* Comment Form */}
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleAddComment(m.id);
                        }}
                        className="flex gap-1.5 items-center"
                      >
                        <input
                          type="text"
                          placeholder="Name"
                          value={newCommentAuthor}
                          onChange={(e) => setNewCommentAuthor(e.target.value)}
                          className="w-1/3 rounded-xl border border-coffee/10 bg-white/70 px-2 py-1 text-xs focus:outline-none focus:border-peach"
                        />
                        <input
                          type="text"
                          placeholder="Write a kind word..."
                          value={newCommentText}
                          onChange={(e) => setNewCommentText(e.target.value)}
                          className="flex-1 rounded-xl border border-coffee/10 bg-white/70 px-2 py-1 text-xs focus:outline-none focus:border-peach"
                        />
                        <button
                          type="submit"
                          className="squish rounded-xl bg-coffee px-3 py-1 text-xs font-bold text-cream cursor-pointer"
                        >
                          Send
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
      </section>

      {/* ==================== KINDNESS WALL SECTION ==================== */}
      <section
        id="garden"
        className="mx-auto max-w-5xl px-6 pt-20 pb-16 scroll-mt-24 border-b border-coffee/5"
      >
        <div className="text-center">
          <div className="mb-2 text-sm font-bold uppercase tracking-widest text-coffee/50">
            ❤️ Kindness Wall
          </div>
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl">
            Every act of <span className="text-peach">kindness</span> matters
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-lg text-coffee/70">
            A space where we record feedings, medical support, and small helps. Post your act to
            earn points and inspire others!
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 sm:gap-4 mt-8 sm:mt-10">
          <StatCard icon="❤️" label="Love Received" value={totalLove} tone="peach" />
          <StatCard
            icon="🍲"
            label="Feedings Logged"
            value={kindnessPosts.filter((p) => p.badge.includes("🍲")).length + totalTreats}
            tone="yellow"
          />
          <StatCard icon="✨" label="Kindness Points" value={kindnessPoints} tone="sage" />
        </div>

        {/* Lined paper Kindness Tree Growth Indicator */}
        <div className="relative mt-10 overflow-hidden rounded-3xl border-2 border-dashed border-sage/50 bg-[#F5F8F5] p-6 sm:p-8 text-center scrapbook-shadow">
          <div className="absolute top-4 right-6 text-4xl animate-float">🦋</div>
          <div
            className="absolute bottom-4 left-6 text-3xl animate-float"
            style={{ animationDelay: "1s" }}
          >
            🐾
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-coffee/60">
            🌳 The Growing Kindness Tree
          </p>
          <h3 className="mt-2 font-display text-3xl sm:text-4xl">{growth.label}</h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-coffee/70">{growth.desc}</p>

          {/* Interactive SVG Tree Canvas */}
          <div className="relative mx-auto mt-8 w-full max-w-[400px] h-[220px] bg-white border border-coffee/10 rounded-2xl p-4 flex items-center justify-center scrapbook-shadow overflow-hidden">
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 200 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Ground line */}
              <line
                x1="20"
                y1="110"
                x2="180"
                y2="110"
                stroke="#7f5539"
                strokeWidth="2"
                strokeDasharray="3 3"
              />
              {/* Trunk & Main Branches */}
              <path
                d="M100,110 C100,80 90,60 80,45 M100,110 C100,80 110,60 120,40 M100,110 L100,60 C100,50 95,35 90,25 M100,60 C100,50 105,35 110,25"
                stroke="#7f5539"
                strokeWidth="4"
                strokeLinecap="round"
                className="map-trace-path"
              />
            </svg>

            {/* Dynamic Leaves attached to tree branch coordinates */}
            {(() => {
              // Defined coordinates on branches
              const leafCoordinates = [
                { top: "30%", left: "42%" }, // center-left branch
                { top: "25%", left: "54%" }, // center-right branch
                { top: "45%", left: "32%" }, // low-left branch
                { top: "40%", left: "64%" }, // low-right branch
                { top: "18%", left: "46%" }, // high-center-left
                { top: "18%", left: "50%" }, // high-center-right
                { top: "52%", left: "36%" }, // bottom-left
                { top: "48%", left: "60%" }, // bottom-right
                { top: "32%", left: "36%" },
                { top: "30%", left: "58%" },
              ];

              return (
                <div className="absolute inset-0 pointer-events-none">
                  {kindnessPosts.slice(0, leafCoordinates.length).map((post, idx) => {
                    const coords = leafCoordinates[idx];
                    const leafIcon = post.badge.includes("🍲")
                      ? "🍲"
                      : post.badge.includes("🏥")
                        ? "🏥"
                        : post.badge.includes("📖")
                          ? "📖"
                          : "🐾";

                    return (
                      <button
                        key={post.id}
                        onClick={() => {
                          toast.info(`🍃 ${post.author} logged: "${post.text}"`);
                          playPageFlip();
                        }}
                        style={{ top: coords.top, left: coords.left }}
                        className="pointer-events-auto absolute flex items-center justify-center w-8 h-8 rounded-full bg-sage/20 border border-sage text-sm shadow-xs hover:scale-125 hover:bg-sage/40 transition-all cursor-pointer leaf-appear"
                        title={`${post.author}: ${post.text}`}
                      >
                        {leafIcon}
                      </button>
                    );
                  })}
                </div>
              );
            })()}
          </div>

          <div className="text-[10px] text-coffee/40 font-bold uppercase mt-4">
            *Every kindness logged grows a new leaf on our tree 🍃
          </div>
        </div>

        {/* Kindness Wall Logger and Feed Container */}
        <div className="mt-12 grid gap-8 md:grid-cols-5 items-start text-left">
          {/* Logger Form */}
          <div className="md:col-span-2 rounded-3xl border border-coffee/10 bg-white p-5 scrapbook-shadow">
            <h4 className="font-display text-lg font-bold text-coffee flex items-center gap-1.5">
              <span>✍️ Log Care Act</span>
            </h4>
            <p className="text-[11px] text-coffee/60 mb-4">
              Did you feed or help an animal today? Share it to grow our wall!
            </p>

            <form onSubmit={handleSubmitKindness} className="space-y-3.5">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-coffee/60">
                  Your Name
                </label>
                <input
                  required
                  type="text"
                  maxLength={50}
                  placeholder="e.g. Sejal"
                  value={newKindnessAuthor}
                  onChange={(e) => setNewKindnessAuthor(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-coffee/10 bg-cream/20 px-3 py-1.5 text-xs focus:outline-none focus:border-peach font-normal"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-coffee/60">
                  What did you do?
                </label>
                <textarea
                  required
                  rows={3}
                  maxLength={250}
                  placeholder="e.g. Shared biscuits with Bruno near College Gate today."
                  value={newKindnessText}
                  onChange={(e) => setNewKindnessText(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-coffee/10 bg-cream/20 px-3 py-1.5 text-xs focus:outline-none focus:border-peach resize-none font-normal"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-coffee/60">
                  Assistance Badge
                </label>
                <select
                  value={newKindnessBadge}
                  onChange={(e) => setNewKindnessBadge(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-coffee/10 bg-cream/20 px-3 py-1.5 text-xs focus:outline-none focus:border-peach font-normal"
                >
                  <option>Food Friend 🍲</option>
                  <option>Care Hero 🏥</option>
                  <option>Memory Keeper 📖</option>
                  <option>Paw Guardian 🐾</option>
                </select>
              </div>

              <button
                type="submit"
                className="squish w-full py-2.5 rounded-full bg-coffee hover:bg-coffee/90 text-cream text-xs font-bold font-display shadow-xs flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>Log Act</span>
                <span className="text-[10px] bg-peach/20 text-peach px-2 py-0.5 rounded-full font-mono font-bold">
                  +10 Pts 🎉
                </span>
              </button>
            </form>
          </div>

          {/* Scrolling Feed */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="font-display text-lg font-bold text-coffee flex items-center justify-between">
              <span>❤️ Kindness Log Feed</span>
              <span className="text-[10px] bg-sage/20 text-coffee/70 px-2.5 py-0.5 rounded-full font-mono">
                {kindnessPosts.length} Logs
              </span>
            </h4>

            <div className="space-y-3.5 max-h-[360px] overflow-y-auto pr-2 scrollbar-thin">
              {kindnessPosts.length === 0 ? (
                <p className="text-xs text-coffee/50 text-center py-10 bg-cream/10 rounded-2xl border border-dashed border-coffee/10">
                  No logs posted yet. Be the first!
                </p>
              ) : (
                kindnessPosts.map((p) => {
                  const colors = [
                    "bg-[#FFFDF6] border-peach/20",
                    "bg-[#F7FCF6] border-sage/20",
                    "bg-[#F5FAFC] border-sky/20",
                  ];
                  const selectedBg = colors[p.id.length % colors.length];
                  return (
                    <div
                      key={p.id}
                      className={`p-4 rounded-2xl border scrapbook-shadow transition-transform hover:-translate-y-0.5 duration-200 relative ${selectedBg}`}
                    >
                      <div className="absolute top-3.5 right-3.5 text-[10px] bg-coffee/5 text-coffee/65 px-2 py-0.5 rounded-full font-bold font-display">
                        {p.badge}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-sm text-coffee">{p.author}</span>
                        <span className="text-red-500 text-xs">❤️</span>
                      </div>

                      <p className="text-coffee/85 mt-1.5 leading-relaxed font-hand text-base">
                        "{p.text}"
                      </p>

                      <div className="flex justify-between items-center mt-3 pt-2 border-t border-coffee/5">
                        <span className="text-[9px] text-coffee/40 font-mono">{p.date}</span>
                        <span className="text-[9px] font-bold text-green-700 bg-green-50 px-1.5 py-0.5 rounded-sm">
                          +{p.points} Pts
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Gardeners list */}
        <div className="mt-16">
          <SectionHeading eyebrow="The gardeners" title="Friends who grew this meadow" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {animals.map((a) => (
              <Link
                key={a.slug}
                to="/paw-friends/$slug"
                params={{ slug: a.slug }}
                className="flex items-center gap-3 rounded-2xl border border-coffee/10 bg-white p-3 scrapbook-shadow transition-transform hover:-translate-y-1"
              >
                <img src={a.image} alt="" className="size-14 rounded-full object-cover" />
                <div className="min-w-0">
                  <p className="truncate font-bold text-left">
                    {a.name} {a.emoji}
                  </p>
                  <p className="text-xs text-coffee/60 text-left">
                    {a.stats.memories} memories · {a.stats.pawPrints} love
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== FOUND A FRIEND SECTION ==================== */}
      <section
        id="found-friends"
        className="mx-auto max-w-6xl px-6 pt-20 pb-16 scroll-mt-24 border-b border-coffee/5"
      >
        <SectionHeading
          eyebrow="Community"
          title="I Found A Friend 🐾"
          action={
            <button
              onClick={() => {
                document
                  .getElementById("share-friend-form")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="rounded-full bg-peach px-5 py-2 text-sm font-bold text-coffee hover:scale-105 cursor-pointer"
            >
              Share yours
            </button>
          }
        />
        <p className="max-w-2xl text-sm text-coffee/70">
          These are little souls people met on the street and wanted to remember. Every story is
          reviewed by our tiny team before it appears here.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 bg-[#e6ccb2]/20 border-4 border-dashed border-[#7f5539] rounded-3xl p-6 relative">
          {allSubmissions.length === 0 && (
            <div className="col-span-full rounded-2xl border border-dashed border-coffee/20 bg-white/50 p-8 text-center text-sm text-coffee/60">
              No community friends yet. Be the first to share one 🌸
            </div>
          )}
          {allSubmissions.map((r, i) => {
            const isLocal = "isLocal" in r && (r as { isLocal: boolean }).isLocal;
            const colors = ["bg-[#fefae0]", "bg-[#e8f5e9]", "bg-[#e1f5fe]", "bg-[#fce4ec]"];
            const rotations = [
              "rotate-1",
              "-rotate-2",
              "rotate-2",
              "-rotate-1",
              "rotate-3",
              "-rotate-3",
            ];
            const noteColor = colors[i % colors.length];
            const rotation = rotations[i % rotations.length];

            const { needType, needStatus, cleanStory } = parseHelpBoardItem(r);

            return (
              <article
                key={r.id}
                className={`relative p-5 scrapbook-shadow border border-coffee/10 transition-all hover:scale-103 hover:rotate-0 duration-300 ${noteColor} ${rotation} rounded-2xl flex flex-col justify-between`}
              >
                {/* Thumbtack */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-2xl z-10 select-none drop-shadow">
                  📌
                </div>

                {isLocal && (
                  <div className="absolute top-2.5 right-2.5 z-10 rounded-full bg-sage px-2 py-0.5 text-[8px] font-bold text-coffee shadow-xs">
                    🏡 Local
                  </div>
                )}

                <div>
                  {/* Polaroid photo holder */}
                  <div className="border border-coffee/5 bg-white p-2 pb-5 shadow-sm rounded-sm mb-4">
                    <SignedImage
                      storageRef={r.photo_url}
                      alt={r.name}
                      className="h-40 w-full object-cover rounded-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-display text-lg font-bold text-coffee">{r.name}</h3>
                      <span className="rounded-full bg-coffee/5 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-coffee/70">
                        {r.species}
                      </span>
                    </div>

                    {/* Need Type Pill */}
                    <div className="flex flex-wrap gap-1.5 items-center">
                      <span className="rounded-full bg-peach/10 border border-peach/25 px-2 py-0.5 text-[9px] font-bold text-coffee/80">
                        {needType}
                      </span>

                      {/* Help Status Pill */}
                      <span
                        className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${
                          needStatus === "open"
                            ? "bg-red-100 text-red-800"
                            : needStatus === "helping"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                        }`}
                      >
                        {needStatus === "open"
                          ? "🚨 Open / Needs Help"
                          : needStatus === "helping"
                            ? "🟡 Someone Helping"
                            : "💚 Help Completed"}
                      </span>
                    </div>

                    <p className="text-[10px] text-coffee/60 font-semibold mt-1">📍 {r.location}</p>
                    <p className="text-coffee/80 leading-relaxed font-hand text-base">
                      "{cleanStory}"
                    </p>
                    {r.video_url && (
                      <div className="mt-2 border border-coffee/5 bg-white p-1 rounded">
                        <SignedVideo storageRef={r.video_url} className="w-full rounded-sm" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 border-t border-coffee/5 pt-3 flex flex-col gap-2">
                  {/* I Can Help Action Trigger */}
                  {needStatus !== "resolved" && (
                    <button
                      onClick={() => handleHelpItem(r)}
                      className={`squish w-full py-2 rounded-xl text-xs font-bold text-coffee border border-coffee/10 scrapbook-shadow cursor-pointer transition-colors ${
                        needStatus === "helping"
                          ? "bg-[#e6f4ea] hover:bg-green-200"
                          : "bg-[#fcf3ef] hover:bg-peach"
                      }`}
                    >
                      {needStatus === "helping" ? "💚 Mark as Help Completed" : "🍲 I Can Help!"}
                    </button>
                  )}
                  {needStatus === "resolved" && (
                    <button
                      onClick={() => handleHelpItem(r)}
                      className="squish w-full py-2 rounded-xl text-xs font-bold text-coffee/40 bg-cream/40 border border-coffee/5 cursor-pointer hover:bg-cream"
                    >
                      🔄 Reopen Assistance Alert
                    </button>
                  )}

                  {isLocal && (
                    <p className="text-[8px] font-bold text-coffee/40 text-center italic">
                      *Saved to local device cache.
                    </p>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        <div id="share-friend-form" className="mt-16">
          <SubmissionSection />
        </div>
      </section>

      {/* ==================== EXPLORE SECTION ==================== */}
      <section id="explore" className="mx-auto max-w-6xl px-6 pt-20 pb-4 scroll-mt-24">
        <div className="mb-2 text-sm font-bold uppercase tracking-widest text-coffee/50">
          🌈 Explore the World
        </div>
        <h2 className="font-display text-4xl sm:text-5xl">Wander a little</h2>
        <p className="mt-2 max-w-xl text-lg text-coffee/70">
          Two cozy corners to lose yourself in — a village map, and a story-weaver that speaks in a
          paw's voice.
        </p>

        <nav className="mt-8 flex flex-wrap gap-2">
          <button
            onClick={() => setExploreTab("map")}
            className={
              "rounded-full border px-4 py-2 text-sm font-bold transition-colors cursor-pointer " +
              (exploreTab === "map"
                ? "border-coffee bg-coffee text-cream"
                : "border-coffee/15 bg-white text-coffee hover:bg-cream/60")
            }
          >
            🗺️ Paw World Map
          </button>
          <button
            onClick={() => setExploreTab("weaver")}
            className={
              "rounded-full border px-4 py-2 text-sm font-bold transition-colors cursor-pointer " +
              (exploreTab === "weaver"
                ? "border-coffee bg-coffee text-cream"
                : "border-coffee/15 bg-white text-coffee hover:bg-cream/60")
            }
          >
            ✨ Story Weaver
          </button>
        </nav>

        <div className="mt-6">
          {exploreTab === "map" ? (
            /* Paw World Map Component */
            <div className="relative overflow-hidden rounded-[2.5rem] border-4 border-white bg-sage/30 p-6 shadow-2xl sm:p-10">
              <div className="pointer-events-none absolute top-6 left-8 text-4xl animate-drift opacity-70">
                ☁️
              </div>
              <div
                className="pointer-events-none absolute top-16 right-20 text-5xl animate-drift opacity-60"
                style={{ animationDelay: "-8s" }}
              >
                ☁️
              </div>
              <div className="pointer-events-none absolute bottom-6 left-1/4 text-3xl">🌳</div>
              <div className="pointer-events-none absolute bottom-10 right-16 text-3xl">🌸</div>
              <div className="pointer-events-none absolute top-1/2 left-8 text-2xl opacity-70">
                🌿
              </div>

              {/* Filter Buttons */}
              <div className="flex flex-wrap gap-2.5 justify-center mb-6">
                {[
                  { id: "all", label: "All Friends 🐾" },
                  { id: "safe", label: "Safe 💚" },
                  { id: "needs-food", label: "Needs Food 🍲" },
                  { id: "needs-care", label: "Needs Care 🏥" },
                  { id: "new-friend", label: "New Friend ✨" },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setMapFilter(f.id as typeof mapFilter)}
                    className={`squish px-4 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer shadow-2xs ${
                      mapFilter === f.id
                        ? "bg-coffee border-coffee text-cream"
                        : "bg-white border-coffee/10 text-coffee hover:bg-cream"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <div className="relative mx-auto aspect-16/10 w-full rounded-4xl bg-linear-to-b from-sky/40 via-cream/60 to-sage/40">
                {/* Roads */}
                <svg
                  className="absolute inset-0 h-full w-full"
                  viewBox="0 0 400 250"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M 0 200 Q 200 100 400 200"
                    className="map-trace-path"
                    stroke="rgba(123,75,50,0.15)"
                    strokeWidth="4"
                    strokeDasharray="8 6"
                    fill="none"
                  />
                  <path
                    d="M 200 0 Q 240 120 200 250"
                    className="map-trace-path"
                    stroke="rgba(123,75,50,0.15)"
                    strokeWidth="4"
                    strokeDasharray="8 6"
                    fill="none"
                  />
                </svg>

                {mapPlaces.map((p) => {
                  const a = getAnimal(p.animals[0]);
                  if (!a) return null;

                  // Filter out map markers based on mapFilter status
                  if (mapFilter !== "all" && a.status !== mapFilter) {
                    return null;
                  }

                  return (
                    <button
                      key={p.id}
                      onClick={() => setFoundPlaceAnimal(a.slug)}
                      className="group absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300"
                      style={{ top: p.top, left: p.left }}
                      aria-label={`Visit ${p.name}`}
                    >
                      <div className="mb-2 rounded-xl bg-white px-2 py-1 text-center text-[10px] font-bold shadow scrapbook-shadow">
                        <div>
                          {p.icon} {p.name}
                        </div>
                      </div>
                      <div className="mx-auto size-14 overflow-hidden rounded-full border-4 border-white bg-white animate-float shadow-lg transition-transform group-hover:scale-110">
                        <img src={a.image} alt={a.name} className="h-full w-full object-cover" />
                      </div>
                    </button>
                  );
                })}
              </div>

              <p className="mt-6 text-center text-sm font-bold uppercase tracking-widest text-coffee/60">
                Tap a place · Meet a friend
              </p>

              {mapAnimal && (
                <div className="mt-6 flex justify-center animate-fade-in">
                  <div className="relative border border-coffee/10 bg-white p-4 pb-6 scrapbook-shadow rotate-[1.5deg] w-full max-w-sm flex gap-4 items-center rounded-2xl">
                    {/* Washi tape */}
                    <div className="absolute -top-3 left-1/2 z-20 h-5 w-14 -translate-x-1/2 bg-yellow/40 border border-dashed border-yellow/20 opacity-75 shadow-xs" />

                    <div className="w-24 aspect-square overflow-hidden rounded-xl border border-coffee/5 shrink-0 bg-cream">
                      <img
                        src={mapAnimal.image}
                        alt={mapAnimal.name}
                        className="size-full object-cover"
                      />
                    </div>

                    <div className="flex-1 text-left space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-display text-lg font-bold text-coffee">
                          {mapAnimal.name} {mapAnimal.emoji}
                        </h4>
                        <span
                          className={`text-[8px] font-bold px-2 py-0.5 rounded-full ${
                            mapAnimal.status === "safe"
                              ? "bg-green-100 text-green-800"
                              : mapAnimal.status === "needs-food"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {mapAnimal.status === "safe"
                            ? "Safe 💚"
                            : mapAnimal.status === "needs-food"
                              ? "Needs Food 🍲"
                              : mapAnimal.status === "needs-care"
                                ? "Needs Care 🏥"
                                : "New Friend 🐾"}
                        </span>
                      </div>
                      <p className="font-hand text-base text-peach">"{mapAnimal.nickname}"</p>
                      <p className="text-[10px] text-coffee/70">📍 {mapAnimal.home}</p>

                      <Link
                        to="/paw-friends/$slug"
                        params={{ slug: mapAnimal.slug }}
                        className="inline-block text-[10px] font-bold text-coffee underline hover:text-peach pt-1"
                      >
                        Open Passport & Stories 📖 →
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {animals.map((a) => (
                  <Link
                    key={a.slug}
                    to="/paw-friends/$slug"
                    params={{ slug: a.slug }}
                    className="flex items-center gap-3 rounded-2xl border border-coffee/10 bg-white p-3 scrapbook-shadow hover:-translate-y-1 transition-transform"
                  >
                    <img src={a.image} alt="" className="size-12 rounded-full object-cover" />
                    <div className="text-left">
                      <p className="text-sm font-bold">
                        {a.name} {a.emoji}
                      </p>
                      <p className="text-xs text-coffee/60">📍 {a.home}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            /* Story Weaver Component */
            <div className="rounded-3xl border-2 border-dashed border-peach/50 bg-white/80 p-6 scrapbook-shadow sm:p-10">
              {isReunion && (
                <div className="mb-6 rounded-2xl border-2 border-yellow bg-yellow/5 p-4 text-center">
                  <span className="text-3xl block mb-1">🌟</span>
                  <h3 className="font-display text-lg font-bold text-coffee">
                    Village Picnic Reunion Unlocked!
                  </h3>
                  <p className="text-xs text-coffee/85 max-w-md mx-auto mt-1">
                    You collected all 4 Village Passport stamps! As a reward, you can weave their
                    reunion picnic adventure.
                  </p>
                </div>
              )}

              <p className="text-xs font-bold uppercase tracking-widest text-coffee/60">
                ✨ Story Weaver
              </p>
              <h2 className="mt-1 font-display text-3xl">
                {isReunion
                  ? "Gather the village friends for a warm adventure."
                  : "Give me a friend, and I'll write in their voice."}
              </h2>

              {!isReunion && (
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-xs font-bold uppercase tracking-widest text-coffee/60">
                      Friend
                    </span>
                    <select
                      value={weaverSlug}
                      onChange={(e) => setWeaverSlug(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-coffee/15 bg-white px-3 py-2 font-bold"
                    >
                      {animals.map((a) => (
                        <option key={a.slug} value={a.slug}>
                          {a.name} {a.emoji} — {a.nickname}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className="text-xs font-bold uppercase tracking-widest text-coffee/60">
                      Story kind
                    </span>
                    <select
                      value={weaverMode}
                      onChange={(e) => setWeaverMode(e.target.value as WeaverMode)}
                      className="mt-1 w-full rounded-xl border border-coffee/15 bg-white px-3 py-2 font-bold"
                    >
                      <option value="pov">Animal's POV story</option>
                      <option value="story">Cute little story</option>
                      <option value="caption">Instagram caption</option>
                      <option value="adoption">Adoption story</option>
                    </select>
                  </label>
                  <label className="block sm:col-span-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-coffee/60">
                      Mood
                    </span>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {["happy", "funny", "emotional", "rain", "rescue", "night"].map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setWeaverMood(m)}
                          className={
                            "rounded-full border px-3 py-1 text-sm font-bold cursor-pointer " +
                            (weaverMood === m
                              ? "border-coffee bg-coffee text-cream"
                              : "border-coffee/15 bg-white hover:bg-cream/60")
                          }
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </label>
                </div>
              )}

              <button
                onClick={onWeaveGenerate}
                disabled={weaverLoading}
                className="mt-6 rounded-2xl bg-coffee px-6 py-3 text-sm font-bold text-cream scrapbook-shadow transition-transform hover:-translate-y-0.5 disabled:opacity-60 cursor-pointer"
              >
                {weaverLoading
                  ? "Gathering friends..."
                  : isReunion
                    ? "🌟 Weave Reunion Picnic Story"
                    : `✨ Weave a story for ${currentWeaveAnimal?.name || "Friend"}`}
              </button>

              {weaverLoading && (
                <div className="flex gap-1.5 items-center justify-center mt-4">
                  <span
                    className="paw-loader-dot text-lg animate-paw-walk"
                    style={{ animationDelay: "0s" }}
                  >
                    🐾
                  </span>
                  <span
                    className="paw-loader-dot text-lg animate-paw-walk"
                    style={{ animationDelay: "0.3s" }}
                  >
                    🐾
                  </span>
                  <span
                    className="paw-loader-dot text-lg animate-paw-walk"
                    style={{ animationDelay: "0.6s" }}
                  >
                    🐾
                  </span>
                  <p className="text-xs text-coffee/50 font-bold tracking-wider ml-1 font-display">
                    Weaving memory...
                  </p>
                </div>
              )}

              {weaverError && (
                <p className="mt-4 rounded-xl bg-destructive/10 p-3 text-sm text-destructive">
                  {weaverError}
                </p>
              )}
              {weaverResult && (
                <div className="mt-6 rounded-2xl border border-coffee/10 bg-cream/60 p-5">
                  <p className="mb-2 text-xs font-bold uppercase tracking-widest text-coffee/50">
                    {isReunion
                      ? "The Village Gathering 🌸"
                      : `A story from ${currentWeaveAnimal?.name || "Friend"} ${currentWeaveAnimal?.emoji || "🐾"}`}
                  </p>
                  <p className="whitespace-pre-line font-hand text-2xl leading-snug text-coffee">
                    {weaverResult}
                  </p>
                </div>
              )}

              {showCertificate && (
                <div className="mt-8 rounded-3xl border-4 border-dashed border-yellow bg-cream/35 p-6 text-center scrapbook-shadow max-w-md mx-auto animate-fade-in relative">
                  <span className="text-5xl block animate-pulse">🏅</span>
                  <h3 className="font-display text-2xl text-coffee mt-2">
                    Village Protector Certificate
                  </h3>
                  <p className="text-xs text-coffee/50 font-bold uppercase tracking-wider mt-1">
                    Awarded to
                  </p>

                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    className="mt-2 mx-auto block w-64 text-center font-hand text-2xl text-peach bg-transparent border-b-2 border-coffee/20 outline-none focus:border-peach pb-1"
                  />

                  <p className="text-xs text-coffee/75 mt-4 leading-relaxed">
                    For exploring the village of College Street, finding all 4 friends (Coco, Moti,
                    Kitty, Tommy), and protecting their memories in their digital Scrapbook.
                  </p>

                  <div className="mt-4 border-t border-coffee/15 pt-3 flex items-center justify-between text-[10px] text-coffee/50 uppercase tracking-widest font-bold">
                    <span>🐾 PawBook Village</span>
                    <span>💮 Collector No. 402</span>
                  </div>

                  <button
                    onClick={() => {
                      shareContent(
                        {
                          title: "Village Protector Certificate!",
                          text: "I matched with all four friends and earned the Village Protector Certificate on PawBook! 🐾",
                          url: window.location.origin,
                        },
                        () => toast.success("Certificate shared / copied successfully! 🌟"),
                        () =>
                          toast.error(
                            "Could not share automatically. Please share the URL from your browser address bar.",
                          ),
                      );
                    }}
                    className="mt-6 w-full rounded-xl bg-coffee py-2.5 text-xs font-bold text-cream transition hover:scale-105 cursor-pointer"
                  >
                    📸 Share Certificate
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Floating Quiz Badge */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setQuizOpen(true)}
          className="flex items-center gap-2 rounded-full border border-coffee bg-peach px-4 py-2.5 text-xs font-bold text-coffee scrapbook-shadow hover:scale-105 active:scale-95 transition-transform cursor-pointer"
        >
          🎮 Play Quiz
        </button>
      </div>

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

// ==================== HELPER COMPONENTS & FUNCTIONS ====================

function ActionButton({
  icon,
  label,
  onClick,
}: {
  icon: string;
  label: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  return (
    <button
      onClick={onClick}
      className="squish flex items-center gap-1 text-xs font-bold transition-transform hover:scale-110 active:scale-95 hover:text-peach cursor-pointer"
    >
      <span className="text-lg">{icon}</span> {label}
    </button>
  );
}

export function PetPhoto({
  slug,
  image,
  className,
}: {
  slug: string;
  image: string;
  className?: string;
}) {
  const [accessory, setAccessory] = useState<string | null>(null);

  useEffect(() => {
    const handleUpdate = () => {
      setAccessory(localStorage.getItem(`pawbook-accessory-${slug}`));
    };
    handleUpdate();
    window.addEventListener("pawbook-accessory-updated", handleUpdate);
    return () => window.removeEventListener("pawbook-accessory-updated", handleUpdate);
  }, [slug]);

  return (
    <div className={`relative ${className || "h-full w-full"}`}>
      <img
        src={image}
        alt=""
        className="h-full w-full object-cover"
        style={slug === "coco" ? { objectPosition: "center 25%" } : undefined}
      />
      {accessory === "crown" && (
        <span
          className="absolute -top-1.5 left-1/2 -translate-x-1/2 text-4xl select-none drop-shadow z-10 animate-bounce"
          style={{ animationDuration: "2s" }}
        >
          👑
        </span>
      )}
      {accessory === "scarf" && (
        <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-4xl select-none drop-shadow z-10">
          🧣
        </span>
      )}
      {accessory === "glasses" && (
        <span className="absolute top-10 left-1/2 -translate-x-1/2 text-3xl select-none drop-shadow z-10">
          🕶️
        </span>
      )}
      {accessory === "hat" && (
        <span className="absolute -top-3 left-1/3 text-4xl select-none drop-shadow z-10 rotate-12">
          🥳
        </span>
      )}
    </div>
  );
}

function moodLabel(m: string) {
  const map: Record<string, string> = {
    happy: "😊 Happy",
    emotional: "🥺 Emotional",
    rain: "🌧 Rainy",
    funny: "😂 Funny",
    rescue: "❤️ Rescue",
    night: "🌙 Night",
  };
  return map[m] ?? m;
}

function sampleComments(slug: string) {
  const map: Record<string, { author: string; text: string }[]> = {
    moti: [
      { author: "Coco 🐕", text: "Save some treats for me 🍖" },
      { author: "Kitty 🐈", text: "Cute human friends ❤️" },
    ],
    kitty: [
      { author: "Tommy 🐕", text: "Butterflies are the best friends" },
      { author: "Moti 🐶", text: "I want a rooftop day too" },
    ],
    coco: [
      { author: "Moti 🐶", text: "Friendly tiger behavior 🐯" },
      { author: "Tommy 🐕", text: "Teach me your ways" },
    ],
    tommy: [
      { author: "Coco 🐕", text: "Rainy days are the coziest" },
      { author: "Kitty 🐈", text: "Stay dry little one 🌧" },
    ],
  };
  return map[slug] ?? [];
}

function StatCard({
  icon,
  label,
  value,
  tone,
}: {
  icon: string;
  label: string;
  value: number;
  tone: "peach" | "yellow" | "sage";
}) {
  return (
    <div
      className={`rounded-2xl sm:rounded-3xl border border-coffee/10 bg-${tone}/40 p-3 sm:p-6 text-center scrapbook-shadow`}
    >
      <div className="text-2xl sm:text-4xl">{icon}</div>
      <p className="mt-1 sm:mt-2 font-display text-xl sm:text-4xl">{value}</p>
      <p className="text-[9px] sm:text-xs font-bold uppercase tracking-tight sm:tracking-widest text-coffee/60 leading-tight mt-0.5 sm:mt-1">
        {label}
      </p>
    </div>
  );
}

function SubmissionSection() {
  const { user, loading } = useSession();
  if (loading) return null;
  return <SubmitForm user={user} />;
}

function SubmitForm({ user }: { user: User | null }) {
  const submit = useServerFn(submitFoundFriend);
  const router = useRouter();
  const [name, setName] = useState("");
  const [needAName, setNeedAName] = useState(false);
  const [species, setSpecies] = useState("Dog");
  const [needType, setNeedType] = useState("Just sharing memory");
  const [location, setLocation] = useState("");
  const [story, setStory] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!photo) {
      toast.error("A photo helps us remember them 📸");
      return;
    }
    setBusy(true);
    try {
      let activeUserId = user?.id;
      if (!activeUserId) {
        const { data: anonData, error: anonError } = await supabase.auth.signInAnonymously();
        if (anonError) throw anonError;
        activeUserId = anonData.user?.id;
      }

      if (!activeUserId) {
        throw new Error("Could not authenticate visitor anonymously.");
      }

      const { path: photoRef } = await uploadToBucket("animal-photos", photo, activeUserId);
      let videoRef: string | null = null;
      if (video) {
        const up = await uploadToBucket("pawbook-videos", video, activeUserId);
        videoRef = up.path;
      }

      const finalName = needAName ? "Need a Name 🐾" : name;
      const finalStory = `${story} [type:${needType}][status:open]`;

      await submit({
        data: { name: finalName, species, location, story: finalStory, photoRef, videoRef },
      });
      toast.success("Thank you 🌸 A moderator will review it soon.");
      setName("");
      setNeedAName(false);
      setLocation("");
      setStory("");
      setPhoto(null);
      setVideo(null);
      router.invalidate();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="scrapbook-shadow mx-auto max-w-2xl rounded-3xl border border-coffee/10 bg-white/90 p-6 sm:p-8"
    >
      <h3 className="font-display text-2xl">Tell us about your new friend</h3>
      <p className="mt-1 text-sm text-coffee/70">A photo, a name, a little story. That's all.</p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col">
          <label className="text-sm font-semibold flex items-center justify-between">
            <span>Their name</span>
            <label className="flex items-center gap-1.5 text-xs font-normal text-coffee/60 normal-case cursor-pointer">
              <input
                type="checkbox"
                checked={needAName}
                onChange={(e) => {
                  setNeedAName(e.target.checked);
                  if (e.target.checked) setName("");
                }}
              />
              Need a Name
            </label>
          </label>
          <input
            required={!needAName}
            disabled={needAName}
            maxLength={80}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={needAName ? "Will be named by community..." : "e.g. Biscuit"}
            className="mt-1 w-full rounded-xl border border-coffee/15 bg-cream/40 px-3 py-2 text-sm font-normal outline-none focus:border-peach disabled:opacity-50"
          />
        </div>
        <label className="text-sm font-semibold">
          Need Type
          <select
            value={needType}
            onChange={(e) => setNeedType(e.target.value)}
            className="mt-1 w-full rounded-xl border border-coffee/15 bg-cream/40 px-3 py-2 text-sm font-normal outline-none focus:border-peach"
          >
            <option>Just sharing memory</option>
            <option>Needs food</option>
            <option>Needs medical care</option>
            <option>Lost pet</option>
            <option>Looking for adoption</option>
          </select>
        </label>
        <label className="text-sm font-semibold">
          Species
          <select
            value={species}
            onChange={(e) => setSpecies(e.target.value)}
            className="mt-1 w-full rounded-xl border border-coffee/15 bg-cream/40 px-3 py-2 text-sm font-normal outline-none focus:border-peach"
          >
            <option>Dog</option>
            <option>Cat</option>
            <option>Bird</option>
            <option>Cow</option>
            <option>Other</option>
          </select>
        </label>
        <label className="text-sm font-semibold">
          Where you met
          <input
            required
            maxLength={120}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Behind the tea shop"
            className="mt-1 w-full rounded-xl border border-coffee/15 bg-cream/40 px-3 py-2 text-sm font-normal outline-none focus:border-peach"
          />
        </label>
        <label className="sm:col-span-2 text-sm font-semibold">
          Their little story
          <textarea
            required
            minLength={10}
            maxLength={2000}
            rows={4}
            value={story}
            onChange={(e) => setStory(e.target.value)}
            placeholder="What did they do? How did they look at you?"
            className="mt-1 w-full rounded-xl border border-coffee/15 bg-cream/40 px-3 py-2 text-sm font-normal outline-none focus:border-peach"
          />
        </label>
        <label className="text-sm font-semibold">
          Photo (required)
          <input
            required
            type="file"
            accept="image/*"
            onChange={(e) => setPhoto(e.target.files?.[0] ?? null)}
            className="mt-1 w-full text-xs font-normal"
          />
        </label>
        <label className="text-sm font-semibold">
          Video (optional)
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setVideo(e.target.files?.[0] ?? null)}
            className="mt-1 w-full text-xs font-normal"
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={busy}
        className="mt-6 w-full rounded-full bg-coffee px-6 py-3 text-sm font-bold text-cream hover:bg-coffee/90 disabled:opacity-50 cursor-pointer"
      >
        {busy ? "Sending love…" : "Share this friend 🐾"}
      </button>
    </form>
  );
}
