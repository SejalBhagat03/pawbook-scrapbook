import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, type ReactNode } from "react";
import { useSession } from "@/hooks/use-session";
import { supabase } from "@/integrations/supabase/client";
import { DailySurpriseBox } from "./DailySurpriseBox";
import { toast } from "sonner";

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
        className="hidden rounded-full border border-coffee/15 bg-white px-3 py-1.5 text-xs font-bold text-coffee/80 hover:bg-cream sm:inline-flex"
        title="Moderation queue (admins only)"
      >
        🛡️ Mod
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

export function CozyCassettePlayer() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [track, setTrack] = useState<"none" | "chiptune" | "rain" | "fire">("none");
  const [audioNodes, setAudioNodes] = useState<(AudioContext | AudioNode | number)[]>([]);

  const startAudio = (type: "chiptune" | "rain" | "fire") => {
    stopAudio();
    const WinAudioContext = (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
    const AudioContextClass = window.AudioContext || WinAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    if (ctx.state === "suspended") ctx.resume();

    const nodesList: (AudioContext | AudioNode | number)[] = [ctx];

    if (type === "rain") {
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(450, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.35, ctx.currentTime);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      whiteNoise.start(0);
      nodesList.push(whiteNoise, filter, gain);
    } else if (type === "fire") {
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5;
      }
      const brownNoise = ctx.createBufferSource();
      brownNoise.buffer = noiseBuffer;
      brownNoise.loop = true;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.25, ctx.currentTime);

      brownNoise.connect(gain);
      gain.connect(ctx.destination);
      brownNoise.start(0);
      nodesList.push(brownNoise, gain);

      const crackleTimer = setInterval(() => {
        if (Math.random() > 0.45) return;
        const osc = ctx.createOscillator();
        const popGain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(800 + Math.random() * 3000, ctx.currentTime);
        popGain.gain.setValueAtTime(0.08 * Math.random(), ctx.currentTime);
        popGain.gain.exponentialRampToValueAtTime(
          0.001,
          ctx.currentTime + 0.01 + Math.random() * 0.02,
        );
        osc.connect(popGain);
        popGain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.04);
      }, 150);

      (nodesList as typeof nodesList & { timer?: number | NodeJS.Timeout }).timer = crackleTimer;
    } else if (type === "chiptune") {
      const notes = [261.63, 329.63, 392.0, 523.25, 392.0, 329.63];
      let noteIndex = 0;
      const synthTimer = setInterval(() => {
        const osc = ctx.createOscillator();
        const synthGain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(notes[noteIndex], ctx.currentTime);
        synthGain.gain.setValueAtTime(0.05, ctx.currentTime);
        synthGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
        osc.connect(synthGain);
        synthGain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
        noteIndex = (noteIndex + 1) % notes.length;
      }, 300);

      (nodesList as typeof nodesList & { timer?: number | NodeJS.Timeout }).timer = synthTimer;
    }

    setAudioNodes(nodesList);
    setTrack(type);
    setIsPlaying(true);
  };

  const stopAudio = () => {
    if (audioNodes.length > 0) {
      const [ctx, ...nodes] = audioNodes;
      nodes.forEach((n) => {
        if (n instanceof AudioScheduledSourceNode) {
          try {
            n.stop();
          } catch (e) {
            console.warn(e);
          }
        }
      });
      const timer = (audioNodes as typeof audioNodes & { timer?: number | NodeJS.Timeout }).timer;
      if (timer) {
        clearInterval(timer);
      }
      if (ctx instanceof AudioContext) {
        try {
          ctx.close();
        } catch (e) {
          console.error(e);
        }
      }
      setAudioNodes([]);
    }
    setIsPlaying(false);
    setTrack("none");
  };

  useEffect(() => {
    return () => {
      if (audioNodes.length > 0) {
        const [ctx, ...nodes] = audioNodes;
        nodes.forEach((n) => {
          if (n instanceof AudioScheduledSourceNode) {
            try {
              n.stop();
            } catch (e) {
              console.warn(e);
            }
          }
        });
        const timer = (audioNodes as typeof audioNodes & { timer?: number | NodeJS.Timeout }).timer;
        if (timer) {
          clearInterval(timer);
        }
        if (ctx instanceof AudioContext) {
          try {
            ctx.close();
          } catch (e) {
            console.error(e);
          }
        }
      }
    };
  }, [audioNodes]);

  return (
    <div className="fixed bottom-24 left-6 z-40">
      <style>{`
        @keyframes spinSlow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spinSlow 4s linear infinite;
        }
      `}</style>

      {isOpen ? (
        <div className="w-64 rounded-3xl border border-coffee bg-white p-4 scrapbook-shadow flex flex-col gap-3 animate-spring-up">
          <div className="flex items-center justify-between border-b border-coffee/5 pb-2">
            <div className="flex items-center gap-1.5">
              <span className="text-xl">📻</span>
              <span className="font-display text-sm font-bold text-coffee">
                Cozy Cassette Player
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-xs font-bold text-coffee/40 hover:text-peach"
            >
              Close
            </button>
          </div>

          <div className="flex justify-center gap-6 bg-cream/40 py-4 rounded-2xl border border-coffee/5 relative">
            <span className="absolute inset-0 m-auto w-fit h-fit font-hand text-base text-coffee/45 z-10 select-none">
              {track === "none" ? "TAPE IN" : track.toUpperCase()}
            </span>
            <div
              className={`w-12 h-12 rounded-full border-4 border-double border-coffee/30 flex items-center justify-center ${isPlaying ? "animate-spin-slow" : ""}`}
            >
              <div className="w-3 h-3 rounded-full bg-coffee" />
            </div>
            <div
              className={`w-12 h-12 rounded-full border-4 border-double border-coffee/30 flex items-center justify-center ${isPlaying ? "animate-spin-slow" : ""}`}
            >
              <div className="w-3 h-3 rounded-full bg-coffee" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-3 gap-1 text-[10px] font-bold">
              <button
                onClick={() => startAudio("chiptune")}
                className={`py-1.5 rounded-lg border transition-colors cursor-pointer text-center truncate ${track === "chiptune" ? "bg-coffee text-cream border-coffee" : "bg-white border-coffee/10 hover:bg-cream/40"}`}
              >
                🎵 Lofi
              </button>
              <button
                onClick={() => startAudio("rain")}
                className={`py-1.5 rounded-lg border transition-colors cursor-pointer text-center truncate ${track === "rain" ? "bg-coffee text-cream border-coffee" : "bg-white border-coffee/10 hover:bg-cream/40"}`}
              >
                🌧️ Rain
              </button>
              <button
                onClick={() => startAudio("fire")}
                className={`py-1.5 rounded-lg border transition-colors cursor-pointer text-center truncate ${track === "fire" ? "bg-coffee text-cream border-coffee" : "bg-white border-coffee/10 hover:bg-cream/40"}`}
              >
                🔥 Fire
              </button>
            </div>
            {isPlaying && (
              <button
                onClick={stopAudio}
                className="w-full py-1 rounded-xl bg-peach/20 text-peach border border-peach/30 text-xs font-bold transition hover:bg-peach/30 cursor-pointer"
              >
                ⏹️ Mute Player
              </button>
            )}
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-coffee bg-white scrapbook-shadow hover:scale-108 active:scale-95 transition-transform cursor-pointer group"
          title="Open Cozy Audio Player"
        >
          <span className="text-xl group-hover:rotate-12 transition-transform">📻</span>
        </button>
      )}
    </div>
  );
}

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen bg-cream text-coffee">
      <SunlightOverlay />
      <div className="relative z-20">
        <TopNav />
        <main className="pb-6 md:pb-16">{children}</main>
        <SiteFooter />
      </div>
      <DailySurpriseBox />
      <CozyCassettePlayer />
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
    <footer className="relative z-10 mt-6 md:mt-16 border-t border-coffee/10 bg-cream/60 px-6 py-10">
      <div className="mx-auto grid max-w-6xl gap-6 text-sm md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2 font-display text-xl">
            <span>🐾</span> PawBook
          </div>
          <p className="mt-2 max-w-xs text-coffee/70">
            A cozy corner of the internet where every little life is remembered.
          </p>
        </div>
        <div className="space-y-2 text-coffee/70">
          <p className="font-bold text-coffee">Wander around</p>
          <div className="flex flex-col gap-1">
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
        <div className="space-y-2 text-coffee/70">
          <p className="font-bold text-coffee">The human behind PawBook</p>
          <p>
            Built with technology and kindness by{" "}
            <Link to="/about" className="font-bold text-peach hover:underline">
              Sejal ❤️
            </Link>
          </p>
          <div className="pt-2">
            <button
              onClick={toggleMotion}
              className="flex items-center gap-1.5 rounded-full border border-coffee/15 bg-white/80 px-3 py-1 text-xs font-bold text-coffee hover:bg-white transition-colors cursor-pointer"
            >
              <span>{reduceMotion ? "🍃 Motion: Low" : "✨ Motion: Cozy"}</span>
            </button>
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
