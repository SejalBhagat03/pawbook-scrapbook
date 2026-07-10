import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { PageShell, SectionHeading } from "@/components/pawbook/SiteChrome";
import { memories, animals, useCMS, updateCMSData } from "@/lib/pawbook-data";

export const Route = createFileRoute("/stories")({
  beforeLoad: () => {
    throw redirect({ to: "/", hash: "stories", replace: true });
  },
  component: () => null,
});

function StoriesPage() {
  const { memories: cmsMemories } = useCMS();
  const [likes, setLikes] = useState<Record<string, number>>({});
  const [commentAuthor, setCommentAuthor] = useState("");
  const [commentTexts, setCommentTexts] = useState<Record<string, string>>({});

  const handleAction = (memoryId: string, type: string, animalName: string) => {
    setLikes((prev) => ({
      ...prev,
      [memoryId]: (prev[memoryId] || 0) + 1,
    }));
    const emojiMap: Record<string, string> = { Boop: "❤️", Treat: "🍪", Hug: "🐾" };
    const emoji = emojiMap[type] || "✨";
    toast.success(`${type} sent! ${animalName} received your love ${emoji}`);
  };

  const handleAddComment = async (memoryId: string) => {
    const text = commentTexts[memoryId] || "";
    if (!commentAuthor.trim() || !text.trim()) {
      toast.error("Please enter your name and comment!");
      return;
    }

    const updatedMemories = cmsMemories.map((mem) => {
      if (mem.id === memoryId) {
        const existingComments = mem.comments || [];
        return {
          ...mem,
          comments: [
            ...existingComments,
            {
              id: `c-${Date.now()}`,
              author: commentAuthor.trim(),
              text: text.trim(),
              date: new Date().toLocaleDateString(),
            },
          ],
        };
      }
      return mem;
    });

    await updateCMSData({ memories: updatedMemories });
    setCommentTexts((prev) => ({
      ...prev,
      [memoryId]: "",
    }));
    toast.success("Comment added to memory! 📖");
  };

  return (
    <PageShell>
      <section className="mx-auto max-w-3xl px-6 pt-10">
        <div className="mb-2 text-sm font-bold uppercase tracking-widest text-coffee/50">
          📖 Paw Feed
        </div>
        <h1 className="font-display text-4xl sm:text-5xl">Today in the village</h1>
        <p className="mt-3 text-lg text-coffee/70">
          Little updates written from a paw's point of view — belly rubs, butterflies, rainy
          afternoons and everything in between.
        </p>
      </section>

      <section className="mx-auto max-w-3xl space-y-8 px-6 py-10">
        <SectionHeading eyebrow="Freshly posted" title="Boop, treat, hug ❤️" />
        {cmsMemories.map((m, i) => {
          const a = animals.find((an) => an.slug === m.animalSlug)!;
          const currentPrints = m.pawPrints + (likes[m.id] || 0);

          return (
            <article
              key={m.id}
              className={`border border-coffee/5 bg-white p-4 sm:p-5 scrapbook-shadow ${i % 3 === 1 ? "rotate-1" : i % 3 === 2 ? "-rotate-1" : ""}`}
            >
              <header className="mb-4 flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <img
                    src={a.image}
                    alt=""
                    className="size-11 shrink-0 rounded-full border-2 border-white object-cover"
                  />
                  <div className="min-w-0">
                    <p className="truncate font-bold">
                      {a.name} {a.emoji}
                    </p>
                    <p className="text-[11px] text-coffee/50">
                      {m.date} · {m.location}
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-cream px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-coffee/60">
                  {moodLabel(m.mood)}
                </span>
              </header>
              <div className="mb-4 overflow-hidden rounded-xl bg-cream">
                <img
                  src={m.image}
                  alt={m.title}
                  loading="lazy"
                  width={1200}
                  height={800}
                  className="aspect-4/3 w-full object-cover"
                />
              </div>
              <p className="mb-4 font-hand text-2xl leading-snug">"{m.story}"</p>
              <div className="flex items-center justify-between border-t border-coffee/5 pt-3">
                <div className="flex flex-wrap gap-3">
                  <ActionButton
                    icon="❤️"
                    label="Boop"
                    onClick={() => handleAction(m.id, "Boop", a.name)}
                  />
                  <ActionButton
                    icon="🍪"
                    label="Treat"
                    onClick={() => handleAction(m.id, "Treat", a.name)}
                  />
                  <ActionButton
                    icon="🐾"
                    label="Hug"
                    onClick={() => handleAction(m.id, "Hug", a.name)}
                  />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-coffee/60">
                  {currentPrints} Paw Prints
                </p>
              </div>
              <div className="mt-4 space-y-2.5 rounded-xl bg-cream/40 p-3">
                <div className="space-y-1.5 max-h-[110px] overflow-y-auto pr-1">
                  {sampleComments(m.animalSlug).map((c) => (
                    <p key={c.author} className="text-xs">
                      <span className="font-bold">{c.author}:</span>{" "}
                      <span className="text-coffee/80">{c.text}</span>
                    </p>
                  ))}
                  {(m.comments || []).map((c) => (
                    <p key={c.id} className="text-xs animate-fade-in">
                      <span className="font-bold">{c.author}:</span>{" "}
                      <span className="text-coffee/80">{c.text}</span>
                      <span className="text-[8px] text-coffee/40 block leading-tight">
                        {c.date}
                      </span>
                    </p>
                  ))}
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleAddComment(m.id);
                  }}
                  className="flex gap-1.5 items-center border-t border-coffee/5 pt-2 mt-2"
                >
                  <input
                    type="text"
                    placeholder="Name"
                    value={commentAuthor}
                    onChange={(e) => setCommentAuthor(e.target.value)}
                    className="w-1/4 rounded-xl border border-coffee/10 bg-white/70 px-2 py-1 text-xs focus:outline-none focus:border-peach"
                  />
                  <input
                    type="text"
                    placeholder="Write a kind word..."
                    value={commentTexts[m.id] || ""}
                    onChange={(e) =>
                      setCommentTexts((prev) => ({ ...prev, [m.id]: e.target.value }))
                    }
                    className="flex-1 rounded-xl border border-coffee/10 bg-white/70 px-2 py-1 text-xs focus:outline-none focus:border-peach"
                  />
                  <button
                    type="submit"
                    className="squish rounded-xl bg-coffee px-3 py-1 text-xs font-bold text-cream cursor-pointer"
                  >
                    Send
                  </button>
                </form>
              </div>
            </article>
          );
        })}
      </section>
    </PageShell>
  );
}

function ActionButton({
  icon,
  label,
  onClick,
}: {
  icon: string;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1 text-xs font-bold transition-transform hover:scale-110 active:scale-95 hover:text-peach cursor-pointer"
    >
      <span className="text-lg">{icon}</span> {label}
    </button>
  );
}

function moodLabel(m: string) {
  const map: Record<string, string> = {
    happy: "😊 Happy",
    emotional: "🥺 Emotional",
    rain: "🌧 Rainy",
    funny: "😂 Funny",
    rescue: "❤️ Rescue",
    night: "🌙 Night",
  };
  return map[m] ?? m;
}

function sampleComments(slug: string) {
  const map: Record<string, { author: string; text: string }[]> = {
    moti: [
      { author: "Coco 🐕", text: "Save some treats for me 🍖" },
      { author: "Kitty 🐈", text: "Cute human friends ❤️" },
    ],
    kitty: [
      { author: "Tommy 🐕", text: "Butterflies are the best friends" },
      { author: "Moti 🐶", text: "I want a rooftop day too" },
    ],
    coco: [
      { author: "Moti 🐶", text: "Friendly tiger behavior 🐯" },
      { author: "Tommy 🐕", text: "Teach me your ways" },
    ],
    tommy: [
      { author: "Coco 🐕", text: "Rainy days are the coziest" },
      { author: "Kitty 🐈", text: "Stay dry little one 🌧" },
    ],
  };
  return map[slug] ?? [];
}
