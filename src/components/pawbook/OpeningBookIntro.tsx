import { useEffect, useState } from "react";
import { playPageFlip } from "@/lib/sound";

export function OpeningBookIntro() {
  const [visible, setVisible] = useState(false);
  const [bookOpen, setBookOpen] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // Only play once per browser session
    const played = sessionStorage.getItem("pawbook-intro-played");
    if (played === "true") {
      return;
    }

    setVisible(true);

    // Flip open the cover shortly after mount
    const openTimer = setTimeout(() => {
      setBookOpen(true);
      playPageFlip();
      // Show page content once the cover is rotated
      setTimeout(() => setContentVisible(true), 600);
    }, 600);

    // Auto-close and fade out after 3.2s
    const fadeTimer = setTimeout(() => {
      handleClose();
    }, 3500);

    return () => {
      clearTimeout(openTimer);
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
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-[#1e1713] p-4 transition-opacity duration-500 ${fading ? "opacity-0" : "opacity-100"}`}
    >
      {/* Skip Button */}
      <button
        onClick={handleClose}
        className="absolute top-6 right-6 rounded-full border border-cream/20 bg-white/5 px-4 py-1.5 text-xs font-bold text-cream/70 transition hover:bg-white/10 hover:text-cream cursor-pointer z-50"
      >
        Skip Intro →
      </button>

      {/* 3D Book Container */}
      <div className="book-container relative w-full max-w-[340px] sm:max-w-[420px] aspect-3/4 flex items-center justify-center">
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
                🐾 Every street friend has a story, a favorite corner, and a heart.
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
          <div className="space-y-2 text-coffee mt-8">
            <span className="text-5xl">📕</span>
            <h1 className="font-display text-3xl sm:text-4xl text-coffee/95 font-bold tracking-tight">
              PawBook
            </h1>
            <p className="text-xs uppercase tracking-widest text-coffee/60 font-bold">
              Memory Scrapbook
            </p>
          </div>

          <div className="mb-4">
            <div className="h-[2px] w-12 bg-coffee/30 mb-2" />
            <p className="font-hand text-lg text-coffee/70">Open the diary of street companions</p>
          </div>
        </div>
      </div>
    </div>
  );
}
