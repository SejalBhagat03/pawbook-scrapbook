import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useServerFn } from "@tanstack/react-start";
import { weaveStory } from "@/lib/ai-story.functions";
import { animals } from "@/lib/pawbook-data";
import { shareContent } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/explore/ai")({
  beforeLoad: ({ search }) => {
    throw redirect({ to: "/", hash: "explore", search, replace: true });
  },
  component: () => null,
});

type Mode = "story" | "pov" | "caption" | "adoption";

function AiPage() {
  const weave = useServerFn(weaveStory);
  const [slug, setSlug] = useState(animals[0].slug);
  const [mode, setMode] = useState<Mode>("pov");
  const [mood, setMood] = useState("happy");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Special Reunion states
  const [isReunion, setIsReunion] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [showCertificate, setShowCertificate] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("reunion") === "true") {
        setIsReunion(true);
        setResult("Click the Weave Reunion button to gather the village friends! 🌟");
      }
    }
  }, []);

  async function onGenerate() {
    setLoading(true);
    setError(null);
    setResult("");
    try {
      if (isReunion) {
        // Special pre-set local collective reunion story
        await new Promise((r) => setTimeout(r, 1200));
        setResult(
          `It was a perfect afternoon in the flower meadow. Bruno arrived first, proudly carrying a packet of Parle-G biscuits. Moti trotted in next, wagging his tail happily. Kitty watched them gracefully from the low branch of a mango tree, and Tommy came sprinting through the grass chasing a yellow butterfly. For the first time, all four friends shared a sunny spot together under the warm sky, happy to be part of the same loving village. 💮🐕🐶🐈🎒🍪`,
        );
        setShowCertificate(true);
      } else {
        const res = await weave({ data: { animalSlug: slug, mode, mood } });
        setResult(res.text);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  const animal = animals.find((a) => a.slug === slug)!;

  return (
    <section className="mx-auto max-w-4xl px-6 py-10">
      <div className="rounded-3xl border-2 border-dashed border-peach/50 bg-white/80 p-6 scrapbook-shadow sm:p-10">
        {isReunion && (
          <div className="mb-6 rounded-2xl border-2 border-yellow bg-yellow/5 p-4 text-center">
            <span className="text-3xl block mb-1">🌟</span>
            <h3 className="font-display text-lg font-bold text-coffee">
              Village Picnic Reunion Unlocked!
            </h3>
            <p className="text-xs text-coffee/85 max-w-md mx-auto mt-1">
              You collected all 4 Village Passport stamps! As a reward, you can weave their reunion
              picnic adventure.
            </p>
          </div>
        )}

        <p className="text-xs font-bold uppercase tracking-widest text-coffee/60">
          ✨ Story Weaver
        </p>
        <h2 className="mt-1 font-display text-3xl">
          {isReunion
            ? "Gather the village friends for a warm adventure."
            : "Give me a friend, and I'll write in their voice."}
        </h2>

        {!isReunion && (
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-xs font-bold uppercase tracking-widest text-coffee/60">
                Friend
              </span>
              <select
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="mt-1 w-full rounded-xl border border-coffee/15 bg-white px-3 py-2 font-bold"
              >
                {animals.map((a) => (
                  <option key={a.slug} value={a.slug}>
                    {a.name} {a.emoji} — {a.nickname}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-xs font-bold uppercase tracking-widest text-coffee/60">
                Story kind
              </span>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value as Mode)}
                className="mt-1 w-full rounded-xl border border-coffee/15 bg-white px-3 py-2 font-bold"
              >
                <option value="pov">Animal's POV story</option>
                <option value="story">Cute little story</option>
                <option value="caption">Instagram caption</option>
                <option value="adoption">Adoption story</option>
              </select>
            </label>
            <label className="block sm:col-span-2">
              <span className="text-xs font-bold uppercase tracking-widest text-coffee/60">
                Mood
              </span>
              <div className="mt-1 flex flex-wrap gap-2">
                {["happy", "funny", "emotional", "rain", "rescue", "night"].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMood(m)}
                    className={
                      "rounded-full border px-3 py-1 text-sm font-bold " +
                      (mood === m
                        ? "border-coffee bg-coffee text-cream"
                        : "border-coffee/15 bg-white hover:bg-cream/60")
                    }
                  >
                    {m}
                  </button>
                ))}
              </div>
            </label>
          </div>
        )}

        <button
          onClick={onGenerate}
          disabled={loading}
          className="mt-6 rounded-2xl bg-coffee px-6 py-3 text-sm font-bold text-cream scrapbook-shadow transition-transform hover:-translate-y-0.5 disabled:opacity-60 cursor-pointer"
        >
          {loading
            ? "Gathering friends..."
            : isReunion
              ? "🌟 Weave Reunion Picnic Story"
              : `✨ Weave a story for ${animal.name}`}
        </button>

        {error && (
          <p className="mt-4 rounded-xl bg-destructive/10 p-3 text-sm text-destructive">{error}</p>
        )}
        {result && (
          <div className="mt-6 rounded-2xl border border-coffee/10 bg-cream/60 p-5">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-coffee/50">
              {isReunion
                ? "The Village Gathering 🌸"
                : `A story from ${animal.name} ${animal.emoji}`}
            </p>
            <p className="whitespace-pre-line font-hand text-2xl leading-snug text-coffee">
              {result}
            </p>
          </div>
        )}

        {showCertificate && (
          <div className="mt-8 rounded-3xl border-4 border-dashed border-yellow bg-cream/35 p-6 text-center scrapbook-shadow max-w-md mx-auto animate-fade-in relative">
            <span className="text-5xl block animate-pulse">🏅</span>
            <h3 className="font-display text-2xl text-coffee mt-2">
              Village Protector Certificate
            </h3>
            <p className="text-xs text-coffee/50 font-bold uppercase tracking-wider mt-1">
              Awarded to
            </p>

            <input
              type="text"
              placeholder="Enter your name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="mt-2 mx-auto block w-64 text-center font-hand text-2xl text-peach bg-transparent border-b-2 border-coffee/20 outline-none focus:border-peach pb-1"
            />

            <p className="text-xs text-coffee/75 mt-4 leading-relaxed">
              For exploring the village of College Street, finding all 4 friends (Bruno, Moti,
              Kitty, Tommy), and protecting their memories in their digital Scrapbook.
            </p>

            <div className="mt-4 border-t border-coffee/15 pt-3 flex items-center justify-between text-[10px] text-coffee/50 uppercase tracking-widest font-bold">
              <span>🐾 PawBook Village</span>
              <span>💮 Collector No. 402</span>
            </div>

            <button
              onClick={() => {
                shareContent(
                  {
                    title: "Village Protector Certificate!",
                    text: "I matched with all four friends and earned the Village Protector Certificate on PawBook! 🐾",
                    url: window.location.origin,
                  },
                  () => toast.success("Certificate shared / copied successfully! 🌟"),
                  () =>
                    toast.error(
                      "Could not share automatically. Please share the URL from your browser address bar.",
                    ),
                );
              }}
              className="mt-6 w-full rounded-xl bg-coffee py-2.5 text-xs font-bold text-cream transition hover:scale-105 cursor-pointer"
            >
              📸 Share Certificate
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
