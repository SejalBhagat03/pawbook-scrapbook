import { createFileRoute, redirect } from "@tanstack/react-router";
import { memories, getAnimal } from "@/lib/pawbook-data";

export const Route = createFileRoute("/explore/diary")({
  beforeLoad: () => {
    throw redirect({ to: "/", hash: "explore", replace: true });
  },
  component: () => null,
});

const entries = [
  {
    date: "Apr 4",
    label: "🐾 Met Coco",
    note: "First met Coco on his birthday in the garden.",
    mood: "happy",
  },
  {
    date: "Feb 22",
    label: "🐈 Met Kitty",
    note: "She watched us from the library balcony.",
    mood: "emotional",
  },
  { date: "Mar 3", label: "🐶 Met Moti", note: "Belly rubs and warm milk.", mood: "happy" },
  {
    date: "May 5",
    label: "🐕 Met Tommy",
    note: "Three months old, already an adventurer.",
    mood: "funny",
  },
  {
    date: "Jul 10",
    label: "❤️ Rescue moment",
    note: "Storm night. Tommy took shelter at the tea shop.",
    mood: "rescue",
  },
  {
    date: "Jul 12",
    label: "🌧 Rain memory",
    note: "A kind lady wiped Tommy dry with her scarf.",
    mood: "rain",
  },
  {
    date: "Jul 15",
    label: "🐯 Coco's Tiger Coat",
    note: "Discovered his beautiful tiger stripes coat pattern.",
    mood: "happy",
  },
  {
    date: "Jul 20",
    label: "💊 Health check",
    note: "The whole village visited the vet. All happy.",
    mood: "emotional",
  },
];

const moodStyles: Record<string, string> = {
  happy: "bg-yellow/50",
  emotional: "bg-peach/50",
  rescue: "bg-peach/60",
  rain: "bg-sky/60",
  funny: "bg-sage/50",
  night: "bg-sky/70",
};

function DiaryPage() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-10">
      <div className="mb-8 text-center">
        <p className="font-hand text-3xl text-peach">Dear diary,</p>
        <p className="mt-1 text-coffee/70">
          Here's everything that happened in the village this year.
        </p>
      </div>

      <ol className="relative space-y-6 border-l-2 border-dashed border-coffee/20 pl-6">
        {entries.map((e, i) => (
          <li
            key={i}
            className={`rounded-2xl border border-coffee/10 p-4 scrapbook-shadow ${moodStyles[e.mood] ?? "bg-white"}`}
          >
            <span className="absolute left-[-13px] flex size-6 items-center justify-center rounded-full bg-coffee text-xs text-cream">
              🐾
            </span>
            <p className="text-xs font-bold uppercase tracking-widest text-coffee/60">{e.date}</p>
            <p className="font-display text-xl">{e.label}</p>
            <p className="mt-1 font-hand text-lg text-coffee/80">{e.note}</p>
          </li>
        ))}
      </ol>

      <div className="mt-12">
        <h2 className="mb-4 font-display text-2xl">Saved memories</h2>
        <div className="space-y-4">
          {memories.map((m) => {
            const a = getAnimal(m.animalSlug);
            return (
              <div
                key={m.id}
                className="flex gap-4 rounded-2xl border border-coffee/10 bg-white p-4 scrapbook-shadow"
              >
                <img src={m.image} alt="" className="size-24 shrink-0 rounded-xl object-cover" />
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-widest text-coffee/60">
                    {m.date}
                  </p>
                  <p className="font-display text-lg">{m.title}</p>
                  <p className="font-hand text-lg text-coffee/80">"{m.story}"</p>
                  <p className="mt-1 text-xs text-coffee/50">
                    with {a?.name} · {m.location}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
