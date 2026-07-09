import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { memories, natureCategories } from "@/lib/pawbook-data";

export const Route = createFileRoute("/explore/nature")({
  beforeLoad: () => {
    throw redirect({ to: "/", hash: "explore", replace: true });
  },
  component: () => null,
});

const naturePosts = [
  {
    title: "Golden hour sky",
    caption: "Everything looks kinder at 6pm.",
    h: 260,
    tone: "yellow" as const,
    icon: "🌤️",
    categoryId: "sky",
  },
  {
    title: "First rain of July",
    caption: "The whole street smelled like earth.",
    h: 340,
    tone: "sky" as const,
    icon: "🌧",
    categoryId: "rain",
  },
  {
    title: "Marigolds by the wall",
    caption: "They're everywhere in October.",
    h: 220,
    tone: "peach" as const,
    icon: "🌼",
    categoryId: "flowers",
  },
  {
    title: "Full moon night",
    caption: "Kitty was awake with me.",
    h: 300,
    tone: "sky" as const,
    icon: "🌙",
    categoryId: "moon",
  },
  {
    title: "Tiny mushroom family",
    caption: "Found after the rain.",
    h: 250,
    tone: "sage" as const,
    icon: "🍄",
    categoryId: "trees",
  },
  {
    title: "Bougainvillea sky",
    caption: "Pink on pink on pink.",
    h: 320,
    tone: "peach" as const,
    icon: "🌸",
    categoryId: "flowers",
  },
  {
    title: "Sleeping butterfly",
    caption: "It rested for three whole minutes.",
    h: 240,
    tone: "sage" as const,
    icon: "🦋",
    categoryId: "creatures",
  },
  {
    title: "Morning fog",
    caption: "The lane disappeared.",
    h: 280,
    tone: "sky" as const,
    icon: "☁️",
    categoryId: "sky",
  },
];

function NaturePage() {
  const [active, setActive] = useState<string | null>(null);

  const filteredPosts = active ? naturePosts.filter((p) => p.categoryId === active) : naturePosts;

  const filteredMemories = active ? memories.filter((m) => m.mood === active) : memories;

  return (
    <section className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActive(null)}
          className={
            "rounded-full border px-4 py-2 text-sm font-bold cursor-pointer " +
            (active === null
              ? "border-coffee bg-coffee text-cream"
              : "border-coffee/15 bg-white text-coffee hover:bg-cream/60")
          }
        >
          ✨ All
        </button>
        {natureCategories.map((c) => (
          <button
            key={c.id}
            onClick={() => setActive(c.id)}
            className={
              "rounded-full border px-4 py-2 text-sm font-bold cursor-pointer " +
              (active === c.id
                ? "border-coffee bg-coffee text-cream"
                : `border-coffee/15 bg-${c.tone}/40 text-coffee hover:opacity-90`)
            }
          >
            {c.icon} {c.name}
          </button>
        ))}
      </div>

      <div className="mt-8 columns-2 gap-4 md:columns-3 lg:columns-4 [column-fill:balance]">
        {filteredPosts.map((p, i) => (
          <div
            key={i}
            className={`mb-4 break-inside-avoid overflow-hidden rounded-2xl border border-coffee/5 bg-${p.tone}/40 scrapbook-shadow`}
          >
            <div className="flex items-center justify-center text-6xl" style={{ height: p.h }}>
              {p.icon}
            </div>
            <div className="border-t border-coffee/10 bg-white/60 p-3">
              <p className="font-display text-lg">{p.title}</p>
              <p className="text-xs text-coffee/60">{p.caption}</p>
            </div>
          </div>
        ))}
        {filteredMemories.map((m) => (
          <div
            key={m.id}
            className="mb-4 break-inside-avoid overflow-hidden rounded-2xl border border-coffee/5 bg-white scrapbook-shadow"
          >
            <img src={m.image} alt={m.title} loading="lazy" className="w-full object-cover" />
            <div className="p-3">
              <p className="font-display text-lg">{m.title}</p>
              <p className="text-xs text-coffee/60">{m.date}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
