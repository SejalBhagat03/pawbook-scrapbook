import { useState, useEffect } from "react";
import { Link, useRouter } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { useServerFn } from "@tanstack/react-start";
import { useSession } from "@/hooks/use-session";
import { supabase } from "@/integrations/supabase/client";
import { SignedImage, SignedVideo } from "@/components/pawbook/SignedImage";
import {
  submitGuestFriend,
  uploadGuestPhoto,
} from "@/lib/submissions.functions";
import { SectionHeading } from "@/components/pawbook/SiteChrome";
import { resolveAsset } from "@/lib/storage";
import type { Database } from "@/integrations/supabase/types";
import type { User } from "@supabase/supabase-js";

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

const SPECIES_OPTIONS = [
  { label: "Dog", emoji: "🐶" },
  { label: "Cat", emoji: "🐱" },
  { label: "Bird", emoji: "🐦" },
  { label: "Other", emoji: "🐾" },
];

const PERSONALITY_TAGS = [
  { label: "Friendly", emoji: "😊" },
  { label: "Food Lover", emoji: "🍪" },
  { label: "Playful", emoji: "🎾" },
  { label: "Sleepy", emoji: "😴" },
  { label: "Shy", emoji: "🥺" },
  { label: "Needs Care", emoji: "❤️" },
];

function SubmitForm({ user }: { user: User | null }) {
  const submitGuest = useServerFn(submitGuestFriend);
  const uploadPhotoFn = useServerFn(uploadGuestPhoto);
  const router = useRouter();

  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [species, setSpecies] = useState("Dog");
  const [location, setLocation] = useState("");
  const [story, setStory] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [promiseChecked, setPromiseChecked] = useState(false);
  const [busy, setBusy] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(false);

  const selectedSpecies = SPECIES_OPTIONS.find((s) => s.label === species) ?? SPECIES_OPTIONS[0];

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) return;
    setPhoto(file);
    const url = URL.createObjectURL(file);
    setPhotoPreview(url);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = (reader.result as string).split(",")[1];
        resolve(base64);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!photo) {
      toast.error("Please upload an animal photo! 📸");
      return;
    }
    if (!promiseChecked) {
      toast.error("Please check the promise box! 🐾");
      return;
    }

    setBusy(true);
    setUploadProgress(true);
    try {
      const base64Str = await fileToBase64(photo);

      const uploadResult = await uploadPhotoFn({
        data: {
          base64: base64Str,
          fileName: photo.name,
          contentType: photo.type,
        },
      });

      const animalName = name.trim() || "New Paw Friend";
      await submitGuest({
        data: {
          name: animalName,
          species,
          location: location.trim() || undefined,
          story: story.trim(),
          photoRef: uploadResult.path,
          tags: selectedTags,
        },
      });

      confetti({
        particleCount: 80,
        spread: 80,
        colors: ["#7f5539", "#ddb892", "#ffccd5", "#b7b7a4", "#e6ccb2"],
      });

      window.dispatchEvent(new Event("pawbook-trigger-flash"));
      setSubmitted(true);
      router.invalidate();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
      setUploadProgress(false);
    }
  };

  const reset = () => {
    setSubmitted(false);
    setName("");
    setSpecies("Dog");
    setLocation("");
    setStory("");
    setSelectedTags([]);
    setPhoto(null);
    setPhotoPreview(null);
    setPromiseChecked(false);
  };

  if (submitted) {
    return (
      <div className="mx-auto max-w-md text-center py-10 relative">
        <motion.div
          initial={{ scale: 0.3, rotate: -25, y: -200 }}
          animate={{ scale: 1.05, rotate: -1.5, y: 0 }}
          transition={{ type: "spring", stiffness: 80, damping: 12 }}
          className="mx-auto w-64 bg-white border border-coffee/10 scrapbook-shadow p-4 pb-8 rounded-sm relative overflow-hidden -rotate-2"
        >
          <div className="bg-cream/60 border border-coffee/5 p-1 rounded-sm relative">
            <img src={photoPreview || ""} alt="" className="w-full h-44 object-cover rounded-sm" />

            <motion.div
              initial={{ scale: 4, opacity: 0, rotate: -45 }}
              animate={{ scale: 1, opacity: 0.85, rotate: 12 }}
              transition={{ delay: 0.6, type: "spring", stiffness: 150, damping: 10 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none select-none text-[#7f5539]/25 text-[8rem] font-bold"
            >
              🐾
            </motion.div>
          </div>
          <p className="font-display text-sm font-bold text-coffee mt-4">
            {name || "New Paw Friend"}
          </p>
          <span className="text-[10px] bg-peach/15 text-coffee/70 px-2 py-0.5 rounded-full font-bold">
            {selectedSpecies.emoji} {species}
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="space-y-4 mt-8"
        >
          <div className="bg-cream/40 rounded-2xl border border-coffee/10 p-6 max-w-sm mx-auto shadow-sm">
            <h4 className="font-display text-lg font-bold text-coffee">
              Your Paw Friend is waiting for approval 🐾
            </h4>
            <p className="text-xs text-coffee/70 mt-2 leading-relaxed">
              Thank you for saving their memory.
              <br />
              They will join PawBook after review 💛
            </p>
          </div>

          <button
            type="button"
            onClick={reset}
            className="rounded-full bg-coffee px-6 py-2.5 text-xs font-bold text-cream hover:bg-coffee/90 cursor-pointer transition-all hover:scale-105 active:scale-95"
          >
            + Add Another Animal
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-4xl space-y-6">
      <div className="rounded-3xl bg-linear-to-br from-peach/30 via-yellow/20 to-sage/20 border border-coffee/10 p-5 sm:p-6 text-center relative overflow-hidden scrapbook-shadow">
        <div className="absolute top-2 left-4 text-2xl opacity-15 -rotate-12 select-none">🐾</div>
        <div className="absolute bottom-2 right-4 text-2xl opacity-15 rotate-12 select-none">
          🐾
        </div>
        <h3 className="font-display text-xl sm:text-2xl font-bold text-coffee">
          Add Your Animal to PawBook 🐾
        </h3>
        <p className="mt-1 text-xs text-coffee/60 max-w-md mx-auto">
          Share a photo, location, and story. No registration needed! Anyone can add an animal
          friend.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-5 items-start">
        <div className="lg:col-span-3 rounded-3xl border border-coffee/10 bg-white scrapbook-shadow p-5 sm:p-6 space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-coffee/60 block mb-1">
              1. Animal Photo (Required)
            </label>
            <label className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-coffee/20 hover:border-peach/60 hover:bg-peach/5 cursor-pointer p-4 min-h-[120px] transition-all relative">
              {uploadProgress && (
                <div className="absolute inset-0 bg-white/80 z-20 flex flex-col items-center justify-center">
                  <span className="animate-spin text-3xl mb-1">🐾</span>
                  <span className="text-[10px] font-bold text-coffee/60 uppercase">
                    Processing photo...
                  </span>
                </div>
              )}
              {photoPreview ? (
                <div className="flex items-center gap-3 w-full">
                  <img
                    src={photoPreview}
                    alt=""
                    className="size-16 object-cover rounded-lg border border-coffee/10"
                  />
                  <div className="text-left">
                    <p className="text-xs font-bold text-coffee truncate max-w-[180px]">
                      {photo?.name}
                    </p>
                    <p className="text-[10px] text-coffee/50">
                      {(photo?.size ?? 0) / 1024 > 1024
                        ? `${((photo?.size ?? 0) / 1024 / 1024).toFixed(1)} MB`
                        : `${((photo?.size ?? 0) / 1024).toFixed(0)} KB`}
                    </p>
                    <span className="text-[9px] text-peach font-bold uppercase tracking-wide mt-1 block">
                      Click to change
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-1">
                  <span className="text-3xl">🖼️</span>
                  <p className="text-xs font-bold text-coffee/70">Click to choose image</p>
                  <p className="text-[9px] text-coffee/40">PNG, JPG, WEBP supported</p>
                </div>
              )}
              <input
                required
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="sr-only"
              />
            </label>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-coffee/60 block mb-1">
              2. Animal Name
            </label>
            <input
              type="text"
              maxLength={80}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Do they have a name?"
              className="w-full rounded-xl border border-coffee/15 bg-cream/40 px-3 py-2 text-xs outline-none focus:border-peach"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-coffee/60 block mb-1">
              3. Animal Type
            </label>
            <div className="grid grid-cols-4 gap-2">
              {SPECIES_OPTIONS.map((s) => (
                <button
                  key={s.label}
                  type="button"
                  onClick={() => setSpecies(s.label)}
                  className={`flex flex-col items-center gap-1 py-2 rounded-xl border transition-all cursor-pointer hover:scale-105 active:scale-95 ${
                    species === s.label
                      ? "border-peach bg-peach/10 font-bold scale-105"
                      : "border-coffee/10 bg-cream/20 hover:border-coffee/20"
                  }`}
                >
                  <span className="text-2xl">{s.emoji}</span>
                  <span className="text-[10px] text-coffee">{s.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-coffee/60 block mb-1">
              4. Location Seen (Optional)
            </label>
            <input
              type="text"
              maxLength={120}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Where did you meet them?"
              className="w-full rounded-xl border border-coffee/15 bg-cream/40 px-3 py-2 text-xs outline-none focus:border-peach"
            />
            <p className="text-[9px] text-coffee/40 mt-1 italic">
              Examples: Near college gate, Garden area, Street corner
            </p>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-coffee/60 block mb-1">
              5. Small Story / Memory
            </label>
            <textarea
              required
              minLength={10}
              maxLength={2000}
              rows={3}
              value={story}
              onChange={(e) => setStory(e.target.value)}
              placeholder="Tell their little story..."
              className="w-full rounded-xl border border-coffee/15 bg-cream/40 px-3 py-2 text-xs outline-none focus:border-peach resize-none"
            />
            <p className="text-[9px] text-coffee/40 mt-0.5 italic">
              Example: "This little friend waits near my home every morning 💛"
            </p>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-coffee/60 block mb-2">
              6. Personality Tags
            </label>
            <div className="flex flex-wrap gap-1.5">
              {PERSONALITY_TAGS.map((t) => {
                const active = selectedTags.includes(t.label);
                return (
                  <button
                    key={t.label}
                    type="button"
                    onClick={() => toggleTag(t.label)}
                    className={`flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-bold cursor-pointer transition-all ${
                      active
                        ? "border-coffee bg-coffee text-cream scale-105"
                        : "border-coffee/10 bg-white text-coffee hover:border-coffee/30"
                    }`}
                  >
                    <span>{t.emoji}</span> {t.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-2 border-t border-coffee/5">
            <label className="flex items-start gap-2 text-xs text-coffee/70 cursor-pointer select-none">
              <input
                required
                type="checkbox"
                checked={promiseChecked}
                onChange={(e) => setPromiseChecked(e.target.checked)}
                className="mt-0.5 rounded accent-coffee cursor-pointer"
              />
              <span>I promise this is a real animal memory 🐾</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={busy || !promiseChecked || !photo}
            className="w-full rounded-full bg-coffee py-3 text-sm font-bold text-cream hover:bg-coffee/90 disabled:opacity-40 cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
          >
            {busy ? (
              <>
                <span className="animate-spin text-base">🐾</span> Sharing Story…
              </>
            ) : (
              <>Add Their Story To PawBook 🐾</>
            )}
          </button>
        </div>

        <div className="lg:col-span-2 sticky top-24">
          <p className="text-[10px] font-bold uppercase tracking-widest text-coffee/40 mb-3 text-center">
            Live Preview
          </p>
          <motion.div
            animate={{ rotate: 1.5 }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            className="rounded-2xl bg-white border border-coffee/10 scrapbook-shadow overflow-hidden relative p-1"
          >
            <div className="washi-tape absolute -top-3 left-1/2 -translate-x-1/2 z-10 h-6 w-20" />
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-2xl z-10 select-none drop-shadow">
              📌
            </div>

            <div className="bg-cream/60 border border-coffee/5 mx-3 mt-6 mb-1 rounded-sm p-1.5 pb-6">
              {photoPreview ? (
                <img src={photoPreview} alt="" className="w-full h-36 object-cover rounded-sm" />
              ) : (
                <div className="w-full h-36 bg-coffee/5 rounded-sm flex items-center justify-center">
                  <span className="text-4xl opacity-30">{selectedSpecies.emoji}</span>
                </div>
              )}
            </div>

            <div className="px-4 pb-4 space-y-1.5">
              <div className="flex items-center justify-between">
                <p className="font-display text-sm font-bold text-coffee truncate max-w-[120px]">
                  {name.trim() || "New Paw Friend"}
                </p>
                <span className="text-[10px] bg-coffee/5 text-coffee/60 px-2 py-0.5 rounded-full font-bold">
                  {selectedSpecies.emoji} {species}
                </span>
              </div>
              {location.trim() && (
                <p className="text-[9px] text-coffee/50 font-semibold truncate">📍 {location}</p>
              )}

              {selectedTags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {selectedTags.map((t) => (
                    <span
                      key={t}
                      className="text-[8px] bg-peach/15 border border-peach/20 text-coffee/80 px-1.5 py-0.5 rounded-full font-bold"
                    >
                      {PERSONALITY_TAGS.find((pt) => pt.label === t)?.emoji || ""} {t}
                    </span>
                  ))}
                </div>
              )}

              {story.trim() && (
                <p className="text-coffee/70 font-hand text-xs leading-relaxed line-clamp-3 italic">
                  "{story}"
                </p>
              )}
            </div>
          </motion.div>

          <p className="text-[9px] text-coffee/30 text-center mt-3 italic">
            This is how the profile card will look
          </p>
        </div>
      </div>
    </form>
  );
}

function SubmissionSection() {
  const { user, loading } = useSession();
  if (loading) return null;
  return <SubmitForm user={user} />;
}

interface CommunityFriendsProps {
  allSubmissions: FoundFriendRow[];
  speciesFilter: string;
  setSpeciesFilter: (s: string) => void;
  visibleCount: number;
  setVisibleCount: React.Dispatch<React.SetStateAction<number>>;
  CARDS_PER_PAGE: number;
  handleHelpItem: (friend: FoundFriendRow) => void;
}

export function CommunityFriends({
  allSubmissions,
  speciesFilter,
  setSpeciesFilter,
  visibleCount,
  setVisibleCount,
  CARDS_PER_PAGE,
  handleHelpItem,
}: CommunityFriendsProps) {
  return (
    <motion.section
      id="found-friends"
      initial={{ opacity: 0, y: 80, rotateX: 6 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ type: "spring", stiffness: 45, damping: 14 }}
      className="mx-auto max-w-6xl px-6 pt-20 pb-16 scroll-mt-24 border border-coffee/5 bg-[#fffdf9] rounded-[2.5rem] scrapbook-shadow-lg p-6 sm:p-10 mb-16 relative overflow-hidden paper"
    >
      <SectionHeading
        eyebrow="🐾 Add to PawBook"
        title="Your Animal Belongs Here"
        action={
          <button
            onClick={() => {
              document
                .getElementById("share-friend-form")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            className="rounded-full bg-peach px-5 py-2 text-sm font-bold text-coffee hover:scale-105 cursor-pointer animate-pulse"
          >
            + Add Animal
          </button>
        }
      />
      <p className="max-w-2xl text-sm text-coffee/70">
        This is a living community album — every animal you add gets their own profile on PawBook.
        Dogs, cats, birds, cows — all are welcome! 🐦🐈🐕🐄
      </p>

      {/* Species filter pills */}
      {allSubmissions.length > 0 && (() => {
        const speciesOptions = ["all", ...Array.from(new Set(allSubmissions.map(r => r.species?.toLowerCase() || "other")))];
        return (
          <div className="mt-6 flex flex-wrap gap-2 items-center">
            <span className="text-[11px] font-bold uppercase tracking-widest text-coffee/50 mr-1">Filter:</span>
            {speciesOptions.map(sp => (
              <button
                key={sp}
                onClick={() => { setSpeciesFilter(sp); setVisibleCount(CARDS_PER_PAGE); }}
                className={`rounded-full px-3 py-1 text-[11px] font-bold transition-all cursor-pointer border ${
                  speciesFilter === sp
                    ? "bg-coffee text-cream border-coffee"
                    : "bg-white text-coffee/70 border-coffee/15 hover:bg-cream"
                }`}
              >
                {sp === "all" ? "🐾 All" : sp.charAt(0).toUpperCase() + sp.slice(1)}
              </button>
            ))}
            <span className="ml-auto text-[11px] font-bold text-coffee/40">
              {allSubmissions.filter(r => speciesFilter === "all" || (r.species?.toLowerCase() || "other") === speciesFilter).length} friends added
            </span>
          </div>
        );
      })()}

      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 bg-[#e6ccb2]/20 border-4 border-dashed border-[#7f5539] rounded-3xl p-6 relative">
        {allSubmissions.length === 0 && (
          <div className="col-span-full rounded-2xl border border-dashed border-coffee/20 bg-white/50 p-8 text-center text-sm text-coffee/60">
            No community friends yet. Be the first to share one 🌸
          </div>
        )}
        {allSubmissions
          .filter(r => speciesFilter === "all" || (r.species?.toLowerCase() || "other") === speciesFilter)
          .slice(0, visibleCount)
          .map((r, i) => {
            const isLocal = "isLocal" in r && (r as { isLocal: boolean }).isLocal;
            const colors = ["bg-[#fefae0]", "bg-[#e8f5e9]", "bg-[#e1f5fe]", "bg-[#fce4ec]"];
            const noteColor = colors[i % colors.length];

            const { needType, needStatus, cleanStory } = parseHelpBoardItem(r);

            return (
              <motion.article
                key={r.id}
                initial={{ opacity: 0, scale: 0.8, y: -65, rotate: i % 2 === 0 ? -12 : 12 }}
                whileInView={{ opacity: 1, scale: 1, y: 0, rotate: i % 2 === 0 ? -1.5 : 1.5 }}
                viewport={{ once: true }}
                whileHover={{ y: -8, rotate: 0, scale: 1.03 }}
                transition={{ type: "spring", stiffness: 65, damping: 10, delay: i * 0.08 }}
                className={`relative p-5 scrapbook-shadow border border-coffee/10 ${noteColor} rounded-2xl flex flex-col justify-between`}
              >
                {/* Washi Tape Snapping */}
                <div className="washi-tape washi-tape-enter absolute -top-3.5 left-1/2 z-20 h-6 w-20 -translate-x-1/2" />
                {/* Thumbtack */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-2xl z-10 select-none drop-shadow">
                  📌
                </div>

                {isLocal && (
                  <div className="absolute top-2.5 right-2.5 z-10 rounded-full bg-sage px-2 py-0.5 text-[8px] font-bold text-coffee shadow-xs">
                    🏡 Local
                  </div>
                )}

                <div>
                  {/* Polaroid photo holder */}
                  <div className="border border-coffee/5 bg-white p-2 pb-5 shadow-sm rounded-sm mb-4">
                    <SignedImage
                      storageRef={r.photo_url}
                      alt={r.name}
                      className="h-40 w-full object-cover rounded-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-display text-lg font-bold text-coffee">{r.name}</h3>
                      <span className="rounded-full bg-coffee/5 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-coffee/70">
                        {r.species}
                      </span>
                    </div>

                    {/* Need Type Pill */}
                    <div className="flex flex-wrap gap-1.5 items-center">
                      <span className="rounded-full bg-peach/10 border border-peach/25 px-2 py-0.5 text-[9px] font-bold text-coffee/80">
                        {needType}
                      </span>

                      {/* Help Status Pill */}
                      <span
                        className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${
                          needStatus === "open"
                            ? "bg-red-100 text-red-800"
                            : needStatus === "helping"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                        }`}
                      >
                        {needStatus === "open"
                          ? "🚨 Open / Needs Help"
                          : needStatus === "helping"
                            ? "🟡 Someone Helping"
                            : "💚 Help Completed"}
                      </span>
                    </div>

                    <p className="text-[10px] text-coffee/60 font-semibold mt-1">📍 {r.location}</p>
                    <p className="text-coffee/80 leading-relaxed font-hand text-base">
                      "{cleanStory}"
                    </p>
                    {r.video_url && (
                      <div className="mt-2 border border-coffee/5 bg-white p-1 rounded">
                        <SignedVideo storageRef={r.video_url} className="w-full rounded-sm" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 border-t border-coffee/5 pt-3 flex flex-col gap-2">
                  {/* I Can Help Action Trigger */}
                  {needStatus !== "resolved" && (
                    <button
                      onClick={() => handleHelpItem(r)}
                      className={`squish w-full py-2 rounded-xl text-xs font-bold text-coffee border border-coffee/10 scrapbook-shadow cursor-pointer transition-colors ${
                        needStatus === "helping"
                          ? "bg-[#e6f4ea] hover:bg-green-200"
                          : "bg-[#fcf3ef] hover:bg-peach"
                      }`}
                    >
                      {needStatus === "helping" ? "💚 Mark as Help Completed" : "🍲 I Can Help!"}
                    </button>
                  )}
                  {needStatus === "resolved" && (
                    <button
                      onClick={() => handleHelpItem(r)}
                      className="squish w-full py-2 rounded-xl text-xs font-bold text-coffee/40 bg-cream/40 border border-coffee/5 cursor-pointer hover:bg-cream"
                    >
                      🔄 Reopen Assistance Alert
                    </button>
                  )}

                  {isLocal && (
                    <p className="text-[8px] font-bold text-coffee/40 text-center italic">
                      *Saved to local device cache.
                    </p>
                  )}

                  {/* View full Instagram-style profile */}
                  <Link
                    to="/found-friends/$id"
                    params={{ id: r.id }}
                    className="squish block w-full py-2 rounded-xl text-xs font-bold text-center text-coffee/70 bg-white hover:bg-peach hover:text-coffee border border-coffee/8 cursor-pointer transition-colors"
                  >
                    🐾 View Full Profile →
                  </Link>
                </div>
              </motion.article>
            );
          })}

        {/* Load more button */}
        {allSubmissions.filter(r => speciesFilter === "all" || (r.species?.toLowerCase() || "other") === speciesFilter).length > visibleCount && (
          <div className="col-span-full flex flex-col items-center gap-2 pt-2">
            <button
              onClick={() => setVisibleCount(v => v + CARDS_PER_PAGE)}
              className="squish rounded-2xl bg-coffee/10 px-8 py-3 text-sm font-bold text-coffee hover:bg-coffee/20 border border-coffee/10 cursor-pointer transition-colors"
            >
              🐾 Load More Friends
            </button>
            <p className="text-[10px] text-coffee/40">
              Showing {Math.min(visibleCount, allSubmissions.filter(r => speciesFilter === "all" || (r.species?.toLowerCase() || "other") === speciesFilter).length)} of {allSubmissions.filter(r => speciesFilter === "all" || (r.species?.toLowerCase() || "other") === speciesFilter).length}
            </p>
          </div>
        )}

        {/* Collapse button — shown when expanded beyond first page */}
        {visibleCount > CARDS_PER_PAGE && allSubmissions.filter(r => speciesFilter === "all" || (r.species?.toLowerCase() || "other") === speciesFilter).length <= visibleCount && (
          <div className="col-span-full flex justify-center pt-2">
            <button
              onClick={() => setVisibleCount(CARDS_PER_PAGE)}
              className="squish rounded-2xl bg-coffee/5 px-8 py-2 text-xs font-bold text-coffee/50 hover:bg-coffee/10 border border-coffee/5 cursor-pointer transition-colors"
            >
              ↑ Show less
            </button>
          </div>
        )}
      </div>

      <div id="share-friend-form" className="mt-16">
        <SubmissionSection />
      </div>
    </motion.section>
  );
}
