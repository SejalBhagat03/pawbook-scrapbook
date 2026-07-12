import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { resolveAsset } from "@/lib/storage";
import { playRustle, playPageFlip } from "@/lib/sound";
import type { Animal } from "@/lib/pawbook-data";

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

interface StoriesSectionProps {
  memories: any[];
  animals: Animal[];
  likes: Record<string, number>;
  envelopeOpen: Record<string, boolean>;
  setEnvelopeOpen: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  currentBookPage: number;
  setCurrentBookPage: React.Dispatch<React.SetStateAction<number>>;
  isBookFlipping: boolean;
  setIsBookFlipping: (f: boolean) => void;
  flipDirection: "next" | "prev";
  setFlipDirection: (dir: "next" | "prev") => void;
  handleAction: (
    memoryId: string,
    type: string,
    animalName: string,
    e?: React.MouseEvent<HTMLButtonElement>
  ) => void;
  handleAddComment: (memoryId: string) => void;
  newCommentAuthor: string;
  setNewCommentAuthor: (v: string) => void;
  newCommentText: string;
  setNewCommentText: (v: string) => void;
}

export function StoriesSection({
  memories,
  animals,
  likes,
  envelopeOpen,
  setEnvelopeOpen,
  currentBookPage,
  setCurrentBookPage,
  isBookFlipping,
  setIsBookFlipping,
  flipDirection,
  setFlipDirection,
  handleAction,
  handleAddComment,
  newCommentAuthor,
  setNewCommentAuthor,
  newCommentText,
  setNewCommentText,
}: StoriesSectionProps) {
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
                  src={resolveAsset(m.image)}
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
                    src={resolveAsset(a.image)}
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
    </motion.section>
  );
}
