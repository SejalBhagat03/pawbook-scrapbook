import { useState, useEffect } from "react";
import { toast } from "sonner";
import { surprises as cmsSurprises } from "@/lib/pawbook-data";

type Surprise = (typeof cmsSurprises)[number];

export function DailySurpriseBox() {
  const surprises = cmsSurprises;
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpenedToday, setHasOpenedToday] = useState(false);
  const [reward, setReward] = useState<Surprise | null>(null);
  const [bounce, setBounce] = useState(false);
  const [particles, setParticles] = useState<
    { id: number; left: string; delay: string; emoji: string }[]
  >([]);

  // Idle bounce triggers every 10s
  useEffect(() => {
    const today = new Date().toDateString();
    const lastOpened = localStorage.getItem("pawbook-last-opened-surprise");
    if (lastOpened === today) {
      setHasOpenedToday(true);
    }

    const timer = setInterval(() => {
      setBounce(true);
      setTimeout(() => setBounce(false), 2000);
    }, 10000);

    return () => clearInterval(timer);
  }, []);

  const handleOpen = () => {
    const random = surprises[Math.floor(Math.random() * surprises.length)];
    setReward(random);
    setIsOpen(true);

    // Generate falling confetti particles
    const confettiList = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      left: `${5 + Math.random() * 90}%`,
      delay: `${Math.random() * 400}ms`,
      emoji: ["🌸", "🎉", "✨", "🍬", "🐾", "🎈", "🍪"][Math.floor(Math.random() * 7)],
    }));
    setParticles(confettiList);

    if (!hasOpenedToday) {
      const today = new Date().toDateString();
      localStorage.setItem("pawbook-last-opened-surprise", today);
      setHasOpenedToday(true);
      toast.success("Surprise Box opened! ✨🎁");
    }
  };

  return (
    <>
      <style>{`
        @keyframes fall {
          0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(450px) rotate(360deg); opacity: 0; }
        }
        .animate-fall {
          animation: fall 2.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
        }
        @keyframes spring-up {
          0% { transform: scale(0.35); opacity: 0; }
          70% { transform: scale(1.06); opacity: 0.95; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-spring-up {
          animation: spring-up 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }
      `}</style>

      {/* Floating Gift Box Badge */}
      <div className="fixed bottom-6 left-6 z-40">
        <button
          onClick={handleOpen}
          className={`flex items-center justify-center rounded-full border border-coffee bg-yellow p-3 scrapbook-shadow hover:scale-110 active:scale-95 group transition-all duration-300 hover:shadow-[0_0_15px_rgba(231,158,130,0.5)] cursor-pointer ${bounce ? "animate-bounce" : ""}`}
          title="Daily Paw Surprise Box"
        >
          <span className="text-2xl transition-transform duration-300 group-hover:rotate-12 group-hover:-translate-y-1 block">
            🎁
          </span>
        </button>
      </div>

      {isOpen && reward && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-coffee/40 px-4 py-6 backdrop-blur-sm animate-fade-in overflow-hidden">
          {/* Confetti particles */}
          {particles.map((p) => (
            <span
              key={p.id}
              className="absolute top-4 text-2xl pointer-events-none animate-fall z-50"
              style={{ left: p.left, animationDelay: p.delay }}
            >
              {p.emoji}
            </span>
          ))}

          <div className="relative w-full max-w-sm rounded-3xl border-2 border-coffee bg-white p-6 text-center scrapbook-shadow sm:p-8 animate-spring-up">
            {/* Washi tape */}
            <div className="washi-tape absolute -top-1.5 left-1/2 z-10 h-6 w-24 -translate-x-1/2 rotate-1" />

            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 h-8 w-8 rounded-full border border-coffee/15 bg-white text-sm font-bold text-coffee/60 hover:bg-cream cursor-pointer"
            >
              ✖
            </button>

            <span className="text-6xl animate-pulse block my-4">{reward.icon}</span>
            <h2 className="font-display text-2xl text-coffee leading-snug">{reward.title}</h2>
            <p className="mt-3 text-coffee/80 leading-relaxed bg-cream/40 rounded-2xl border border-coffee/5 p-4 font-hand text-xl">
              "{reward.content}"
            </p>

            <div className="mt-6 flex flex-col gap-2">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full rounded-xl bg-coffee py-2.5 text-xs font-bold text-cream transition hover:scale-105 cursor-pointer"
              >
                Cozy! Close 🌸
              </button>
              <p className="text-[9px] text-coffee/40 font-semibold">
                Come back tomorrow for another village surprise! 📆🐾
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
