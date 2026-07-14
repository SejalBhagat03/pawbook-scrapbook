import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useCMS } from "@/lib/pawbook-data";
import cocoImg from "@/assets/coco.png";

interface PetChat {
  slug: string;
  name: string;
  emoji: string;
  greeting: string;
  avatar: string;
  prompts: {
    text: string;
    reply: string;
    toastMsg: string;
  }[];
}

const petChats: PetChat[] = [
  {
    slug: "coco",
    name: "Coco",
    emoji: "🐕",
    avatar: cocoImg,
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
  {
    slug: "moti",
    name: "Moti",
    emoji: "🐶",
    avatar:
      "https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&q=80&w=150",
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
  {
    slug: "kitty",
    name: "Kitty",
    emoji: "🐈",
    avatar:
      "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=150",
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
  {
    slug: "tommy",
    name: "Tommy",
    emoji: "🐕",
    avatar:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150",
    greeting: "Let's go! What are we chasing today? 🎾 A leaf? A butterfly? I have maximum energy!",
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
];

export function TalkWithPets() {
  const { dialogues } = useCMS();
  const [activeTab, setActiveTab] = useState(0);
  const [messages, setMessages] = useState<
    Record<number, { text: string; sender: "pet" | "user" }[]>
  >({});
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const currentPet = petChats[activeTab];

  // Dynamic CMS Dialogue injection
  const activeDialogues = isMounted ? dialogues : [];
  const cmsDialogues = activeDialogues.filter((d) => d.petSlug === currentPet.slug);
  const cmsPrompts = cmsDialogues.map((d) => {
    const emotionEmojis: Record<string, string> = {
      funny: "😂 Tell a joke",
      happy: "❤️ Say hello",
      attitude: "😼 Challenge me",
      sleepy: "😴 Sleepy chat",
    };
    return {
      text: emotionEmojis[d.emotion] || "🐾 Ask question",
      reply: d.message,
      toastMsg: `${currentPet.name} has a message! ✨`,
    };
  });

  const allPrompts = [...cmsPrompts, ...currentPet.prompts];

  const getChatHistory = () => {
    return messages[activeTab] || [{ text: currentPet.greeting, sender: "pet" }];
  };

  const handlePromptClick = (promptText: string, replyText: string, toastMsg: string) => {
    const history = getChatHistory();
    const updated = [
      ...history,
      { text: promptText, sender: "user" as const },
      { text: replyText, sender: "pet" as const },
    ];
    setMessages({
      ...messages,
      [activeTab]: updated,
    });
    toast.success(toastMsg);
  };

  const resetChat = () => {
    setMessages({
      ...messages,
      [activeTab]: [{ text: currentPet.greeting, sender: "pet" }],
    });
  };

  return (
    <div className="flex flex-col rounded-3xl border border-coffee/10 bg-white scrapbook-shadow overflow-hidden h-[450px] w-full max-w-md mx-auto">
      {/* Header Tabs */}
      <div className="flex bg-cream/35 border-b border-coffee/10">
        {petChats.map((pc, idx) => (
          <button
            key={pc.slug}
            onClick={() => setActiveTab(idx)}
            className={
              "flex-1 flex flex-col items-center py-2.5 transition gap-1 outline-none cursor-pointer border-r border-coffee/5 last:border-r-0 " +
              (activeTab === idx
                ? "bg-white font-bold border-b-2 border-b-peach"
                : "hover:bg-white/40")
            }
          >
            <img
              src={pc.avatar}
              alt=""
              className="size-8 rounded-full object-cover border border-coffee/10"
            />
            <span className="text-[10px] text-coffee/80">{pc.name}</span>
          </button>
        ))}
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-cream/5 scrollbar-thin">
        {getChatHistory().map((msg, i) => (
          <div
            key={i}
            className={
              "flex items-end gap-2 max-w-[85%] " +
              (msg.sender === "user" ? "ml-auto flex-row-reverse" : "")
            }
          >
            {msg.sender === "pet" && (
              <img
                src={currentPet.avatar}
                alt=""
                className="size-7 rounded-full object-cover shrink-0 border border-coffee/10"
              />
            )}
            <div
              className={
                "rounded-2xl p-3 text-xs leading-relaxed scrapbook-shadow " +
                (msg.sender === "user"
                  ? "bg-coffee text-cream rounded-br-none"
                  : "bg-white text-coffee rounded-bl-none border border-coffee/5")
              }
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Prompts Footer */}
      <div className="p-3 border-t border-coffee/10 bg-cream/15 space-y-2">
        <div className="flex flex-wrap gap-1.5 justify-center">
          {allPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handlePromptClick(p.text, p.reply, p.toastMsg)}
              className="rounded-full border border-coffee/15 bg-white px-3 py-1.5 text-[10px] font-bold text-coffee hover:bg-cream/70 cursor-pointer transition active:scale-95 shadow-sm"
            >
              💬 {p.text}
            </button>
          ))}
        </div>
        <button
          onClick={resetChat}
          className="block w-full text-center text-[9px] font-bold text-coffee/40 hover:text-peach transition cursor-pointer"
        >
          Clear Chat history 🔄
        </button>
      </div>
    </div>
  );
}
