import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { PetPhoto } from "@/components/pawbook/PetPhoto";
import { playBark, playMeow, playHappyChime } from "@/lib/sound";
import type { Animal } from "@/lib/pawbook-data";

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

interface PawBookGridProps {
  animals: Animal[];
  flippedSlugs: Record<string, boolean>;
  toggleFlip: (slug: string, e: React.MouseEvent) => void;
  villageRef: React.RefObject<HTMLDivElement | null>;
}

export function PawBookGrid({
  animals,
  flippedSlugs,
  toggleFlip,
  villageRef,
}: PawBookGridProps) {
  return (
    <>
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
    </>
  );
}
