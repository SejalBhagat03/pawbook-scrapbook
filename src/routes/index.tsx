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
  type Animal,
} from "@/lib/pawbook-data";
import { PetQuizModal } from "@/components/pawbook/PetQuizModal";
import { SpinWheel } from "@/components/pawbook/SpinWheel";
import { InstagramStories } from "@/components/pawbook/InstagramStories";
import { playPop, playRustle, playBark, playMeow, playPageFlip } from "@/lib/sound";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";
import confetti from "canvas-confetti";

import { useServerFn } from "@tanstack/react-start";
import { uploadToBucket, resolveAsset } from "@/lib/storage";
import {
  submitFoundFriend,
  uploadGuestPhoto,
  submitGuestFriend,
} from "@/lib/submissions.functions";
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
          "Meet Coco, Moti, Kitty and Tommy — a cozy village of beloved animals whose stories live forever in PawBook.",
      },
    ],
  }),
  component: HomePage,
});

function FriendCardStyle() {
  return (
    <style>{`
      @utility rotate-y-180 {
        transform: rotateY(180deg);
      }
    `}</style>
  );
}

function FriendCard({
  a,
  isFlipped,
  toggleFlip,
  i,
}: {
  a: Animal;
  isFlipped: boolean;
  toggleFlip: (e: React.MouseEvent) => void;
  i: number;
}) {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;
    const tiltX = (mouseY / (height / 2)) * -12;
    const tiltY = (mouseX / (width / 2)) * 12;
    setRotateX(tiltX);
    setRotateY(tiltY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setIsHovered(false);
  };

  const getInitial = () => {
    if (a.slug === "kitty") return { opacity: 0, x: -80, rotate: -5 };
    if (a.slug === "moti") return { opacity: 0, scale: 0.8, rotate: -15 };
    return { opacity: 0, y: 100, rotate: 5 };
  };

  const getAnimate = () => {
    if (a.slug === "kitty") return { opacity: 1, x: 0, rotate: -1.5 };
    if (a.slug === "moti") return { opacity: 1, scale: 1, rotate: 2 };
    return { opacity: 1, y: 0, rotate: 1 };
  };

  return (
    <motion.div
      onClick={toggleFlip}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => setIsHovered(true)}
      initial={getInitial()}
      whileInView={getAnimate()}
      viewport={{ once: true, margin: "-8% 0px" }}
      style={{
        rotateX: isFlipped ? 0 : rotateX,
        rotateY: isFlipped ? 180 : rotateY,
        transformStyle: "preserve-3d",
        perspective: "1000px",
      }}
      whileHover={{ scale: 1.05 }}
      transition={{
        type: "spring",
        stiffness: 70,
        damping: 12,
        delay: i * 0.1,
      }}
      className="relative w-full h-[390px] cursor-pointer select-none group"
    >
      <div
        className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${
          isFlipped ? "rotate-y-180" : ""
        }`}
      >
        {/* FRONT SIDE */}
        <div className="absolute inset-0 w-full h-full backface-hidden rounded-3xl border border-coffee/10 bg-white p-3 pb-5 flex flex-col justify-between scrapbook-shadow z-10">
          <div className="absolute -top-3.5 left-1/2 z-20 h-6 w-16 -translate-x-1/2 bg-yellow/40 border border-dashed border-yellow/20 opacity-75 shadow-xs" />

          <div className="relative w-full aspect-square overflow-hidden rounded-2xl bg-cream border border-coffee/5">
            <div className="absolute top-2.5 right-2.5 rounded-full bg-peach/95 p-1.5 text-xs shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100 z-30 select-none">
              🐾
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
          <div className="absolute -top-3.5 left-1/2 z-20 h-6 w-16 -translate-x-1/2 bg-peach/40 border border-dashed border-peach/20 opacity-75 shadow-xs" />

          <div className="space-y-3.5 flex-1">
            <div className="text-center border-b border-coffee/5 pb-2">
              <h4 className="font-display text-base font-bold text-coffee">{a.name}'s Love</h4>
              <p className="text-[10px] text-coffee/50">Community Care Card</p>
            </div>

            <div className="grid grid-cols-3 gap-1 bg-[#FDFBF7] p-2.5 rounded-2xl border border-coffee/5 text-center">
              <div>
                <p className="text-[11px] font-bold text-coffee">
                  {a.communityLove?.followers || 0}
                </p>
                <p className="text-[8px] text-coffee/50 uppercase font-bold tracking-wider">Love</p>
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
                <p className="text-[11px] font-bold text-coffee">{a.communityLove?.helpers || 0}</p>
                <p className="text-[8px] text-coffee/50 uppercase font-bold tracking-wider">
                  Helpers
                </p>
              </div>
            </div>

            <div className="text-[11px] space-y-1 text-left">
              <p>
                <span className="font-bold text-coffee/70">🧬 Breed:</span>{" "}
                <span className="text-coffee/85 font-medium">{a.breedType}</span>
              </p>
              <p>
                <span className="font-bold text-coffee/70">🍪 Fav Snack:</span>{" "}
                <span className="text-coffee/85 font-medium">
                  {(a.favoriteFood || "Unknown").slice(0, 35)}
                </span>
              </p>
            </div>

            <div className="flex flex-wrap gap-1 mt-1">
              {(a.badges || []).slice(0, 3).map((badge: string, idx: number) => (
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

      {isHovered && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
          {[0, 1, 2].map((k) => (
            <motion.span
              key={k}
              initial={{ y: 280, x: 40 + k * 40, opacity: 1, scale: 0.6 }}
              animate={{
                y: -40,
                x: 40 + k * 40 + (Math.random() * 40 - 20),
                opacity: 0,
                scale: 1.3,
                rotate: Math.random() * 360,
              }}
              transition={{ duration: 1.8, delay: k * 0.25, ease: "easeOut" }}
              className="absolute text-xl select-none"
            >
              {a.slug === "kitty" ? "🐾" : "❤️"}
            </motion.span>
          ))}
        </div>
      )}
    </motion.div>
  );
}

const orbitClasses = [
  { top: "0%", left: "10%", delay: "0s", size: "w-20 h-20" },
  { top: "10%", right: "0%", delay: "-1s", size: "w-16 h-16" },
  { bottom: "5%", right: "10%", delay: "-2s", size: "w-20 h-20" },
  { bottom: "15%", left: "0%", delay: "-3s", size: "w-16 h-16" },
];

type WeaverMode = "story" | "pov" | "caption" | "adoption";

// Floating paw decorations that react to scroll position
function ScrollFlowDecor() {
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 40, damping: 20 });

  // Different parallax speeds for each paw
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
      {/* Top-left drifting paw */}
      <motion.div
        style={{ y: y1, rotate: rotate1, opacity: opacity1, scale: scale1 }}
        className="absolute -top-8 left-[8%] text-5xl select-none"
      >
        🐾
      </motion.div>

      {/* Top-right slow paw */}
      <motion.div
        style={{ y: y2, rotate: rotate2, opacity: opacity2 }}
        className="absolute top-[12%] right-[6%] text-7xl select-none"
      >
        🐾
      </motion.div>

      {/* Mid-left fast paw */}
      <motion.div
        style={{ y: y3, opacity: opacity1 }}
        className="absolute top-[35%] left-[3%] text-3xl select-none"
      >
        🐾
      </motion.div>

      {/* Mid-right small paw */}
      <motion.div
        style={{ y: y4, rotate: rotate1, opacity: opacity2 }}
        className="absolute top-[55%] right-[10%] text-2xl select-none"
      >
        🐾
      </motion.div>

      {/* Bottom-left paw */}
      <motion.div
        style={{ y: y2, rotate: rotate2, opacity: opacity1 }}
        className="absolute top-[75%] left-[15%] text-4xl select-none"
      >
        🐾
      </motion.div>

      {/* Scroll progress bar at top */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-0.5 bg-linear-to-r from-peach via-yellow to-peach origin-left z-50"
        style={{ scaleX: smoothProgress }}
      />
    </div>
  );
}

function MagicLetter({
  name,
  story,
  isOpen,
  onToggle,
}: {
  name: string;
  story: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-[#FDFBF7]/60 border border-coffee/5 p-4 mb-4 select-none">
      <AnimatePresence initial={false} mode="wait">
        {!isOpen ? (
          <motion.div
            key="closed"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            onClick={onToggle}
            className="cursor-pointer flex flex-col items-center justify-center py-6 text-center group"
          >
            {/* Cute physical envelope simulator */}
            <div className="relative w-40 h-24 mb-4 bg-[#EED9C4] border border-coffee/10 rounded-lg flex items-center justify-center shadow-xs overflow-visible">
              {/* Back side of envelope body */}
              <div
                className="absolute inset-0 bg-[#E6CCA7]"
                style={{ clipPath: "polygon(0 0, 50% 55%, 100% 0, 100% 100%, 0 100%)" }}
              />
              <div
                className="absolute inset-0 bg-[#EED9C4]"
                style={{ clipPath: "polygon(0 100%, 50% 55%, 0 0)" }}
              />
              <div
                className="absolute inset-0 bg-[#F5DEC2]"
                style={{ clipPath: "polygon(100% 100%, 50% 55%, 100% 0)" }}
              />
              <div
                className="absolute inset-0 bg-[#DEBF97]"
                style={{ clipPath: "polygon(0 100%, 50% 55%, 100% 100%)" }}
              />

              {/* Envelope top flap */}
              <motion.div
                className="absolute top-0 left-0 right-0 h-12 bg-[#D1AE82] origin-top z-10"
                style={{
                  clipPath: "polygon(0 0, 50% 100%, 100% 0)",
                  transformStyle: "preserve-3d",
                }}
                whileHover={{ rotateX: -30 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              />

              {/* Heart Sticker / Seal */}
              <motion.div
                className="absolute top-[55%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 text-3xl select-none pointer-events-none drop-shadow-md"
                animate={{ scale: [1, 1.12, 1] }}
                transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
              >
                💌
              </motion.div>
            </div>

            <h4 className="font-display text-sm font-bold text-coffee group-hover:text-peach transition-colors">
              Open {name}&apos;s Memory Letter
            </h4>
            <p className="text-[10px] text-coffee/40 font-bold uppercase tracking-wider mt-1">
              Tap to open letter
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="open"
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            className="flex flex-col items-center"
          >
            {/* Lined Notebook Paper Story */}
            <motion.div
              initial={{ scale: 0.93, y: 25 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ delay: 0.08, duration: 0.4, ease: "backOut" }}
              className="w-full relative bg-white border border-coffee/10 rounded-xl p-5 shadow-sm bg-[radial-gradient(circle_at_0px_0px,transparent_8px,transparent_8px),linear-gradient(#F5EFEB_1px,transparent_1px)] bg-size-[100%_28px] pl-8"
            >
              {/* Lined margin */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-red-400/20" />

              <div className="absolute right-4 top-4 text-[9px] font-bold text-coffee/30 select-none font-display">
                PAGE 1 OF 1
              </div>

              <div className="mt-2 pl-2">
                <p className="font-hand text-lg leading-[28px] text-coffee/85 whitespace-pre-line italic">
                  "{story}"
                </p>
              </div>

              <div className="mt-5 flex justify-end text-xs font-bold text-peach font-display pr-2">
                — {name} 🐾
              </div>
            </motion.div>

            <button
              onClick={onToggle}
              className="mt-3.5 inline-flex items-center gap-1.5 py-1 px-3.5 rounded-full border border-coffee/10 bg-white text-[9px] font-bold uppercase tracking-wider text-[#A06040] hover:bg-[#FAF4ED] hover:text-peach transition-all cursor-pointer shadow-xs"
            >
              ✕ Fold & Close Letter
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

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

  const [flashActive, setFlashActive] = useState(false);
  const [plantingPost, setPlantingPost] = useState<KindnessPost | null>(null);

  useEffect(() => {
    const triggerFlash = () => {
      setFlashActive(true);
      setTimeout(() => setFlashActive(false), 600);
    };
    window.addEventListener("pawbook-trigger-flash", triggerFlash);
    return () => window.removeEventListener("pawbook-trigger-flash", triggerFlash);
  }, []);

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

    setPlantingPost(newPost);
    playPop();

    setTimeout(() => {
      const updated = [newPost, ...kindnessPosts];
      setKindnessPosts(updated);
      localStorage.setItem("pawbook-kindness-posts", JSON.stringify(updated));

      const nextPoints = kindnessPoints + 10;
      setKindnessPoints(nextPoints);
      localStorage.setItem("pawbook-kindness-points", nextPoints.toString());

      setNewKindnessAuthor("");
      setNewKindnessText("");
      setPlantingPost(null);

      // Confetti burst
      confetti({
        particleCount: 50,
        spread: 80,
        colors: ["#7f5539", "#ddb892", "#ffccd5", "#b7b7a4", "#e6ccb2"],
      });

      toast.success("Kindness registered! You earned +10 Kindness Points! 🎉");
    }, 3800);
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
        {/* Instagram Stories Row */}
        <section className="mx-auto max-w-5xl px-4 pt-4">
          <InstagramStories />
        </section>

        {/* HERO */}
        <header className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-6 px-6 pt-4 pb-12 lg:grid-cols-2 lg:gap-16 lg:pt-16 lg:pb-24">
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-4 lg:space-y-8"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-yellow px-4 py-1.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.18em] scrapbook-shadow">
              🐾 Welcome to PawBook World
            </div>
            <h1 className="font-display text-3xl sm:text-4xl md:text-6xl lg:text-7xl leading-tight text-balance">
              Every little friend has a
              <br />
              <span className="text-peach">story worth remembering 🐾</span>
            </h1>
            <p className="max-w-md text-sm md:text-base leading-relaxed text-coffee/85 sm:text-lg">
              Create memories, follow journeys, and celebrate the little paws and wings that make
              our world feel like home.
            </p>
            <div className="flex flex-row gap-3 pt-1 sm:gap-4">
              <button
                onClick={() =>
                  document.getElementById("paw-book")?.scrollIntoView({ behavior: "smooth" })
                }
                className="squish flex-1 sm:flex-initial rounded-2xl bg-coffee px-4 py-2.5 sm:px-8 sm:py-3.5 text-xs sm:text-base font-bold text-cream scrapbook-shadow cursor-pointer text-center animate-bounce-slow"
              >
                🐶 Meet Paw Friends
              </button>
              <button
                onClick={() =>
                  document.getElementById("found-friends")?.scrollIntoView({ behavior: "smooth" })
                }
                className="squish flex-1 sm:flex-initial rounded-2xl border-2 border-coffee/10 bg-white px-4 py-2.5 sm:px-8 sm:py-3.5 text-xs sm:text-base font-bold text-coffee cursor-pointer text-center hover:bg-cream/60"
              >
                ❤️ Share a Paw Moment
              </button>
            </div>

            {/* Scrapbook Community Statistics Sticky Notes */}
            <div className="flex overflow-x-auto gap-2.5 pt-2 pb-2 scrollbar-none snap-x snap-mandatory -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-4 sm:overflow-visible sm:pb-0 sm:max-w-xl">
              <div className="bg-[#fefae0] border border-coffee/10 p-2 md:p-3 rounded-2xl -rotate-2 scrapbook-shadow text-center w-[115px] sm:w-auto shrink-0 snap-center">
                <span className="text-xl md:text-2xl">🐾</span>
                <p className="text-sm md:text-base font-bold text-coffee mt-1">
                  {animals.length} Friends
                </p>
                <p className="text-[8px] md:text-[9px] text-coffee/60 font-bold uppercase tracking-wider">
                  Paw Friends Added
                </p>
              </div>
              <div className="bg-[#fcf3ef] border border-coffee/10 p-2 md:p-3 rounded-2xl rotate-[1.5deg] scrapbook-shadow text-center w-[115px] sm:w-auto shrink-0 snap-center">
                <span className="text-xl md:text-2xl">❤️</span>
                <p className="text-sm md:text-base font-bold text-coffee mt-1">
                  {memories.length} Saved
                </p>
                <p className="text-[8px] md:text-[9px] text-coffee/60 font-bold uppercase tracking-wider">
                  Memories Saved
                </p>
              </div>
              <div className="bg-[#e8f0fe] border border-coffee/10 p-2 md:p-3 rounded-2xl rotate-1 scrapbook-shadow text-center w-[115px] sm:w-auto shrink-0 snap-center">
                <span className="text-xl md:text-2xl">🍲</span>
                <p className="text-sm md:text-base font-bold text-coffee mt-1">420 Shared</p>
                <p className="text-[8px] md:text-[9px] text-coffee/60 font-bold uppercase tracking-wider">
                  Meals Shared
                </p>
              </div>
              <div className="bg-[#e6f4ea] border border-coffee/10 p-2 md:p-3 rounded-2xl rotate-[-1.5deg] scrapbook-shadow text-center w-[115px] sm:w-auto shrink-0 snap-center">
                <span className="text-xl md:text-2xl">🏥</span>
                <p className="text-sm md:text-base font-bold text-coffee mt-1">94 Care</p>
                <p className="text-[8px] md:text-[9px] text-coffee/60 font-bold uppercase tracking-wider">
                  Care Moments
                </p>
              </div>
            </div>
          </motion.div>

          {/* Live showcase */}
          <div className="relative flex h-[480px] md:h-[560px] items-center justify-center">
            <div className="pointer-events-none absolute inset-0 hidden md:block">
              {others.map((a, i) => {
                const pos = orbitClasses[i % orbitClasses.length];
                return (
                  <motion.button
                    key={a.slug}
                    onClick={() => {
                      setFeaturedSlug(a.slug);
                      setIsFlipped(false);
                    }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 85,
                      damping: 12,
                      delay: 0.8 + i * 0.15,
                    }}
                    className="pointer-events-auto group absolute w-16 h-16 md:w-20 md:h-20 animate-floaty overflow-hidden rounded-full border-4 border-white bg-white scrapbook-shadow cursor-pointer transition-all duration-300 hover:scale-115 hover:paused"
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
                  </motion.button>
                );
              })}
            </div>

            {/* Sway wrapper is separate from perspective so CSS animation transform
                doesn't override the 3D rotateY flip transform on the same element */}
            <div
              className="relative z-10 w-full max-w-sm h-[470px] md:h-[560px]"
              style={{ animation: "sway 6s ease-in-out infinite" }}
            >
              <motion.div
                key={featured.slug}
                initial={{ opacity: 0, y: 100, rotate: 6 }}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                transition={{ type: "spring", stiffness: 60, damping: 14, delay: 0.4 }}
                className="w-full h-full perspective-1000"
              >
                <div
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="w-full h-full transform-style-3d transition-all duration-500 ease-soft relative cursor-pointer hover:-translate-y-1"
                  style={{
                    transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                  }}
                >
                  {/* FRONT SIDE */}
                  <div
                    className="absolute inset-0 w-full h-full backface-hidden"
                    style={{ pointerEvents: isFlipped ? "none" : "auto" }}
                  >
                    <div className="relative -rotate-2 border border-coffee/5 bg-white p-3.5 pb-5 md:p-4 md:pb-7 scrapbook-shadow h-full flex flex-col justify-between backface-hidden">
                      <div className="washi-tape absolute -top-3 left-1/2 z-20 h-8 w-24 -translate-x-1/2 rotate-2" />

                      {/* Polaroid Picture */}
                      <div className="relative aspect-4/3 md:aspect-square overflow-hidden rounded-sm bg-cream shrink-0">
                        <PetPhoto slug={featured.slug} image={featured.image} />
                        <div className="absolute right-3 bottom-3 flex flex-wrap justify-end gap-2">
                          {(featured.badges || []).slice(0, 2).map((b) => (
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
                  <div
                    className="absolute inset-0 w-full h-full backface-hidden"
                    style={{
                      transform: "rotateY(180deg)",
                      pointerEvents: isFlipped ? "auto" : "none",
                    }}
                  >
                    <div className="relative rotate-2 border border-coffee/10 bg-cream/95 p-3.5 pb-5 md:p-5 md:pb-7 scrapbook-shadow h-full flex flex-col justify-between text-left backface-hidden">
                      <div className="washi-tape absolute -top-3 left-1/2 z-20 h-8 w-24 -translate-x-1/2 rotate-1" />

                      <div>
                        <div className="flex items-center justify-between border-b border-coffee/10 pb-2 md:pb-3">
                          <div>
                            <h3 className="font-display text-xl md:text-2xl text-coffee">
                              {featured.name}'s Secrets 🤫
                            </h3>
                            <p className="text-[9px] md:text-[10px] text-coffee/40 font-bold uppercase tracking-wider">
                              Creator Files
                            </p>
                          </div>
                          <span className="text-2xl md:text-3xl">{featured.emoji}</span>
                        </div>

                        <div className="mt-2.5 md:mt-4 space-y-2 md:space-y-3.5 text-[11px] md:text-xs">
                          <div className="flex justify-between items-baseline border-b border-coffee/5 pb-0.5 md:pb-1">
                            <span className="font-bold text-coffee/50 uppercase text-[8px] md:text-[9px] tracking-wider">
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
                          <div className="flex justify-between items-baseline border-b border-coffee/5 pb-0.5 md:pb-1">
                            <span className="font-bold text-coffee/50 uppercase text-[8px] md:text-[9px] tracking-wider">
                              Favorite Snack
                            </span>
                            <span className="font-bold text-coffee">
                              {featured.favoriteFood || "Parle-G Biscuits"}
                            </span>
                          </div>
                          <div className="flex justify-between items-baseline border-b border-coffee/5 pb-0.5 md:pb-1">
                            <span className="font-bold text-coffee/50 uppercase text-[8px] md:text-[9px] tracking-wider">
                              First Met Date
                            </span>
                            <span className="font-bold text-coffee">
                              {featured.firstMet || "12 Jan 2025"}
                            </span>
                          </div>
                          <div className="flex justify-between items-baseline border-b border-coffee/5 pb-0.5 md:pb-1">
                            <span className="font-bold text-coffee/50 uppercase text-[8px] md:text-[9px] tracking-wider">
                              Primary Basecamp
                            </span>
                            <span className="font-bold text-coffee">{featured.home}</span>
                          </div>
                          <div className="flex justify-between items-baseline border-b border-coffee/5 pb-0.5 md:pb-1">
                            <span className="font-bold text-coffee/50 uppercase text-[8px] md:text-[9px] tracking-wider">
                              Personality Tag
                            </span>
                            <span className="font-bold text-peach">{featured.personality}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2.5 md:space-y-4">
                        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={(e) => handleAction("feat-love", "Boop", featured.name, e)}
                            className="squish flex-1 rounded-xl bg-peach py-1.5 md:py-2 text-[11px] md:text-xs font-bold text-coffee scrapbook-shadow cursor-pointer"
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
              </motion.div>
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
                      "{(a.dailyThought || a.story || "").slice(0, 45)}..."
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
                  Take our viral 5-question personality matching game to find out which beloved
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
      </motion.div>

      {/* ==================== PAWBOOK SECTION ==================== */}
      <FriendCardStyle />
      <motion.section
        id="paw-book"
        initial={{ opacity: 0, y: 80, rotateX: 6 }}
        whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ type: "spring", stiffness: 45, damping: 14 }}
        className="mx-auto max-w-7xl px-6 pt-20 pb-16 scroll-mt-24 border border-coffee/5 bg-[#fffdf9] rounded-[2.5rem] scrapbook-shadow-lg p-6 sm:p-10 mb-16 relative overflow-hidden paper"
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
          className="mt-10 flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:overflow-x-visible sm:pb-0"
        >
          {animals.map((a, i) => {
            const isFlipped = !!flippedSlugs[a.slug];
            return (
              <div key={a.slug} className="w-[85vw] sm:w-auto shrink-0 snap-center">
                <FriendCard
                  a={a}
                  isFlipped={isFlipped}
                  toggleFlip={(e) => toggleFlip(a.slug, e)}
                  i={i}
                />
              </div>
            );
          })}
        </div>

        {/* Swipe indicator (mobile only) */}
        {animals.length > 1 && (
          <div className="flex flex-col items-center gap-1 mt-4 sm:hidden">
            <p className="text-[10px] font-bold uppercase tracking-wider text-coffee/30 animate-pulse">
              Swipe left / right to see all friends 🐾
            </p>
          </div>
        )}
      </motion.section>

      {/* ==================== STORIES SECTION ==================== */}
      <motion.section
        id="stories"
        initial={{ opacity: 0, y: 80, rotateX: 6 }}
        whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ type: "spring", stiffness: 45, damping: 14 }}
        className="mx-auto max-w-4xl px-6 pt-20 pb-16 scroll-mt-24 border border-coffee/5 bg-[#fffdf9] rounded-[2.5rem] scrapbook-shadow-lg p-6 sm:p-10 mb-16 relative overflow-hidden paper"
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
                    <MagicLetter
                      name={a.name}
                      story={m.story}
                      isOpen={!!envelopeOpen[m.id]}
                      onToggle={() => {
                        setEnvelopeOpen((prev) => ({ ...prev, [m.id]: !prev[m.id] }));
                        playPageFlip();
                      }}
                    />
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
      </motion.section>

      {/* ==================== FOUND A FRIEND SECTION ==================== */}
      <motion.section
        id="found-friends"
        initial={{ opacity: 0, y: 80, rotateX: 6 }}
        whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ type: "spring", stiffness: 45, damping: 14 }}
        className="mx-auto max-w-6xl px-6 pt-20 pb-16 scroll-mt-24 border border-coffee/5 bg-[#fffdf9] rounded-[2.5rem] scrapbook-shadow-lg p-6 sm:p-10 mb-16 relative overflow-hidden paper"
      >
        <SectionHeading
          eyebrow="🐾 Add to PawBook"
          title="Your Animal Belongs Here"
          action={
            <button
              onClick={() => {
                document
                  .getElementById("share-friend-form")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="rounded-full bg-peach px-5 py-2 text-sm font-bold text-coffee hover:scale-105 cursor-pointer animate-pulse"
            >
              + Add Animal
            </button>
          }
        />
        <p className="max-w-2xl text-sm text-coffee/70">
          This is a living community album — every animal you add gets their own profile on PawBook.
          Dogs, cats, birds, cows — all are welcome! 🐦🐈🐕🐄
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
            const noteColor = colors[i % colors.length];

            const { needType, needStatus, cleanStory } = parseHelpBoardItem(r);

            return (
              <motion.article
                key={r.id}
                initial={{ opacity: 0, scale: 0.8, y: -65, rotate: i % 2 === 0 ? -12 : 12 }}
                whileInView={{ opacity: 1, scale: 1, y: 0, rotate: i % 2 === 0 ? -1.5 : 1.5 }}
                viewport={{ once: true }}
                whileHover={{ y: -8, rotate: 0, scale: 1.03 }}
                transition={{ type: "spring", stiffness: 65, damping: 10, delay: i * 0.08 }}
                className={`relative p-5 scrapbook-shadow border border-coffee/10 ${noteColor} rounded-2xl flex flex-col justify-between`}
              >
                {/* Washi Tape Snapping */}
                <div className="washi-tape washi-tape-enter absolute -top-3.5 left-1/2 z-20 h-6 w-20 -translate-x-1/2" />
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
              </motion.article>
            );
          })}
        </div>

        <div id="share-friend-form" className="mt-16">
          <SubmissionSection />
        </div>
      </motion.section>

      {/* ==================== EXPLORE SECTION ==================== */}
      <motion.section
        id="explore"
        initial={{ opacity: 0, y: 80, rotateX: 6 }}
        whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ type: "spring", stiffness: 45, damping: 14 }}
        className="mx-auto max-w-6xl px-6 pt-20 pb-4 scroll-mt-24 border border-coffee/5 bg-[#fffdf9] rounded-[2.5rem] scrapbook-shadow-lg p-6 sm:p-10 mb-16 relative overflow-hidden paper"
      >
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
              {/* Drifting butterflies & falling leaves */}
              <div className="pointer-events-none absolute inset-0 overflow-hidden z-10">
                <div className="absolute top-10 left-10 text-3xl animate-butterfly opacity-85 select-none">
                  🦋
                </div>
                <div
                  className="absolute top-40 right-20 text-3xl animate-butterfly opacity-65 select-none"
                  style={{ animationDelay: "3.5s" }}
                >
                  🦋
                </div>
                <div className="absolute top-0 left-1/3 text-2xl animate-falling-leaf opacity-40 select-none">
                  🍃
                </div>
                <div
                  className="absolute top-0 right-1/4 text-2xl animate-falling-leaf opacity-35 select-none"
                  style={{ animationDelay: "4.5s" }}
                >
                  🍂
                </div>
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
                <div className="mt-6 flex justify-center">
                  <motion.div
                    initial={{ scale: 0, opacity: 0, rotate: -8 }}
                    animate={{ scale: 1, opacity: 1, rotate: 1.5 }}
                    transition={{ type: "spring", stiffness: 90, damping: 11 }}
                    className="relative border border-coffee/10 bg-white p-4 pb-6 scrapbook-shadow w-full max-w-sm flex gap-4 items-center rounded-2xl"
                  >
                    {/* Washi tape */}
                    <div className="absolute -top-3.5 left-1/2 z-20 h-5 w-14 -translate-x-1/2 bg-yellow/40 border border-dashed border-yellow/20 opacity-75 shadow-xs animate-pulse" />

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
                  </motion.div>
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
      </motion.section>

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
        src={resolveAsset(image)}
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

const SPECIES_OPTIONS = [
  { label: "Dog", emoji: "🐶" },
  { label: "Cat", emoji: "🐱" },
  { label: "Bird", emoji: "🐦" },
  { label: "Other", emoji: "🐾" },
];

const PERSONALITY_TAGS = [
  { label: "Friendly", emoji: "😊" },
  { label: "Food Lover", emoji: "🍪" },
  { label: "Playful", emoji: "🎾" },
  { label: "Sleepy", emoji: "😴" },
  { label: "Shy", emoji: "🥺" },
  { label: "Needs Care", emoji: "❤️" },
];

function SubmitForm({ user }: { user: User | null }) {
  const submitGuest = useServerFn(submitGuestFriend);
  const uploadPhotoFn = useServerFn(uploadGuestPhoto);
  const router = useRouter();

  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [species, setSpecies] = useState("Dog");
  const [location, setLocation] = useState("");
  const [story, setStory] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [promiseChecked, setPromiseChecked] = useState(false);
  const [busy, setBusy] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(false);

  const selectedSpecies = SPECIES_OPTIONS.find((s) => s.label === species) ?? SPECIES_OPTIONS[0];

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) return;
    setPhoto(file);
    const url = URL.createObjectURL(file);
    setPhotoPreview(url);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = (reader.result as string).split(",")[1];
        resolve(base64);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!photo) {
      toast.error("Please upload an animal photo! 📸");
      return;
    }
    if (!promiseChecked) {
      toast.error("Please check the promise box! 🐾");
      return;
    }

    setBusy(true);
    setUploadProgress(true);
    try {
      // 1. Convert file to base64
      const base64Str = await fileToBase64(photo);

      // 2. Upload photo via guest server function (bypasses RLS)
      const uploadResult = await uploadPhotoFn({
        data: {
          base64: base64Str,
          fileName: photo.name,
          contentType: photo.type,
        },
      });

      // 3. Submit guest found friend (bypasses RLS)
      const animalName = name.trim() || "New Paw Friend";
      await submitGuest({
        data: {
          name: animalName,
          species,
          location: location.trim() || undefined,
          story: story.trim(),
          photoRef: uploadResult.path,
          tags: selectedTags,
        },
      });

      // Confetti splash
      confetti({
        particleCount: 80,
        spread: 80,
        colors: ["#7f5539", "#ddb892", "#ffccd5", "#b7b7a4", "#e6ccb2"],
      });

      window.dispatchEvent(new Event("pawbook-trigger-flash"));
      setSubmitted(true);
      router.invalidate();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
      setUploadProgress(false);
    }
  };

  const reset = () => {
    setSubmitted(false);
    setName("");
    setSpecies("Dog");
    setLocation("");
    setStory("");
    setSelectedTags([]);
    setPhoto(null);
    setPhotoPreview(null);
    setPromiseChecked(false);
  };

  // SUCCESS ANIMATION OVERLAY
  if (submitted) {
    return (
      <div className="mx-auto max-w-md text-center py-10 relative">
        <motion.div
          initial={{ scale: 0.3, rotate: -25, y: -200 }}
          animate={{ scale: 1.05, rotate: -1.5, y: 0 }}
          transition={{ type: "spring", stiffness: 80, damping: 12 }}
          className="mx-auto w-64 bg-white border border-coffee/10 scrapbook-shadow p-4 pb-8 rounded-sm relative overflow-hidden -rotate-2"
        >
          {/* Polaroid image */}
          <div className="bg-cream/60 border border-coffee/5 p-1 rounded-sm relative">
            <img src={photoPreview || ""} alt="" className="w-full h-44 object-cover rounded-sm" />

            {/* Paw stamp animation overlay */}
            <motion.div
              initial={{ scale: 4, opacity: 0, rotate: -45 }}
              animate={{ scale: 1, opacity: 0.85, rotate: 12 }}
              transition={{ delay: 0.6, type: "spring", stiffness: 150, damping: 10 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none select-none text-[#7f5539]/25 text-[8rem] font-bold"
            >
              🐾
            </motion.div>
          </div>
          <p className="font-display text-sm font-bold text-coffee mt-4">
            {name || "New Paw Friend"}
          </p>
          <span className="text-[10px] bg-peach/15 text-coffee/70 px-2 py-0.5 rounded-full font-bold">
            {selectedSpecies.emoji} {species}
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="space-y-4 mt-8"
        >
          <div className="bg-cream/40 rounded-2xl border border-coffee/10 p-6 max-w-sm mx-auto shadow-sm">
            <h4 className="font-display text-lg font-bold text-coffee">
              Your Paw Friend is waiting for approval 🐾
            </h4>
            <p className="text-xs text-coffee/70 mt-2 leading-relaxed">
              Thank you for saving their memory.
              <br />
              They will join PawBook after review 💛
            </p>
          </div>

          <button
            type="button"
            onClick={reset}
            className="rounded-full bg-coffee px-6 py-2.5 text-xs font-bold text-cream hover:bg-coffee/90 cursor-pointer transition-all hover:scale-105 active:scale-95"
          >
            + Add Another Animal
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-4xl space-y-6">
      {/* Header banner */}
      <div className="rounded-3xl bg-linear-to-br from-peach/30 via-yellow/20 to-sage/20 border border-coffee/10 p-5 sm:p-6 text-center relative overflow-hidden scrapbook-shadow">
        <div className="absolute top-2 left-4 text-2xl opacity-15 -rotate-12 select-none">🐾</div>
        <div className="absolute bottom-2 right-4 text-2xl opacity-15 rotate-12 select-none">
          🐾
        </div>
        <h3 className="font-display text-xl sm:text-2xl font-bold text-coffee">
          Add Your Animal to PawBook 🐾
        </h3>
        <p className="mt-1 text-xs text-coffee/60 max-w-md mx-auto">
          Share a photo, location, and story. No registration needed! Anyone can add an animal
          friend.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-5 items-start">
        {/* FORM INPUTS */}
        <div className="lg:col-span-3 rounded-3xl border border-coffee/10 bg-white scrapbook-shadow p-5 sm:p-6 space-y-4">
          {/* Photo upload field */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-coffee/60 block mb-1">
              1. Animal Photo (Required)
            </label>
            <label className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-coffee/20 hover:border-peach/60 hover:bg-peach/5 cursor-pointer p-4 min-h-[120px] transition-all relative">
              {uploadProgress && (
                <div className="absolute inset-0 bg-white/80 z-20 flex flex-col items-center justify-center">
                  <span className="animate-spin text-3xl mb-1">🐾</span>
                  <span className="text-[10px] font-bold text-coffee/60 uppercase">
                    Processing photo...
                  </span>
                </div>
              )}
              {photoPreview ? (
                <div className="flex items-center gap-3 w-full">
                  <img
                    src={photoPreview}
                    alt=""
                    className="size-16 object-cover rounded-lg border border-coffee/10"
                  />
                  <div className="text-left">
                    <p className="text-xs font-bold text-coffee truncate max-w-[180px]">
                      {photo?.name}
                    </p>
                    <p className="text-[10px] text-coffee/50">
                      {(photo?.size ?? 0) / 1024 > 1024
                        ? `${((photo?.size ?? 0) / 1024 / 1024).toFixed(1)} MB`
                        : `${((photo?.size ?? 0) / 1024).toFixed(0)} KB`}
                    </p>
                    <span className="text-[9px] text-peach font-bold uppercase tracking-wide mt-1 block">
                      Click to change
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-1">
                  <span className="text-3xl">🖼️</span>
                  <p className="text-xs font-bold text-coffee/70">Click to choose image</p>
                  <p className="text-[9px] text-coffee/40">PNG, JPG, WEBP supported</p>
                </div>
              )}
              <input
                required
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="sr-only"
              />
            </label>
          </div>

          {/* Animal Name */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-coffee/60 block mb-1">
              2. Animal Name
            </label>
            <input
              type="text"
              maxLength={80}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Do they have a name?"
              className="w-full rounded-xl border border-coffee/15 bg-cream/40 px-3 py-2 text-xs outline-none focus:border-peach"
            />
          </div>

          {/* Animal Type */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-coffee/60 block mb-1">
              3. Animal Type
            </label>
            <div className="grid grid-cols-4 gap-2">
              {SPECIES_OPTIONS.map((s) => (
                <button
                  key={s.label}
                  type="button"
                  onClick={() => setSpecies(s.label)}
                  className={`flex flex-col items-center gap-1 py-2 rounded-xl border transition-all cursor-pointer hover:scale-105 active:scale-95 ${
                    species === s.label
                      ? "border-peach bg-peach/10 font-bold scale-105"
                      : "border-coffee/10 bg-cream/20 hover:border-coffee/20"
                  }`}
                >
                  <span className="text-2xl">{s.emoji}</span>
                  <span className="text-[10px] text-coffee">{s.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Location Seen */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-coffee/60 block mb-1">
              4. Location Seen (Optional)
            </label>
            <input
              type="text"
              maxLength={120}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Where did you meet them?"
              className="w-full rounded-xl border border-coffee/15 bg-cream/40 px-3 py-2 text-xs outline-none focus:border-peach"
            />
            <p className="text-[9px] text-coffee/40 mt-1 italic">
              Examples: Near college gate, Garden area, Street corner
            </p>
          </div>

          {/* Story / Memory */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-coffee/60 block mb-1">
              5. Small Story / Memory
            </label>
            <textarea
              required
              minLength={10}
              maxLength={2000}
              rows={3}
              value={story}
              onChange={(e) => setStory(e.target.value)}
              placeholder="Tell their little story..."
              className="w-full rounded-xl border border-coffee/15 bg-cream/40 px-3 py-2 text-xs outline-none focus:border-peach resize-none"
            />
            <p className="text-[9px] text-coffee/40 mt-0.5 italic">
              Example: "This little friend waits near my home every morning 💛"
            </p>
          </div>

          {/* Personality Tags */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-coffee/60 block mb-2">
              6. Personality Tags
            </label>
            <div className="flex flex-wrap gap-1.5">
              {PERSONALITY_TAGS.map((t) => {
                const active = selectedTags.includes(t.label);
                return (
                  <button
                    key={t.label}
                    type="button"
                    onClick={() => toggleTag(t.label)}
                    className={`flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-bold cursor-pointer transition-all ${
                      active
                        ? "border-coffee bg-coffee text-cream scale-105"
                        : "border-coffee/10 bg-white text-coffee hover:border-coffee/30"
                    }`}
                  >
                    <span>{t.emoji}</span> {t.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Anti-spam checkbox */}
          <div className="pt-2 border-t border-coffee/5">
            <label className="flex items-start gap-2 text-xs text-coffee/70 cursor-pointer select-none">
              <input
                required
                type="checkbox"
                checked={promiseChecked}
                onChange={(e) => setPromiseChecked(e.target.checked)}
                className="mt-0.5 rounded accent-coffee cursor-pointer"
              />
              <span>I promise this is a real animal memory 🐾</span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={busy || !promiseChecked || !photo}
            className="w-full rounded-full bg-coffee py-3 text-sm font-bold text-cream hover:bg-coffee/90 disabled:opacity-40 cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
          >
            {busy ? (
              <>
                <span className="animate-spin text-base">🐾</span> Sharing Story…
              </>
            ) : (
              <>Add Their Story To PawBook 🐾</>
            )}
          </button>
        </div>

        {/* LIVE PREVIEW CARD */}
        <div className="lg:col-span-2 sticky top-24">
          <p className="text-[10px] font-bold uppercase tracking-widest text-coffee/40 mb-3 text-center">
            Live Preview
          </p>
          <motion.div
            animate={{ rotate: 1.5 }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            className="rounded-2xl bg-white border border-coffee/10 scrapbook-shadow overflow-hidden relative p-1"
          >
            <div className="washi-tape absolute -top-3 left-1/2 -translate-x-1/2 z-10 h-6 w-20" />
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-2xl z-10 select-none drop-shadow">
              📌
            </div>

            <div className="bg-cream/60 border border-coffee/5 mx-3 mt-6 mb-1 rounded-sm p-1.5 pb-6">
              {photoPreview ? (
                <img src={photoPreview} alt="" className="w-full h-36 object-cover rounded-sm" />
              ) : (
                <div className="w-full h-36 bg-coffee/5 rounded-sm flex items-center justify-center">
                  <span className="text-4xl opacity-30">{selectedSpecies.emoji}</span>
                </div>
              )}
            </div>

            <div className="px-4 pb-4 space-y-1.5">
              <div className="flex items-center justify-between">
                <p className="font-display text-sm font-bold text-coffee truncate max-w-[120px]">
                  {name.trim() || "New Paw Friend"}
                </p>
                <span className="text-[10px] bg-coffee/5 text-coffee/60 px-2 py-0.5 rounded-full font-bold">
                  {selectedSpecies.emoji} {species}
                </span>
              </div>
              {location.trim() && (
                <p className="text-[9px] text-coffee/50 font-semibold truncate">📍 {location}</p>
              )}

              {selectedTags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {selectedTags.map((t) => (
                    <span
                      key={t}
                      className="text-[8px] bg-peach/15 border border-peach/20 text-coffee/80 px-1.5 py-0.5 rounded-full font-bold"
                    >
                      {PERSONALITY_TAGS.find((pt) => pt.label === t)?.emoji || ""} {t}
                    </span>
                  ))}
                </div>
              )}

              {story.trim() && (
                <p className="text-coffee/70 font-hand text-xs leading-relaxed line-clamp-3 italic">
                  "{story}"
                </p>
              )}
            </div>
          </motion.div>

          <p className="text-[9px] text-coffee/30 text-center mt-3 italic">
            This is how the profile card will look
          </p>
        </div>
      </div>
    </form>
  );
}
