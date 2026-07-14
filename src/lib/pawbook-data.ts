import coco from "@/assets/coco.png";
import bruno from "@/assets/bruno.png";
import moti from "@/assets/moti.png";
import kitty from "@/assets/kitty.png";
import tommy from "@/assets/tommy.png";
import postMoti from "@/assets/post-moti.png";
import postKitty from "@/assets/post-kitty.png";

export type Mood = "happy" | "funny" | "emotional" | "rain" | "rescue" | "night";

export type CareEvent = {
  date: string;
  label: string;
  note: string;
};

export type HealthRecord = {
  type: "Vaccination" | "Checkup" | "Treatment" | "Medicine";
  date: string;
  note: string;
};

export type PawUpdate = {
  id: string;
  petId: string;
  message: string;
  date: string;
  type: "feed" | "vet" | "play" | "sleep";
};

export type CareReminder = {
  id: string;
  petId: string;
  type: string;
  dueDate: string;
  completed: boolean;
};

export type Animal = {
  slug: string;
  name: string;
  emoji: string;
  nickname: string;
  bio: string;
  story: string;
  image: string;
  color: "sky" | "peach" | "sage" | "yellow";
  personality: string;
  home: string;
  favoriteFood: string;
  firstMet: string;
  mood: string;
  status: "safe" | "needs-food" | "needs-care" | "emergency" | "new-friend";
  stats: { pawPrints: number; treats: number; memories: number; adventures: number };
  badges: string[];

  // Last Seen & Updated Info
  lastSeenLocation: string;
  lastUpdated: string;

  // Paw Passport & Health
  pawId: string;
  ageEstimate: string;
  gender: string;
  breedType: string;
  knownSince: string;
  homeArea: string;
  vaccinated: boolean;
  sterilized: boolean;
  medicalNotes: string;
  healthRecords: HealthRecord[];

  // Personality Meter (0-100)
  friendliness: number;
  energy: number;
  trust: number;
  playfulness: number;

  // Community stats
  communityLove: {
    followers: number;
    memories: number;
    helpers: number;
  };

  // Daily Paw Thought
  dailyThought: string;

  // Timeline
  careTimeline: CareEvent[];
};

export type Comment = {
  id: string;
  author: string;
  text: string;
  date: string;
};

export type Memory = {
  id: string;
  animalSlug: string;
  title: string;
  story: string;
  image: string;
  date: string;
  location: string;
  mood: Mood;
  pawPrints: number;
  showInStories?: boolean;
  showInSurpriseBox?: boolean;
  showInTimeline?: boolean;
  showInSpinWheel?: boolean;
  comments?: Comment[];
};

export type PetDialogue = {
  petSlug: string;
  message: string;
  emotion: "funny" | "happy" | "attitude" | "sleepy";
};

export type QuizQuestion = {
  text: string;
  options: { text: string; pet: string; icon: string }[];
};

export type SpinReward = {
  label: string;
  color: string;
  icon: string;
  title: string;
  content: string;
};

export type SurpriseReward = {
  title: string;
  icon: string;
  content: string;
};

export type KindnessPost = {
  id: string;
  author: string;
  text: string;
  badge: string;
  points: number;
  date: string;
};

// Default seed database
const defaultAnimals: Animal[] = [
  {
    slug: "coco",
    name: "Coco",
    emoji: "🐕",
    nickname: "The Friendly Tiger",
    bio: "Large size, looks like a tiger, but he is too friendly! 🐯❤️",
    story: "I celebrated my 7th birthday with a giant cake of treats! I love making new friends.",
    image: coco,
    color: "yellow",
    personality: "Friendly Labrador",
    home: "Cozy Garden House",
    favoriteFood: "Birthday cake of kibble and treats",
    firstMet: "4 April 2019",
    mood: "Excited 🎉",
    status: "safe",
    stats: { pawPrints: 250, treats: 120, memories: 35, adventures: 18 },
    badges: ["Friendly Giant 🐾", "Birthday Boy 🎂", "Tiger Lookalike 🐯", "Tail Wag Champ 🏆"],

    // Redesign properties
    lastSeenLocation: "Near the flower bed",
    lastUpdated: "2 hours ago",
    pawId: "PB-COCO-1024",
    ageEstimate: "7 years",
    gender: "Male",
    breedType: "Labrador Retriever",
    knownSince: "4 April 2019",
    homeArea: "Cozy Garden House",
    vaccinated: true,
    sterilized: true,
    medicalNotes: "Fully healthy. Regular ear drops for wax cleanup.",
    healthRecords: [
      { type: "Vaccination", date: "12 Jan 2026", note: "Annual 7-in-1 vaccine completed." },
      {
        type: "Checkup",
        date: "20 Feb 2026",
        note: "Normal vet health check - heart rate normal.",
      },
    ],
    friendliness: 98,
    energy: 85,
    trust: 95,
    playfulness: 90,
    communityLove: { followers: 156, memories: 35, helpers: 12 },
    dailyThought:
      "Today my friends visited again. The birthday treats were nice, but the belly rubs were better ❤️",
    careTimeline: [
      {
        date: "April 2019",
        label: "🐾 First Met",
        note: "Brought Coco home as a tiny friendly puppy.",
      },
      {
        date: "May 2019",
        label: "🐯 Tiger Look",
        note: "Everyone noticed Coco's tiger stripes and majestic gaze.",
      },
      {
        date: "April 2026",
        label: "🎂 7th Birthday",
        note: "Made a huge dog-friendly treat cake. Coco loved it!",
      },
    ],
  },
  {
    slug: "bruno",
    name: "Bruno",
    emoji: "🐕",
    nickname: "The Biscuit King",
    bio: "Professional nap taker, butterfly watcher, and biscuit tester.",
    story: "I wait near the college gate every morning for my human friends ❤️",
    image: bruno,
    color: "yellow",
    personality: "Friendly Biscuit Lover",
    home: "College Street",
    favoriteFood: "Parle-G biscuits",
    firstMet: "12 Jan 2025",
    mood: "Happy 😊",
    status: "safe",
    stats: { pawPrints: 250, treats: 120, memories: 35, adventures: 18 },
    badges: ["Happy Soul ⭐", "Friendly Paw 🐾", "Biscuit King 🍪", "Tail Wag Champion 🏆"],
    lastSeenLocation: "Near the college gate",
    lastUpdated: "3 hours ago",
    pawId: "PB-BRUN-1001",
    ageEstimate: "5 years",
    gender: "Male",
    breedType: "Indy Mix",
    knownSince: "12 Jan 2025",
    homeArea: "College Street",
    vaccinated: true,
    sterilized: true,
    medicalNotes: "Healthy and fit. Loves biscuits but needs controlled diet.",
    healthRecords: [
      { type: "Vaccination", date: "15 Jan 2026", note: "Annual rabies vaccine completed." },
      { type: "Checkup", date: "22 Feb 2026", note: "Dewormed and weighed. Perfect health." },
    ],
    friendliness: 95,
    energy: 70,
    trust: 90,
    playfulness: 80,
    communityLove: { followers: 180, memories: 35, helpers: 15 },
    dailyThought: "The students brought two packets of biscuits today. A glorious morning! 🍪",
    careTimeline: [
      {
        date: "Jan 2025",
        label: "🐾 First met Bruno",
        note: "Began waiting at the college gate for students.",
      },
      {
        date: "Feb 2025",
        label: "🍪 Parle-G Pact",
        note: "Decided Parle-G biscuits are the ultimate reward.",
      },
    ],
  },
  {
    slug: "moti",
    name: "Moti",
    emoji: "🐶",
    nickname: "The Belly Rub Believer",
    bio: "Small in size, huge in heart. Believes every human is a friend she just hasn't met yet.",
    story: "Today was amazing. I got biscuits and belly rubs ❤️",
    image: moti,
    color: "sky",
    personality: "Gentle Little Soul",
    home: "Tea Shop Corner",
    favoriteFood: "Warm milk",
    firstMet: "3 March 2025",
    mood: "Sleepy 😴",
    status: "safe",
    stats: { pawPrints: 352, treats: 88, memories: 24, adventures: 11 },
    badges: ["Happy Soul ⭐", "Best Friend ❤️"],

    // Redesign properties
    lastSeenLocation: "Under the tea shop bench",
    lastUpdated: "1 day ago",
    pawId: "PB-MOTI-2048",
    ageEstimate: "3 years",
    gender: "Female",
    breedType: "Indy Mix",
    knownSince: "3 March 2025",
    homeArea: "Tea Shop Corner",
    vaccinated: true,
    sterilized: true,
    medicalNotes: "Mild skin itch in monsoons. Dewormed regularly.",
    healthRecords: [
      { type: "Vaccination", date: "05 Jan 2026", note: "Rabies booster completed." },
      { type: "Checkup", date: "10 Mar 2026", note: "Deworming pill administered. Weight stable." },
    ],
    friendliness: 95,
    energy: 60,
    trust: 90,
    playfulness: 70,
    communityLove: { followers: 232, memories: 24, helpers: 28 },
    dailyThought:
      "The tea shop bench was warm today. A nice student scratched my ears for five whole minutes. Success! 🐶",
    careTimeline: [
      {
        date: "March 2025",
        label: "🐶 Met Moti",
        note: "Spotted Moti guarding the hot tea shop corner.",
      },
      {
        date: "April 2025",
        label: "❤️ Rubs Pact",
        note: "Moti decided belly rubs are the currency of friendship.",
      },
    ],
  },
  {
    slug: "kitty",
    name: "Kitty",
    emoji: "🐈",
    nickname: "The Rooftop Philosopher",
    bio: "Studies butterflies for a living. Very serious about sunbeams.",
    story: "Met a new butterfly friend today. We sat in silence for a while 🦋",
    image: kitty,
    color: "peach",
    personality: "Quiet Observer",
    home: "Library Balcony",
    favoriteFood: "Grilled fish",
    firstMet: "22 Feb 2025",
    mood: "Curious 🌸",
    status: "safe",
    stats: { pawPrints: 128, treats: 40, memories: 19, adventures: 7 },
    badges: ["Rain Fighter 🌧️", "Friendly Paw 🐾"],

    // Redesign properties
    lastSeenLocation: "Library window sill",
    lastUpdated: "3 days ago",
    pawId: "PB-KITT-3096",
    ageEstimate: "2 years",
    gender: "Female",
    breedType: "Feral Tabby Cat",
    knownSince: "22 Feb 2025",
    homeArea: "Library Balcony",
    vaccinated: true,
    sterilized: true,
    medicalNotes: "Sterilization completed. Ear tip-clipped.",
    healthRecords: [
      {
        type: "Treatment",
        date: "15 Dec 2025",
        note: "Sterilization surgery & recovery completed.",
      },
      { type: "Vaccination", date: "15 Dec 2025", note: "Feline distemper vaccine given." },
    ],
    friendliness: 50,
    energy: 40,
    trust: 85,
    playfulness: 55,
    communityLove: { followers: 98, memories: 19, helpers: 5 },
    dailyThought:
      "The humans made too much noise in the reading room. I glared at them until they looked ashamed. 🐈‍⬛",
    careTimeline: [
      {
        date: "Feb 2025",
        label: "🐈 Library Ghost",
        note: "First sighted Kitty looking majestic on library stairs.",
      },
      {
        date: "Dec 2025",
        label: "🏥 Spay Day",
        note: "Successfully caught Kitty for spaying and released safely.",
      },
    ],
  },
  {
    slug: "tommy",
    name: "Tommy",
    emoji: "🐕",
    nickname: "The Little Adventurer",
    bio: "Only three months old and already ran three blocks after a butterfly.",
    story: "Chased a butterfly for three blocks today. Almost caught it!",
    image: tommy,
    color: "sage",
    personality: "Playful Explorer",
    home: "River Road Bend",
    favoriteFood: "Anything, honestly",
    firstMet: "5 May 2025",
    mood: "Excited 🎈",
    status: "needs-care",
    stats: { pawPrints: 415, treats: 62, memories: 28, adventures: 22 },
    badges: ["Happy Soul ⭐", "Rain Fighter 🌧️"],

    // Redesign properties
    lastSeenLocation: "Near the river guard rails",
    lastUpdated: "Just now",
    pawId: "PB-TOMM-4192",
    ageEstimate: "1 year",
    gender: "Male",
    breedType: "Indy Puppy",
    knownSince: "5 May 2025",
    homeArea: "River Road Bend",
    vaccinated: false,
    sterilized: false,
    medicalNotes: "Needs first puppy vaccination booster. Scheduled soon.",
    healthRecords: [
      {
        type: "Checkup",
        date: "12 May 2025",
        note: "General deworming completed. Needs vaccines next week.",
      },
    ],
    friendliness: 99,
    energy: 98,
    trust: 90,
    playfulness: 99,
    communityLove: { followers: 312, memories: 28, helpers: 15 },
    dailyThought:
      "A yellow leaf floated down the river. I tried to catch it and got my paws all wet. Totally worth it! 🍂🐾",
    careTimeline: [
      {
        date: "May 2025",
        label: "🐾 Tiny Puppy",
        note: "Found Tommy crying under a bridge during first monsoon rain.",
      },
      {
        date: "July 2025",
        label: "🌧️ Rain Scarf",
        note: "Tommy wore a yellow scarf gifted by library staff.",
      },
    ],
  },
];

const defaultMemories: Memory[] = [
  {
    id: "m1",
    animalSlug: "moti",
    title: "Belly Rubs Day",
    story: "Today was amazing. I got biscuits and belly rubs from the newcomers ❤️",
    image: postMoti,
    date: "July 20, 2025",
    location: "Tea Shop Corner",
    mood: "happy",
    pawPrints: 352,
    showInStories: true,
    showInSurpriseBox: true,
    showInTimeline: true,
    showInSpinWheel: true,
  },
  {
    id: "m2",
    animalSlug: "kitty",
    title: "Butterfly Friend",
    story: "Met a new butterfly friend today. We sat in silence for a while 🦋",
    image: postKitty,
    date: "July 18, 2025",
    location: "Library Balcony",
    mood: "emotional",
    pawPrints: 128,
    showInStories: true,
    showInSurpriseBox: true,
    showInTimeline: true,
    showInSpinWheel: true,
  },
  {
    id: "m3",
    animalSlug: "coco",
    title: "7th Birthday Party",
    story:
      "My human made me a huge birthday cake covered in delicious treats. I ate the whole thing! 🎂🎉",
    image: coco,
    date: "April 4, 2026",
    location: "Cozy Garden House",
    mood: "happy",
    pawPrints: 250,
    showInStories: true,
    showInSurpriseBox: true,
    showInTimeline: true,
    showInSpinWheel: true,
  },
  {
    id: "m4",
    animalSlug: "tommy",
    title: "First Rain",
    story: "It rained today. I hid under the tea stall. A kind lady wiped me dry with her scarf 🌧️",
    image: tommy,
    date: "July 12, 2025",
    location: "River Road Bend",
    mood: "rain",
    pawPrints: 189,
    showInStories: true,
    showInSurpriseBox: true,
    showInTimeline: true,
    showInSpinWheel: true,
  },
];

const defaultDialogues: PetDialogue[] = [
  {
    petSlug: "coco",
    message:
      "Hey human! Did you bring birthday cookies? 👀 I might look big like a tiger but I love hugs!",
    emotion: "funny",
  },
  {
    petSlug: "coco",
    message: "If you have snacks, we are already friends 🍖 Let's go play in the garden!",
    emotion: "happy",
  },
  {
    petSlug: "moti",
    message: "Belly rub time? I'm ready! 🐶 The corner near the tea stall is warm today.",
    emotion: "happy",
  },
  {
    petSlug: "kitty",
    message:
      "I have selected you as my servant today. 😼 Ask me something, or just stand there in awe.",
    emotion: "attitude",
  },
  {
    petSlug: "tommy",
    message: "Let's go! What are we chasing today? 🎾 A leaf? A butterfly?",
    emotion: "funny",
  },
];

const defaultQuizQuestions: QuizQuestion[] = [
  {
    text: "What is your absolute weekend mood?",
    options: [
      { text: "Take a deep 14-hour nap 😴", pet: "coco", icon: "😴" },
      { text: "Hunt for tasty snacks 🍪", pet: "coco", icon: "🍪" },
      { text: "Demand attention & belly rubs ❤️", pet: "moti", icon: "❤️" },
      { text: "Go on a running adventure 🏃", pet: "tommy", icon: "🏃" },
    ],
  },
  {
    text: "Choose your secret superpower:",
    options: [
      {
        text: "Looking like a tiger but actually being super friendly 🐯",
        pet: "coco",
        icon: "🐯",
      },
      { text: "Melting hearts with puppy eyes 🥺", pet: "moti", icon: "🥺" },
      { text: "Silent contemplation from rooftops 🐈", pet: "kitty", icon: "🐈" },
      { text: "Monsoon splash-running champ 🧣", pet: "tommy", icon: "🧣" },
    ],
  },
  {
    text: "What is your perfect kind of weather?",
    options: [
      { text: "Sunny garden walks under tree shade ☀️", pet: "coco", icon: "🌳" },
      { text: "Cozy rainy noise under a shop roof 🌧️", pet: "moti", icon: "🌧️" },
      { text: "A bright hot sunbeam on a balcony ☀️", pet: "kitty", icon: "☀️" },
      { text: "Monsoon puddles to leap over! ⛈️", pet: "tommy", icon: "⛈️" },
    ],
  },
  {
    text: "Who would be your dream snack companion?",
    options: [
      { text: "Family members with giant birthday treats 🎂", pet: "coco", icon: "🎂" },
      { text: "Tea shop owners with warm milk 🥛", pet: "moti", icon: "🥛" },
      { text: "Silence and a plate of grilled fish 🐟", pet: "kitty", icon: "🐟" },
      { text: "Anyone who has a treat in their hand! 🍖", pet: "tommy", icon: "🍖" },
    ],
  },
  {
    text: "A new human walks by. How do you react?",
    options: [
      { text: "Trot over happily looking like a tiger to get pets 🐯", pet: "coco", icon: "🐯" },
      { text: "Trot over immediately for side scratches 🐶", pet: "moti", icon: "🐶" },
      { text: "Watch them silently to judge their character 🐈", pet: "kitty", icon: "🐈" },
      { text: "Bark happily and run around their legs! 🐾", pet: "tommy", icon: "🐾" },
    ],
  },
];

const defaultSpinRewards: SpinReward[] = [
  {
    label: "Coco's Secret",
    color: "#F28C28",
    icon: "🍪",
    title: "Coco's Secret Garden Spot 🌳",
    content:
      "Coco has a secret spot in the garden where he buries his favorite bones and tiger-stripe toys!",
  },
  {
    label: "Kitty's Story",
    color: "#6495ED",
    icon: "🥛",
    title: "Kitty & The Milk Bowl 🥛",
    content:
      "Kitty has trained the tea shop owner to pour milk at exactly 4:00 PM. If they are late by 5 minutes, she sits on their keyboard!",
  },
  {
    label: "Moti's Love",
    color: "#FF6F61",
    icon: "❤️",
    title: "Moti's Favorite Student ❤️",
    content:
      "Moti has a favorite student who wears a yellow scarf. Whenever they arrive, Moti runs and drops his tennis ball directly on their lap.",
  },
  {
    label: "Tommy's Play",
    color: "#77DD77",
    icon: "🎾",
    title: "Tommy's Leaf Chasing Records 🍃",
    content:
      "Tommy holds the official village speed record of catching 12 leaves mid-air in under 3 minutes during autumn winds!",
  },
  {
    label: "Rare Memory",
    color: "#FDFD96",
    icon: "📸",
    title: "Rare Reunion Photo 📸",
    content:
      "A student once snapped a photo of all 5 pets sleeping in a neat row under the tea stall during a monsoon storm. Total peace!",
  },
];

const defaultSurprises: SurpriseReward[] = [
  {
    title: "Coco's Secret 🤫",
    icon: "🍪",
    content:
      "Coco once saw a butterfly, got so excited he sprinted around the yard, and ended up wearing a flower pot like a hat!",
  },
  {
    title: "Moti's Cozy Memory ❤️",
    icon: "🐶",
    content:
      "Moti loves sitting directly on students' backpacks when they lay them on the grass, successfully preventing them from going to class.",
  },
  {
    title: "Kitty's Royal Judgment 😼",
    icon: "🐈",
    content:
      "Kitty once spent three solid hours silently glaring at a pigeon that landed on her balcony, until the pigeon flew away in shame.",
  },
  {
    title: "Tommy's Adventure 🧣",
    icon: "🐕",
    content:
      "Tommy chased a dry mango leaf for three entire blocks, caught it, and proudly carried it in his mouth like a golden trophy.",
  },
  {
    title: "Village Secret 🗺️",
    icon: "☕",
    content:
      "During heavy rains, all five pets shelter under the same tea stall roof. Kitty gets the dry chair, while the dogs share the mat!",
  },
  {
    title: "Cute Pet Fact 🐾",
    icon: "✨",
    content:
      "Dogs can understand up to 150 words! Coco definitely knows the word 'Treat' in three different languages.",
  },
];

import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";

// ---------------------------------------------------------------------------
// normalizeAnimal — guarantees every Animal object (including guest uploads
// from Supabase) has safe default values for every array / string field.
// Without this, old or minimal records crash the UI when code calls
// undefined.slice() or undefined.map().
// ---------------------------------------------------------------------------
export function normalizeAnimal(raw: Partial<Animal>): Animal {
  const def = defaultAnimals.find((d) => d.slug === raw.slug);
  return {
    slug: raw.slug ?? "unknown",
    name: raw.name ?? def?.name ?? "Unnamed Friend",
    emoji: raw.emoji ?? def?.emoji ?? "🐾",
    nickname: raw.nickname ?? def?.nickname ?? "Street Friend",
    bio: raw.bio ?? def?.bio ?? "",
    story: raw.story ?? def?.story ?? "",
    image: raw.image ?? def?.image ?? "",
    color: raw.color ?? def?.color ?? "peach",
    personality: raw.personality ?? def?.personality ?? "Friendly",
    home: raw.home ?? def?.home ?? "Unknown Area",
    favoriteFood: raw.favoriteFood ?? def?.favoriteFood ?? "Whatever is offered 🍪",
    firstMet: raw.firstMet ?? def?.firstMet ?? "Recently",
    mood: raw.mood ?? def?.mood ?? "Curious 🌸",
    status: raw.status ?? def?.status ?? "new-friend",
    stats: raw.stats ?? def?.stats ?? { pawPrints: 0, treats: 0, memories: 0, adventures: 0 },
    badges: Array.isArray(raw.badges) && raw.badges.length > 0 ? raw.badges : (def?.badges ?? []),
    lastSeenLocation: raw.lastSeenLocation ?? def?.lastSeenLocation ?? "Unknown",
    lastUpdated: raw.lastUpdated ?? def?.lastUpdated ?? "Recently",
    pawId: raw.pawId ?? def?.pawId ?? `PB-GUEST-${Date.now()}`,
    ageEstimate: raw.ageEstimate ?? def?.ageEstimate ?? "Unknown",
    gender: raw.gender ?? def?.gender ?? "Unknown",
    breedType: raw.breedType ?? def?.breedType ?? "Street Dog / Cat",
    knownSince: raw.knownSince ?? def?.knownSince ?? "Recently",
    homeArea: raw.homeArea ?? def?.homeArea ?? "Unknown",
    vaccinated: raw.vaccinated ?? def?.vaccinated ?? false,
    sterilized: raw.sterilized ?? def?.sterilized ?? false,
    medicalNotes: raw.medicalNotes ?? def?.medicalNotes ?? "No medical records yet.",
    healthRecords:
      Array.isArray(raw.healthRecords) && raw.healthRecords.length > 0
        ? raw.healthRecords
        : (def?.healthRecords ?? []),
    friendliness: raw.friendliness ?? def?.friendliness ?? 80,
    energy: raw.energy ?? def?.energy ?? 70,
    trust: raw.trust ?? def?.trust ?? 75,
    playfulness: raw.playfulness ?? def?.playfulness ?? 75,
    communityLove: raw.communityLove ??
      def?.communityLove ?? { followers: 0, memories: 0, helpers: 0 },
    dailyThought:
      raw.dailyThought ??
      def?.dailyThought ??
      raw.story ??
      def?.story ??
      "Just happy to be here 🐾",
    careTimeline:
      Array.isArray(raw.careTimeline) && raw.careTimeline.length > 0
        ? raw.careTimeline
        : (def?.careTimeline ?? []),
  };
}

// Live Mutable Variables
export let animals: Animal[] = [...defaultAnimals];
export let memories: Memory[] = [...defaultMemories];
export let dialogues: PetDialogue[] = [...defaultDialogues];
export let quizQuestions: QuizQuestion[] = [...defaultQuizQuestions];
export let spinRewards: SpinReward[] = [...defaultSpinRewards];
export let surprises: SurpriseReward[] = [...defaultSurprises];

// Sync arrays from Supabase on client-side
if (typeof window !== "undefined") {
  const syncCMS = async () => {
    try {
      const { data, error } = await supabase
        .from("cms_data")
        .select("*")
        .eq("id", "main")
        .maybeSingle();

      if (error) throw error;

      if (data) {
        // Always load whatever is stored in Supabase — never auto-reset.
        // Run every animal through normalizeAnimal() so guest-uploaded records
        // with missing fields never crash the UI with undefined.slice() errors.
        const rawAnimals = (data.animals as unknown as Partial<Animal>[]) || defaultAnimals;
        animals = rawAnimals.map(normalizeAnimal);
        memories = (data.memories as unknown as Memory[]) || defaultMemories;
        dialogues = (data.dialogues as unknown as PetDialogue[]) || defaultDialogues;
        quizQuestions = (data.quiz_questions as unknown as QuizQuestion[]) || defaultQuizQuestions;
        spinRewards = (data.spin_rewards as unknown as SpinReward[]) || defaultSpinRewards;
        surprises = (data.surprises as unknown as SurpriseReward[]) || defaultSurprises;

        localStorage.setItem("pawbook-cms-animals", JSON.stringify(animals));
        localStorage.setItem("pawbook-cms-memories", JSON.stringify(memories));
        localStorage.setItem("pawbook-cms-dialogues", JSON.stringify(dialogues));
        localStorage.setItem("pawbook-cms-quiz", JSON.stringify(quizQuestions));
        localStorage.setItem("pawbook-cms-spinwheel", JSON.stringify(spinRewards));
        localStorage.setItem("pawbook-cms-surprises", JSON.stringify(surprises));
      } else {
        // Seed default config into Supabase
        const savedAnimals = localStorage.getItem("pawbook-cms-animals");
        const savedMemories = localStorage.getItem("pawbook-cms-memories");
        const savedDialogues = localStorage.getItem("pawbook-cms-dialogues");
        const savedQuiz = localStorage.getItem("pawbook-cms-quiz");
        const savedSpin = localStorage.getItem("pawbook-cms-spinwheel");
        const savedSurprises = localStorage.getItem("pawbook-cms-surprises");

        const animalsPayload = savedAnimals ? JSON.parse(savedAnimals) : defaultAnimals;
        const memoriesPayload = savedMemories ? JSON.parse(savedMemories) : defaultMemories;
        const dialoguesPayload = savedDialogues ? JSON.parse(savedDialogues) : defaultDialogues;
        const quizPayload = savedQuiz ? JSON.parse(savedQuiz) : defaultQuizQuestions;
        const spinPayload = savedSpin ? JSON.parse(savedSpin) : defaultSpinRewards;
        const surprisesPayload = savedSurprises ? JSON.parse(savedSurprises) : defaultSurprises;

        const { error: insertError } = await supabase.from("cms_data").insert({
          id: "main",
          animals: animalsPayload,
          memories: memoriesPayload,
          dialogues: dialoguesPayload,
          quiz_questions: quizPayload,
          spin_rewards: spinPayload,
          surprises: surprisesPayload,
        });

        if (insertError) {
          console.warn(
            "Could not seed default database rows (are you logged in as admin?):",
            insertError,
          );
        }

        animals = animalsPayload;
        memories = memoriesPayload;
        dialogues = dialoguesPayload;
        quizQuestions = quizPayload;
        spinRewards = spinPayload;
        surprises = surprisesPayload;
      }
    } catch (e) {
      console.warn("Failed to fetch live Supabase CMS data. Loading local cache...", e);
      const savedAnimals = localStorage.getItem("pawbook-cms-animals");
      const savedMemories = localStorage.getItem("pawbook-cms-memories");
      const savedDialogues = localStorage.getItem("pawbook-cms-dialogues");
      const savedQuiz = localStorage.getItem("pawbook-cms-quiz");
      const savedSpin = localStorage.getItem("pawbook-cms-spinwheel");
      const savedSurprises = localStorage.getItem("pawbook-cms-surprises");

      if (savedAnimals) animals = JSON.parse(savedAnimals);
      if (savedMemories) memories = JSON.parse(savedMemories);
      if (savedDialogues) dialogues = JSON.parse(savedDialogues);
      if (savedQuiz) quizQuestions = JSON.parse(savedQuiz);
      if (savedSpin) spinRewards = JSON.parse(savedSpin);
      if (savedSurprises) surprises = JSON.parse(savedSurprises);
    }

    window.dispatchEvent(new Event("pawbook-cms-refreshed"));
  };

  syncCMS();
  window.addEventListener("pawbook-cms-updated", syncCMS);
}

export function useCMS() {
  const [data, setData] = useState({
    animals: defaultAnimals,
    memories: defaultMemories,
    dialogues: defaultDialogues,
    quizQuestions: defaultQuizQuestions,
    spinRewards: defaultSpinRewards,
    surprises: defaultSurprises,
  });

  useEffect(() => {
    setData({
      animals,
      memories,
      dialogues,
      quizQuestions,
      spinRewards,
      surprises,
    });

    const handleUpdate = () => {
      setData({
        animals,
        memories,
        dialogues,
        quizQuestions,
        spinRewards,
        surprises,
      });
    };
    window.addEventListener("pawbook-cms-refreshed", handleUpdate);
    window.addEventListener("pawbook-cms-updated", handleUpdate);
    return () => {
      window.removeEventListener("pawbook-cms-refreshed", handleUpdate);
      window.removeEventListener("pawbook-cms-updated", handleUpdate);
    };
  }, []);

  return data;
}

export const getAnimal = (slug: string) => animals.find((a) => a.slug === slug);

export const updateCMSData = async (fields: {
  animals?: Animal[];
  memories?: Memory[];
  dialogues?: PetDialogue[];
  quizQuestions?: QuizQuestion[];
  spinRewards?: SpinReward[];
  surprises?: SurpriseReward[];
}) => {
  if (fields.animals) animals = fields.animals;
  if (fields.memories) memories = fields.memories;
  if (fields.dialogues) dialogues = fields.dialogues;
  if (fields.quizQuestions) quizQuestions = fields.quizQuestions;
  if (fields.spinRewards) spinRewards = fields.spinRewards;
  if (fields.surprises) surprises = fields.surprises;

  if (typeof window !== "undefined") {
    localStorage.setItem("pawbook-cms-animals", JSON.stringify(animals));
    localStorage.setItem("pawbook-cms-memories", JSON.stringify(memories));
    localStorage.setItem("pawbook-cms-dialogues", JSON.stringify(dialogues));
    localStorage.setItem("pawbook-cms-quiz", JSON.stringify(quizQuestions));
    localStorage.setItem("pawbook-cms-spinwheel", JSON.stringify(spinRewards));
    localStorage.setItem("pawbook-cms-surprises", JSON.stringify(surprises));
  }

  try {
    const { error } = await supabase
      .from("cms_data")
      .update({
        animals,
        memories,
        dialogues,
        quiz_questions: quizQuestions,
        spin_rewards: spinRewards,
        surprises,
        updated_at: new Date().toISOString(),
      })
      .eq("id", "main");
    if (error) console.warn("Supabase sync failed (likely RLS):", error.message);
  } catch (err) {
    console.warn("Failed to update Supabase data:", err);
  }

  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("pawbook-cms-refreshed"));
  }
};

export const careTimeline = [
  { date: "July 1", label: "🍪 First Feeding", note: "Shared biscuits near the gate." },
  {
    date: "July 10",
    label: "❤️ Rescue Moment",
    note: "Took shelter under the stairs during storm.",
  },
  { date: "July 20", label: "💊 Health Check", note: "Vet visit — happy and healthy." },
];

export const mapPlaces = [
  { id: "garden", name: "Garden Friends", icon: "🌳", top: "22%", left: "18%", animals: ["kitty"] },
  {
    id: "gardenhouse",
    name: "Garden House",
    icon: "🏡",
    top: "22%",
    left: "38%",
    animals: ["coco"],
  },
  { id: "tea", name: "Tea Shop Paws", icon: "☕", top: "60%", left: "62%", animals: ["moti"] },
  {
    id: "college",
    name: "College Street",
    icon: "🏫",
    top: "38%",
    left: "72%",
    animals: ["bruno"],
  },
  { id: "home", name: "Home Friends", icon: "🏠", top: "70%", left: "28%", animals: ["tommy"] },
];

export const natureCategories = [
  { id: "flowers", name: "Flowers", icon: "🌸", tone: "peach" as const },
  { id: "trees", name: "Trees", icon: "🌳", tone: "sage" as const },
  { id: "sky", name: "Sky", icon: "☁️", tone: "sky" as const },
  { id: "rain", name: "Rain", icon: "🌧", tone: "sky" as const },
  { id: "moon", name: "Moon", icon: "🌙", tone: "yellow" as const },
  { id: "creatures", name: "Creatures", icon: "🦋", tone: "peach" as const },
];
