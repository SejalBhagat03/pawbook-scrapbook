import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import {
  animals as defaultAnimals,
  memories as defaultMemories,
  dialogues as defaultDialogues,
  quizQuestions as defaultQuiz,
  spinRewards as defaultSpin,
  surprises as defaultSurprises,
  type Animal,
  type Memory,
  type PetDialogue,
  type QuizQuestion,
  type SpinReward,
  type SurpriseReward,
  type Mood,
  type HealthRecord,
  type CareEvent,
} from "@/lib/pawbook-data";
import { supabase } from "@/integrations/supabase/client";
import { PageShell } from "@/components/pawbook/SiteChrome";
import { SignedImage } from "@/components/pawbook/SignedImage";
import { useServerFn } from "@tanstack/react-start";
import { listPendingSubmissions, reviewSubmission } from "@/lib/submissions.functions";
import type { Database } from "@/integrations/supabase/types";

type FoundFriendRow = Database["public"]["Tables"]["found_friends"]["Row"];

export const Route = createFileRoute("/_authenticated/pet-studio")({
  head: () => ({
    meta: [
      { title: "Pet Studio — Creator Panel" },
      {
        name: "description",
        content: "Manage stories, matching quizzes, spin wheels, and pet profiles.",
      },
    ],
  }),
  component: PetStudioPage,
});

type Tab =
  "dashboard" | "pets" | "memories" | "gallery" | "dialogues" | "games" | "moderation" | "settings";

function PetStudioPage() {
  const getPending = useServerFn(listPendingSubmissions);
  const review = useServerFn(reviewSubmission);

  const [activeTab, setActiveTab] = useState<Tab>("dashboard");

  // CMS States loaded from localStorage
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [dialogues, setDialogues] = useState<PetDialogue[]>([]);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [spinRewards, setSpinRewards] = useState<SpinReward[]>([]);
  const [surprises, setSurprises] = useState<SurpriseReward[]>([]);
  const [localSubmissions, setLocalSubmissions] = useState<FoundFriendRow[]>([]);

  // Analytics
  const [loveStats, setLoveStats] = useState<Record<string, number>>({});
  const [treatStats, setTreatStats] = useState<Record<string, number>>({});

  const loadCMSData = useCallback(async () => {
    const savedAnimals = localStorage.getItem("pawbook-cms-animals");
    const savedMemories = localStorage.getItem("pawbook-cms-memories");
    const savedDialogues = localStorage.getItem("pawbook-cms-dialogues");
    const savedQuiz = localStorage.getItem("pawbook-cms-quiz");
    const savedSpin = localStorage.getItem("pawbook-cms-spinwheel");
    const savedSurprises = localStorage.getItem("pawbook-cms-surprises");

    setAnimals(savedAnimals ? JSON.parse(savedAnimals) : defaultAnimals);
    setMemories(savedMemories ? JSON.parse(savedMemories) : defaultMemories);
    setDialogues(savedDialogues ? JSON.parse(savedDialogues) : defaultDialogues);
    setQuizQuestions(savedQuiz ? JSON.parse(savedQuiz) : defaultQuiz);
    setSpinRewards(savedSpin ? JSON.parse(savedSpin) : defaultSpin);
    setSurprises(savedSurprises ? JSON.parse(savedSurprises) : defaultSurprises);

    try {
      const subs = await getPending();
      setLocalSubmissions(subs || []);
    } catch (e) {
      console.error("Failed to load live Supabase submissions", e);
      const savedSubs = localStorage.getItem("pawbook-local-submissions");
      setLocalSubmissions(savedSubs ? JSON.parse(savedSubs) : []);
    }

    // Load love and treats from local storage
    const love: Record<string, number> = {};
    const treats: Record<string, number> = {};
    defaultAnimals.forEach((a) => {
      love[a.slug] = parseInt(localStorage.getItem(`pawbook-extra-love-${a.slug}`) || "0", 10);
      treats[a.slug] = parseInt(localStorage.getItem(`pawbook-extra-treats-${a.slug}`) || "0", 10);
    });
    setLoveStats(love);
    setTreatStats(treats);
  }, [getPending]);

  useEffect(() => {
    loadCMSData();
  }, [loadCMSData]);

  const saveCMSData = async (
    updatedAnimals: Animal[],
    updatedMemories: Memory[],
    updatedDialogues: PetDialogue[],
    updatedQuiz: QuizQuestion[],
    updatedSpin: SpinReward[],
    updatedSurprises: SurpriseReward[],
  ) => {
    localStorage.setItem("pawbook-cms-animals", JSON.stringify(updatedAnimals));
    localStorage.setItem("pawbook-cms-memories", JSON.stringify(updatedMemories));
    localStorage.setItem("pawbook-cms-dialogues", JSON.stringify(updatedDialogues));
    localStorage.setItem("pawbook-cms-quiz", JSON.stringify(updatedQuiz));
    localStorage.setItem("pawbook-cms-spinwheel", JSON.stringify(updatedSpin));
    localStorage.setItem("pawbook-cms-surprises", JSON.stringify(updatedSurprises));

    setAnimals(updatedAnimals);
    setMemories(updatedMemories);
    setDialogues(updatedDialogues);
    setQuizQuestions(updatedQuiz);
    setSpinRewards(updatedSpin);
    setSurprises(updatedSurprises);

    try {
      const { error } = await supabase
        .from("cms_data")
        .update({
          animals: updatedAnimals,
          memories: updatedMemories,
          dialogues: updatedDialogues,
          quiz_questions: updatedQuiz,
          spin_rewards: updatedSpin,
          surprises: updatedSurprises,
          updated_at: new Date().toISOString(),
        })
        .eq("id", "main");

      if (error) throw error;
      toast.success("CMS configurations saved to Supabase backend! ☁️🐾");
    } catch (e) {
      console.error("Failed to save to Supabase database:", e);
      toast.error("Database save failed. Cached locally in browser.");
    }

    window.dispatchEvent(new Event("pawbook-cms-updated"));
  };

  const handleReset = async () => {
    if (!confirm("Are you sure you want to reset all CMS content to default settings?")) return;

    try {
      const { error } = await supabase
        .from("cms_data")
        .update({
          animals: defaultAnimals,
          memories: defaultMemories,
          dialogues: defaultDialogues,
          quiz_questions: defaultQuiz,
          spin_rewards: defaultSpin,
          surprises: defaultSurprises,
          updated_at: new Date().toISOString(),
        })
        .eq("id", "main");

      if (error) throw error;
      toast.success("Database settings reset to defaults! 🌸");
    } catch (e) {
      console.error(e);
      toast.error("Failed to reset database settings. Resetting local cache only.");
    }

    localStorage.removeItem("pawbook-cms-animals");
    localStorage.removeItem("pawbook-cms-memories");
    localStorage.removeItem("pawbook-cms-dialogues");
    localStorage.removeItem("pawbook-cms-quiz");
    localStorage.removeItem("pawbook-cms-spinwheel");
    localStorage.removeItem("pawbook-cms-surprises");
    loadCMSData();
  };

  // Convert files to Base64 helper
  const handleFileChange = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  };

  // Profile manager states
  const [selectedPetIdx, setSelectedPetIdx] = useState(0);
  const [petFormName, setPetFormName] = useState("");
  const [petFormEmoji, setPetFormEmoji] = useState("");
  const [petFormNickname, setPetFormNickname] = useState("");
  const [petFormBio, setPetFormBio] = useState("");
  const [petFormStory, setPetFormStory] = useState("");
  const [petFormFavFood, setPetFormFavFood] = useState("");
  const [petFormMood, setPetFormMood] = useState("");
  const [petFormPic, setPetFormPic] = useState("");

  const [petFormLastSeen, setPetFormLastSeen] = useState("");
  const [petFormVaccinated, setPetFormVaccinated] = useState(false);
  const [petFormSterilized, setPetFormSterilized] = useState(false);
  const [petFormMedicalNotes, setPetFormMedicalNotes] = useState("");
  const [petFormAgeEst, setPetFormAgeEst] = useState("");
  const [petFormGender, setPetFormGender] = useState("");
  const [petFormBreedType, setPetFormBreedType] = useState("");
  const [petFormKnownSince, setPetFormKnownSince] = useState("");
  const [petFormHomeArea, setPetFormHomeArea] = useState("");
  const [petFormFriendliness, setPetFormFriendliness] = useState(80);
  const [petFormEnergy, setPetFormEnergy] = useState(70);
  const [petFormTrust, setPetFormTrust] = useState(85);
  const [petFormPlayfulness, setPetFormPlayfulness] = useState(75);

  const [petFormHealthRecords, setPetFormHealthRecords] = useState<HealthRecord[]>([]);
  const [petFormCareTimeline, setPetFormCareTimeline] = useState<CareEvent[]>([]);

  const [newHealthDate, setNewHealthDate] = useState("");
  const [newHealthType, setNewHealthType] = useState<
    "Vaccination" | "Checkup" | "Treatment" | "Medicine"
  >("Vaccination");
  const [newHealthNote, setNewHealthNote] = useState("");

  const [newCareDate, setNewCareDate] = useState("");
  const [newCareLabel, setNewCareLabel] = useState("");
  const [newCareNote, setNewCareNote] = useState("");

  const handleAddHealth = () => {
    if (!newHealthDate || !newHealthNote) return;
    const entry = { date: newHealthDate, type: newHealthType, note: newHealthNote };
    setPetFormHealthRecords([...petFormHealthRecords, entry]);
    setNewHealthDate("");
    setNewHealthNote("");
  };

  const handleRemoveHealth = (idx: number) => {
    setPetFormHealthRecords(petFormHealthRecords.filter((_, i) => i !== idx));
  };

  const handleAddCare = () => {
    if (!newCareDate || !newCareLabel || !newCareNote) return;
    const entry = { date: newCareDate, label: newCareLabel, note: newCareNote };
    setPetFormCareTimeline([...petFormCareTimeline, entry]);
    setNewCareDate("");
    setNewCareLabel("");
    setNewCareNote("");
  };

  const handleRemoveCare = (idx: number) => {
    setPetFormCareTimeline(petFormCareTimeline.filter((_, i) => i !== idx));
  };

  useEffect(() => {
    if (animals[selectedPetIdx]) {
      const p = animals[selectedPetIdx];
      setPetFormName(p.name);
      setPetFormEmoji(p.emoji);
      setPetFormNickname(p.nickname);
      setPetFormBio(p.bio);
      setPetFormStory(p.story);
      setPetFormFavFood(p.favoriteFood);
      setPetFormMood(p.mood);
      setPetFormPic(p.image);

      setPetFormLastSeen(p.lastSeenLocation || "");
      setPetFormVaccinated(!!p.vaccinated);
      setPetFormSterilized(!!p.sterilized);
      setPetFormMedicalNotes(p.medicalNotes || "");
      setPetFormAgeEst(p.ageEstimate || "");
      setPetFormGender(p.gender || "");
      setPetFormBreedType(p.breedType || "");
      setPetFormKnownSince(p.knownSince || "");
      setPetFormHomeArea(p.homeArea || "");
      setPetFormFriendliness(p.friendliness || 80);
      setPetFormEnergy(p.energy || 70);
      setPetFormTrust(p.trust || 85);
      setPetFormPlayfulness(p.playfulness || 75);
      setPetFormHealthRecords(p.healthRecords || []);
      setPetFormCareTimeline(p.careTimeline || []);
    }
  }, [selectedPetIdx, animals]);

  const handleUpdatePetProfile = () => {
    const updated = [...animals];
    updated[selectedPetIdx] = {
      ...updated[selectedPetIdx],
      name: petFormName,
      emoji: petFormEmoji,
      nickname: petFormNickname,
      bio: petFormBio,
      story: petFormStory,
      favoriteFood: petFormFavFood,
      mood: petFormMood,
      image: petFormPic,

      lastSeenLocation: petFormLastSeen,
      lastUpdated:
        new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }) + " (Admin)",
      vaccinated: petFormVaccinated,
      sterilized: petFormSterilized,
      medicalNotes: petFormMedicalNotes,
      ageEstimate: petFormAgeEst,
      gender: petFormGender,
      breedType: petFormBreedType,
      knownSince: petFormKnownSince,
      homeArea: petFormHomeArea,
      friendliness: Number(petFormFriendliness),
      energy: Number(petFormEnergy),
      trust: Number(petFormTrust),
      playfulness: Number(petFormPlayfulness),
      healthRecords: petFormHealthRecords,
      careTimeline: petFormCareTimeline,
    };
    saveCMSData(updated, memories, dialogues, quizQuestions, spinRewards, surprises);
    toast.success(`${petFormName}'s profile details updated! 🐾`);
  };

  // Memory manager states
  const [memFormPet, setMemFormPet] = useState("coco");
  const [memFormTitle, setMemFormTitle] = useState("");
  const [memFormStory, setMemFormStory] = useState("");
  const [memFormMood, setMemFormMood] = useState<Mood>("happy");
  const [memFormPic, setMemFormPic] = useState("");
  const [memFormStories, setMemFormStories] = useState(true);
  const [memFormSurprise, setMemFormSurprise] = useState(true);
  const [memFormTimeline, setMemFormTimeline] = useState(true);
  const [memFormSpin, setMemFormSpin] = useState(true);

  const handleAddMemory = () => {
    if (!memFormTitle || !memFormStory) {
      toast.error("Please add a memory title and story text 📖");
      return;
    }
    const newMemory: Memory = {
      id: "mem_" + Date.now(),
      animalSlug: memFormPet,
      title: memFormTitle,
      story: memFormStory,
      image:
        memFormPic ||
        "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=400",
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      location: animals.find((a) => a.slug === memFormPet)?.home || "Village Lane",
      mood: memFormMood,
      pawPrints: 1,
      showInStories: memFormStories,
      showInSurpriseBox: memFormSurprise,
      showInTimeline: memFormTimeline,
      showInSpinWheel: memFormSpin,
    };

    const updated = [newMemory, ...memories];
    saveCMSData(animals, updated, dialogues, quizQuestions, spinRewards, surprises);
    toast.success("New memory published and distributed! 🚀🌸");
    setMemFormTitle("");
    setMemFormStory("");
    setMemFormPic("");
  };

  // Dialogue states
  const [diagPet, setDiagPet] = useState("coco");
  const [diagText, setDiagText] = useState("");
  const [diagEmotion, setDiagEmotion] = useState<PetDialogue["emotion"]>("funny");

  const handleAddDialogue = () => {
    if (!diagText) return;
    const newDiag: PetDialogue = {
      petSlug: diagPet,
      message: diagText,
      emotion: diagEmotion,
    };
    const updated = [newDiag, ...dialogues];
    saveCMSData(animals, memories, updated, quizQuestions, spinRewards, surprises);
    setDiagText("");
    toast.success("Dialogue registered to pet chat bubbles!");
  };

  const handleRemoveDialogue = (idx: number) => {
    const updated = dialogues.filter((_, i) => i !== idx);
    saveCMSData(animals, memories, updated, quizQuestions, spinRewards, surprises);
    toast.success("Dialogue entry deleted.");
  };

  // Game assets additions
  const [spinLabel, setSpinLabel] = useState("");
  const [spinTitle, setSpinTitle] = useState("");
  const [spinContent, setSpinContent] = useState("");
  const [spinColor, setSpinColor] = useState("#FF6F61");
  const [spinIcon, setSpinIcon] = useState("🍪");

  const handleAddSpinReward = () => {
    if (!spinLabel || !spinContent) return;
    const newRew: SpinReward = {
      label: spinLabel,
      color: spinColor,
      icon: spinIcon,
      title: spinTitle || spinLabel,
      content: spinContent,
    };
    const updated = [...spinRewards, newRew];
    saveCMSData(animals, memories, dialogues, quizQuestions, updated, surprises);
    setSpinLabel("");
    setSpinTitle("");
    setSpinContent("");
    toast.success("New segment added to Spin Wheel! 🎡");
  };

  const handleRemoveSpin = (idx: number) => {
    const updated = spinRewards.filter((_, i) => i !== idx);
    saveCMSData(animals, memories, dialogues, quizQuestions, updated, surprises);
    toast.success("Spin segment removed.");
  };

  // Surprise editor
  const [surpTitle, setSurpTitle] = useState("");
  const [surpIcon, setSurpIcon] = useState("🎁");
  const [surpContent, setSurpContent] = useState("");

  const handleAddSurprise = () => {
    if (!surpTitle || !surpContent) return;
    const newSur: SurpriseReward = {
      title: surpTitle,
      icon: surpIcon,
      content: surpContent,
    };
    const updated = [...surprises, newSur];
    saveCMSData(animals, memories, dialogues, quizQuestions, spinRewards, updated);
    setSurpTitle("");
    setSurpContent("");
    toast.success("Surprise pool card created!");
  };

  const handleRemoveSurprise = (idx: number) => {
    const updated = surprises.filter((_, i) => i !== idx);
    saveCMSData(animals, memories, dialogues, quizQuestions, spinRewards, updated);
    toast.success("Surprise card removed.");
  };

  // Moderation triggers
  const handleModerateSub = async (id: string, action: "approve" | "delete") => {
    try {
      if (action === "approve") {
        await review({ data: { id, status: "approved" } });
        toast.success("Memory note approved on database! 🐾");
      } else {
        await review({ data: { id, status: "rejected" } });
        toast.success("Memory note rejected.");
      }
      const subs = await getPending();
      setLocalSubmissions(subs || []);
    } catch (err) {
      console.error(err);
      // Fallback for local storage mock moderation
      let updated: FoundFriendRow[];
      if (action === "approve") {
        updated = localSubmissions.map((s) => (s.id === id ? { ...s, status: "approved" } : s));
        toast.success("Memory note approved locally! 🐾");
      } else {
        updated = localSubmissions.filter((s) => s.id !== id);
        toast.success("Memory note removed locally.");
      }
      localStorage.setItem("pawbook-local-submissions", JSON.stringify(updated));
      setLocalSubmissions(updated);
      window.dispatchEvent(new Event("pawbook-local-sub-updated"));
    }
  };

  return (
    <PageShell>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex flex-col gap-6 md:flex-row">
          {/* Canva Style Creator Sidebar */}
          <aside className="w-full shrink-0 md:w-64 rounded-3xl border border-coffee/10 bg-white p-5 scrapbook-shadow flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center gap-2 border-b border-coffee/5 pb-3">
                <span className="text-3xl">🐾</span>
                <div>
                  <h1 className="font-display text-lg font-bold text-coffee">Pet Studio</h1>
                  <p className="text-[10px] text-coffee/50 font-bold uppercase tracking-wider">
                    Creator Center
                  </p>
                </div>
              </div>
              <nav className="flex flex-col gap-1">
                {[
                  { id: "dashboard", label: "🏠 Dashboard" },
                  { id: "pets", label: "🐾 My Pets" },
                  { id: "memories", label: "📖 Memories" },
                  { id: "gallery", label: "📸 Gallery" },
                  { id: "dialogues", label: "💬 Dialogues" },
                  { id: "games", label: "🎡 Game Content" },
                  {
                    id: "moderation",
                    label: `Paw Requests 🐾${
                      localSubmissions.filter((s) => s.status === "pending").length > 0
                        ? ` (${localSubmissions.filter((s) => s.status === "pending").length})`
                        : ""
                    }`,
                  },
                  { id: "settings", label: "⚙ Settings" },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id as Tab)}
                    className={
                      "w-full text-left rounded-xl px-4 py-2.5 text-xs font-bold transition-all cursor-pointer " +
                      (activeTab === t.id
                        ? "bg-coffee text-cream"
                        : "text-coffee/85 hover:bg-cream/40")
                    }
                  >
                    {t.label}
                  </button>
                ))}
              </nav>{" "}
            </div>

            <div className="pt-6 border-t border-coffee/5 mt-6">
              <button
                onClick={handleReset}
                className="w-full rounded-xl border border-dashed border-destructive/30 py-2 text-[10px] font-bold text-destructive/80 hover:bg-destructive/5 cursor-pointer"
              >
                Reset Database Defaults 🔄
              </button>
            </div>
          </aside>

          {/* Tab Workspace Panels */}
          <main className="flex-1 rounded-3xl border border-coffee/10 bg-white p-6 scrapbook-shadow sm:p-8">
            {/* T1: Overview Dashboard */}
            {activeTab === "dashboard" && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-display text-2xl text-coffee">Overview Analytics</h2>
                  <p className="text-xs text-coffee/60">
                    Live metrics of your digital pet diary content.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <div className="rounded-2xl border border-coffee/5 bg-cream/20 p-4 text-center">
                    <span className="text-2xl block mb-1">🐾</span>
                    <span className="text-2xl font-bold font-display text-coffee">
                      {animals.length}
                    </span>
                    <p className="text-[10px] text-coffee/50 font-bold uppercase tracking-wider mt-1">
                      Total Pets
                    </p>
                  </div>
                  <div className="rounded-2xl border border-coffee/5 bg-cream/20 p-4 text-center">
                    <span className="text-2xl block mb-1">📖</span>
                    <span className="text-2xl font-bold font-display text-coffee">
                      {memories.length}
                    </span>
                    <p className="text-[10px] text-coffee/50 font-bold uppercase tracking-wider mt-1">
                      Memories
                    </p>
                  </div>
                  <div className="rounded-2xl border border-coffee/5 bg-cream/20 p-4 text-center">
                    <span className="text-2xl block mb-1">💬</span>
                    <span className="text-2xl font-bold font-display text-coffee">
                      {dialogues.length}
                    </span>
                    <p className="text-[10px] text-coffee/50 font-bold uppercase tracking-wider mt-1">
                      Quotes
                    </p>
                  </div>
                  <div className="rounded-2xl border border-coffee/5 bg-cream/20 p-4 text-center">
                    <span className="text-2xl block mb-1">❤️</span>
                    <span className="text-2xl font-bold font-display text-coffee">
                      {Object.values(loveStats).reduce((a, b) => a + b, 0) +
                        Object.values(treatStats).reduce((a, b) => a + b, 0)}
                    </span>
                    <p className="text-[10px] text-coffee/50 font-bold uppercase tracking-wider mt-1">
                      Love Recieved
                    </p>
                  </div>
                </div>

                {/* Love Breakdown */}
                <div className="rounded-2xl border border-coffee/10 p-5 space-y-4">
                  <h3 className="font-display text-lg text-coffee">Most Loved Village Pets</h3>
                  <div className="space-y-3">
                    {animals.map((a) => {
                      const total = (loveStats[a.slug] || 0) + (treatStats[a.slug] || 0);
                      return (
                        <div
                          key={a.slug}
                          className="flex items-center justify-between text-xs border-b border-coffee/5 pb-2 last:border-b-0 last:pb-0"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{a.emoji}</span>
                            <span className="font-bold">{a.name}</span>
                            <span className="text-[10px] text-coffee/40">({a.nickname})</span>
                          </div>
                          <span className="font-bold text-peach">❤️ {total} points</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* T2: Pet Profile Editor */}
            {activeTab === "pets" && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-display text-2xl text-coffee">Pet Profile Manager</h2>
                  <p className="text-xs text-coffee/60">
                    Update biography, nicknames, favorites, or current mood.
                  </p>
                </div>

                {/* Pet Selector tabs */}
                <div className="flex gap-2 border-b border-coffee/5 pb-3 overflow-x-auto">
                  {animals.map((a, idx) => (
                    <button
                      key={a.slug}
                      onClick={() => setSelectedPetIdx(idx)}
                      className={
                        "rounded-full px-3 py-1.5 text-xs font-bold transition-all cursor-pointer shrink-0 " +
                        (selectedPetIdx === idx
                          ? "bg-peach text-coffee"
                          : "bg-cream/40 hover:bg-cream")
                      }
                    >
                      {a.emoji} {a.name}
                    </button>
                  ))}
                </div>

                {/* Profile form */}
                <div className="grid gap-4 sm:grid-cols-2 pt-2">
                  <label className="block">
                    <span className="text-[10px] font-bold text-coffee/50 uppercase tracking-wider">
                      Pet Name
                    </span>
                    <input
                      type="text"
                      value={petFormName}
                      onChange={(e) => setPetFormName(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-coffee/15 bg-white px-3 py-2 text-xs font-bold"
                    />
                  </label>
                  <label className="block">
                    <span className="text-[10px] font-bold text-coffee/50 uppercase tracking-wider">
                      Emoji Avatar
                    </span>
                    <input
                      type="text"
                      value={petFormEmoji}
                      onChange={(e) => setPetFormEmoji(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-coffee/15 bg-white px-3 py-2 text-xs font-bold"
                    />
                  </label>
                  <label className="block sm:col-span-2">
                    <span className="text-[10px] font-bold text-coffee/50 uppercase tracking-wider">
                      Subtitle Nickname
                    </span>
                    <input
                      type="text"
                      value={petFormNickname}
                      onChange={(e) => setPetFormNickname(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-coffee/15 bg-white px-3 py-2 text-xs font-bold"
                    />
                  </label>
                  <label className="block sm:col-span-2">
                    <span className="text-[10px] font-bold text-coffee/50 uppercase tracking-wider">
                      Profile Photo (Base64 / URL)
                    </span>
                    <input
                      type="text"
                      value={petFormPic}
                      onChange={(e) => setPetFormPic(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-coffee/15 bg-white px-3 py-2 text-[10px]"
                    />
                    <div className="mt-2 flex items-center gap-3">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const b64 = await handleFileChange(file);
                            setPetFormPic(b64);
                          }
                        }}
                        className="text-[10px]"
                      />
                    </div>
                  </label>
                  <label className="block sm:col-span-2">
                    <span className="text-[10px] font-bold text-coffee/50 uppercase tracking-wider">
                      Biography Bio
                    </span>
                    <textarea
                      rows={2}
                      value={petFormBio}
                      onChange={(e) => setPetFormBio(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-coffee/15 bg-white px-3 py-2 text-xs font-medium"
                    />
                  </label>
                  <label className="block sm:col-span-2">
                    <span className="text-[10px] font-bold text-coffee/50 uppercase tracking-wider">
                      Story Speech Vibe
                    </span>
                    <input
                      type="text"
                      value={petFormStory}
                      onChange={(e) => setPetFormStory(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-coffee/15 bg-white px-3 py-2 text-xs font-bold"
                    />
                  </label>
                  <label className="block">
                    <span className="text-[10px] font-bold text-coffee/50 uppercase tracking-wider">
                      Favorite Snack
                    </span>
                    <input
                      type="text"
                      value={petFormFavFood}
                      onChange={(e) => setPetFormFavFood(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-coffee/15 bg-white px-3 py-2 text-xs font-bold"
                    />
                  </label>
                  <label className="block">
                    <span className="text-[10px] font-bold text-coffee/50 uppercase tracking-wider">
                      Today's Mood Status
                    </span>
                    <input
                      type="text"
                      value={petFormMood}
                      onChange={(e) => setPetFormMood(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-coffee/15 bg-white px-3 py-2 text-xs font-bold"
                    />
                  </label>

                  <label className="block">
                    <span className="text-[10px] font-bold text-coffee/50 uppercase tracking-wider">
                      Last Seen Location
                    </span>
                    <input
                      type="text"
                      value={petFormLastSeen}
                      onChange={(e) => setPetFormLastSeen(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-coffee/15 bg-white px-3 py-2 text-xs font-bold"
                    />
                  </label>

                  <label className="block">
                    <span className="text-[10px] font-bold text-coffee/50 uppercase tracking-wider">
                      Age Est.
                    </span>
                    <input
                      type="text"
                      value={petFormAgeEst}
                      onChange={(e) => setPetFormAgeEst(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-coffee/15 bg-white px-3 py-2 text-xs font-bold"
                    />
                  </label>

                  <label className="block">
                    <span className="text-[10px] font-bold text-coffee/50 uppercase tracking-wider">
                      Gender
                    </span>
                    <input
                      type="text"
                      value={petFormGender}
                      onChange={(e) => setPetFormGender(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-coffee/15 bg-white px-3 py-2 text-xs font-bold"
                    />
                  </label>

                  <label className="block">
                    <span className="text-[10px] font-bold text-coffee/50 uppercase tracking-wider">
                      Breed / Type
                    </span>
                    <input
                      type="text"
                      value={petFormBreedType}
                      onChange={(e) => setPetFormBreedType(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-coffee/15 bg-white px-3 py-2 text-xs font-bold"
                    />
                  </label>

                  <label className="block">
                    <span className="text-[10px] font-bold text-coffee/50 uppercase tracking-wider">
                      Known Since
                    </span>
                    <input
                      type="text"
                      value={petFormKnownSince}
                      onChange={(e) => setPetFormKnownSince(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-coffee/15 bg-white px-3 py-2 text-xs font-bold"
                    />
                  </label>

                  <label className="block">
                    <span className="text-[10px] font-bold text-coffee/50 uppercase tracking-wider">
                      Home Area
                    </span>
                    <input
                      type="text"
                      value={petFormHomeArea}
                      onChange={(e) => setPetFormHomeArea(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-coffee/15 bg-white px-3 py-2 text-xs font-bold"
                    />
                  </label>

                  <div className="sm:col-span-2 grid grid-cols-2 gap-4">
                    <label className="flex items-center gap-2 cursor-pointer border border-coffee/10 bg-white p-2.5 rounded-xl">
                      <input
                        type="checkbox"
                        checked={petFormVaccinated}
                        onChange={(e) => setPetFormVaccinated(e.target.checked)}
                      />
                      <span className="text-xs font-bold text-coffee/70">Vaccinated 💉</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer border border-coffee/10 bg-white p-2.5 rounded-xl">
                      <input
                        type="checkbox"
                        checked={petFormSterilized}
                        onChange={(e) => setPetFormSterilized(e.target.checked)}
                      />
                      <span className="text-xs font-bold text-coffee/70">Sterilized ✂️</span>
                    </label>
                  </div>

                  <label className="block sm:col-span-2">
                    <span className="text-[10px] font-bold text-coffee/50 uppercase tracking-wider">
                      Medical Notes
                    </span>
                    <textarea
                      rows={2}
                      value={petFormMedicalNotes}
                      onChange={(e) => setPetFormMedicalNotes(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-coffee/15 bg-white px-3 py-2 text-xs font-medium"
                    />
                  </label>

                  {/* Sliders */}
                  <div className="sm:col-span-2 grid grid-cols-2 gap-4 border-t border-coffee/5 pt-4">
                    <div className="text-left">
                      <label className="text-[10px] font-bold text-coffee/60 uppercase">
                        Friendliness ({petFormFriendliness}%)
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={petFormFriendliness}
                        onChange={(e) => setPetFormFriendliness(Number(e.target.value))}
                        className="w-full h-1.5 bg-cream rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                    <div className="text-left">
                      <label className="text-[10px] font-bold text-coffee/60 uppercase">
                        Energy ({petFormEnergy}%)
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={petFormEnergy}
                        onChange={(e) => setPetFormEnergy(Number(e.target.value))}
                        className="w-full h-1.5 bg-cream rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                    <div className="text-left">
                      <label className="text-[10px] font-bold text-coffee/60 uppercase">
                        Trust ({petFormTrust}%)
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={petFormTrust}
                        onChange={(e) => setPetFormTrust(Number(e.target.value))}
                        className="w-full h-1.5 bg-cream rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                    <div className="text-left">
                      <label className="text-[10px] font-bold text-coffee/60 uppercase">
                        Playfulness ({petFormPlayfulness}%)
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={petFormPlayfulness}
                        onChange={(e) => setPetFormPlayfulness(Number(e.target.value))}
                        className="w-full h-1.5 bg-cream rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Health records sub-list editor */}
                  <div className="sm:col-span-2 border-t border-coffee/5 pt-4 text-left">
                    <span className="text-[10px] font-bold text-coffee/50 uppercase tracking-wider block mb-2">
                      Medical / Health Journal History ({petFormHealthRecords.length} Entries)
                    </span>
                    <div className="space-y-2 mb-3 max-h-[150px] overflow-y-auto pr-1">
                      {petFormHealthRecords.map((h, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between items-center bg-cream/30 p-2 border border-coffee/5 rounded-xl text-xs"
                        >
                          <div>
                            <span className="font-bold">[{h.date}]</span> {h.type} —{" "}
                            <span className="text-coffee/85">{h.note}</span>
                          </div>
                          <button
                            onClick={() => handleRemoveHealth(idx)}
                            type="button"
                            className="text-red-500 hover:text-red-700 font-bold px-1.5 py-0.5 cursor-pointer"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2 items-center bg-cream/10 p-2.5 rounded-xl border border-dashed border-coffee/10">
                      <input
                        type="text"
                        placeholder="Date (e.g. Jul 20)"
                        value={newHealthDate}
                        onChange={(e) => setNewHealthDate(e.target.value)}
                        className="w-1/4 rounded-lg border border-coffee/10 bg-white px-2 py-1 text-xs"
                      />
                      <select
                        value={newHealthType}
                        onChange={(e) =>
                          setNewHealthType(
                            e.target.value as "Vaccination" | "Checkup" | "Treatment" | "Medicine",
                          )
                        }
                        className="w-1/4 rounded-lg border border-coffee/10 bg-white px-2 py-1 text-xs"
                      >
                        <option>Vaccination</option>
                        <option>Checkup</option>
                        <option>Treatment</option>
                        <option>Medicine</option>
                      </select>
                      <input
                        type="text"
                        placeholder="Description / note"
                        value={newHealthNote}
                        onChange={(e) => setNewHealthNote(e.target.value)}
                        className="flex-1 rounded-lg border border-coffee/10 bg-white px-2 py-1 text-xs"
                      />
                      <button
                        onClick={handleAddHealth}
                        type="button"
                        className="bg-coffee text-cream font-bold text-xs px-3 py-1 rounded-lg cursor-pointer shrink-0"
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  {/* Care timeline sub-list editor */}
                  <div className="sm:col-span-2 border-t border-coffee/5 pt-4 text-left">
                    <span className="text-[10px] font-bold text-coffee/50 uppercase tracking-wider block mb-2">
                      Care Journey Milestones ({petFormCareTimeline.length} Entries)
                    </span>
                    <div className="space-y-2 mb-3 max-h-[150px] overflow-y-auto pr-1">
                      {petFormCareTimeline.map((t, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between items-center bg-cream/30 p-2 border border-coffee/5 rounded-xl text-xs"
                        >
                          <div>
                            <span className="font-bold">[{t.date}]</span> {t.label} —{" "}
                            <span className="text-coffee/85">{t.note}</span>
                          </div>
                          <button
                            onClick={() => handleRemoveCare(idx)}
                            type="button"
                            className="text-red-500 hover:text-red-700 font-bold px-1.5 py-0.5 cursor-pointer"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2 items-center bg-cream/10 p-2.5 rounded-xl border border-dashed border-coffee/10">
                      <input
                        type="text"
                        placeholder="Date (e.g. Apr 4)"
                        value={newCareDate}
                        onChange={(e) => setNewCareDate(e.target.value)}
                        className="w-1/4 rounded-lg border border-coffee/10 bg-white px-2 py-1 text-xs"
                      />
                      <input
                        type="text"
                        placeholder="Event title"
                        value={newCareLabel}
                        onChange={(e) => setNewCareLabel(e.target.value)}
                        className="w-1/4 rounded-lg border border-coffee/10 bg-white px-2 py-1 text-xs"
                      />
                      <input
                        type="text"
                        placeholder="Description note"
                        value={newCareNote}
                        onChange={(e) => setNewCareNote(e.target.value)}
                        className="flex-1 rounded-lg border border-coffee/10 bg-white px-2 py-1 text-xs"
                      />
                      <button
                        onClick={handleAddCare}
                        type="button"
                        className="bg-coffee text-cream font-bold text-xs px-3 py-1 rounded-lg cursor-pointer shrink-0"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleUpdatePetProfile}
                  className="w-full mt-4 rounded-xl bg-coffee py-2.5 text-xs font-bold text-cream transition hover:scale-103 cursor-pointer"
                >
                  Save Pet Profile Overrides 💾
                </button>
              </div>
            )}

            {/* T3: Memory Manager */}
            {activeTab === "memories" && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-display text-2xl text-coffee">Memory Publisher</h2>
                  <p className="text-xs text-coffee/60">
                    Publish a new card and choose which game features it feeds.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-[10px] font-bold text-coffee/50 uppercase tracking-wider">
                      Select Pet
                    </span>
                    <select
                      value={memFormPet}
                      onChange={(e) => setMemFormPet(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-coffee/15 bg-white px-3 py-2 text-xs font-bold"
                    >
                      {animals.map((a) => (
                        <option key={a.slug} value={a.slug}>
                          {a.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className="text-[10px] font-bold text-coffee/50 uppercase tracking-wider">
                      Memory Tone
                    </span>
                    <select
                      value={memFormMood}
                      onChange={(e) => setMemFormMood(e.target.value as Mood)}
                      className="mt-1 w-full rounded-xl border border-coffee/15 bg-white px-3 py-2 text-xs font-bold"
                    >
                      <option value="happy">Funny 😂</option>
                      <option value="emotional">Emotional ❤️</option>
                      <option value="rescue">Childhood 🍼</option>
                      <option value="funny">Naughty 😈</option>
                      <option value="night">Adventure 🌎</option>
                    </select>
                  </label>
                  <label className="block sm:col-span-2">
                    <span className="text-[10px] font-bold text-coffee/50 uppercase tracking-wider">
                      Memory Title
                    </span>
                    <input
                      type="text"
                      placeholder="e.g. Biscuit Crime Spot"
                      value={memFormTitle}
                      onChange={(e) => setMemFormTitle(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-coffee/15 bg-white px-3 py-2 text-xs font-bold"
                    />
                  </label>
                  <label className="block sm:col-span-2">
                    <span className="text-[10px] font-bold text-coffee/50 uppercase tracking-wider">
                      Photo / Asset (Drag file or url)
                    </span>
                    <input
                      type="text"
                      placeholder="Image URL"
                      value={memFormPic}
                      onChange={(e) => setMemFormPic(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-coffee/15 bg-white px-3 py-2 text-[10px]"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const b64 = await handleFileChange(file);
                          setMemFormPic(b64);
                        }
                      }}
                      className="mt-2 text-[10px]"
                    />
                  </label>
                  <label className="block sm:col-span-2">
                    <span className="text-[10px] font-bold text-coffee/50 uppercase tracking-wider">
                      Diary Narrative
                    </span>
                    <textarea
                      rows={3}
                      placeholder="Tell the story of what happened..."
                      value={memFormStory}
                      onChange={(e) => setMemFormStory(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-coffee/15 bg-white px-3 py-2 text-xs font-medium"
                    />
                  </label>
                </div>

                <div className="rounded-2xl border border-coffee/5 bg-cream/10 p-4 space-y-2">
                  <span className="text-[10px] font-bold text-coffee/50 uppercase tracking-wider block mb-2">
                    Auto-Distribution Targets
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={memFormStories}
                        onChange={(e) => setMemFormStories(e.target.checked)}
                      />
                      <span>Instagram Stories Viewer</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={memFormSurprise}
                        onChange={(e) => setMemFormSurprise(e.target.checked)}
                      />
                      <span>Daily Surprise Box Pool</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={memFormTimeline}
                        onChange={(e) => setMemFormTimeline(e.target.checked)}
                      />
                      <span>Pet profile timeline</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={memFormSpin}
                        onChange={(e) => setMemFormSpin(e.target.checked)}
                      />
                      <span>Spin Wheel prize drop</span>
                    </label>
                  </div>
                </div>

                <button
                  onClick={handleAddMemory}
                  className="w-full rounded-xl bg-coffee py-2.5 text-xs font-bold text-cream transition hover:scale-103 cursor-pointer"
                >
                  Publish and Distribute Memory 🚀🌸
                </button>
              </div>
            )}

            {/* T4: Gallery Manager */}
            {activeTab === "gallery" && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-display text-2xl text-coffee">Central Media Gallery</h2>
                  <p className="text-xs text-coffee/60">
                    Upload once, view all assets categorized by pet.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {memories.map((m) => (
                    <div
                      key={m.id}
                      className="relative rounded-2xl border border-coffee/5 p-2 bg-cream/10 shadow-sm overflow-hidden"
                    >
                      <img src={m.image} alt="" className="h-28 w-full object-cover rounded-lg" />
                      <span className="absolute bottom-3 left-3 rounded bg-coffee/85 text-[8px] font-bold text-cream px-1.5 py-0.5">
                        {m.animalSlug}
                      </span>
                    </div>
                  ))}
                  {animals.map((a) => (
                    <div
                      key={a.slug}
                      className="relative rounded-2xl border border-coffee/5 p-2 bg-cream/10 shadow-sm overflow-hidden"
                    >
                      <img src={a.image} alt="" className="h-28 w-full object-cover rounded-lg" />
                      <span className="absolute bottom-3 left-3 rounded bg-peach text-[8px] font-bold text-coffee px-1.5 py-0.5">
                        {a.name} Profile
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* T5: Dialogues Manager */}
            {activeTab === "dialogues" && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-display text-2xl text-coffee">Dialogue Editor</h2>
                  <p className="text-xs text-coffee/60">
                    Edit chat bubble dialogue prompts and responses.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-[10px] font-bold text-coffee/50 uppercase tracking-wider">
                      Select Pet
                    </span>
                    <select
                      value={diagPet}
                      onChange={(e) => setDiagPet(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-coffee/15 bg-white px-3 py-2 text-xs font-bold"
                    >
                      {animals.map((a) => (
                        <option key={a.slug} value={a.slug}>
                          {a.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className="text-[10px] font-bold text-coffee/50 uppercase tracking-wider">
                      Dialogue Vibe Tone
                    </span>
                    <select
                      value={diagEmotion}
                      onChange={(e) => setDiagEmotion(e.target.value as PetDialogue["emotion"])}
                      className="mt-1 w-full rounded-xl border border-coffee/15 bg-white px-3 py-2 text-xs font-bold"
                    >
                      <option value="funny">Funny 😂</option>
                      <option value="happy">Cute/Happy ❤️</option>
                      <option value="attitude">Attitude 😼</option>
                      <option value="sleepy">Sleepy 😴</option>
                    </select>
                  </label>
                  <label className="block sm:col-span-2">
                    <span className="text-[10px] font-bold text-coffee/50 uppercase tracking-wider">
                      Dialogue Text
                    </span>
                    <input
                      type="text"
                      placeholder="e.g. If you have snacks, we are already friends 🍪"
                      value={diagText}
                      onChange={(e) => setDiagText(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-coffee/15 bg-white px-3 py-2 text-xs font-bold"
                    />
                  </label>
                </div>

                <button
                  onClick={handleAddDialogue}
                  className="w-full mt-2 rounded-xl bg-coffee py-2.5 text-xs font-bold text-cream transition hover:scale-103 cursor-pointer"
                >
                  Register Dialogue Response 💬
                </button>

                <div className="rounded-2xl border border-coffee/10 p-4 mt-6">
                  <span className="text-[10px] font-bold text-coffee/50 uppercase tracking-wider block mb-3">
                    Custom Dialogue Registry
                  </span>
                  <div className="space-y-2">
                    {dialogues.map((d, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between text-xs border-b border-coffee/5 pb-2 last:border-b-0"
                      >
                        <div>
                          <span className="font-bold text-peach uppercase text-[9px] mr-2">
                            [{d.petSlug}]
                          </span>
                          <span className="italic">"{d.message}"</span>
                        </div>
                        <button
                          onClick={() => handleRemoveDialogue(i)}
                          className="text-[10px] font-bold text-destructive hover:underline cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* T6: Game Content Manager */}
            {activeTab === "games" && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-display text-2xl text-coffee">Game Asset curation</h2>
                  <p className="text-xs text-coffee/60">
                    Customize segments for the Spin Wheel and items inside the Surprise Box.
                  </p>
                </div>

                {/* Spin wheel editor */}
                <div className="rounded-2xl border border-coffee/10 p-5 space-y-4">
                  <h3 className="font-display text-lg text-coffee border-b border-coffee/5 pb-2">
                    🎡 Spin Wheel Wedges
                  </h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="block">
                      <span className="text-[10px] font-bold text-coffee/50 uppercase tracking-wider">
                        Wedge Label
                      </span>
                      <input
                        type="text"
                        placeholder="Moti's Adventure"
                        value={spinLabel}
                        onChange={(e) => setSpinLabel(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-coffee/15 bg-white px-3 py-2 text-xs font-bold"
                      />
                    </label>
                    <label className="block">
                      <span className="text-[10px] font-bold text-coffee/50 uppercase tracking-wider">
                        Icon
                      </span>
                      <input
                        type="text"
                        value={spinIcon}
                        onChange={(e) => setSpinIcon(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-coffee/15 bg-white px-3 py-2 text-xs font-bold"
                      />
                    </label>
                    <label className="block sm:col-span-2">
                      <span className="text-[10px] font-bold text-coffee/50 uppercase tracking-wider">
                        Reward Card Title
                      </span>
                      <input
                        type="text"
                        placeholder="Moti Chasing Leaves"
                        value={spinTitle}
                        onChange={(e) => setSpinTitle(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-coffee/15 bg-white px-3 py-2 text-xs font-bold"
                      />
                    </label>
                    <label className="block sm:col-span-2">
                      <span className="text-[10px] font-bold text-coffee/50 uppercase tracking-wider">
                        Description Text
                      </span>
                      <input
                        type="text"
                        placeholder="Wrote details here..."
                        value={spinContent}
                        onChange={(e) => setSpinContent(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-coffee/15 bg-white px-3 py-2 text-xs font-bold"
                      />
                    </label>
                  </div>

                  <button
                    onClick={handleAddSpinReward}
                    className="w-full rounded-xl bg-coffee py-2 text-xs font-bold text-cream cursor-pointer"
                  >
                    Add Wedge Segment 🎡
                  </button>

                  <div className="space-y-1.5 max-h-40 overflow-y-auto pt-2 border-t border-coffee/5">
                    {spinRewards.map((s, i) => (
                      <div key={i} className="flex justify-between items-center text-xs">
                        <span>
                          {s.icon} {s.label}
                        </span>
                        <button
                          onClick={() => handleRemoveSpin(i)}
                          className="text-[10px] font-bold text-destructive hover:underline cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Surprise Box editor */}
                <div className="rounded-2xl border border-coffee/10 p-5 space-y-4">
                  <h3 className="font-display text-lg text-coffee border-b border-coffee/5 pb-2">
                    🎁 Daily Surprise Box Pool
                  </h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="block">
                      <span className="text-[10px] font-bold text-coffee/50 uppercase tracking-wider">
                        Card Title
                      </span>
                      <input
                        type="text"
                        value={surpTitle}
                        onChange={(e) => setSurpTitle(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-coffee/15 bg-white px-3 py-2 text-xs font-bold"
                      />
                    </label>
                    <label className="block">
                      <span className="text-[10px] font-bold text-coffee/50 uppercase tracking-wider">
                        Icon
                      </span>
                      <input
                        type="text"
                        value={surpIcon}
                        onChange={(e) => setSurpIcon(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-coffee/15 bg-white px-3 py-2 text-xs font-bold"
                      />
                    </label>
                    <label className="block sm:col-span-2">
                      <span className="text-[10px] font-bold text-coffee/50 uppercase tracking-wider">
                        Surprise Fact Content
                      </span>
                      <input
                        type="text"
                        value={surpContent}
                        onChange={(e) => setSurpContent(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-coffee/15 bg-white px-3 py-2 text-xs font-bold"
                      />
                    </label>
                  </div>

                  <button
                    onClick={handleAddSurprise}
                    className="w-full rounded-xl bg-coffee py-2 text-xs font-bold text-cream cursor-pointer"
                  >
                    Add Surprise Card 🎁
                  </button>

                  <div className="space-y-1.5 max-h-40 overflow-y-auto pt-2 border-t border-coffee/5">
                    {surprises.map((s, i) => (
                      <div key={i} className="flex justify-between items-center text-xs">
                        <span>
                          {s.icon} {s.title}
                        </span>
                        <button
                          onClick={() => handleRemoveSurprise(i)}
                          className="text-[10px] font-bold text-destructive hover:underline cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* T7: Moderation Wall */}
            {activeTab === "moderation" && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-display text-2xl text-coffee">
                    Visitor Love Wall Moderation
                  </h2>
                  <p className="text-xs text-coffee/60">
                    Approve or hide submissions posted to your local scrapbook.
                  </p>
                </div>

                <div className="space-y-4">
                  {localSubmissions.length === 0 && (
                    <p className="text-xs text-coffee/50 italic text-center py-6">
                      No visitor submissions to moderate yet.
                    </p>
                  )}
                  {localSubmissions.map((s) => (
                    <div
                      key={s.id}
                      className="flex flex-col sm:flex-row gap-4 border border-coffee/10 p-4 rounded-2xl bg-cream/5 justify-between"
                    >
                      <div className="flex gap-3">
                        <SignedImage
                          storageRef={s.photo_url}
                          alt={s.name || ""}
                          className="size-16 object-cover rounded-lg shrink-0 border border-coffee/5"
                        />
                        <div>
                          <h4 className="font-display text-sm text-coffee">
                            {s.name}{" "}
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-coffee/5 uppercase">
                              {s.species}
                            </span>
                          </h4>
                          <p className="text-[10px] text-coffee/50">
                            📍 {s.location} · {s.created_at.split("T")[0]}
                          </p>
                          <p className="text-xs text-coffee/85 mt-2 italic">"{s.story}"</p>
                        </div>
                      </div>

                      <div className="flex sm:flex-col justify-end gap-2 shrink-0">
                        {s.status !== "approved" ? (
                          <button
                            onClick={() => handleModerateSub(s.id, "approve")}
                            className="rounded bg-sage px-3 py-1 text-[10px] font-bold text-coffee cursor-pointer"
                          >
                            Approve
                          </button>
                        ) : (
                          <span className="text-center rounded border border-sage text-sage px-3 py-1 text-[10px] font-bold">
                            Approved
                          </span>
                        )}
                        <button
                          onClick={() => handleModerateSub(s.id, "delete")}
                          className="rounded bg-destructive/10 px-3 py-1 text-[10px] font-bold text-destructive hover:bg-destructive/15 cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* T8: Settings */}
            {activeTab === "settings" && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-display text-2xl text-coffee">Database Settings</h2>
                  <p className="text-xs text-coffee/60">Maintenance features and custom resets.</p>
                </div>

                <div className="rounded-2xl border border-coffee/10 p-5 space-y-4">
                  <h3 className="font-display text-lg text-coffee border-b border-coffee/5 pb-2">
                    CMS Initialization
                  </h3>
                  <p className="text-xs text-coffee/70 leading-relaxed">
                    This studio uses local browser database variables synced to your browser
                    session. If you want to delete all customizations and restore default
                    configurations, click reset.
                  </p>
                  <button
                    onClick={handleReset}
                    className="rounded-xl bg-destructive py-2 px-4 text-xs font-bold text-cream hover:bg-destructive/90 cursor-pointer"
                  >
                    Restore Defaults 🔄
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </PageShell>
  );
}
