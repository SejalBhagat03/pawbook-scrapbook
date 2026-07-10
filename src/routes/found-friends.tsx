import { createFileRoute, redirect, Link, useRouter } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { PageShell, SectionHeading } from "@/components/pawbook/SiteChrome";
import { SignedImage, SignedVideo } from "@/components/pawbook/SignedImage";
import { useSession } from "@/hooks/use-session";
import { submitFoundFriend } from "@/lib/submissions.functions";
import { uploadToBucket } from "@/lib/storage";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import type { User } from "@supabase/supabase-js";

type Row = Database["public"]["Tables"]["found_friends"]["Row"];

export const Route = createFileRoute("/found-friends")({
  beforeLoad: () => {
    throw redirect({ to: "/", hash: "found-friends", replace: true });
  },
  component: () => null,
});

function FoundFriendsPage() {
  const data = Route.useLoaderData() as { approved: Row[] };
  const approved = data.approved;
  const [localSubmissions, setLocalSubmissions] = useState<Row[]>([]);

  const loadLocalSubmissions = () => {
    const saved = localStorage.getItem("pawbook-local-submissions");
    if (saved) {
      try {
        setLocalSubmissions(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  };

  useEffect(() => {
    loadLocalSubmissions();
    window.addEventListener("pawbook-local-sub-updated", loadLocalSubmissions);
    return () => {
      window.removeEventListener("pawbook-local-sub-updated", loadLocalSubmissions);
    };
  }, []);

  const allSubmissions = [...localSubmissions, ...approved];

  return (
    <PageShell>
      <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6">
        <SectionHeading
          eyebrow="Community"
          title="I Found A Friend 🐾"
          action={
            <button
              onClick={() => {
                document.getElementById("share")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="rounded-full bg-peach px-5 py-2 text-sm font-bold text-coffee hover:scale-105 cursor-pointer"
            >
              Share yours
            </button>
          }
        />
        <p className="max-w-2xl text-sm text-coffee/70">
          These are little souls people met on the street and wanted to remember. Every story is
          reviewed by our tiny team before it appears here.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 bg-[#e6ccb2]/20 border-4 border-dashed border-[#7f5539] rounded-3xl p-6 relative">
          {allSubmissions.length === 0 && (
            <div className="col-span-full rounded-2xl border border-dashed border-coffee/20 bg-white/50 p-8 text-center text-sm text-coffee/60">
              No community friends yet. Be the first to share one 🌸
            </div>
          )}
          {allSubmissions.map((r, i) => {
            const isLocal = "isLocal" in r && (r as { isLocal: boolean }).isLocal;
            const colors = ["bg-[#fefae0]", "bg-[#e8f5e9]", "bg-[#e1f5fe]", "bg-[#fce4ec]"];
            const rotations = [
              "rotate-1",
              "-rotate-2",
              "rotate-2",
              "-rotate-1",
              "rotate-3",
              "-rotate-3",
            ];
            const noteColor = colors[i % colors.length];
            const rotation = rotations[i % rotations.length];

            return (
              <article
                key={r.id}
                className={`relative p-5 scrapbook-shadow border border-coffee/10 transition-transform hover:scale-103 hover:rotate-0 duration-300 ${noteColor} ${rotation} rounded-xl`}
              >
                {/* Thumbtack */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-2xl z-10 select-none drop-shadow">
                  📌
                </div>

                {isLocal && (
                  <div className="absolute top-2 right-2 z-10 rounded bg-sage px-2 py-0.5 text-[8px] font-bold text-coffee shadow-sm">
                    🏡 Saved to Device
                  </div>
                )}

                {/* Polaroid photo holder */}
                <div className="border border-coffee/5 bg-white p-2 pb-5 shadow-sm rounded-sm mb-4">
                  <SignedImage
                    storageRef={r.photo_url}
                    alt={r.name}
                    className="h-44 w-full object-cover rounded-sm"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-display text-lg">{r.name}</h3>
                    <span className="rounded-full bg-coffee/5 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide">
                      {r.species}
                    </span>
                  </div>
                  <p className="text-[10px] text-coffee/60 font-semibold">📍 {r.location}</p>
                  <p className="text-coffee/80 leading-relaxed font-hand text-base">"{r.story}"</p>
                  {r.video_url && (
                    <div className="mt-2 border border-coffee/5 bg-white p-1 rounded">
                      <SignedVideo storageRef={r.video_url} className="w-full rounded-sm" />
                    </div>
                  )}
                  {isLocal && (
                    <p className="mt-3 text-[9px] font-bold text-coffee/40 italic">
                      *Local copy. Sign in via top menu to publish globally!
                    </p>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        <div id="share" className="mt-16">
          <SubmissionSection />
        </div>
      </div>
    </PageShell>
  );
}

function SubmissionSection() {
  const { user, loading } = useSession();
  if (loading) return null;
  return <SubmitForm user={user} />;
}

function SubmitForm({ user }: { user: User | null }) {
  const submit = useServerFn(submitFoundFriend);
  const router = useRouter();
  const [name, setName] = useState("");
  const [species, setSpecies] = useState("Dog");
  const [location, setLocation] = useState("");
  const [story, setStory] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!photo) {
      toast.error("A photo helps us remember them 📸");
      return;
    }
    if (!user?.id) {
      toast.error("Please sign in first to add an animal 🐾");
      return;
    }
    setBusy(true);
    try {
      const { path: photoRef } = await uploadToBucket("animal-photos", photo, user.id);
      let videoRef: string | null = null;
      if (video) {
        const up = await uploadToBucket("pawbook-videos", video, user.id);
        videoRef = up.path;
      }
      await submit({ data: { name, species, location, story, photoRef, videoRef } });
      toast.success("Thank you 🌸 A moderator will review it soon.");
      setName("");
      setLocation("");
      setStory("");
      setPhoto(null);
      setVideo(null);
      router.invalidate();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="scrapbook-shadow mx-auto max-w-2xl rounded-3xl border border-coffee/10 bg-white/90 p-6 sm:p-8"
    >
      <h2 className="font-display text-2xl">Tell us about your new friend</h2>
      <p className="mt-1 text-sm text-coffee/70">A photo, a name, a little story. That's all.</p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-semibold">
          Their name
          <input
            required
            maxLength={80}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Biscuit"
            className="mt-1 w-full rounded-xl border border-coffee/15 bg-cream/40 px-3 py-2 text-sm font-normal outline-none focus:border-peach"
          />
        </label>
        <label className="text-sm font-semibold">
          Species
          <select
            value={species}
            onChange={(e) => setSpecies(e.target.value)}
            className="mt-1 w-full rounded-xl border border-coffee/15 bg-cream/40 px-3 py-2 text-sm font-normal outline-none focus:border-peach"
          >
            <option>Dog</option>
            <option>Cat</option>
            <option>Bird</option>
            <option>Cow</option>
            <option>Other</option>
          </select>
        </label>
        <label className="sm:col-span-2 text-sm font-semibold">
          Where you met
          <input
            required
            maxLength={120}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Behind the tea shop"
            className="mt-1 w-full rounded-xl border border-coffee/15 bg-cream/40 px-3 py-2 text-sm font-normal outline-none focus:border-peach"
          />
        </label>
        <label className="sm:col-span-2 text-sm font-semibold">
          Their little story
          <textarea
            required
            minLength={10}
            maxLength={2000}
            rows={4}
            value={story}
            onChange={(e) => setStory(e.target.value)}
            placeholder="What did they do? How did they look at you?"
            className="mt-1 w-full rounded-xl border border-coffee/15 bg-cream/40 px-3 py-2 text-sm font-normal outline-none focus:border-peach"
          />
        </label>
        <label className="text-sm font-semibold">
          Photo (required)
          <input
            required={!photo}
            type="file"
            accept="image/*"
            onChange={(e) => setPhoto(e.target.files?.[0] ?? null)}
            className="mt-1 w-full text-xs font-normal"
          />
        </label>
        <label className="text-sm font-semibold">
          Video (optional)
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setVideo(e.target.files?.[0] ?? null)}
            className="mt-1 w-full text-xs font-normal"
          />
        </label>
      </div>

      {/* Sign-in gate if not authenticated */}
      {!user && (
        <div className="mt-6 rounded-2xl bg-peach/10 border border-peach/30 p-4 text-center space-y-2">
          <p className="text-sm font-bold text-coffee">🔐 Sign in to add your animal</p>
          <p className="text-xs text-coffee/60">
            A free account lets you track your submissions and get updates.
          </p>
          <Link
            to="/auth"
            className="inline-flex items-center gap-1.5 rounded-full bg-coffee px-5 py-2 text-xs font-bold text-cream hover:bg-coffee/90 cursor-pointer mt-1"
          >
            Sign In / Sign Up →
          </Link>
        </div>
      )}

      <button
        type="submit"
        disabled={busy || !user}
        className="mt-6 w-full rounded-full bg-coffee px-6 py-3 text-sm font-bold text-cream hover:bg-coffee/90 disabled:opacity-50"
      >
        {busy ? "Sending love…" : "Share this friend 🐾"}
      </button>
    </form>
  );
}
