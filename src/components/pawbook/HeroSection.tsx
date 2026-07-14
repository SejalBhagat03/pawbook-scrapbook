import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { PetPhoto } from "@/components/pawbook/PetPhoto";
import { resolveAsset } from "@/lib/storage";
import type { Animal } from "@/lib/pawbook-data";

const orbitClasses = [
  { top: "0%", left: "10%", delay: "0s", size: "w-20 h-20" },
  { top: "10%", right: "0%", delay: "-1s", size: "w-16 h-16" },
  { bottom: "5%", right: "10%", delay: "-2s", size: "w-20 h-20" },
  { bottom: "15%", left: "0%", delay: "-3s", size: "w-16 h-16" },
];

interface HeroSectionProps {
  animals: Animal[];
  featured: Animal;
  others: Animal[];
  isFlipped: boolean;
  setIsFlipped: (f: boolean) => void;
  setFeaturedSlug: (slug: string) => void;
  handleAction: (
    memoryId: string,
    type: string,
    animalName: string,
    e?: React.MouseEvent<HTMLButtonElement>,
  ) => void;
  memoriesLength: number;
}

export function HeroSection({
  animals,
  featured,
  others,
  isFlipped,
  setIsFlipped,
  setFeaturedSlug,
  handleAction,
  memoriesLength,
}: HeroSectionProps) {
  return (
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
          Create memories, follow journeys, and celebrate the little paws and wings that make our
          world feel like home.
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
              {memoriesLength} Saved
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
                <img
                  src={resolveAsset(a.image)}
                  alt={a.name}
                  className="h-full w-full object-cover"
                />
                <span className="absolute inset-x-0 bottom-1 mx-auto w-fit rounded bg-white/95 px-2 py-0.5 text-[10px] font-bold opacity-0 transition-opacity group-hover:opacity-100">
                  {a.name}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* 3D flip card */}
        <motion.div
          key={featured.slug}
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0, rotate: [0, -1.5, 1.5, -1.5, 1.5, -1.5, 0] }}
          transition={{
            opacity: { duration: 0.5, delay: 0.3 },
            y: { type: "spring", stiffness: 60, damping: 14, delay: 0.3 },
            rotate: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 },
          }}
          className="relative z-10 w-full max-w-sm h-[470px] md:h-[560px]"
          style={{ perspective: "1200px" }}
        >
          <div
            className="relative w-full h-full cursor-pointer"
            style={{
              transformStyle: "preserve-3d",
              transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
              transition: "transform 0.7s cubic-bezier(0.45, 0, 0.55, 1)",
            }}
          >
            {/* FRONT SIDE */}
            <div
              onClick={() => setIsFlipped(true)}
              className="absolute inset-0 w-full h-full"
              style={{
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                pointerEvents: isFlipped ? "none" : "auto",
              }}
            >
              <div className="relative -rotate-2 border border-coffee/5 bg-white p-3.5 pb-5 md:p-4 md:pb-7 scrapbook-shadow h-full flex flex-col justify-between">
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
              onClick={() => setIsFlipped(false)}
              className="absolute inset-0 w-full h-full"
              style={{
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
                pointerEvents: isFlipped ? "auto" : "none",
              }}
            >
              <div className="relative rotate-2 border border-coffee/10 bg-cream/95 p-3.5 pb-5 md:p-5 md:pb-7 scrapbook-shadow h-full flex flex-col justify-between text-left">
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
    </header>
  );
}
