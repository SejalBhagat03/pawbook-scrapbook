import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { resolveAsset } from "@/lib/storage";
import { mapPlaces, type Animal } from "@/lib/pawbook-data";
import { shareContent } from "@/lib/utils";
import { toast } from "sonner";

type WeaverMode = "story" | "pov" | "caption" | "adoption";

interface ExploreSectionProps {
  animals: Animal[];
  exploreTab: "map" | "weaver";
  setExploreTab: (tab: "map" | "weaver") => void;
  mapFilter: "all" | "safe" | "needs-food" | "needs-care" | "new-friend";
  setMapFilter: (filter: "all" | "safe" | "needs-food" | "needs-care" | "new-friend") => void;
  setFoundPlaceAnimal: (slug: string | null) => void;
  foundPlaceAnimal: string | null;
  mapAnimal: Animal | null | undefined;
  isReunion: boolean;
  weaverSlug: string;
  setWeaverSlug: (slug: string) => void;
  weaverMode: WeaverMode;
  setWeaverMode: (mode: WeaverMode) => void;
  weaverMood: string;
  setWeaverMood: (mood: string) => void;
  onWeaveGenerate: () => void;
  weaverLoading: boolean;
  weaverError: string | null;
  weaverResult: string;
  currentWeaveAnimal: Animal | null;
  showCertificate: boolean;
  playerName: string;
  setPlayerName: (name: string) => void;
}

export function ExploreSection({
  animals,
  exploreTab,
  setExploreTab,
  mapFilter,
  setMapFilter,
  setFoundPlaceAnimal,
  foundPlaceAnimal,
  mapAnimal,
  isReunion,
  weaverSlug,
  setWeaverSlug,
  weaverMode,
  setWeaverMode,
  weaverMood,
  setWeaverMood,
  onWeaveGenerate,
  weaverLoading,
  weaverError,
  weaverResult,
  currentWeaveAnimal,
  showCertificate,
  playerName,
  setPlayerName,
}: ExploreSectionProps) {
  return (
    <motion.section
      id="explore"
      initial={{ opacity: 0, y: 80, rotateX: 6 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ type: "spring", stiffness: 45, damping: 14 }}
      className="mx-auto max-w-6xl px-6 pt-20 pb-4 scroll-mt-24 border border-coffee/5 bg-[#fffdf9] rounded-[2.5rem] scrapbook-shadow-lg p-6 sm:p-10 mb-16 relative overflow-hidden paper"
    >
      <div className="mb-2 text-sm font-bold uppercase tracking-widest text-coffee/50">
        🌈 Explore the World
      </div>
      <h2 className="font-display text-4xl sm:text-5xl">Wander a little</h2>
      <p className="mt-2 max-w-xl text-lg text-coffee/70">
        Two cozy corners to lose yourself in — a village map, and a story-weaver that speaks in a
        paw's voice.
      </p>

      <nav className="mt-8 flex flex-wrap gap-2">
        <button
          onClick={() => setExploreTab("map")}
          className={
            "rounded-full border px-4 py-2 text-sm font-bold transition-colors cursor-pointer " +
            (exploreTab === "map"
              ? "border-coffee bg-coffee text-cream"
              : "border-coffee/15 bg-white text-coffee hover:bg-cream/60")
          }
        >
          🗺️ Paw World Map
        </button>
        <button
          onClick={() => setExploreTab("weaver")}
          className={
            "rounded-full border px-4 py-2 text-sm font-bold transition-colors cursor-pointer " +
            (exploreTab === "weaver"
              ? "border-coffee bg-coffee text-cream"
              : "border-coffee/15 bg-white text-coffee hover:bg-cream/60")
          }
        >
          ✨ Story Weaver
        </button>
      </nav>

      <div className="mt-6">
        {exploreTab === "map" ? (
          /* Paw World Map Component */
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
            {/* Drifting butterflies & falling leaves */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden z-10">
              <div className="absolute top-10 left-10 text-3xl animate-butterfly opacity-85 select-none">
                🦋
              </div>
              <div
                className="absolute top-40 right-20 text-3xl animate-butterfly opacity-65 select-none"
                style={{ animationDelay: "3.5s" }}
              >
                🦋
              </div>
              <div className="absolute top-0 left-1/3 text-2xl animate-falling-leaf opacity-40 select-none">
                🍃
              </div>
              <div
                className="absolute top-0 right-1/4 text-2xl animate-falling-leaf opacity-35 select-none"
                style={{ animationDelay: "4.5s" }}
              >
                🍂
              </div>
            </div>

            <div className="pointer-events-none absolute bottom-6 left-1/4 text-3xl">🌳</div>
            <div className="pointer-events-none absolute bottom-10 right-16 text-3xl">🌸</div>
            <div className="pointer-events-none absolute top-1/2 left-8 text-2xl opacity-70">
              🌿
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2.5 justify-center mb-6">
              {[
                { id: "all", label: "All Friends 🐾" },
                { id: "safe", label: "Safe 💚" },
                { id: "needs-food", label: "Needs Food 🍲" },
                { id: "needs-care", label: "Needs Care 🏥" },
                { id: "new-friend", label: "New Friend ✨" },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setMapFilter(f.id as typeof mapFilter)}
                  className={`squish px-4 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer shadow-2xs ${
                    mapFilter === f.id
                      ? "bg-coffee border-coffee text-cream"
                      : "bg-white border-coffee/10 text-coffee hover:bg-cream"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="relative mx-auto aspect-16/10 w-full rounded-4xl bg-linear-to-b from-sky/40 via-cream/60 to-sage/40">
              {/* Roads */}
              <svg
                className="absolute inset-0 h-full w-full"
                viewBox="0 0 400 250"
                preserveAspectRatio="none"
              >
                <path
                  d="M 0 200 Q 200 100 400 200"
                  className="map-trace-path"
                  stroke="rgba(123,75,50,0.15)"
                  strokeWidth="4"
                  strokeDasharray="8 6"
                  fill="none"
                />
                <path
                  d="M 200 0 Q 240 120 200 250"
                  className="map-trace-path"
                  stroke="rgba(123,75,50,0.15)"
                  strokeWidth="4"
                  strokeDasharray="8 6"
                  fill="none"
                />
              </svg>

              {mapPlaces.map((p) => {
                const a = animals.find((an) => an.slug === p.animals[0]);
                if (!a) return null;

                if (mapFilter !== "all" && a.status !== mapFilter) {
                  return null;
                }

                return (
                  <button
                    key={p.id}
                    onClick={() => setFoundPlaceAnimal(a.slug)}
                    className="group absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300"
                    style={{ top: p.top, left: p.left }}
                    aria-label={`Visit ${p.name}`}
                  >
                    <div className="mb-2 rounded-xl bg-white px-2 py-1 text-center text-[10px] font-bold shadow scrapbook-shadow">
                      <div>
                        {p.icon} {p.name}
                      </div>
                    </div>
                    <div className="mx-auto size-14 overflow-hidden rounded-full border-4 border-white bg-white animate-float shadow-lg transition-transform group-hover:scale-110">
                      <img
                        src={resolveAsset(a.image)}
                        alt={a.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </button>
                );
              })}
            </div>

            <p className="mt-6 text-center text-sm font-bold uppercase tracking-widest text-coffee/60">
              Tap a place · Meet a friend
            </p>

            {mapAnimal && (
              <div className="mt-6 flex justify-center">
                <motion.div
                  initial={{ scale: 0, opacity: 0, rotate: -8 }}
                  animate={{ scale: 1, opacity: 1, rotate: 1.5 }}
                  transition={{ type: "spring", stiffness: 90, damping: 11 }}
                  className="relative border border-coffee/10 bg-white p-4 pb-6 scrapbook-shadow w-full max-w-sm flex gap-4 items-center rounded-2xl"
                >
                  <div className="absolute -top-3.5 left-1/2 z-20 h-5 w-14 -translate-x-1/2 bg-yellow/40 border border-dashed border-yellow/20 opacity-75 shadow-xs animate-pulse" />

                  <div className="w-24 aspect-square overflow-hidden rounded-xl border border-coffee/5 shrink-0 bg-cream">
                    <img
                      src={resolveAsset(mapAnimal.image)}
                      alt={mapAnimal.name}
                      className="size-full object-cover"
                    />
                  </div>

                  <div className="flex-1 text-left space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-display text-lg font-bold text-coffee">
                        {mapAnimal.name} {mapAnimal.emoji}
                      </h4>
                      <span
                        className={`text-[8px] font-bold px-2 py-0.5 rounded-full ${
                          mapAnimal.status === "safe"
                            ? "bg-green-100 text-green-800"
                            : mapAnimal.status === "needs-food"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {mapAnimal.status === "safe"
                          ? "Safe 💚"
                          : mapAnimal.status === "needs-food"
                            ? "Needs Food 🍲"
                            : mapAnimal.status === "needs-care"
                              ? "Needs Care 🏥"
                              : "New Friend 🐾"}
                      </span>
                    </div>
                    <p className="font-hand text-base text-peach">"{mapAnimal.nickname}"</p>
                    <p className="text-[10px] text-coffee/70">📍 {mapAnimal.home}</p>

                    <Link
                      to="/paw-friends/$slug"
                      params={{ slug: mapAnimal.slug }}
                      className="inline-block text-[10px] font-bold text-coffee underline hover:text-peach pt-1"
                    >
                      Open Passport & Stories 📖 →
                    </Link>
                  </div>
                </motion.div>
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
                  <img
                    src={resolveAsset(a.image)}
                    alt=""
                    className="size-12 rounded-full object-cover"
                  />
                  <div className="text-left">
                    <p className="text-sm font-bold">
                      {a.name} {a.emoji}
                    </p>
                    <p className="text-xs text-coffee/60">📍 {a.home}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          /* Story Weaver Component */
          <div className="rounded-3xl border-2 border-dashed border-peach/50 bg-white/80 p-6 scrapbook-shadow sm:p-10">
            {isReunion && (
              <div className="mb-6 rounded-2xl border-2 border-yellow bg-yellow/5 p-4 text-center">
                <span className="text-3xl block mb-1">🌟</span>
                <h3 className="font-display text-lg font-bold text-coffee">
                  Village Picnic Reunion Unlocked!
                </h3>
                <p className="text-xs text-coffee/85 max-w-md mx-auto mt-1">
                  You collected all 4 Village Passport stamps! As a reward, you can weave their
                  reunion picnic adventure.
                </p>
              </div>
            )}

            <p className="text-xs font-bold uppercase tracking-widest text-coffee/60">
              ✨ Story Weaver
            </p>
            <h2 className="mt-1 font-display text-3xl">
              {isReunion
                ? "Gather the village friends for a warm adventure."
                : "Give me a friend, and I'll write in their voice."}
            </h2>

            {!isReunion && (
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-xs font-bold uppercase tracking-widest text-coffee/60">
                    Friend
                  </span>
                  <select
                    value={weaverSlug}
                    onChange={(e) => setWeaverSlug(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-coffee/15 bg-white px-3 py-2 font-bold"
                  >
                    {animals.map((a) => (
                      <option key={a.slug} value={a.slug}>
                        {a.name} {a.emoji} — {a.nickname}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="text-xs font-bold uppercase tracking-widest text-coffee/60">
                    Story kind
                  </span>
                  <select
                    value={weaverMode}
                    onChange={(e) => setWeaverMode(e.target.value as WeaverMode)}
                    className="mt-1 w-full rounded-xl border border-coffee/15 bg-white px-3 py-2 font-bold"
                  >
                    <option value="pov">Animal's POV story</option>
                    <option value="story">Cute little story</option>
                    <option value="caption">Instagram caption</option>
                    <option value="adoption">Adoption story</option>
                  </select>
                </label>
                <label className="block sm:col-span-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-coffee/60">
                    Mood
                  </span>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {["happy", "funny", "emotional", "rain", "rescue", "night"].map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setWeaverMood(m)}
                        className={
                          "rounded-full border px-3 py-1 text-sm font-bold cursor-pointer " +
                          (weaverMood === m
                            ? "border-coffee bg-coffee text-cream"
                            : "border-coffee/15 bg-white hover:bg-cream/60")
                        }
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </label>
              </div>
            )}

            <button
              onClick={onWeaveGenerate}
              disabled={weaverLoading}
              className="mt-6 rounded-2xl bg-coffee px-6 py-3 text-sm font-bold text-cream scrapbook-shadow transition-transform hover:-translate-y-0.5 disabled:opacity-60 cursor-pointer"
            >
              {weaverLoading
                ? "Gathering friends..."
                : isReunion
                  ? "🌟 Weave Reunion Picnic Story"
                  : `✨ Weave a story for ${currentWeaveAnimal?.name || "Friend"}`}
            </button>

            {weaverLoading && (
              <div className="flex gap-1.5 items-center justify-center mt-4">
                <span
                  className="paw-loader-dot text-lg animate-paw-walk"
                  style={{ animationDelay: "0s" }}
                >
                  🐾
                </span>
                <span
                  className="paw-loader-dot text-lg animate-paw-walk"
                  style={{ animationDelay: "0.3s" }}
                >
                  🐾
                </span>
                <span
                  className="paw-loader-dot text-lg animate-paw-walk"
                  style={{ animationDelay: "0.6s" }}
                >
                  🐾
                </span>
                <p className="text-xs text-coffee/50 font-bold tracking-wider ml-1 font-display">
                  Weaving memory...
                </p>
              </div>
            )}

            {weaverError && (
              <p className="mt-4 rounded-xl bg-destructive/10 p-3 text-sm text-destructive">
                {weaverError}
              </p>
            )}
            {weaverResult && (
              <div className="mt-6 rounded-2xl border border-coffee/10 bg-cream/60 p-5">
                <p className="mb-2 text-xs font-bold uppercase tracking-widest text-coffee/50">
                  {isReunion
                    ? "The Village Gathering 🌸"
                    : `A story from ${currentWeaveAnimal?.name || "Friend"} ${currentWeaveAnimal?.emoji || "🐾"}`}
                </p>
                <p className="whitespace-pre-line font-hand text-2xl leading-snug text-coffee">
                  {weaverResult}
                </p>
              </div>
            )}

            {showCertificate && (
              <div className="mt-8 rounded-3xl border-4 border-dashed border-yellow bg-cream/35 p-6 text-center scrapbook-shadow max-w-md mx-auto animate-fade-in relative">
                <span className="text-5xl block animate-pulse">🏅</span>
                <h3 className="font-display text-2xl text-coffee mt-2">
                  Village Protector Certificate
                </h3>
                <p className="text-xs text-coffee/50 font-bold uppercase tracking-wider mt-1">
                  Awarded to
                </p>

                <input
                  type="text"
                  placeholder="Enter your name"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="mt-2 mx-auto block w-64 text-center font-hand text-2xl text-peach bg-transparent border-b-2 border-coffee/20 outline-none focus:border-peach pb-1"
                />

                <p className="text-xs text-coffee/75 mt-4 leading-relaxed">
                  For exploring the village of College Street, finding all 4 friends (Coco, Moti,
                  Kitty, Tommy), and protecting their memories in their digital Scrapbook.
                </p>

                <div className="mt-4 border-t border-coffee/15 pt-3 flex items-center justify-between text-[10px] text-coffee/50 uppercase tracking-widest font-bold">
                  <span>🐾 PawBook Village</span>
                  <span>💮 Collector No. 402</span>
                </div>

                <button
                  onClick={() => {
                    shareContent(
                      {
                        title: "Village Protector Certificate!",
                        text: "I matched with all four friends and earned the Village Protector Certificate on PawBook! 🐾",
                        url: window.location.origin,
                      },
                      () => toast.success("Certificate shared / copied successfully! 🌟"),
                      () =>
                        toast.error(
                          "Could not share automatically. Please share the URL from your browser address bar.",
                        ),
                    );
                  }}
                  className="mt-6 w-full rounded-xl bg-coffee py-2.5 text-xs font-bold text-cream transition hover:scale-105 cursor-pointer"
                >
                  📸 Share Certificate
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.section>
  );
}
