import { useEffect, useState } from "react";
import { playPageFlip } from "@/lib/sound";
import { motion, AnimatePresence } from "framer-motion";

export function OpeningBookIntro() {
  const [visible, setVisible] = useState(false);
  const [bookOpen, setBookOpen] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);
  const [fading, setFading] = useState(false);

  // States for sequential intro steps
  const [step, setStep] = useState(0); // 0: dark/sunrise wake up, 1: drawing logo & walk, 2: float polaroids, 3: flip book open

  useEffect(() => {
    // Only play once per browser session
    const played = sessionStorage.getItem("pawbook-intro-played");
    if (played === "true") {
      return;
    }

    setVisible(true);

    // Sequence timelines
    const t1 = setTimeout(() => setStep(1), 500); // Sunrise wakes up, logo starts drawing
    const t2 = setTimeout(() => setStep(2), 1800); // Paws walk, polaroids float in
    const t3 = setTimeout(() => {
      setStep(3);
      setBookOpen(true);
      playPageFlip();
      setTimeout(() => setContentVisible(true), 600);
    }, 3800); // Book opens and shows inside message
    // Auto-close and fade out
    const fadeTimer = setTimeout(() => {
      handleClose();
    }, 7200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(fadeTimer);
    };
  }, []);

  const handleClose = () => {
    setFading(true);
    setTimeout(() => {
      sessionStorage.setItem("pawbook-intro-played", "true");
      setVisible(false);
    }, 600);
  };

  if (!visible) return null;

  return (
    <motion.div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-colors duration-2000 ${
        step >= 1 ? "animate-sunrise" : "bg-[#1e1713]"
      } ${fading ? "opacity-0 pointer-events-none" : "opacity-100"}`}
    >
      {/* Skip Button */}
      <button
        onClick={handleClose}
        className="absolute top-6 right-6 rounded-full border border-coffee/20 bg-white/20 px-4 py-1.5 text-xs font-bold text-coffee/85 transition hover:bg-white/40 hover:text-coffee cursor-pointer z-50"
      >
        Skip Intro →
      </button>

      {/* Floating Leaves */}
      {step >= 1 && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[0, 1, 2, 3].map((i) => (
            <motion.span
              key={i}
              initial={{ y: -50, x: Math.random() * 800 - 400, opacity: 0 }}
              animate={{
                y: window.innerHeight + 100,
                x: Math.random() * 800 - 400,
                opacity: [0, 0.7, 0.7, 0],
              }}
              transition={{
                duration: 6 + i * 2,
                repeat: Infinity,
                delay: i * 1.5,
                ease: "linear",
              }}
              className="absolute text-3xl"
              style={{
                left: `${20 + i * 20}%`,
              }}
            >
              {i % 2 === 0 ? "🍃" : "🍁"}
            </motion.span>
          ))}
        </div>
      )}

      {/* Walking Paw Prints */}
      {step >= 1 && (
        <div className="absolute inset-x-0 top-1/4 h-24 pointer-events-none flex justify-center gap-12 select-none">
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={step >= 2 ? { opacity: [0, 0.5, 0.5, 0], scale: 1.2 } : {}}
              transition={{
                duration: 1.8,
                delay: i * 0.35,
                ease: "easeOut",
              }}
              className="text-4xl -rotate-12"
            >
              🐾
            </motion.span>
          ))}
        </div>
      )}

      {/* Floating Polaroids */}
      <AnimatePresence>
        {step >= 2 && step < 3 && (
          <>
            {/* Polaroid 1 (Left) */}
            <motion.div
              initial={{ x: -300, y: 100, rotate: -25, opacity: 0 }}
              animate={{ x: -180, y: -60, rotate: -15, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 50, damping: 15 }}
              className="absolute hidden md:block border-8 border-white p-2 pb-6 scrapbook-shadow bg-white w-32 aspect-3/4 rounded-sm"
            >
              <div className="bg-cream h-20 w-full overflow-hidden">
                <img
                  src="/coco.jpg"
                  alt=""
                  className="object-cover h-full w-full"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=200";
                  }}
                />
              </div>
              <p className="font-hand text-[10px] text-peach text-center mt-1">Coco 🐶</p>
            </motion.div>

            {/* Polaroid 2 (Right) */}
            <motion.div
              initial={{ x: 300, y: -100, rotate: 25, opacity: 0 }}
              animate={{ x: 180, y: 50, rotate: 10, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 50, damping: 15, delay: 0.2 }}
              className="absolute hidden md:block border-8 border-white p-2 pb-6 scrapbook-shadow bg-white w-32 aspect-3/4 rounded-sm"
            >
              <div className="bg-cream h-20 w-full overflow-hidden">
                <img
                  src="/kitty.jpg"
                  alt=""
                  className="object-cover h-full w-full"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200";
                  }}
                />
              </div>
              <p className="font-hand text-[10px] text-peach text-center mt-1">Kitty 🐈</p>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 3D Book Container */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="book-container relative w-full max-w-[340px] sm:max-w-[420px] aspect-3/4 flex items-center justify-center"
      >
        {/* Left/Back page (base of the book inside) */}
        <div
          className={`absolute inset-0 rounded-r-3xl bg-[#fdfbf7] p-6 sm:p-8 flex flex-col justify-center border-l border-coffee/20 shadow-2xl transition-opacity duration-300 ${bookOpen ? "opacity-100" : "opacity-0"}`}
          style={{
            backgroundImage:
              "radial-gradient(rgba(74, 46, 32, 0.02) 1px, transparent 1px), linear-gradient(#00000005 1px, transparent 1px)",
            backgroundSize: "16px 16px, 100% 24px",
          }}
        >
          {contentVisible && (
            <div className="space-y-4 animate-fade-in text-coffee">
              <p className="text-2xl sm:text-3xl font-hand leading-relaxed">
                🐾 Every little friend has a story, a favorite corner, and a heart.
              </p>
              <div className="w-12 h-px bg-coffee/20" />
              <p className="font-hand text-lg sm:text-xl text-coffee/70 italic">
                Welcome to PawBook — a living memory diary of our community paws.
              </p>
            </div>
          )}
        </div>

        {/* 3D Flipping Cover */}
        <div
          className={`book-cover-3d absolute inset-0 rounded-r-3xl bg-peach p-6 flex flex-col justify-between shadow-2xl border-y border-r border-[#e0755a] ${bookOpen ? "book-cover-open" : ""}`}
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          {/* Cover Art */}
          <div className="space-y-4 text-coffee mt-8 flex flex-col items-center text-center">
            {/* self-drawing handwritten paw logo */}
            <div className="h-20 w-20 flex items-center justify-center bg-cream/35 rounded-full p-2">
              <svg width="60" height="60" viewBox="0 0 100 100">
                <motion.path
                  d="M 30 70 C 30 50, 70 50, 70 70 C 70 85, 30 85, 30 70 Z"
                  fill="none"
                  stroke="#4a2e20"
                  strokeWidth="6"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.8, ease: "easeInOut" }}
                />
                <motion.circle
                  cx="22"
                  cy="40"
                  r="10"
                  fill="none"
                  stroke="#4a2e20"
                  strokeWidth="6"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.2, delay: 0.3 }}
                />
                <motion.circle
                  cx="40"
                  cy="26"
                  r="10"
                  fill="none"
                  stroke="#4a2e20"
                  strokeWidth="6"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.2, delay: 0.6 }}
                />
                <motion.circle
                  cx="60"
                  cy="26"
                  r="10"
                  fill="none"
                  stroke="#4a2e20"
                  strokeWidth="6"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.2, delay: 0.9 }}
                />
                <motion.circle
                  cx="78"
                  cy="40"
                  r="10"
                  fill="none"
                  stroke="#4a2e20"
                  strokeWidth="6"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.2, delay: 1.2 }}
                />
              </svg>
            </div>

            <div className="space-y-1">
              <h1 className="font-display text-3xl sm:text-4xl text-coffee/95 font-bold tracking-tight">
                PawBook
              </h1>
              <p className="text-xs uppercase tracking-widest text-coffee/60 font-bold">
                Memory Scrapbook
              </p>
            </div>

            {/* Breathing Pet Illustration */}
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              className="text-5xl mt-2 select-none"
            >
              🐕🐈🐾
            </motion.div>
          </div>

          <div className="mb-4">
            <div className="h-[2px] w-12 bg-coffee/30 mb-2" />
            <p className="font-hand text-lg text-coffee/70">Open the diary of beloved companions</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
