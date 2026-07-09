import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import cocoImg from "@/assets/coco.jpg";
import { toast } from "sonner";
import { animals, quizQuestions } from "@/lib/pawbook-data";
import { copyToClipboard, shareContent } from "@/lib/utils";

interface PetQuizModalProps {
  forceOpen?: boolean;
  onClose?: () => void;
}

interface Question {
  text: string;
  options: { text: string; pet: string; icon: string }[];
}

const resultsData: Record<
  string,
  { name: string; nickname: string; emoji: string; desc: string; similarity: string; photo: string }
> = {
  coco: {
    name: "Coco",
    nickname: "The Friendly Tiger",
    emoji: "🐕",
    similarity: "98% Friendly Tiger Affinity",
    photo: cocoImg,
    desc: "Both of you look big and powerful like a tiger, but you are just a big softie who wants to play! 🐯❤️",
  },
  moti: {
    name: "Moti",
    nickname: "Belly Rub Believer",
    emoji: "🐶",
    similarity: "99% Love Compatibility",
    photo:
      "https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&q=80&w=400",
    desc: "You are pure warmth ❤️ You believe there is no such thing as too many belly rubs, and warm milk near a tea shop is heaven.",
  },
  kitty: {
    name: "Kitty",
    nickname: "Rooftop Philosopher",
    emoji: "🐈",
    similarity: "95% Majestic Radiance",
    photo:
      "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=400",
    desc: "You are quiet, self-sufficient, and slightly royal 👑 You prefer sunbathing in silence and observing the world from above.",
  },
  tommy: {
    name: "Tommy",
    nickname: "Little Adventurer",
    emoji: "🐕",
    similarity: "97% Energy Matching",
    photo:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400",
    desc: "You are a wild leaf-chaser 🧣 Rain showers don't scare you, and you're always ready to sprint after butterfly dreams!",
  },
};

export function PetQuizModal({ forceOpen = false, onClose }: PetQuizModalProps) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0); // 0: Welcome, 1..5: Qs, 6: Result
  const [selectedPets, setSelectedPets] = useState<string[]>([]);
  const [match, setMatch] = useState<string | null>(null);

  useEffect(() => {
    if (forceOpen) {
      setIsOpen(true);
      setStep(0);
      setSelectedPets([]);
      setMatch(null);
    } else {
      const completed = localStorage.getItem("pawbook-quiz-completed");
      if (!completed) {
        setIsOpen(true);
      }
    }
  }, [forceOpen]);

  const handleStart = () => {
    setStep(1);
    setSelectedPets([]);
  };

  const handleSelectOption = (pet: string) => {
    const nextAnswers = [...selectedPets, pet];
    setSelectedPets(nextAnswers);

    if (step < quizQuestions.length) {
      setStep(step + 1);
    } else {
      // Calculate match
      const counts: Record<string, number> = {};
      let maxCount = 0;
      let matchedPet = "coco"; // Fallback

      nextAnswers.forEach((p) => {
        counts[p] = (counts[p] || 0) + 1;
        if (counts[p] > maxCount) {
          maxCount = counts[p];
          matchedPet = p;
        }
      });

      setMatch(matchedPet);
      setStep(6); // result page
    }
  };

  const claimReward = () => {
    if (!match) return;
    const treatsKey = `pawbook-extra-treats-${match}`;
    const currentTreats = parseInt(localStorage.getItem(treatsKey) || "0", 10);
    localStorage.setItem(treatsKey, (currentTreats + 1).toString());

    localStorage.setItem("pawbook-quiz-completed", "true");
    setIsOpen(false);
    if (onClose) onClose();

    const matchedName = resultsData[match].name;
    toast.success(`Matched! You gave a treat to ${matchedName}! 🍪`);

    navigate({
      to: "/paw-friends/$slug",
      params: { slug: match },
    });
  };

  const shareInstagram = () => {
    if (!match) return;
    const result = resultsData[match];
    const shareText = `🐾 I took the PawBook Quiz and matched with ${result.name} (${result.similarity})! \n"${result.desc}"`;
    shareContent(
      {
        title: "Paw Match Quiz Results!",
        text: shareText,
        url: window.location.origin,
      },
      () => toast.success("Match results shared / copied successfully! 🌟"),
      () =>
        toast.error(
          "Could not share automatically. Please share the URL from your browser address bar.",
        ),
    );
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    if (onClose) onClose();
  };

  if (!isOpen) return null;

  const currentQuestion = step >= 1 && step <= 5 ? quizQuestions[step - 1] : null;
  const result = step === 6 && match ? resultsData[match] : null;

  const activeAnimal = match ? animals.find((a) => a.slug === match) : null;
  const petImg = activeAnimal?.image || (result ? result.photo : "");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-coffee/40 px-4 py-6 backdrop-blur-sm animate-fade-in">
      <style>{`
        @keyframes paperDrop {
          0% { transform: translateY(-40px) scale(0.95); opacity: 0; }
          70% { transform: translateY(5px) scale(1.02); opacity: 0.95; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        .animate-paper-drop {
          animation: paperDrop 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }
      `}</style>

      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border-2 border-coffee bg-white p-6 text-center scrapbook-shadow sm:p-8 animate-paper-drop">
        {/* Washi tape decoration */}
        <div className="washi-tape absolute -top-1.5 left-1/2 z-10 h-6 w-24 -translate-x-1/2 rotate-1" />

        {/* Close Button */}
        <button
          onClick={handleCloseModal}
          className="absolute top-4 right-4 h-8 w-8 rounded-full border border-coffee/15 bg-white text-sm font-bold text-coffee/60 hover:bg-cream cursor-pointer"
        >
          ✖
        </button>

        {/* Step 0: Welcome Screen */}
        {step === 0 && (
          <div className="space-y-4 pt-4">
            <span className="text-5xl animate-bounce inline-block">🐾</span>
            <h2 className="font-display text-3xl text-coffee">Find Your Paw Best Friend</h2>
            <p className="text-sm text-coffee/80 leading-relaxed">
              Answer 5 cute questions to find your matching soul friend in the village, claim a
              cookie reward, and share it on Instagram!
            </p>
            <button
              onClick={handleStart}
              className="squish w-full rounded-2xl bg-coffee py-3 text-sm font-bold text-cream scrapbook-shadow cursor-pointer"
            >
              Find My Match! 🐕🐾
            </button>
          </div>
        )}

        {/* Steps 1-5: Questions */}
        {currentQuestion && (
          <div className="space-y-4 pt-2">
            <p className="text-xs font-bold uppercase tracking-widest text-coffee/50">
              Question {step} of 5
            </p>
            <h2 className="font-display text-xl text-coffee leading-snug">
              {currentQuestion.text}
            </h2>
            <div className="grid gap-3 pt-2">
              {currentQuestion.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleSelectOption(opt.pet)}
                  className="flex items-center gap-3 w-full rounded-2xl border border-coffee/15 bg-white p-4 text-left font-semibold text-coffee hover:bg-cream/40 transition-all cursor-pointer animate-[fade-up_0.3s_ease-out_both]"
                  style={{ animationDelay: `${i * 75}ms` }}
                >
                  <span className="text-2xl">{opt.icon}</span>
                  <span className="text-sm">{opt.text}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 6: Results */}
        {step === 6 && result && (
          <div className="space-y-5 pt-2">
            <p className="text-xs font-bold uppercase tracking-widest text-coffee/50">
              You Matched With:
            </p>

            <div className="mx-auto max-w-[200px] border border-coffee/5 bg-cream/35 p-3 pb-6 shadow rotate-2 relative">
              <img
                src={petImg}
                alt={result.name}
                className="h-32 w-full object-cover rounded bg-coffee/10 animate-pulse"
              />
              <h3 className="font-display text-2xl mt-3">
                {result.name} {result.emoji}
              </h3>
              <p className="font-hand text-base text-peach mt-1">"{result.nickname}"</p>
              <span className="absolute -top-2 -right-2 rounded-full bg-peach px-2 py-0.5 text-[8px] font-bold text-coffee uppercase shadow">
                {result.similarity}
              </span>
            </div>

            <p className="text-sm font-semibold text-coffee/80 px-2 leading-relaxed">
              {result.desc}
            </p>

            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={claimReward}
                className="squish w-full rounded-2xl bg-coffee py-3 text-sm font-bold text-cream scrapbook-shadow cursor-pointer"
              >
                Claim Treat & Meet {result.name} 🍪
              </button>
              <button
                onClick={shareInstagram}
                className="squish w-full rounded-2xl border-2 border-coffee bg-peach py-2.5 text-xs font-bold text-coffee hover:bg-peach/90 cursor-pointer"
              >
                📸 Share on Instagram Story
              </button>
              <button
                onClick={() => setStep(0)}
                className="text-[10px] font-bold text-coffee/50 hover:text-peach transition-colors py-1 cursor-pointer"
              >
                Replay Quiz 🔄
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
