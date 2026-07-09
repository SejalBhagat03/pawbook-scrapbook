import { createFileRoute, redirect, Link } from "@tanstack/react-router";
import { useState } from "react";
import { getAnimal, mapPlaces, animals } from "@/lib/pawbook-data";

export const Route = createFileRoute("/explore/map")({
  beforeLoad: () => {
    throw redirect({ to: "/", hash: "explore", replace: true });
  },
  component: () => null,
});

function MapPage() {
  const [found, setFound] = useState<string | null>(null);
  const animal = found ? getAnimal(found) : null;

  return (
    <section className="mx-auto max-w-6xl px-6 py-10">
      <div className="relative overflow-hidden rounded-[2.5rem] border-4 border-white bg-sage/30 p-6 shadow-2xl sm:p-10">
        <div className="pointer-events-none absolute top-6 left-8 text-4xl animate-drift opacity-70">
          ☁️
        </div>
        <div
          className="pointer-events-none absolute top-16 right-20 text-5xl animate-drift opacity-60"
          style={{ animationDelay: "-8s" }}
        >
          ☁️
        </div>
        <div className="pointer-events-none absolute bottom-6 left-1/4 text-3xl">🌳</div>
        <div className="pointer-events-none absolute bottom-10 right-16 text-3xl">🌸</div>
        <div className="pointer-events-none absolute top-1/2 left-8 text-2xl opacity-70">🌿</div>

        <div className="relative mx-auto aspect-16/10 w-full rounded-4xl bg-linear-to-b from-sky/40 via-cream/60 to-sage/40">
          {/* Roads */}
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 400 250"
            preserveAspectRatio="none"
          >
            <path
              d="M 0 200 Q 200 100 400 200"
              stroke="rgba(123,75,50,0.15)"
              strokeWidth="4"
              strokeDasharray="8 6"
              fill="none"
            />
            <path
              d="M 200 0 Q 240 120 200 250"
              stroke="rgba(123,75,50,0.15)"
              strokeWidth="4"
              strokeDasharray="8 6"
              fill="none"
            />
          </svg>

          {mapPlaces.map((p) => {
            const a = getAnimal(p.animals[0]);
            if (!a) return null;
            return (
              <button
                key={p.id}
                onClick={() => setFound(a.slug)}
                className="group absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                style={{ top: p.top, left: p.left }}
                aria-label={`Visit ${p.name}`}
              >
                <div className="mb-2 rounded-xl bg-white px-2 py-1 text-center text-[10px] font-bold shadow scrapbook-shadow">
                  <div>
                    {p.icon} {p.name}
                  </div>
                </div>
                <div className="mx-auto size-14 overflow-hidden rounded-full border-4 border-white bg-white animate-float shadow-lg transition-transform group-hover:scale-110">
                  <img src={a.image} alt={a.name} className="h-full w-full object-cover" />
                </div>
              </button>
            );
          })}
        </div>

        <p className="mt-6 text-center text-sm font-bold uppercase tracking-widest text-coffee/60">
          Tap a place · Meet a friend
        </p>
      </div>

      {animal && (
        <div className="mt-6 flex flex-col items-center gap-4 rounded-3xl border border-coffee/10 bg-white p-6 text-center scrapbook-shadow sm:flex-row sm:text-left">
          <img src={animal.image} alt={animal.name} className="size-24 rounded-full object-cover" />
          <div className="flex-1">
            <p className="font-hand text-2xl text-peach">You found {animal.name} 🐾</p>
            <p className="mt-1 text-coffee/70">"{animal.story}"</p>
          </div>
          <Link
            to="/paw-friends/$slug"
            params={{ slug: animal.slug }}
            className="rounded-full bg-coffee px-5 py-2.5 text-sm font-bold text-cream"
          >
            Visit profile →
          </Link>
        </div>
      )}

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {animals.map((a) => (
          <Link
            key={a.slug}
            to="/paw-friends/$slug"
            params={{ slug: a.slug }}
            className="flex items-center gap-3 rounded-2xl border border-coffee/10 bg-white p-3 scrapbook-shadow hover:-translate-y-1 transition-transform"
          >
            <img src={a.image} alt="" className="size-12 rounded-full object-cover" />
            <div>
              <p className="text-sm font-bold">
                {a.name} {a.emoji}
              </p>
              <p className="text-xs text-coffee/60">📍 {a.home}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
