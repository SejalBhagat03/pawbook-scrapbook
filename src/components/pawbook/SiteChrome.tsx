import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, type ReactNode } from "react";
import { useSession } from "@/hooks/use-session";
import { supabase } from "@/integrations/supabase/client";
import { DailySurpriseBox } from "./DailySurpriseBox";
import { toast } from "sonner";
import { MousePawTrail } from "./MousePawTrail";
import { OpeningBookIntro } from "./OpeningBookIntro";
import { motion, AnimatePresence } from "framer-motion";
import { useServerFn } from "@tanstack/react-start";
import { getPendingSubmissionsCount } from "@/lib/submissions.functions";

const navLinks = [
  { to: "/", hash: "home", label: "Home" },
  { to: "/", hash: "paw-book", label: "PawBook 🐾" },
  { to: "/", hash: "stories", label: "Memories 📖" },
  { to: "/", hash: "explore", label: "PawMap 🗺️" },
  { to: "/", hash: "found-friends", label: "Help Board 🚨" },
  { to: "/", hash: "garden", label: "Kindness Wall ❤️" },
  { to: "/pet-studio", hash: "", label: "Studio ⚙️" },
] as const;

export function TopNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("home");
  const [passportOpen, setPassportOpen] = useState(false);

  // Track active section on scroll
  useEffect(() => {
    if (pathname !== "/") return;

    const sections = ["home", "paw-book", "stories", "garden", "found-friends", "explore"];
    const observerOptions = {
      root: null,
      rootMargin: "-25% 0px -55% 0px",
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      sections.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.unobserve(el);
      });
    };
  }, [pathname]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, to: string, hash?: string) => {
    if (pathname === "/") {
      if (hash) {
        e.preventDefault();
        const el = document.getElementById(hash);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
          window.history.pushState(null, "", `/#${hash}`);
          setActiveSection(hash);
        } else if (to === "/") {
          window.scrollTo({ top: 0, behavior: "smooth" });
          window.history.pushState(null, "", "/");
          setActiveSection("home");
        }
      } else if (to === "/") {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
        window.history.pushState(null, "", "/");
        setActiveSection("home");
      }
    }
  };

  return (
    <nav className="sticky top-4 z-40 px-4 sm:px-6">
      <div className="mx-auto flex max-w-5xl scrapbook-shadow items-center justify-between gap-3 rounded-full border border-coffee/5 bg-white/85 px-4 py-2.5 backdrop-blur-md sm:px-8 sm:py-3">
        <Link
          to="/"
          onClick={(e) => handleNavClick(e, "/")}
          className="flex shrink-0 items-center gap-2 font-display text-lg font-bold sm:text-xl group relative overflow-hidden px-2 py-0.5 rounded-md"
        >
          <span className="text-2xl transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110">
            🐾
          </span>
          <span className="relative overflow-hidden block">
            PawBook
            <span className="absolute inset-0 bg-linear-to-r from-transparent via-white/50 to-transparent translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-out" />
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden items-center gap-7 text-sm font-semibold md:flex">
          {navLinks.map((l) => {
            const active = pathname === "/" ? activeSection === l.hash : false;
            return (
              <Link
                key={l.hash}
                to={l.to}
                hash={l.hash}
                onClick={(e) => handleNavClick(e, l.to, l.hash)}
                className={
                  "relative py-1 transition-colors hover:text-peach group " +
                  (active ? "text-peach font-bold" : "text-coffee")
                }
              >
                <span>{l.label}</span>
                <span
                  className={
                    "absolute bottom-0 left-0 h-0.5 w-full bg-peach transition-transform duration-300 origin-center " +
                    (active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100")
                  }
                />
              </Link>
            );
          })}
        </div>

        <div className="hidden items-center gap-4 md:flex">
          <button
            onClick={() => setPassportOpen(true)}
            className="squish flex items-center gap-1.5 py-1.5 px-3.5 rounded-full border border-coffee bg-[#fce4ec] text-xs font-bold text-coffee cursor-pointer"
          >
            🔖 Passport
          </button>
          <AuthAffordance />
        </div>

        {/* Mobile menu toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={() => setPassportOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-coffee/10 bg-[#fce4ec] text-sm hover:bg-[#fce4ec]/80 cursor-pointer mr-1"
            title="Open Passport"
          >
            🔖
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-coffee/10 bg-white text-lg hover:bg-cream cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? "✖" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="mx-auto mt-2 max-w-5xl overflow-hidden rounded-3xl border border-coffee/10 bg-white/95 p-6 shadow-xl backdrop-blur-md md:hidden animate-fade-in">
          <div className="flex flex-col gap-4 text-base font-semibold">
            {navLinks.map((l) => {
              const active = pathname === "/" ? activeSection === l.hash : false;
              return (
                <Link
                  key={l.hash}
                  to={l.to}
                  hash={l.hash}
                  onClick={(e) => {
                    setMobileMenuOpen(false);
                    handleNavClick(e, l.to, l.hash);
                  }}
                  className={
                    "transition-colors py-1 " +
                    (active ? "text-peach font-bold" : "text-coffee hover:text-peach")
                  }
                >
                  {l.label}
                </Link>
              );
            })}
            <div className="border-t border-coffee/10 pt-4 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setPassportOpen(true);
                }}
                className="squish flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl border border-coffee bg-[#fce4ec] text-xs font-bold text-coffee cursor-pointer"
              >
                🔖 Open Passport Booklet
              </button>
              <AuthAffordance />
            </div>
          </div>
        </div>
      )}

      <PassportModal isOpen={passportOpen} onClose={() => setPassportOpen(false)} />
    </nav>
  );
}
function AuthAffordance() {
  const { user, loading } = useSession();
  const navigate = useNavigate();
  const getCountFn = useServerFn(getPendingSubmissionsCount);
  const [pendingCount, setPendingCount] = useState<number | null>(null);

  useEffect(() => {
    if (!user?.id) return;

    const checkPending = () => {
      getCountFn()
        .then(({ count }) => {
          setPendingCount(count);
        })
        .catch((err) => console.error("Failed to query pending count via server fn:", err));
    };

    checkPending();
    const interval = setInterval(checkPending, 10000);
    return () => clearInterval(interval);
  }, [user, getCountFn]);

  if (loading) return null;

  // Only show the Studio controls if you are signed in with an email account (Admin)
  if (!user || !user.email) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        to="/pet-studio"
        className="rounded-full bg-peach px-3 py-1.5 text-xs font-bold text-coffee hover:scale-105 flex items-center gap-1 shadow-sm"
        title="Pet Studio CMS Dashboard"
      >
        🎨 Studio
      </Link>
      <Link
        to="/admin/moderation"
        className="inline-flex items-center gap-1.5 rounded-full border-2 border-coffee/20 bg-white px-3 py-1.5 text-xs font-bold text-coffee/80 hover:bg-peach/20 hover:border-peach transition-all"
        title="Moderation queue (admins only)"
      >
        🛡️ <span className="hidden sm:inline">Mod</span>
        {pendingCount !== null && pendingCount > 0 && (
          <span className="rounded-full bg-peach px-1.5 py-0.5 text-[9px] font-bold text-coffee animate-pulse">
            {pendingCount}
          </span>
        )}
      </Link>
      <button
        onClick={async () => {
          await supabase.auth.signOut();
          navigate({ to: "/" });
        }}
        className="rounded-full bg-coffee px-4 py-2 text-xs font-bold text-cream hover:bg-coffee/90 sm:px-5 sm:text-sm cursor-pointer"
      >
        Sign out
      </button>
    </div>
  );
}

export function MobileBottomNav() {
  return null;
}

export function FloatingCreatures() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-30 overflow-hidden">
      <div className="absolute bottom-24 left-8 animate-float text-4xl opacity-40">🦋</div>
      <div
        className="absolute top-1/3 right-10 animate-float text-3xl opacity-30"
        style={{ animationDelay: "1.5s" }}
      >
        🦋
      </div>
      <div className="absolute top-16 left-1/3 animate-drift text-2xl opacity-30">☁️</div>
      <div
        className="absolute top-40 -left-10 animate-drift text-3xl opacity-25"
        style={{ animationDelay: "-10s" }}
      >
        ☁️
      </div>
      <div className="absolute bottom-32 right-8 rotate-12 text-2xl opacity-10">🐾</div>
    </div>
  );
}

export function SunlightOverlay() {
  const [offsetY, setOffsetY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setOffsetY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const shiftY = offsetY * -0.05;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 transition-transform duration-75 ease-out"
      style={{
        transform: `translateY(${shiftY}px) translateZ(0)`,
        background:
          "radial-gradient(1200px 600px at 100% 0%, color-mix(in oklab, var(--color-yellow) 45%, transparent) 0%, transparent 55%), radial-gradient(900px 500px at 0% 100%, color-mix(in oklab, var(--color-peach) 25%, transparent) 0%, transparent 60%)",
      }}
    />
  );
}

function WalkingDogLoader() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-cream/95 backdrop-blur-xs"
    >
      <div className="text-center space-y-4">
        {/* Walking dog and paw prints */}
        <div className="flex items-center justify-center gap-2 text-5xl">
          <motion.span
            animate={{
              y: [0, -10, 0],
              rotate: [0, -5, 5, 0],
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="inline-block"
          >
            🐕
          </motion.span>
          <div className="flex gap-1.5 ml-2">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: i * 0.4,
                  ease: "easeInOut",
                }}
                className="text-2xl"
              >
                🐾
              </motion.span>
            ))}
          </div>
        </div>
        <h3 className="font-display text-xl text-coffee font-semibold animate-pulse">
          Finding Paw Friends...
        </h3>
      </div>
    </motion.div>
  );
}

export function PageShell({ children }: { children: ReactNode }) {
  const routerState = useRouterState();
  const isPending = routerState.status === "pending";
  const [initialLoading, setInitialLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const played = sessionStorage.getItem("pawbook-intro-played");
    if (played === "true") {
      setInitialLoading(true);
      const timer = setTimeout(() => setInitialLoading(false), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const showLoader = isMounted && (initialLoading || isPending);

  return (
    <div className="relative min-h-screen bg-cream text-coffee">
      <AnimatePresence>{showLoader && <WalkingDogLoader />}</AnimatePresence>
      <SunlightOverlay />
      <div className="relative z-20">
        <TopNav />
        <main className="pb-6 md:pb-16 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={routerState.location.pathname}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.5, ease: [0.25, 0.8, 0.25, 1] }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
        <SiteFooter />
      </div>
      <DailySurpriseBox />
      <MousePawTrail />
      <OpeningBookIntro />
      {/* Contextual sounds are now in pet profile interactions */}
    </div>
  );
}

export function SiteFooter() {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("pawbook-reduce-motion");
    const prefersReduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (saved === "true" || (saved === null && prefersReduce)) {
      setReduceMotion(true);
      document.documentElement.classList.add("reduce-motion");
    }
  }, []);

  const toggleMotion = () => {
    const next = !reduceMotion;
    setReduceMotion(next);
    if (next) {
      document.documentElement.classList.add("reduce-motion");
      localStorage.setItem("pawbook-reduce-motion", "true");
      toast.success("Motion set to Low. Restoring quiet calmness 🍃");
    } else {
      document.documentElement.classList.remove("reduce-motion");
      localStorage.setItem("pawbook-reduce-motion", "false");
      toast.success("Motion set to Cozy. Bouncy animations active! 🐾✨");
    }
  };

  return (
    <footer className="relative z-10 mt-6 md:mt-16 border-t border-coffee/10 bg-cream/60 px-6 py-6 md:py-10">
      <div className="mx-auto max-w-6xl text-sm flex flex-col md:flex-row md:justify-between gap-6 md:gap-12">
        {/* Brand details */}
        <div className="flex flex-col gap-1.5 md:max-w-xs">
          <div className="flex items-center gap-2 font-display text-lg md:text-xl">
            <span>🐾</span> PawBook
          </div>
          <p className="text-xs md:text-sm text-coffee/70">
            A cozy corner of the internet where every little life is remembered.
          </p>
        </div>

        {/* Links row */}
        <div className="flex flex-col gap-1.5">
          <p className="font-bold text-coffee text-xs md:text-sm">Wander around</p>
          <div className="flex flex-wrap md:flex-col gap-x-4 gap-y-1.5 text-xs md:text-sm text-coffee/70">
            <Link to="/" hash="paw-friends" className="hover:text-peach">
              Paw Friends
            </Link>
            <Link to="/" hash="stories" className="hover:text-peach">
              Stories
            </Link>
            <Link to="/" hash="garden" className="hover:text-peach">
              Kindness Garden
            </Link>
            <Link to="/" hash="explore" className="hover:text-peach">
              Paw World Map
            </Link>
          </div>
        </div>

        {/* Author / Motion settings */}
        <div className="flex flex-col gap-1.5">
          <p className="font-bold text-coffee text-xs md:text-sm">The human behind PawBook</p>
          <div className="flex flex-wrap md:flex-col items-center md:items-start gap-3 md:gap-2 text-xs md:text-sm text-coffee/70">
            <p>
              Built with technology and kindness by{" "}
              <Link to="/about" className="font-bold text-peach hover:underline">
                Sejal ❤️
              </Link>
            </p>
            <div className="pt-0.5">
              <button
                onClick={toggleMotion}
                className="flex items-center gap-1.5 rounded-full border border-coffee/15 bg-white/80 px-2.5 py-0.5 text-[10px] md:text-xs font-bold text-coffee hover:bg-white transition-colors cursor-pointer"
              >
                <span>{reduceMotion ? "🍃 Motion: Low" : "✨ Motion: Cozy"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  action,
}: {
  eyebrow?: string;
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-8 flex items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-coffee/50">
            {eyebrow}
          </p>
        )}
        <h2 className="mt-1 font-display text-3xl sm:text-4xl">{title}</h2>
      </div>
      {action}
    </div>
  );
}

export function PassportModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [visited, setVisited] = useState<string[]>([]);
  const [quizDone, setQuizDone] = useState(false);
  const [gardenerDone, setGardenerDone] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    // Load visited slugs
    const savedVisited = localStorage.getItem("pawbook-visited-stamps");
    if (savedVisited) {
      try {
        setVisited(JSON.parse(savedVisited));
      } catch (e) {
        console.error(e);
      }
    }

    // Load quiz completed
    setQuizDone(localStorage.getItem("pawbook-quiz-completed") === "true");

    // Load garden flowers
    const flowerStates = localStorage.getItem("pawbook-flower-states") || "{}";
    try {
      const parsed = JSON.parse(flowerStates);
      const count = Object.keys(parsed).length;
      setGardenerDone(count >= 3);
    } catch (e) {
      console.error(e);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const stampList = [
    {
      id: "coco",
      label: "Coco's Pact",
      emoji: "🍪",
      desc: "Visit Coco's Diary",
      unlocked: visited.includes("coco"),
    },
    {
      id: "moti",
      label: "Moti's Rubs",
      emoji: "🐶",
      desc: "Visit Moti's Diary",
      unlocked: visited.includes("moti"),
    },
    {
      id: "kitty",
      label: "Kitty's Balcony",
      emoji: "🐈",
      desc: "Visit Kitty's Diary",
      unlocked: visited.includes("kitty"),
    },
    {
      id: "tommy",
      label: "Tommy's Path",
      emoji: "🧣",
      desc: "Visit Tommy's Diary",
      unlocked: visited.includes("tommy"),
    },
    {
      id: "gardener",
      label: "Meadow Gardener",
      emoji: "🌸",
      desc: "Grow 3+ Garden Flowers",
      unlocked: gardenerDone,
    },
    {
      id: "protector",
      label: "Village Protector",
      emoji: "💮",
      desc: "Complete Match Quiz",
      unlocked: quizDone,
    },
  ];

  const unlockedCount = stampList.filter((s) => s.unlocked).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-coffee/40 px-4 py-6 backdrop-blur-sm animate-fade-in">
      <style>{`
        @keyframes pageTurn {
          0% { transform: rotateY(-90deg); opacity: 0; }
          100% { transform: rotateY(0deg); opacity: 1; }
        }
        .animate-page-turn {
          animation: pageTurn 0.55s cubic-bezier(0.2, 0.8, 0.2, 1) both;
          transform-origin: left center;
        }
      `}</style>

      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border-2 border-coffee bg-white p-6 text-center scrapbook-shadow sm:p-8 animate-page-turn">
        {/* Notebook Spiral Binding Side Art */}
        <div className="absolute left-0 top-0 h-full w-4 bg-linear-to-r from-coffee/20 to-transparent border-r border-dashed border-coffee/20" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 h-8 w-8 rounded-full border border-coffee/15 bg-white text-sm font-bold text-coffee/60 hover:bg-cream cursor-pointer"
        >
          ✖
        </button>

        <span className="text-4xl block my-2">💮</span>
        <h3 className="font-display text-2xl text-coffee">Village Passport</h3>
        <p className="text-xs text-coffee/60 mb-6">
          Your collected stamps from exploring the village ({unlockedCount} / {stampList.length})
        </p>

        <div className="grid grid-cols-2 gap-4 my-4 max-h-[300px] overflow-y-auto pr-1">
          {stampList.map((s) => (
            <div
              key={s.id}
              className={`p-3 rounded-2xl border text-center relative flex flex-col items-center justify-center transition-all ${
                s.unlocked
                  ? "bg-[#fefae0] border-yellow shadow-sm"
                  : "bg-cream/15 border-coffee/5 opacity-55"
              }`}
            >
              {s.unlocked && (
                <div className="absolute top-1 right-1 text-[8px] bg-yellow border border-coffee/20 px-1 rounded font-bold text-coffee uppercase scale-90">
                  💮 Stamp
                </div>
              )}
              <span className="text-3xl mb-1">{s.unlocked ? s.emoji : "❓"}</span>
              <p className="font-bold text-xs text-coffee truncate w-full">{s.label}</p>
              <p className="text-[9px] text-coffee/50 leading-tight mt-0.5">{s.desc}</p>
            </div>
          ))}
        </div>

        <p className="text-[10px] font-hand text-peach mt-4">
          * Explore friends' profiles and complete playrooms to earn more stamps!
        </p>
      </div>
    </div>
  );
}
