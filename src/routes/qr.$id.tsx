import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/qr/$id")({
  loader: ({ params }) => {
    let slug = params.id.toLowerCase();
    // Parse PB-SLUG-ID code to extract only the slug
    if (slug.startsWith("pb-")) {
      const parts = slug.split("-");
      slug = parts[1] || "coco";
    }
    throw redirect({
      to: "/paw-friends/$slug",
      params: { slug },
      search: { scan: "qr" },
    });
  },
});
