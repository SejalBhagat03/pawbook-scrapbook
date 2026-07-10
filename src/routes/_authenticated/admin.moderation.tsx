import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PageShell, SectionHeading } from "@/components/pawbook/SiteChrome";
import { SignedImage, SignedVideo } from "@/components/pawbook/SignedImage";
import {
  checkIsAdmin,
  listPendingSubmissions,
  reviewSubmission,
  deleteSubmission,
} from "@/lib/submissions.functions";
import type { Database } from "@/integrations/supabase/types";

type Row = Database["public"]["Tables"]["found_friends"]["Row"];

export const Route = createFileRoute("/_authenticated/admin/moderation")({
  head: () => ({ meta: [{ title: "Moderation — PawBook" }] }),
  component: ModerationPage,
});

const parseSubmissionStory = (storyStr: string) => {
  const guestMatch = storyStr.match(/\[guest:([^\]]+)\]/);
  const tagsMatch = storyStr.match(/\[tags:([^\]]+)\]/);

  const isGuest = guestMatch ? guestMatch[1] === "true" : false;
  const tags = tagsMatch ? tagsMatch[1].split(",").filter(Boolean) : [];

  const cleanStory = storyStr
    .replace(/\[guest:[^\]]+\]/g, "")
    .replace(/\[tags:[^\]]+\]/g, "")
    .replace(/\[type:[^\]]+\]/g, "")
    .replace(/\[status:[^\]]+\]/g, "")
    .trim();

  return { isGuest, tags, cleanStory };
};

function ModerationPage() {
  const router = useRouter();
  const isAdminFn = useServerFn(checkIsAdmin);
  const listFn = useServerFn(listPendingSubmissions);
  const reviewFn = useServerFn(reviewSubmission);
  const deleteFn = useServerFn(deleteSubmission);

  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [rows, setRows] = useState<Row[]>([]);
  const [filter, setFilter] = useState<"pending" | "approved" | "rejected" | "all">("pending");

  useEffect(() => {
    isAdminFn().then((r) => setIsAdmin(r.isAdmin));
  }, [isAdminFn]);

  useEffect(() => {
    if (isAdmin) listFn().then((data) => setRows(data ?? []));
  }, [isAdmin, listFn]);

  async function handleReview(id: string, status: "approved" | "rejected") {
    try {
      await reviewFn({ data: { id, status } });
      if (status === "approved") {
        toast.success("New friend joined PawBook 💛");
      } else {
        toast.success("Submission marked as rejected ❌");
      }
      const data = await listFn();
      setRows(data ?? []);
      router.invalidate();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to review");
    }
  }

  async function handleDelete(id: string) {
    if (
      !confirm(
        "Are you sure you want to permanently delete this submission? This cannot be undone.",
      )
    ) {
      return;
    }
    try {
      await deleteFn({ data: { id } });
      toast.success("Submission deleted permanently 🗑️");
      const data = await listFn();
      setRows(data ?? []);
      router.invalidate();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to delete");
    }
  }

  if (isAdmin === null) {
    return (
      <PageShell>
        <div className="p-10 text-center text-sm text-coffee/60">Checking access…</div>
      </PageShell>
    );
  }

  if (!isAdmin) {
    return (
      <PageShell>
        <div className="mx-auto max-w-md p-10 text-center">
          <div className="text-4xl">🔒</div>
          <h1 className="mt-2 font-display text-2xl">Just for moderators</h1>
          <p className="mt-1 text-sm text-coffee/70">
            Your account doesn't have moderator access. If you should — ask a PawBook admin to grant
            you the <code className="rounded bg-cream/70 px-1">admin</code> role.
          </p>
        </div>
      </PageShell>
    );
  }

  const filtered = filter === "all" ? rows : rows.filter((r) => r.status === filter);

  return (
    <PageShell>
      <div className="mx-auto max-w-5xl px-4 pt-8 sm:px-6">
        <SectionHeading eyebrow="🐾 Paw Requests" title="Animal Moderation Queue" />

        <div className="mb-6 flex flex-wrap gap-2">
          {(["pending", "approved", "rejected", "all"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={
                "rounded-full px-4 py-1.5 text-xs font-bold capitalize transition cursor-pointer " +
                (filter === f ? "bg-coffee text-cream" : "bg-white text-coffee/70 hover:bg-cream")
              }
            >
              {f} {f !== "all" && `(${rows.filter((r) => r.status === f).length})`}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filtered.length === 0 && (
            <div className="rounded-2xl border border-dashed border-coffee/20 bg-white/50 p-8 text-center text-sm text-coffee/60">
              Nothing here right now 🌿
            </div>
          )}
          {filtered.map((r) => {
            const { isGuest, tags, cleanStory } = parseSubmissionStory(r.story);

            return (
              <div
                key={r.id}
                className="scrapbook-shadow flex flex-col gap-4 rounded-2xl bg-white p-4 sm:flex-row border border-coffee/5"
              >
                <div className="relative shrink-0 sm:w-40">
                  <SignedImage
                    storageRef={r.photo_url}
                    alt={r.name}
                    className="h-40 w-full rounded-xl object-cover sm:w-40 border border-coffee/5"
                  />
                  {isGuest && (
                    <span className="absolute top-2 left-2 bg-peach text-coffee text-[8px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                      👤 Guest upload
                    </span>
                  )}
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-display text-xl font-bold text-coffee">{r.name}</h3>
                      <span className="rounded-full bg-sage/40 px-2 py-0.5 text-[9px] font-bold uppercase text-coffee/80">
                        {r.species}
                      </span>
                      <span
                        className={
                          "rounded-full px-2 py-0.5 text-[9px] font-bold uppercase " +
                          (r.status === "pending"
                            ? "bg-yellow/40 text-coffee/70"
                            : r.status === "approved"
                              ? "bg-sage/50 text-coffee/70"
                              : "bg-peach/30 text-coffee/70")
                        }
                      >
                        {r.status}
                      </span>
                    </div>

                    <p className="mt-1 text-[10px] text-coffee/50 font-medium">
                      📍 {r.location} · submitted {new Date(r.created_at).toLocaleString()}
                    </p>

                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {tags.map((t) => (
                          <span
                            key={t}
                            className="bg-cream border border-coffee/10 text-coffee/75 rounded-full px-2 py-0.5 text-[8px] font-semibold"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}

                    <p className="mt-2 text-sm text-coffee/80 italic leading-relaxed">
                      "{cleanStory}"
                    </p>

                    {r.video_url && (
                      <div className="mt-2">
                        <SignedVideo
                          storageRef={r.video_url}
                          className="max-h-56 rounded-lg border border-coffee/5"
                        />
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-coffee/5 flex gap-2 justify-end">
                    {r.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleReview(r.id, "approved")}
                          className="rounded-full bg-sage px-4 py-1.5 text-xs font-bold text-coffee hover:scale-105 cursor-pointer flex items-center gap-1 shadow-xs"
                        >
                          Approve 🐾
                        </button>
                        <button
                          onClick={() => handleReview(r.id, "rejected")}
                          className="rounded-full border border-coffee/20 bg-white px-4 py-1.5 text-xs font-bold text-coffee hover:bg-cream cursor-pointer"
                        >
                          Reject ❌
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleDelete(r.id)}
                      className="rounded-full bg-destructive/10 px-4 py-1.5 text-xs font-bold text-destructive hover:bg-destructive/15 cursor-pointer flex items-center gap-1"
                    >
                      Delete 🗑️
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </PageShell>
  );
}
