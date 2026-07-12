import { useState, useEffect } from "react";
import type { Animal } from "@/lib/pawbook-data";
import { resolveAsset } from "@/lib/storage";
import { SpinWheel } from "@/components/pawbook/SpinWheel";
import { SectionHeading } from "@/components/pawbook/SiteChrome";
import { toast } from "sonner";

const PET_PROMPTS: Record<
  string,
  {
    greeting: string;
    prompts: { text: string; reply: string; toastMsg: string }[];
  }
> = {
  coco: {
    greeting:
      "Hey human! Did you bring birthday cookies? 👀 I might look big like a tiger but I love hugs!",
    prompts: [
      {
        text: "Offer Birthday Treat 🍖",
        reply:
          "Munch munch... Oh, you are the best! My tail is wagging at maximum speed. Let's go play in the garden! 🌳🍖",
        toastMsg: "You fed Coco a birthday treat! 🍖",
      },
      {
        text: "Tell him he looks like a tiger 🐯",
        reply:
          "Haha, yes! Everyone says I look like a tiger, but I'm just a big friendly puppy at heart. 🐯❤️",
        toastMsg: "Coco wags his tail happily!",
      },
    ],
  },
  moti: {
    greeting: "Belly rub time? I'm ready! 🐶 The corner near the tea stall is warm today.",
    prompts: [
      {
        text: "Give belly rubs ❤️",
        reply:
          "Aaaah, that's the spot. My hind leg is twitching. You are officially my favorite human today! 🥺🐾",
        toastMsg: "Moti is melting from rubs! ❤️",
      },
      {
        text: "Offer warm milk 🥛",
        reply:
          "Slurp slurp slurp... Warm tummy feels so cozy! Now I'm ready to watch over the street corner again! 🥛🐶",
        toastMsg: "Moti drinks warm milk! 🥛",
      },
    ],
  },
  kitty: {
    greeting:
      "I have selected you as my servant today. 😼 Ask me something, or just stand there in awe.",
    prompts: [
      {
        text: "Pet gently 🐾",
        reply:
          "Hiss! Just kidding... Purr purr purr. You may rub behind my left ear once. Do not push your luck, servant! 🐈👑",
        toastMsg: "Kitty accepts your scratches.",
      },
      {
        text: "Ask for wisdom 🔮",
        reply:
          "The sunbeams are round and the rooftops are high. Life is simple: if you see a box, sit in it. Also, give me fish. 🐟",
        toastMsg: "Kitty shares feline wisdom.",
      },
    ],
  },
  tommy: {
    greeting:
      "Let's go! What are we chasing today? 🎾 A leaf? A butterfly? I have maximum energy!",
    prompts: [
      {
        text: "Throw tennis ball 🎾",
        reply:
          "Sprints! Sprints! I got it! *drops wet ball on your lap* Throw it again! Please please please! 🐕⚡🎾",
        toastMsg: "Tommy fetches the ball! 🎾",
      },
      {
        text: "Offer warm scarf 🧣",
        reply:
          "Wears scarf proudly! Look at me, I'm the most stylish puppy in this village. Let's run in the rain! 🧣✨",
        toastMsg: "Tommy wears your scarf! 🧣",
      },
    ],
  },
};

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
  const [messages, setMessages] = useState<{ text: string; sender: "pet" | "user" }[]>([]);

  const getPetPromptConfig = (slug: string) => {
    return (
      PET_PROMPTS[slug.toLowerCase()] ?? {
        greeting: `Hello friend! I'm so happy to meet you here in PawBook. 🐾`,
        prompts: [
          {
            text: "Send online hugs 🤗",
            reply: `Aww, thank you! Sending you a warm, soft headbutt back! 💖🐾`,
            toastMsg: "Hugs sent successfully! 🤗",
          },
          {
            text: "Offer treats 🍪",
            reply: `Sniff sniff... Crunchy! That was delicious, thank you kind human! 🐶🍪`,
            toastMsg: "Treat offered! 🍪",
          },
        ],
      }
    );
  };

  useEffect(() => {
    const config = getPetPromptConfig(featured.slug);
    setMessages([{ text: config.greeting, sender: "pet" }]);
  }, [featured.slug]);

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
        {/* Cozy Chat Card */}
        <div
          className="w-[85vw] sm:w-[360px] md:w-auto shrink-0 snap-center bg-white rounded-3xl p-6 border border-coffee/10 scrapbook-shadow h-[545px] flex flex-col justify-between overflow-hidden animate-[fade-up_0.5s_ease-out_both]"
          style={{ animationDelay: "100ms" }}
        >
          <div className="text-center w-full">
            <span className="text-4xl block my-2">💬</span>
            <h3 className="font-display text-2xl mb-1 text-coffee">Cozy Chat</h3>
            <p className="text-xs text-coffee/60 mb-3 max-w-xs mx-auto">
              Have a little conversation with {featured.name}!
            </p>
          </div>

          {/* Chat dialog logs */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5 bg-cream/20 rounded-2xl border border-coffee/5 scrollbar-none my-2 flex flex-col justify-start">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={
                  "flex items-end gap-1.5 max-w-[90%] " +
                  (msg.sender === "user" ? "ml-auto flex-row-reverse" : "")
                }
              >
                {msg.sender === "pet" && (
                  <div className="size-6 rounded-full overflow-hidden shrink-0 border border-coffee/15 bg-white">
                    <img
                      src={resolveAsset(featured.image)}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <div
                  className={
                    "rounded-2xl p-2.5 text-xs leading-relaxed " +
                    (msg.sender === "user"
                      ? "bg-coffee text-cream rounded-br-none font-bold"
                      : "bg-white text-coffee rounded-bl-none border border-coffee/5 shadow-3xs")
                  }
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Action buttons */}
          <div className="space-y-2">
            <div className="flex flex-wrap gap-1.5 justify-center">
              {getPetPromptConfig(featured.slug).prompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setMessages((prev) => [
                      ...prev,
                      { text: p.text, sender: "user" },
                      { text: p.reply, sender: "pet" },
                    ]);
                    toast.success(p.toastMsg);
                  }}
                  className="rounded-xl border-2 border-coffee/25 bg-white hover:bg-peach/10 px-2.5 py-1.5 text-[10px] font-bold text-coffee cursor-pointer transition active:scale-95 shadow-sm"
                >
                  💬 {p.text}
                </button>
              ))}
            </div>
            <button
              onClick={() => {
                const config = getPetPromptConfig(featured.slug);
                setMessages([{ text: config.greeting, sender: "pet" }]);
              }}
              className="block w-full text-center text-[9px] font-bold text-coffee/40 hover:text-peach transition cursor-pointer"
            >
              Restart Chat 🔄
            </button>
          </div>
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

          <div className="flex-1 overflow-y-auto space-y-3 my-2 pr-1 text-left scrollbar-none flex flex-col justify-start">
            {(featured.healthRecords || []).map((r, i) => {
              const icon =
                r.type === "Vaccination"
                  ? "💉"
                  : r.type === "Checkup"
                    ? "🏥"
                    : r.type === "Medicine"
                      ? "💊"
                      : "🩹";
              return (
                <div
                  key={`${featured.slug}-rem-${i}`}
                  className="bg-cream/40 border border-coffee/5 p-3 rounded-2xl flex gap-3 items-start shadow-3xs animate-fade-in"
                >
                  <span className="text-lg mt-0.5">{icon}</span>
                  <div>
                    <p className="text-xs font-bold text-coffee">
                      {featured.name}'s {r.type}
                    </p>
                    <p className="text-[10px] text-coffee/70">{r.note}</p>
                    <p className="text-[9px] text-peach font-bold uppercase mt-1">
                      Due Date: {r.date}
                    </p>
                  </div>
                </div>
              );
            })}

            {(!featured.healthRecords || featured.healthRecords.length === 0) && (
              <div className="flex flex-col items-center justify-center flex-1 text-center py-8 px-4">
                <span className="text-4xl mb-3 animate-pulse">💖</span>
                <p className="text-sm font-bold text-coffee">{featured.name} is all caught up!</p>
                <p className="text-xs text-coffee/50 mt-1 max-w-[200px]">
                  No upcoming vet visits or vaccinations scheduled.
                </p>
              </div>
            )}
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
