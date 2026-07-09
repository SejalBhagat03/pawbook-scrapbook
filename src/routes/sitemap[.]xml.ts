import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { animals } from "@/lib/pawbook-data";

const BASE_URL = "";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries = [
          { path: "/", priority: "1.0", changefreq: "weekly" as const },
          { path: "/paw-friends", priority: "0.9", changefreq: "weekly" as const },
          { path: "/stories", priority: "0.8", changefreq: "daily" as const },
          { path: "/garden", priority: "0.7", changefreq: "weekly" as const },
          { path: "/explore", priority: "0.6", changefreq: "weekly" as const },
          { path: "/explore/map", priority: "0.6", changefreq: "weekly" as const },
          { path: "/explore/nature", priority: "0.6", changefreq: "weekly" as const },
          { path: "/explore/diary", priority: "0.6", changefreq: "weekly" as const },
          { path: "/explore/ai", priority: "0.5", changefreq: "monthly" as const },
          { path: "/about", priority: "0.5", changefreq: "monthly" as const },
          ...animals.map((a) => ({
            path: `/paw-friends/${a.slug}`,
            priority: "0.8",
            changefreq: "weekly" as const,
          })),
        ];
        const xml =
          `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
          entries
            .map(
              (e) =>
                `  <url><loc>${BASE_URL}${e.path}</loc><changefreq>${e.changefreq}</changefreq><priority>${e.priority}</priority></url>`,
            )
            .join("\n") +
          `\n</urlset>`;
        return new Response(xml, {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});
