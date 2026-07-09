import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/pawbook/SiteChrome";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "The human behind PawBook · Sejal" },
      {
        name: "description",
        content:
          "PawBook was built with technology and kindness by Sejal, to remember the small lives that cannot tell their own stories.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <PageShell>
      <section className="mx-auto max-w-3xl px-6 pt-14 pb-6 text-center">
        <div className="mb-2 text-sm font-bold uppercase tracking-widest text-coffee/50">
          ❤️ About
        </div>
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl">
          The human behind <span className="text-peach">PawBook</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl font-hand text-2xl text-coffee/80">
          Created by Sejal ❤️
        </p>
        <p className="mx-auto mt-2 max-w-xl text-coffee/70">
          A project built with technology and kindness to save small stories of animals who cannot
          tell their own.
        </p>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-8">
        <div className="rounded-3xl border border-coffee/10 bg-white p-6 scrapbook-shadow sm:p-10">
          <p className="font-hand text-2xl leading-snug text-coffee">
            "Every street animal has a name. Every little life deserves to be remembered."
          </p>
          <p className="mt-4 text-coffee/70">
            PawBook grew out of the belief that the tiny lives passing through our streets — the
            biscuit-loving Brunos, the rooftop-philosopher Kittys, the rain-soaked Tommys — are
            already characters in a story. This is a place to write it down.
          </p>
        </div>

        <div className="mt-8 rounded-3xl border border-coffee/10 bg-white p-6 scrapbook-shadow sm:p-10">
          <p className="text-xs font-bold uppercase tracking-widest text-coffee/60">Built with</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {[
              "React",
              "TypeScript",
              "Tailwind CSS",
              "AI",
              "Authentication",
              "Database",
              "Storage",
            ].map((t) => (
              <span key={t} className="rounded-full bg-cream px-3 py-1 text-sm font-bold">
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/paw-friends"
            className="rounded-full bg-coffee px-5 py-2.5 text-sm font-bold text-cream"
          >
            Meet the friends
          </Link>
          <Link
            to="/garden"
            className="rounded-full border border-coffee/15 bg-white px-5 py-2.5 text-sm font-bold"
          >
            Visit the garden
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
