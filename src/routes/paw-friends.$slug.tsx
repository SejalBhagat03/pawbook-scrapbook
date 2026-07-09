import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { PageShell } from "@/components/pawbook/SiteChrome";
import {
  careTimeline,
  memories as defaultMemories,
  getAnimal,
  type Animal,
  useCMS,
} from "@/lib/pawbook-data";
import { copyToClipboard, shareContent } from "@/lib/utils";
import { playBark, playMeow, playHappyChime, playPawSteps, playPageFlip } from "@/lib/sound";

export const Route = createFileRoute("/paw-friends/$slug")({
  loader: ({ params }): { animal: Animal } => {
    const animal = getAnimal(params.slug);
    if (!animal) throw notFound();
    return { animal };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Friend not found · PawBook" }, { name: "robots", content: "noindex" }],
      };
    }
    const a = loaderData.animal;
    return {
      meta: [
        { title: `${a.name} ${a.emoji} · PawBook` },
        { name: "description", content: `${a.bio} Read ${a.name}'s diary on PawBook.` },
        { property: "og:title", content: `${a.name} — "${a.nickname}"` },
        { property: "og:description", content: a.story },
      ],
    };
  },
  component: AnimalProfile,
  notFoundComponent: () => (
    <PageShell>
      <div className="mx-auto max-w-md px-6 py-24 text-center">
        <div className="text-6xl">🐾</div>
        <h1 className="mt-4 font-display text-3xl">This friend hasn't joined the village yet</h1>
        <Link to="/paw-friends" className="mt-6 inline-block font-bold text-peach underline">
          ← Back to Paw Friends
        </Link>
      </div>
    </PageShell>
  ),
});

const animalTimelines: Record<string, { date: string; label: string; note: string }[]> = {
  coco: [
    {
      date: "Apr 4",
      label: "🐾 Birthday Boy",
      note: "Celebrated Coco's 7th birthday in the garden.",
    },
    {
      date: "May 10",
      label: "🐯 Tiger Look",
      note: "Discovered his unique tiger-like coat pattern.",
    },
    {
      date: "Jul 15",
      label: "❤️ Too Friendly",
      note: "Coco welcomed every visitor with tail wags and happy jumps.",
    },
  ],
  moti: [
    {
      date: "Mar 3",
      label: "🐶 Corner Guard",
      note: "Found Moti watching over the tea shop corner.",
    },
    {
      date: "Apr 20",
      label: "❤️ Belly Rub Pact",
      note: "Moti demanded belly rubs from every customer.",
    },
    {
      date: "Jul 20",
      label: "💊 Healthy Pup",
      note: "Vet health check: Moti is healthy and safe!",
    },
  ],
  kitty: [
    {
      date: "Feb 22",
      label: "🐈 Balcony Sighting",
      note: "Kitty watched us silently from the library balcony.",
    },
    {
      date: "May 10",
      label: "🌸 Butterfly Hunt",
      note: "Sat in complete silence with a butterfly friend.",
    },
    {
      date: "Jun 30",
      label: "🥛 Rooftop Feast",
      note: "Gave her grilled fish to celebrate the summer heat.",
    },
  ],
  tommy: [
    {
      date: "May 5",
      label: "🐕 Tiny Adventurer",
      note: "Found Tommy running after a leaf at just 3 months old.",
    },
    {
      date: "Jul 10",
      label: "⛈️ Storm Rescue",
      note: "Sheltered under the tea shop stall during a heavy monsoon.",
    },
    {
      date: "Jul 12",
      label: "🧣 Warm Blanket",
      note: "A kind visitor dried him off and gave him a cozy blanket.",
    },
  ],
};

function AnimalProfile() {
  const { animals, memories } = useCMS();
  const data = Route.useLoaderData() as { animal: Animal };
  const a = animals.find((pet) => pet.slug === data.animal.slug) || data.animal;
  const timeline = animalTimelines[a.slug] || careTimeline;
  const theirMemories = memories.filter((m) => m.animalSlug === a.slug);
  const statusColor =
    a.status === "safe" ? "bg-sage" : a.status === "needs-care" ? "bg-yellow" : "bg-destructive/80";
  const statusText =
    a.status === "safe"
      ? "🟢 Healthy"
      : a.status === "needs-care"
        ? "🟡 Needs Care"
        : "🔴 Emergency";

  const [extraLove, setExtraLove] = useState(0);
  const [extraTreats, setExtraTreats] = useState(0);
  const [accessory, setAccessory] = useState<string | null>(null);
  const [memoryPlaying, setMemoryPlaying] = useState(false);
  const [memoryVisible, setMemoryVisible] = useState(false);

  const [scrollProgress, setScrollProgress] = useState(0);

  // Track page scroll to grow care timeline thread line
  useEffect(() => {
    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      setScrollProgress(window.scrollY / docHeight);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Each pet has their own voice memory
  const petVoiceMemories: Record<string, string> = {
    coco: `Hi friend! 🐾\nI'm Coco — the happiest boy near the garden gate.\n\nEvery morning I sit at the same spot,\nwagging my tail, waiting for someone to say hello.\n\nToday I made a new friend. That's enough for me. ❤️`,
    moti: `Hey there! 🍪\nMoti here — the official biscuit inspector of the tea shop.\n\nI work very hard every day.\nI make sure everyone who sits down feels welcome.\n\nBelly rubs accepted. Always. 🐕`,
    kitty: `...\n\nI don't say much. But I notice everything.\n\nThe butterfly that came yesterday.\nThe warm patch of sun on the balcony.\nYou, reading this right now. 🐈\n\nThat's enough.`,
    tommy: `Woof! 🌧️\nI'm Tommy — I survived the big storm!\n\nA kind person gave me a warm blanket that night.\nI still look for them every morning.\n\nI'm safe now. Thank you for caring. 🧣`,
  };
  const petVoice =
    petVoiceMemories[a.slug] ||
    `Hi! I'm ${a.name}. 🐾\nThank you for visiting my diary today.\n\nEvery kind visit makes my tail wag a little more. ❤️`;

  // Guestbook comments state
  const [comments, setComments] = useState<
    { name: string; icon: string; message: string; date: string }[]
  >([]);
  const [newName, setNewName] = useState("");
  const [newIcon, setNewIcon] = useState("🐶");
  const [newMessage, setNewMessage] = useState("");

  // Load guestbook, love points, and treats from localStorage
  useEffect(() => {
    const key = `pawbook-guestbook-${a.slug}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        setComments(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    } else {
      // Default placeholder comments
      const defaults = [
        {
          name: "Moti",
          icon: "🐶",
          message: `Hey ${a.name}, let's share biscuits together tomorrow near the tea stall! 🍪`,
          date: "Just now",
        },
        {
          name: "Kitty",
          icon: "🐈",
          message: `Stay cozy, ${a.name}! The sun is warm on the library balcony today. ☀️`,
          date: "1 hour ago",
        },
      ];
      setComments(defaults);
      localStorage.setItem(key, JSON.stringify(defaults));
    }

    const loveKey = `pawbook-extra-love-${a.slug}`;
    const treatsKey = `pawbook-extra-treats-${a.slug}`;
    setExtraLove(parseInt(localStorage.getItem(loveKey) || "0", 10));
    setExtraTreats(parseInt(localStorage.getItem(treatsKey) || "0", 10));
    setAccessory(localStorage.getItem(`pawbook-accessory-${a.slug}`));

    // Register passport stamp
    const stampsKey = "pawbook-visited-stamps";
    const visitedStr = localStorage.getItem(stampsKey) || "[]";
    try {
      const visited = JSON.parse(visitedStr) as string[];
      if (!visited.includes(a.slug)) {
        const next = [...visited, a.slug];
        localStorage.setItem(stampsKey, JSON.stringify(next));
        window.dispatchEvent(new Event("pawbook-stamp-updated"));
        toast.success(`New stamp added to your Village Passport: ${a.name}! 💮`);
      }
    } catch (e) {
      console.error(e);
    }
  }, [a.slug, a.name]);

  const handleGuestbookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newMessage.trim()) return;
    const newComment = {
      name: newName.trim(),
      icon: newIcon,
      message: newMessage.trim(),
      date: "Just now",
    };
    const updated = [newComment, ...comments];
    setComments(updated);
    localStorage.setItem(`pawbook-guestbook-${a.slug}`, JSON.stringify(updated));
    setNewName("");
    setNewMessage("");
    toast.success(`Greeting sent to ${a.name}! 🐾`);
  };

  const handleShare = () => {
    shareContent(
      {
        title: `${a.name} ${a.emoji} · PawBook`,
        text: `Meet ${a.name}, "${a.nickname}" on PawBook! 🐾`,
        url: window.location.href,
      },
      () => toast.success("Shared successfully! 🐾"),
      () =>
        toast.error(
          "Could not share automatically. Please copy the URL from your browser address bar.",
        ),
    );
  };

  const handleBoop = () => {
    setExtraLove((prev) => {
      const next = prev + 1;
      localStorage.setItem(`pawbook-extra-love-${a.slug}`, next.toString());
      return next;
    });
    if (a.slug === "kitty") {
      playMeow();
    } else {
      playBark();
    }
    setTimeout(() => playHappyChime(), 180);
    toast.success(`You booped ${a.name}'s nose! ❤️`);
  };

  const handleTreat = () => {
    setExtraTreats((prev) => {
      const next = prev + 1;
      localStorage.setItem(`pawbook-extra-treats-${a.slug}`, next.toString());
      return next;
    });
    if (a.slug === "kitty") {
      playMeow();
    } else {
      playBark();
    }
    setTimeout(() => playHappyChime(), 200);
    toast.success(`You gave ${a.name} a biscuit! 🍪`);
  };

  const handleHug = () => {
    setExtraLove((prev) => {
      const next = prev + 1;
      localStorage.setItem(`pawbook-extra-love-${a.slug}`, next.toString());
      return next;
    });
    playHappyChime();
    toast.success(`You gave ${a.name} a warm hug! 🐾`);
  };

  const handleHearMemory = () => {
    if (memoryPlaying) return;
    setMemoryPlaying(true);
    setMemoryVisible(false);
    playPawSteps(() => {
      if (a.slug === "kitty") {
        playMeow();
      } else {
        playBark();
      }
      setTimeout(() => {
        playPageFlip();
        setMemoryVisible(true);
      }, 200);
    });
    setTimeout(() => setMemoryPlaying(false), 2000);
  };

  return (
    <PageShell>
      {/* Cover */}
      <section className="relative">
        {/* Back Bookmark */}
        <Link
          to="/"
          hash="paw-friends"
          className="absolute top-4 left-4 sm:top-6 sm:left-6 z-30 group flex items-center gap-2 rounded-2xl border-2 border-dashed border-peach/50 bg-white px-3 py-1.5 sm:px-4 sm:py-2 font-display text-xs sm:text-sm font-bold text-coffee scrapbook-shadow hover:scale-105 active:scale-95 transition-transform cursor-pointer"
        >
          <span className="text-sm sm:text-base group-hover:-translate-x-0.5 transition-transform">
            🏡 🐾
          </span>
          <span>Return to Village</span>
        </Link>

        <div
          className={`relative h-56 sm:h-72 md:h-80 bg-${a.color}/60`}
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 30%, color-mix(in oklab, var(--color-peach) 30%, transparent), transparent 40%), radial-gradient(circle at 80% 60%, color-mix(in oklab, var(--color-sky) 40%, transparent), transparent 50%)",
          }}
        >
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-20 text-9xl">
            {a.emoji}
          </div>
        </div>
        <div className="mx-auto -mt-20 max-w-5xl px-6">
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-end">
            <div className="washi-tape-wrap relative">
              <div className="washi-tape absolute -top-3 left-1/2 z-20 h-6 w-20 -translate-x-1/2 rotate-3" />
              <div className="rounded-full border-8 border-white bg-white scrapbook-shadow relative overflow-hidden size-40 sm:size-48 flex items-center justify-center">
                <img
                  src={a.image}
                  alt={a.name}
                  className="h-full w-full object-cover"
                  style={a.slug === "coco" ? { objectPosition: "center 25%" } : undefined}
                  width={400}
                  height={400}
                />
              </div>
            </div>
            <div className="flex-1">
              <p className="font-hand text-2xl text-peach">"{a.nickname}"</p>
              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl">
                {a.name} {a.emoji}
              </h1>
              <p className="mt-2 max-w-xl text-base text-coffee/80">{a.bio}</p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                {a.badges.map((b) => (
                  <span
                    key={b}
                    className="rounded-full bg-white px-3 py-1 text-xs font-bold scrapbook-shadow"
                  >
                    {b}
                  </span>
                ))}
                <button
                  onClick={handleShare}
                  className="rounded-full bg-coffee px-3.5 py-1 text-xs font-bold text-cream hover:bg-peach hover:text-coffee transition-colors scrapbook-shadow cursor-pointer"
                >
                  🔗 Share Friend
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Details grid */}
      <section className="mx-auto grid max-w-5xl gap-6 px-6 py-10 md:grid-cols-3">
        <div className="space-y-4 md:col-span-1">
          {/* Paw Passport Card */}
          <div className="rounded-3xl border border-coffee/10 bg-white p-5 scrapbook-shadow relative overflow-hidden bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[16px_16px]">
            <div className="absolute right-2 bottom-2 text-6xl opacity-5 pointer-events-none rotate-12">
              🪪
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-coffee/50 mb-3">
              🪪 Paw Passport
            </p>
            <div className="space-y-2.5 text-xs text-coffee/85">
              <div className="border-b border-coffee/5 pb-2">
                <p className="text-[9px] uppercase tracking-wider text-coffee/40 font-bold">
                  PawBook ID
                </p>
                <p className="font-mono text-sm font-bold text-coffee">
                  {a.pawId || `PB-${a.slug.toUpperCase()}-1024`}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-[9px] uppercase tracking-wider text-coffee/40 font-bold">
                    Age Est.
                  </p>
                  <p className="font-semibold">{a.ageEstimate || "N/A"}</p>
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-wider text-coffee/40 font-bold">
                    Gender
                  </p>
                  <p className="font-semibold">{a.gender || "N/A"}</p>
                </div>
              </div>

              <div>
                <p className="text-[9px] uppercase tracking-wider text-coffee/40 font-bold">
                  Breed / Type
                </p>
                <p className="font-semibold">{a.breedType || a.personality}</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-[9px] uppercase tracking-wider text-coffee/40 font-bold">
                    Known Since
                  </p>
                  <p className="font-semibold">{a.knownSince || a.firstMet}</p>
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-wider text-coffee/40 font-bold">
                    Home Area
                  </p>
                  <p className="font-semibold truncate">{a.homeArea || a.home}</p>
                </div>
              </div>

              <div className="border-t border-coffee/5 pt-3 space-y-2">
                <p className="text-[9px] uppercase tracking-wider text-coffee/40 font-bold">
                  Health Status
                </p>
                <div className="flex flex-wrap gap-2">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold ${
                      a.vaccinated ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    💉 {a.vaccinated ? "Vaccinated" : "Needs Vaccine"}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold ${
                      a.sterilized ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    ✂️ {a.sterilized ? "Sterilized" : "Not Sterilized"}
                  </span>
                </div>
                {a.medicalNotes && (
                  <p className="text-[10px] text-coffee/70 bg-cream/30 p-2 rounded-xl border border-coffee/5 italic">
                    "{a.medicalNotes}"
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Personality Meter */}
          <div className="rounded-3xl border border-coffee/10 bg-white p-5 scrapbook-shadow">
            <p className="text-[10px] font-bold uppercase tracking-widest text-coffee/50 mb-3">
              📊 Personality Meter
            </p>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-[10px] font-bold text-coffee/70 mb-1">
                  <span>Friendliness</span>
                  <span>{a.friendliness || 80}%</span>
                </div>
                <div className="h-2 w-full bg-cream rounded-full overflow-hidden border border-coffee/5">
                  <div
                    className="h-full bg-peach rounded-full"
                    style={{ width: `${a.friendliness || 80}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[10px] font-bold text-coffee/70 mb-1">
                  <span>Energy</span>
                  <span>{a.energy || 70}%</span>
                </div>
                <div className="h-2 w-full bg-cream rounded-full overflow-hidden border border-coffee/5">
                  <div
                    className="h-full bg-yellow rounded-full"
                    style={{ width: `${a.energy || 70}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[10px] font-bold text-coffee/70 mb-1">
                  <span>Trust</span>
                  <span>{a.trust || 85}%</span>
                </div>
                <div className="h-2 w-full bg-cream rounded-full overflow-hidden border border-coffee/5">
                  <div
                    className="h-full bg-sage rounded-full"
                    style={{ width: `${a.trust || 85}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[10px] font-bold text-coffee/70 mb-1">
                  <span>Playfulness</span>
                  <span>{a.playfulness || 75}%</span>
                </div>
                <div className="h-2 w-full bg-cream rounded-full overflow-hidden border border-coffee/5">
                  <div
                    className="h-full bg-peach rounded-full"
                    style={{ width: `${a.playfulness || 75}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* QR Paw Tag */}
          <div className="rounded-3xl border-2 border-dashed border-peach/50 bg-[#FDFBF7] p-5 scrapbook-shadow text-center relative overflow-hidden flex flex-col items-center">
            <p className="text-[10px] font-bold uppercase tracking-widest text-coffee/50 mb-2">
              🏷️ QR Paw Tag
            </p>
            <p className="text-[11px] font-mono font-bold text-coffee">
              ID: {a.pawId || `PB-${a.slug.toUpperCase()}-1024`}
            </p>

            <div className="my-4 size-28 bg-white border border-coffee/10 rounded-2xl p-2.5 flex items-center justify-center scrapbook-shadow">
              <div className="size-full bg-coffee opacity-85 relative">
                <div className="absolute inset-0 grid grid-cols-5 gap-1 p-1 opacity-70">
                  {Array.from({ length: 25 }).map((_, idx) => (
                    <div
                      key={idx}
                      className={`rounded-sm ${(idx * 7) % 3 === 0 ? "bg-coffee" : "bg-transparent"}`}
                    />
                  ))}
                </div>
                <div className="absolute top-1 left-1 size-5 border-2 border-coffee bg-white p-0.5">
                  <div className="size-full bg-coffee" />
                </div>
                <div className="absolute top-1 right-1 size-5 border-2 border-coffee bg-white p-0.5">
                  <div className="size-full bg-coffee" />
                </div>
                <div className="absolute bottom-1 left-1 size-5 border-2 border-coffee bg-white p-0.5">
                  <div className="size-full bg-coffee" />
                </div>
              </div>
            </div>

            <p className="text-[10px] text-coffee/60 leading-tight">
              Scan tag or print to place near {a.name}'s feeding spot so anyone can read their
              story.
            </p>
          </div>
        </div>

        <div className="space-y-6 md:col-span-2">
          {/* Lined Notebook Paper Story */}
          <div className="rounded-3xl border border-coffee/10 bg-white p-6 scrapbook-shadow relative">
            <div className="absolute top-4 right-6 text-2xl rotate-6 animate-float">✍️</div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-coffee/50 mb-2">
              My Story
            </p>
            <div className="bg-[radial-gradient(circle_at_0px_0px,transparent_8px,transparent_8px),linear-gradient(#00000008_1px,transparent_1px)] bg-size-[100%_24px] pl-1 py-1.5 mt-2">
              <p className="font-hand text-2xl leading-relaxed text-coffee">
                "
                {a.story ||
                  `Hi, I am ${a.name} 🐾 Every morning I wait near the tea shop because my friends come to meet me.`}
                "
              </p>
            </div>
            <p className="mt-4 text-[10px] uppercase tracking-widest text-coffee/40 text-right">
              — Logged by protectors at the {a.home}
            </p>
          </div>

          {/* 🎧 Hear Pet's Memory — emotional voice interaction */}
          <div className="rounded-3xl border-2 border-dashed border-peach/60 bg-[#FFFBF5] p-6 scrapbook-shadow relative overflow-hidden">
            <div className="absolute top-3 right-4 text-2xl opacity-20 select-none">🐾🐾🐾</div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-coffee/50 mb-3">
              🎧 {a.name}&apos;s Memory Voice
            </p>

            {!memoryVisible ? (
              <div className="flex flex-col items-center gap-3 py-2">
                <p className="text-sm text-coffee/60 text-center font-hand">
                  Press to hear what {a.name} wants to tell you…
                </p>
                <button
                  onClick={handleHearMemory}
                  disabled={memoryPlaying}
                  className={`flex items-center gap-2 rounded-2xl border-2 border-peach bg-peach/10 px-5 py-2.5 font-display text-sm font-bold text-coffee scrapbook-shadow transition-all cursor-pointer
                    ${memoryPlaying ? "opacity-60 animate-pulse" : "hover:bg-peach/20 hover:scale-105 active:scale-95"}`}
                >
                  {memoryPlaying ? (
                    <>
                      <span className="animate-bounce">🐾</span>
                      <span className="animate-bounce" style={{ animationDelay: "0.1s" }}>
                        🐾
                      </span>
                      <span className="animate-bounce" style={{ animationDelay: "0.2s" }}>
                        🐾
                      </span>
                      <span className="ml-1">Walking over…</span>
                    </>
                  ) : (
                    <>🎧 Hear {a.name}&apos;s Memory</>
                  )}
                </button>
              </div>
            ) : (
              <div
                className="space-y-3 animate-fade-in"
                style={{ animation: "fadeIn 0.6s ease forwards" }}
              >
                <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }`}</style>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">{a.emoji}</span>
                  <p className="font-display font-bold text-coffee">{a.name} says…</p>
                </div>
                <div className="bg-white rounded-2xl border border-coffee/10 p-4 shadow-sm">
                  {petVoice.split("\n").map((line, i) => (
                    <p
                      key={i}
                      className="font-hand text-lg leading-relaxed text-coffee"
                      style={{
                        animationDelay: `${i * 0.08}s`,
                        minHeight: line === "" ? "1rem" : undefined,
                      }}
                    >
                      {line || "\u00A0"}
                    </p>
                  ))}
                </div>
                <button
                  onClick={() => {
                    setMemoryVisible(false);
                  }}
                  className="text-[10px] font-bold uppercase tracking-wider text-coffee/40 hover:text-peach transition-colors cursor-pointer"
                >
                  Close ✕
                </button>
              </div>
            )}
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Care Timeline Card */}
            <div className="rounded-3xl border border-coffee/10 bg-white p-6 scrapbook-shadow">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-display text-xl font-bold text-coffee">Care Journey</h2>
                <span className="text-xs text-coffee/40">Milestones</span>
              </div>
              <div className="relative">
                {/* Sewn thread timeline line that grows on scroll */}
                <div
                  className="absolute left-[1px] top-0 w-0.5 bg-peach transition-all duration-300 z-10"
                  style={{ height: `${Math.min(scrollProgress * 230, 100)}%` }}
                />
                <ol className="relative space-y-4 border-l-2 border-dashed border-peach/50 pl-5">
                  {(a.careTimeline || []).map((t, idx) => (
                    <li key={idx} className="relative">
                      <span className="absolute left-[-29px] top-0 flex size-5 items-center justify-center rounded-full bg-peach/20 text-xs border border-peach/40">
                        🐾
                      </span>
                      <p className="text-[8px] font-bold uppercase tracking-wider text-coffee/40">
                        {t.date}
                      </p>
                      <p className="font-display text-base font-bold text-coffee">{t.label}</p>
                      <p className="text-[11px] text-coffee/70 leading-normal">{t.note}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            {/* Health Journey Card */}
            <div className="rounded-3xl border border-coffee/10 bg-white p-6 scrapbook-shadow">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-display text-xl font-bold text-coffee">Health Records</h2>
                <span className="text-xs text-coffee/40">History 🏥</span>
              </div>
              {!a.healthRecords || a.healthRecords.length === 0 ? (
                <p className="text-xs text-coffee/50">No health events recorded yet.</p>
              ) : (
                <ol className="relative space-y-4 border-l-2 border-dashed border-sage/50 pl-5">
                  {a.healthRecords.map((h, idx) => (
                    <li key={idx} className="relative">
                      <span className="absolute left-[-29px] top-0 flex size-5 items-center justify-center rounded-full bg-sage/20 text-xs border border-sage/40">
                        🏥
                      </span>
                      <p className="text-[8px] font-bold uppercase tracking-wider text-coffee/40">
                        {h.date}
                      </p>
                      <p className="font-display text-base font-bold text-coffee flex items-center gap-1.5">
                        <span>{h.type}</span>
                        <span className="text-xs">
                          {h.type === "Vaccination" ? "💉" : h.type === "Checkup" ? "🩺" : "💊"}
                        </span>
                      </p>
                      <p className="text-[11px] text-coffee/70 leading-normal">{h.note}</p>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </div>

          {/* Photo Memories Gallery */}
          <div className="rounded-2xl border border-coffee/10 bg-white p-6 scrapbook-shadow">
            <h2 className="mb-4 font-display text-2xl">{a.name}'s Memories</h2>
            {theirMemories.length === 0 ? (
              <p className="text-sm text-coffee/60">No memories saved yet. Come back soon!</p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {theirMemories.map((m) => (
                  <div
                    key={m.id}
                    className="overflow-hidden rounded-xl border border-coffee/5 bg-cream/40"
                  >
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={m.image}
                        alt={m.title}
                        loading="lazy"
                        className="h-full w-full object-cover"
                        style={a.slug === "coco" ? { objectPosition: "center 25%" } : undefined}
                      />
                    </div>
                    <div className="p-3">
                      <p className="font-display text-lg">{m.title}</p>
                      <p className="text-xs text-coffee/60">
                        {m.date} · {m.location}
                      </p>
                      <p className="mt-2 font-hand text-lg text-coffee/80">"{m.story}"</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Guestbook Section */}
      <section className="mx-auto max-w-5xl px-6 pb-10">
        <div className="rounded-3xl border border-coffee/10 bg-white p-6 scrapbook-shadow sm:p-8">
          <h2 className="font-display text-2xl mb-1">🐾 Pet Guestbook</h2>
          <p className="text-sm text-coffee/70 mb-6">
            Connecting with friends! Let {a.name} know your pet visited them.
          </p>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Form */}
            <form
              onSubmit={handleGuestbookSubmit}
              className="space-y-4 rounded-2xl bg-cream/40 p-5 border border-coffee/5"
            >
              <h3 className="font-display text-lg">Leave a Hello</h3>

              <div className="grid gap-3 sm:grid-cols-3">
                <label className="sm:col-span-2 text-xs font-semibold">
                  Your Pet's Name
                  <input
                    required
                    type="text"
                    maxLength={30}
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Rocky"
                    className="mt-1 w-full rounded-xl border border-coffee/15 bg-white px-3 py-2 text-sm font-normal outline-none focus:border-peach"
                  />
                </label>
                <label className="text-xs font-semibold">
                  Pet Icon
                  <select
                    value={newIcon}
                    onChange={(e) => setNewIcon(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-coffee/15 bg-white px-3 py-2 text-sm font-normal outline-none focus:border-peach"
                  >
                    <option>🐶</option>
                    <option>🐈</option>
                    <option>🐹</option>
                    <option>🐰</option>
                    <option>🦁</option>
                    <option>🦊</option>
                    <option>🦝</option>
                    <option>🐼</option>
                    <option>🐻</option>
                    <option>🐷</option>
                  </select>
                </label>
              </div>

              <label className="block text-xs font-semibold">
                Message
                <textarea
                  required
                  maxLength={200}
                  rows={3}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={`Send ${a.name} some warm updates!`}
                  className="mt-1 w-full rounded-xl border border-coffee/15 bg-white px-3 py-2 text-sm font-normal outline-none focus:border-peach"
                />
              </label>

              <button
                type="submit"
                className="w-full rounded-full bg-coffee py-2 text-xs font-bold text-cream hover:bg-peach hover:text-coffee transition-colors cursor-pointer"
              >
                Send Greeting 💌
              </button>
            </form>

            {/* List */}
            <div className="space-y-4 max-h-[340px] overflow-y-auto pr-2">
              <h3 className="font-display text-lg">Greetings ({comments.length})</h3>
              {comments.length === 0 && (
                <p className="text-sm text-coffee/50 italic">Be the first to say hello!</p>
              )}
              <div className="space-y-3">
                {comments.map((c, i) => (
                  <div
                    key={i}
                    className="relative rounded-2xl border border-coffee/5 bg-cream/20 p-4 scrapbook-shadow"
                  >
                    <div className="washi-tape absolute -top-2 left-4 h-4 w-12 rotate-2 opacity-60" />
                    <div className="flex gap-3">
                      <span className="text-2xl">{c.icon}</span>
                      <div className="min-w-0">
                        <p className="text-sm font-bold">{c.name}</p>
                        <p className="mt-1 font-hand text-lg text-coffee/80 leading-snug">
                          "{c.message}"
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-6 pb-16 pt-8 text-center sm:text-left">
        <Link
          to="/"
          hash="paw-friends"
          className="inline-flex items-center gap-2 rounded-2xl border border-coffee/15 bg-white px-5 py-3 font-display text-sm font-bold text-coffee scrapbook-shadow transition hover:scale-105 active:scale-95 cursor-pointer"
        >
          <span>🏡 ⬅️</span>
          <span>Back to Village Scrapbook</span>
        </Link>
      </div>
    </PageShell>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-coffee/50">{label}</dt>
      <dd className="text-right font-semibold">{value}</dd>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: string; label: string; value: number }) {
  return (
    <div className="rounded-xl bg-cream/60 p-3">
      <div className="text-2xl">{icon}</div>
      <p className="font-display text-xl">{value}</p>
      <p className="text-[10px] uppercase tracking-widest text-coffee/50">{label}</p>
    </div>
  );
}
