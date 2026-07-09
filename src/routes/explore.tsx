import { createFileRoute, redirect, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { PageShell } from "@/components/pawbook/SiteChrome";

export const Route = createFileRoute("/explore")({
  beforeLoad: () => {
    throw redirect({ to: "/", hash: "explore", replace: true });
  },
  component: () => null,
});

const tabs: { to: string; label: string; icon: string; exact?: boolean }[] = [
  { to: "/explore/map", label: "Paw World Map", icon: "🗺️" },
  { to: "/explore/ai", label: "Story Weaver", icon: "✨" },
];

function ExploreLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <PageShell>
      <section className="mx-auto max-w-6xl px-6 pt-10">
        <div className="mb-2 text-sm font-bold uppercase tracking-widest text-coffee/50">
          🌈 Explore the World
        </div>
        <h1 className="font-display text-4xl sm:text-5xl">Wander a little</h1>
        <p className="mt-2 max-w-xl text-lg text-coffee/70">
          Four cozy corners to lose yourself in — a village map, a nature scrapbook, an emotional
          diary, and a story-weaver that speaks in a paw's voice.
        </p>

        <nav className="mt-8 flex flex-wrap gap-2">
          {tabs.map((t) => {
            const active = t.exact
              ? pathname === t.to
              : pathname === t.to || pathname.startsWith(t.to + "/");
            return (
              <Link
                key={t.to}
                to={t.to}
                className={
                  "rounded-full border px-4 py-2 text-sm font-bold transition-colors " +
                  (active
                    ? "border-coffee bg-coffee text-cream"
                    : "border-coffee/15 bg-white text-coffee hover:bg-cream/60")
                }
              >
                {t.icon} {t.label}
              </Link>
            );
          })}
        </nav>
      </section>
      <Outlet />
    </PageShell>
  );
}
