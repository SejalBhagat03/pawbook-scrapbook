import type { Animal } from "@/lib/pawbook-data";
import { resolveAsset } from "@/lib/storage";
import { SpinWheel } from "@/components/pawbook/SpinWheel";
import { SectionHeading } from "@/components/pawbook/SiteChrome";
import { toast } from "sonner";

interface PawPlayroomProps {
  featured: Animal;
  animals: Animal[];
  handlePlayroomScroll: (e: React.UIEvent<HTMLDivElement>) => void;
  handleAction: (
    memoryId: string,
    type: string,
    animalName: string,
    e?: React.MouseEvent<HTMLButtonElement>
  ) => void;
  setQuizOpen: (open: boolean) => void;
  activePlayroomIndex: number;
}

export function PawPlayroom({
  featured,
  animals,
  handlePlayroomScroll,
  handleAction,
  setQuizOpen,
  activePlayroomIndex,
}: PawPlayroomProps) {
  return (
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
                <img
                  src={resolveAsset(a.image)}
                  alt={a.name}
                  className="h-full w-full object-cover"
                />
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
  );
}
