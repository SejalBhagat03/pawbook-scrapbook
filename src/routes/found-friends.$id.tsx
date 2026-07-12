import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { PageShell } from "@/components/pawbook/SiteChrome";
import { SignedImage, SignedVideo } from "@/components/pawbook/SignedImage";
import { supabase } from "@/integrations/supabase/client";
import { copyToClipboard, shareContent } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import type { Database } from "@/integrations/supabase/types";

type FoundFriendRow = Database["public"]["Tables"]["found_friends"]["Row"];

function parseHelpBoardItem(r: FoundFriendRow) {
  const storyStr = r.story || "";
  const typeMatch = storyStr.match(/\[type:([^\]]+)\]/);
  const statusMatch = storyStr.match(/\[status:([^\]]+)\]/);
  const needType = typeMatch ? typeMatch[1] : "Just sharing memory";
  const needStatus = statusMatch ? statusMatch[1] : "open";
  const cleanStory = storyStr
    .replace(/\[type:[^\]]+\]/g, "")
    .replace(/\[status:[^\]]+\]/g, "")
    .trim();
  return { needType, needStatus, cleanStory };
}

export const Route = createFileRoute("/found-friends/$id")({
  loader: async ({ params }): Promise<{ friend: FoundFriendRow }> => {
    // Try Supabase first
    try {
      const { data, error } = await supabase
        .from("found_friends")
        .select("*")
        .eq("id", params.id)
        .maybeSingle();

      if (!error && data) return { friend: data };
    } catch (e) {
      console.warn("Supabase fetch failed, trying localStorage:", e);
    }

    // Fallback: local submissions (pending approval)
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("pawbook-local-submissions");
      if (saved) {
        try {
          const list = JSON.parse(saved) as FoundFriendRow[];
          const found = list.find((r) => r.id === params.id);
          if (found) return { friend: found };
        } catch (e) {
          console.error(e);
        }
      }
    }

    throw notFound();
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Friend not found · PawBook" }] };
    const f = loaderData.friend;
    return {
      meta: [
        { title: `${f.name} · PawBook Community` },
        {
          name: "description",
          content: `Meet ${f.name}, a ${f.species} from ${f.location}. ${f.story}`,
        },
      ],
    };
  },
  component: CommunityAnimalProfile,
  notFoundComponent: () => (
    <PageShell>
      <div className="mx-auto max-w-md px-6 py-24 text-center">
        <div className="text-6xl">🐾</div>
        <h1 className="mt-4 font-display text-3xl">This friend's profile doesn't exist</h1>
        <Link
          to="/"
          hash="found-friends"
          className="mt-6 inline-block font-bold text-peach underline"
        >
          ← Back to Community Friends
        </Link>
      </div>
    </PageShell>
  ),
});

const SPECIES_EMOJI: Record<string, string> = {
  dog: "🐕",
  cat: "🐈",
  bird: "🐦",
  cow: "🐄",
  rabbit: "🐰",
  horse: "🐴",
  goat: "🐐",
  other: "🐾",
};

const SPECIES_GRADIENT: Record<string, string> = {
  dog: "from-yellow/40 to-peach/30",
  cat: "from-peach/40 to-sky/20",
  bird: "from-sky/40 to-sage/30",
  cow: "from-sage/30 to-yellow/20",
  rabbit: "from-peach/30 to-yellow/20",
  default: "from-peach/30 to-sky/30",
};

function CommunityAnimalProfile() {
  const { friend } = Route.useLoaderData() as { friend: FoundFriendRow };
  const { needType, needStatus, cleanStory } = parseHelpBoardItem(friend);

  const speciesKey = friend.species?.toLowerCase() || "other";
  const emoji = SPECIES_EMOJI[speciesKey] || "🐾";
  const gradientClass = SPECIES_GRADIENT[speciesKey] || SPECIES_GRADIENT.default;

  const followKey = `pawbook-comm-follow-${friend.id}`;
  const boopKey = `pawbook-comm-boop-${friend.id}`;
  const helpKey = `pawbook-comm-helped-${friend.id}`;
  const guestbookKey = `pawbook-comm-guestbook-${friend.id}`;

  const [isFollowing, setIsFollowing] = useState(false);
  const [followers, setFollowers] = useState(0);
  const [boops, setBoops] = useState(0);
  const [helpCount, setHelpCount] = useState(0);
  const [comments, setComments] = useState<
    { name: string; icon: string; message: string; date: string }[]
  >([]);
  const [newName, setNewName] = useState("");
  const [newIcon, setNewIcon] = useState("🐾");
  const [newMessage, setNewMessage] = useState("");
  const [showGuestbookForm, setShowGuestbookForm] = useState(false);
  const [boopPop, setBoopPop] = useState(false);

  useEffect(() => {
    setIsFollowing(localStorage.getItem(followKey) === "true");
    setFollowers(parseInt(localStorage.getItem(`${followKey}-count`) || "0", 10));
    setBoops(parseInt(localStorage.getItem(boopKey) || "0", 10));
    setHelpCount(parseInt(localStorage.getItem(helpKey) || "0", 10));

    const saved = localStorage.getItem(guestbookKey);
    if (saved) {
      try {
        setComments(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, [friend.id, followKey, boopKey, helpKey, guestbookKey]);

  const handleFollow = () => {
    const next = !isFollowing;
    setIsFollowing(next);
    const nextCount = followers + (next ? 1 : -1);
    setFollowers(Math.max(0, nextCount));
    localStorage.setItem(followKey, String(next));
    localStorage.setItem(`${followKey}-count`, String(Math.max(0, nextCount)));
    toast.success(next ? `You're now following ${friend.name}! 🐾` : `Unfollowed ${friend.name}`);
  };

  const handleBoop = () => {
    const next = boops + 1;
    setBoops(next);
    localStorage.setItem(boopKey, String(next));
    setBoopPop(true);
    setTimeout(() => setBoopPop(false), 600);
    toast.success(`You booped ${friend.name}! ❤️`);
  };

  const handleHelp = () => {
    const next = helpCount + 1;
    setHelpCount(next);
    localStorage.setItem(helpKey, String(next));
    toast.success(`You've marked helping ${friend.name}! 💚`);
  };

  const handleShare = () => {
    shareContent(
      {
        title: `${friend.name} · PawBook`,
        text: `Meet ${friend.name} on PawBook! 🐾`,
        url: window.location.href,
      },
      () => toast.success("Shared! 🐾"),
      () => {
        copyToClipboard(
          window.location.href,
          () => {},
          () => {},
        );
        toast.success("Link copied! 📋");
      },
    );
  };

  const handleGuestbookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newMessage.trim()) return;
    const newComment = {
      name: newName.trim(),
      icon: newIcon,
      message: newMessage.trim(),
      date: "Just now",
    };
    const updated = [newComment, ...comments];
    setComments(updated);
    localStorage.setItem(guestbookKey, JSON.stringify(updated));
    setNewName("");
    setNewMessage("");
    setShowGuestbookForm(false);
    toast.success(`Message left for ${friend.name}! 🐾`);
  };

  const joinedDate = new Date(friend.created_at).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const statusBadge =
    needStatus === "open"
      ? { text: "🚨 Needs Help", className: "bg-red-100 text-red-700 border-red-200" }
      : needStatus === "helping"
        ? { text: "🟡 Being Helped", className: "bg-yellow-100 text-yellow-700 border-yellow-200" }
        : { text: "💚 Safe & Helped", className: "bg-green-100 text-green-700 border-green-200" };

  // Generate a stable "base" follower count from the name so it's not always 0
  const baseFollowers = (friend.name.charCodeAt(0) || 10) * 7 + 12;

  return (
    <PageShell>
      {/* ── Cover ── */}
      <section className="relative overflow-hidden">
        <Link
          to="/"
          hash="found-friends"
          className="absolute top-4 left-4 sm:top-6 sm:left-6 z-30 group flex items-center gap-2 rounded-2xl border-2 border-dashed border-peach/50 bg-white px-3 py-1.5 sm:px-4 sm:py-2 font-display text-xs sm:text-sm font-bold text-coffee scrapbook-shadow hover:scale-105 active:scale-95 transition-transform cursor-pointer"
        >
          <span className="group-hover:-translate-x-0.5 transition-transform">🏡 🐾</span>
          <span className="hidden sm:inline">Back to Village</span>
        </Link>

        <div
          className={`relative h-48 sm:h-60 md:h-72 bg-linear-to-br ${gradientClass}`}
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 30%, color-mix(in oklab, var(--color-peach) 20%, transparent), transparent 50%), radial-gradient(circle at 80% 60%, color-mix(in oklab, var(--color-sky) 25%, transparent), transparent 55%)",
          }}
        >
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.07] text-[10rem] select-none">
            {emoji}
          </div>
        </div>

        {/* Profile header card */}
        <div className="mx-auto -mt-16 sm:-mt-20 max-w-4xl px-4 sm:px-6">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end">
            {/* Circular avatar */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 80, damping: 14, delay: 0.15 }}
              className="relative shrink-0"
            >
              <div className="washi-tape absolute -top-3 left-1/2 z-20 h-5 w-14 -translate-x-1/2 rotate-3" />
              <div className="rounded-full border-[6px] border-white bg-white scrapbook-shadow relative overflow-hidden size-36 sm:size-44">
                <SignedImage
                  storageRef={friend.photo_url}
                  alt={friend.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-coffee/10 bg-white px-3 py-0.5 text-[11px] font-bold scrapbook-shadow">
                {emoji} {friend.species}
              </span>
            </motion.div>

            {/* Name + meta */}
            <motion.div
              className="flex-1 pb-2 min-w-0"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
            >
              <div className="flex flex-wrap gap-2 mb-2">
                <span
                  className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${statusBadge.className}`}
                >
                  {statusBadge.text}
                </span>
                <span className="rounded-full bg-coffee/5 px-2.5 py-0.5 text-[10px] font-bold text-coffee/60 border border-coffee/10">
                  {needType}
                </span>
              </div>
              <h1 className="font-display text-4xl sm:text-5xl truncate">{friend.name}</h1>
              <p className="text-sm text-coffee/45 font-semibold mt-0.5">
                @{friend.name.toLowerCase().replace(/\s+/g, "-")}.pawbook
              </p>
              <p className="text-xs text-coffee/40 mt-1">
                📍 {friend.location} · Joined {joinedDate}
              </p>

              {/* Action buttons */}
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  onClick={handleFollow}
                  className={`squish rounded-full px-5 py-2 text-sm font-bold transition-all cursor-pointer scrapbook-shadow ${
                    isFollowing
                      ? "bg-cream border-2 border-coffee/20 text-coffee"
                      : "bg-coffee text-cream hover:bg-peach hover:text-coffee"
                  }`}
                >
                  {isFollowing ? "✓ Following" : "+ Follow"}
                </button>
                <motion.button
                  onClick={handleBoop}
                  animate={boopPop ? { scale: [1, 1.3, 1] } : {}}
                  transition={{ duration: 0.3 }}
                  className="squish rounded-full px-4 py-2 text-sm font-bold bg-peach/20 text-coffee hover:bg-peach/40 border border-peach/30 transition-all cursor-pointer"
                >
                  ❤️ Boop{" "}
                  {boops > 0 && <span className="ml-1 text-[10px] opacity-60">{boops}</span>}
                </motion.button>
                {needStatus !== "resolved" && (
                  <button
                    onClick={handleHelp}
                    className="squish rounded-full px-4 py-2 text-sm font-bold bg-sage/20 text-coffee hover:bg-sage/40 border border-sage/30 transition-all cursor-pointer"
                  >
                    🍲 I Can Help
                  </button>
                )}
                <button
                  onClick={handleShare}
                  className="squish rounded-full px-4 py-2 text-sm font-bold bg-white text-coffee hover:bg-cream border border-coffee/10 transition-all cursor-pointer"
                >
                  🔗 Share
                </button>
              </div>
            </motion.div>
          </div>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mt-6 flex gap-6 sm:gap-10 border-t border-b border-coffee/8 py-4"
          >
            {[
              { label: "Posts", value: friend.video_url ? 2 : 1 },
              { label: "Followers", value: baseFollowers + followers },
              { label: "Boops", value: boops },
              { label: "Helpers", value: helpCount },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-display text-2xl sm:text-3xl">{stat.value}</p>
                <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-coffee/45">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Main content ── */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 py-8 grid gap-6 md:grid-cols-3">
        {/* LEFT sidebar */}
        <div className="space-y-4 md:col-span-1">
          {/* Story card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl border border-coffee/10 bg-white p-5 scrapbook-shadow relative overflow-hidden"
          >
            <div className="absolute right-2 bottom-2 text-5xl opacity-[0.05] pointer-events-none">
              📖
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-coffee/50 mb-3">
              📖 Story
            </p>
            <p className="font-hand text-lg leading-relaxed text-coffee/80">"{cleanStory}"</p>
          </motion.div>

          {/* Paw Passport */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="rounded-3xl border border-coffee/10 bg-white p-5 scrapbook-shadow relative overflow-hidden bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[16px_16px]"
          >
            <div className="absolute right-2 bottom-2 text-6xl opacity-[0.04] pointer-events-none rotate-12">
              🪪
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-coffee/50 mb-3">
              🪪 Paw Passport
            </p>
            <div className="space-y-3 text-xs">
              <div className="border-b border-coffee/5 pb-2">
                <p className="text-[9px] uppercase tracking-wider text-coffee/40 font-bold">
                  PawBook Community ID
                </p>
                <p className="font-mono font-bold text-coffee">{`PB-COMM-${friend.id.slice(0, 8).toUpperCase()}`}</p>
              </div>
              <div>
                <p className="text-[9px] uppercase tracking-wider text-coffee/40 font-bold">
                  Species
                </p>
                <p className="font-semibold">
                  {emoji} {friend.species}
                </p>
              </div>
              <div>
                <p className="text-[9px] uppercase tracking-wider text-coffee/40 font-bold">
                  Location
                </p>
                <p className="font-semibold">📍 {friend.location}</p>
              </div>
              <div>
                <p className="text-[9px] uppercase tracking-wider text-coffee/40 font-bold">
                  Shared by
                </p>
                <p className="font-semibold">🧡 {friend.submitted_by || "Anonymous"}</p>
              </div>
              <div>
                <p className="text-[9px] uppercase tracking-wider text-coffee/40 font-bold">Need</p>
                <span className="rounded-full bg-peach/10 border border-peach/25 px-2 py-0.5 text-[9px] font-bold text-coffee/80">
                  {needType}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Help timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="rounded-3xl border border-coffee/10 bg-white p-5 scrapbook-shadow"
          >
            <p className="text-[10px] font-bold uppercase tracking-widest text-coffee/50 mb-3">
              🕐 Timeline
            </p>
            <div className="space-y-3 relative pl-1">
              <div className="absolute left-2.5 top-2 bottom-2 w-px bg-coffee/10" />
              {[
                { icon: "🐾", label: "Added to PawBook", sub: joinedDate },
                needStatus !== "open" && {
                  icon: needStatus === "helping" ? "🟡" : "💚",
                  label: needStatus === "helping" ? "Someone is helping!" : "Help completed!",
                  sub: "Community action",
                },
                helpCount > 0 && {
                  icon: "🍲",
                  label: `${helpCount} helper${helpCount > 1 ? "s" : ""} from this profile`,
                  sub: "Thank you! ❤️",
                },
              ]
                .filter(Boolean)
                .map((item, i) => {
                  if (!item) return null;
                  const it = item as { icon: string; label: string; sub: string };
                  return (
                    <div key={i} className="flex gap-3 items-start relative">
                      <span className="text-lg z-10 bg-white">{it.icon}</span>
                      <div>
                        <p className="text-xs font-bold text-coffee">{it.label}</p>
                        <p className="text-[10px] text-coffee/50">{it.sub}</p>
                      </div>
                    </div>
                  );
                })}
            </div>
          </motion.div>
        </div>

        {/* RIGHT: posts + guestbook */}
        <div className="md:col-span-2 space-y-6">
          {/* Paw Posts grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-[10px] font-bold uppercase tracking-widest text-coffee/50 mb-3">
              📸 Paw Posts
            </p>
            <div className={`grid gap-3 ${friend.video_url ? "grid-cols-2" : "grid-cols-1"}`}>
              {/* Main photo post */}
              <div className="relative rounded-2xl border border-coffee/8 bg-white p-2 pb-6 scrapbook-shadow overflow-hidden group">
                <div className="washi-tape absolute -top-3 left-1/2 z-20 h-5 w-14 -translate-x-1/2 rotate-1" />
                <SignedImage
                  storageRef={friend.photo_url}
                  alt={friend.name}
                  className={`w-full rounded-sm object-cover ${friend.video_url ? "h-52 sm:h-64" : "h-72 sm:h-96"}`}
                />
                <p className="absolute bottom-1.5 left-0 right-0 text-center text-[10px] font-bold text-coffee/45">
                  {friend.name} {emoji}
                </p>
              </div>
              {/* Video post */}
              {friend.video_url && (
                <div className="relative rounded-2xl border border-coffee/8 bg-white p-2 pb-6 scrapbook-shadow overflow-hidden">
                  <div className="washi-tape absolute -top-3 left-1/2 z-20 h-5 w-14 -translate-x-1/2 -rotate-1" />
                  <SignedVideo
                    storageRef={friend.video_url}
                    className="w-full h-52 sm:h-64 rounded-sm object-cover"
                  />
                  <p className="absolute bottom-1.5 left-0 right-0 text-center text-[10px] font-bold text-coffee/45">
                    🎬 Video
                  </p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Guestbook */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl border border-coffee/10 bg-white p-5 scrapbook-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-coffee/50">
                💬 Guestbook ({comments.length})
              </p>
              <button
                onClick={() => setShowGuestbookForm(!showGuestbookForm)}
                className="rounded-full bg-peach/20 px-3 py-1 text-[11px] font-bold text-coffee cursor-pointer hover:bg-peach/40 transition-colors"
              >
                {showGuestbookForm ? "✕ Cancel" : "+ Leave message"}
              </button>
            </div>

            <AnimatePresence>
              {showGuestbookForm && (
                <motion.form
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  onSubmit={handleGuestbookSubmit}
                  className="mb-5 rounded-2xl border border-coffee/10 bg-cream/30 p-4 space-y-3 overflow-hidden"
                >
                  <div className="flex gap-2">
                    <select
                      value={newIcon}
                      onChange={(e) => setNewIcon(e.target.value)}
                      className="rounded-xl border border-coffee/10 bg-white px-2 py-2 text-base cursor-pointer"
                    >
                      {["🐾", "🐶", "🐈", "🐦", "❤️", "🍪", "🌸", "✨", "🏡", "😊"].map((ic) => (
                        <option key={ic} value={ic}>
                          {ic}
                        </option>
                      ))}
                    </select>
                    <input
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="Your name"
                      required
                      className="flex-1 rounded-xl border border-coffee/10 bg-white px-3 py-2 text-sm focus:outline-none focus:border-peach"
                    />
                  </div>
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={`Leave a kind message for ${friend.name}...`}
                    required
                    rows={3}
                    className="w-full rounded-xl border border-coffee/10 bg-white px-3 py-2 text-sm font-hand resize-none focus:outline-none focus:border-peach"
                  />
                  <button
                    type="submit"
                    className="squish w-full rounded-xl bg-coffee text-cream py-2 text-sm font-bold hover:bg-peach hover:text-coffee transition-colors cursor-pointer"
                  >
                    🐾 Send Message
                  </button>
                </motion.form>
              )}
            </AnimatePresence>

            {comments.length === 0 ? (
              <p className="text-center text-sm text-coffee/40 py-6">
                Be the first to leave a kind message! 🌸
              </p>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {comments.map((c, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="flex gap-3 rounded-2xl bg-cream/50 p-3 border border-coffee/5"
                  >
                    <span className="text-2xl shrink-0">{c.icon}</span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-bold text-coffee">{c.name}</p>
                        <p className="text-[10px] text-coffee/40">{c.date}</p>
                      </div>
                      <p className="font-hand text-sm text-coffee/80 mt-0.5 wrap-break-word">
                        {c.message}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </PageShell>
  );
}
