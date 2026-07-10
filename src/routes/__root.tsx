import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportAppError } from "../lib/error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4">
      <div className="max-w-md rounded-3xl border border-coffee/10 bg-white/80 p-8 text-center scrapbook-shadow">
        <div className="text-6xl">🐾</div>
        <h1 className="mt-4 font-display text-4xl text-coffee">Lost in the garden</h1>
        <p className="mt-2 text-sm text-coffee/70">
          This page wandered off chasing a butterfly. Let's head back home together.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-coffee px-5 py-2.5 text-sm font-bold text-cream hover:bg-coffee/90"
        >
          Take me home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportAppError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4">
      <div className="max-w-md rounded-3xl border border-coffee/10 bg-white p-8 text-center scrapbook-shadow">
        <div className="text-5xl">🌧️</div>
        <h1 className="mt-4 font-display text-2xl text-coffee">A tiny storm passed through</h1>
        <p className="mt-2 text-sm text-coffee/70">
          Something didn't load right. Give it another try.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="rounded-full bg-coffee px-5 py-2 text-sm font-bold text-cream hover:bg-coffee/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="rounded-full border border-coffee/20 bg-white px-5 py-2 text-sm font-bold text-coffee hover:bg-cream"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "PawBook — Where Every Paw Has a Story" },
      {
        name: "description",
        content:
          "A cozy digital world where dogs, cats, birds and all animals become characters with their own stories, profiles and diaries.",
      },
      { name: "author", content: "Sejal" },
      { name: "theme-color", content: "#FFF7E8" },
      { property: "og:title", content: "PawBook — Where Every Paw Has a Story" },
      {
        property: "og:description",
        content:
          "Little paws. Big stories. A peaceful place where every animal friend is remembered.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "PawBook — Where Every Paw Has a Story" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}
