import { createFileRoute, redirect, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { PageShell, SectionHeading } from "@/components/pawbook/SiteChrome";
import { memories, animals } from "@/lib/pawbook-data";

export const Route = createFileRoute("/garden")({
  head: () => ({ meta: [{ title: "Kindness Garden — PawBook" }] }),
  component: Garden,
});

function Garden() {
  const totalMemories = memories.length;
  const [flowerStates, setFlowerStates] = useState<Record<number, string>>({});

  const handleFlowerClick = (index: number) => {
    const flowerList = ["🌸", "🌻", "🌼", "🌺", "🌷", "🌹", "🏵️", "💮", "🦄", "🌈"];
    const currentEmoji = flowerStates[index] || ["🌸", "🌻", "🌼", "🌺", "🌷"][index % 5];
    const nextIndex = (flowerList.indexOf(currentEmoji) + 1) % flowerList.length;
    const nextEmoji = flowerList[nextIndex];

    setFlowerStates((prev) => ({
      ...prev,
      [index]: nextEmoji,
    }));

    const messages = [
      "A seed of kindness has sprouted! 🌱",
      "Love is blooming in the meadow! 🌸",
      "You grew a gorgeous flower! 🌻",
      "Your treat to Coco grew this daisy! 🍪",
      "A butterfly sat on your flower! 🦋",
      "The meadow is glowing with colors! 🌈",
    ];
    toast.success(messages[index % messages.length]);
  };
  const totalLove = animals.reduce((s, a) => s + a.stats.pawPrints, 0);
  const totalTreats = animals.reduce((s, a) => s + a.stats.treats, 0);

  const growth =
    totalMemories >= 100
      ? { label: "Paw Forest 🌲", desc: "The village has grown into a full forest of memories." }
      : totalMemories >= 50
        ? { label: "Rainbow 🌈", desc: "The garden is glowing with color today." }
        : totalMemories >= 10
          ? { label: "A big tree 🌳", desc: "Your kindness has grown a whole tree." }
          : { label: "A little flower 🌸", desc: "Every memory adds another petal." };

  return (
    <PageShell>
      <section className="mx-auto max-w-4xl px-6 pt-10 text-center">
        <div className="mb-2 text-sm font-bold uppercase tracking-widest text-coffee/50">
          🌱 Kindness Garden
        </div>
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl">
          Kindness that <span className="text-peach">grows</span>
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-lg text-coffee/70">
          Every memory shared, every treat given, every rescue remembered — plants something small
          in our meadow.
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-12">
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard icon="❤️" label="Love Received" value={totalLove} tone="peach" />
          <StatCard icon="🍪" label="Treats Shared" value={totalTreats} tone="yellow" />
          <StatCard icon="📸" label="Memories Saved" value={totalMemories} tone="sage" />
        </div>

        <div className="relative mt-10 overflow-hidden rounded-3xl border-2 border-dashed border-sage/50 bg-sage/20 p-8 text-center">
          <div className="absolute top-4 right-6 text-4xl animate-float">🦋</div>
          <div
            className="absolute bottom-4 left-6 text-3xl animate-float"
            style={{ animationDelay: "1s" }}
          >
            🐾
          </div>
          <p className="text-xs font-bold uppercase tracking-widest text-coffee/60">
            Your garden today
          </p>
          <h2 className="mt-2 font-display text-4xl sm:text-5xl">{growth.label}</h2>
          <p className="mx-auto mt-2 max-w-md text-coffee/70">{growth.desc}</p>

          <div className="mx-auto mt-8 grid max-w-2xl grid-cols-6 gap-3 sm:grid-cols-10">
            {Array.from({ length: 30 }).map((_, i) => {
              const flowers = ["🌸", "🌻", "🌼", "🌺", "🌷"];
              const currentEmoji = flowerStates[i] || flowers[i % flowers.length];
              const grown = i < totalMemories * 6;
              return (
                <button
                  key={i}
                  onClick={() => handleFlowerClick(i)}
                  className={
                    "flex aspect-square items-center justify-center rounded-xl bg-white text-2xl transition-all hover:scale-115 active:scale-90 cursor-pointer " +
                    (grown ? "opacity-100 animate-float" : "opacity-20")
                  }
                  style={{ animationDelay: `${(i % 5) * 0.3}s` }}
                >
                  {currentEmoji}
                </button>
              );
            })}
          </div>

          <Link
            to="/found-friends"
            className="mt-8 inline-block rounded-full bg-coffee px-6 py-3 text-sm font-bold text-cream scrapbook-shadow transition-transform hover:-translate-y-1"
          >
            Plant another memory
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-16">
        <SectionHeading eyebrow="The gardeners" title="Friends who grew this meadow" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {animals.map((a) => (
            <Link
              key={a.slug}
              to="/paw-friends/$slug"
              params={{ slug: a.slug }}
              className="flex items-center gap-3 rounded-2xl border border-coffee/10 bg-white p-3 scrapbook-shadow transition-transform hover:-translate-y-1"
            >
              <img src={a.image} alt="" className="size-14 rounded-full object-cover" />
              <div className="min-w-0">
                <p className="truncate font-bold">
                  {a.name} {a.emoji}
                </p>
                <p className="text-xs text-coffee/60">
                  {a.stats.memories} memories · {a.stats.pawPrints} love
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </PageShell>
  );
}

function StatCard({
  icon,
  label,
  value,
  tone,
}: {
  icon: string;
  label: string;
  value: number;
  tone: "peach" | "yellow" | "sage";
}) {
  return (
    <div
      className={`rounded-3xl border border-coffee/10 bg-${tone}/40 p-6 text-center scrapbook-shadow`}
    >
      <div className="text-4xl">{icon}</div>
      <p className="mt-2 font-display text-4xl">{value}</p>
      <p className="text-xs font-bold uppercase tracking-widest text-coffee/60">{label}</p>
    </div>
  );
}
