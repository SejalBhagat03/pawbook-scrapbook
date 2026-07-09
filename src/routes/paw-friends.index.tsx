import { createFileRoute, redirect, Link } from "@tanstack/react-router";
import { PageShell, SectionHeading } from "@/components/pawbook/SiteChrome";
import { animals } from "@/lib/pawbook-data";

export const Route = createFileRoute("/paw-friends/")({
  beforeLoad: () => {
    throw redirect({ to: "/", hash: "paw-friends", replace: true });
  },
  component: () => null,
});

function PawFriends() {
  return (
    <PageShell>
      <section className="mx-auto max-w-7xl px-6 pt-10 pb-4">
        <div className="mb-2 text-sm font-bold uppercase tracking-widest text-coffee/50">
          🐾 The Village
        </div>
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl">
          Meet the <span className="text-peach">Paw Friends</span>
        </h1>
        <p className="mt-3 max-w-xl text-lg text-coffee/70">
          Every card here is a real little life. Click a friend to open their diary, hear their
          story, and see the tiny moments that make them who they are.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <SectionHeading eyebrow="All friends" title="Say hello 🐾" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {animals.map((a, i) => (
            <Link
              key={a.slug}
              to="/paw-friends/$slug"
              params={{ slug: a.slug }}
              className={`group block border border-coffee/5 bg-white p-3 scrapbook-shadow transition-transform hover:-translate-y-2 hover:rotate-0 ${i % 2 === 0 ? "-rotate-1" : "rotate-1"}`}
            >
              <div className={`relative aspect-square overflow-hidden rounded-sm bg-${a.color}`}>
                <img
                  src={a.image}
                  alt={a.name}
                  loading="lazy"
                  width={600}
                  height={600}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 rounded-full bg-white/95 px-3 py-1 text-[10px] font-bold shadow-sm">
                  {a.mood}
                </div>
              </div>
              <div className="mt-4 space-y-1 px-1 pb-2">
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="font-display text-2xl">
                    {a.name} {a.emoji}
                  </h3>
                  <span
                    className={
                      "text-[10px] font-bold " +
                      (a.status === "safe"
                        ? "text-sage"
                        : a.status === "needs-care"
                          ? "text-yellow-700"
                          : "text-destructive")
                    }
                  >
                    ●{" "}
                    {a.status === "safe"
                      ? "Safe"
                      : a.status === "needs-care"
                        ? "Needs care"
                        : "Emergency"}
                  </span>
                </div>
                <p className="font-hand text-lg text-peach">"{a.nickname}"</p>
                <p className="text-xs text-coffee/60">📍 {a.home}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
