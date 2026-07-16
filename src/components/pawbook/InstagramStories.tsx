import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import cocoImg from "@/assets/coco.png";
import motiImg from "@/assets/moti.png";
import kittyImg from "@/assets/kitty.png";
import tommyImg from "@/assets/tommy.png";

interface StorySlide {
  image: string;
  title: string;
  desc: string;
}

interface PetStory {
  slug: string;
  name: string;
  emoji: string;
  avatar: string;
  slides: StorySlide[];
}

const storiesData: PetStory[] = [
  {
    slug: "coco",
    name: "Coco",
    emoji: "🐕",
    avatar: cocoImg,
    slides: [
      {
        image: cocoImg,
        title: "Day 1: First Hello 🐯",
        desc: "Found Coco sitting under the garden tree. He looked big and powerful like a tiger, but as soon as we held out a treat, he wagged his tail and licked our hands! ❤️",
      },
      {
        image:
          "https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?auto=format&fit=crop&q=80&w=600",
        title: "Naughty Moment: The Flowerpot Hat 🌸",
        desc: "Coco chased a butterfly around the garden and ran directly into a hanging basket. Spent the afternoon wearing it like a hat.",
      },
      {
        image: cocoImg,
        title: "Favorite Thing: Treats 🎂",
        desc: "Coco is incredibly friendly and will happily sit, stand, or shake hands for dog-friendly birthday treat cake!",
      },
    ],
  },
  {
    slug: "moti",
    name: "Moti",
    emoji: "🐶",
    avatar: motiImg,
    slides: [
      {
        image: motiImg,
        title: "Day 1: Safe & Sound ❤️",
        desc: "Moti was a tiny ball of fluff when he wandered into the lane. The local tea vendor gave him a cardboard bed and warm milk.",
      },
      {
        image:
          "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&q=80&w=600",
        title: "Naughty Moment: Bed Blocker 😴",
        desc: "Moti once napped in front of the tea stall door for 4 hours. Customers had to step over him, but they left extra biscuits!",
      },
      {
        image:
          "https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?auto=format&fit=crop&q=80&w=600",
        title: "Favorite Thing: Belly Rubs 🐾",
        desc: "Loves to flop onto his back the second you say hello. He believes belly rubs are a human's main duty.",
      },
    ],
  },
  {
    slug: "kitty",
    name: "Kitty",
    emoji: "🐈",
    avatar: kittyImg,
    slides: [
      {
        image: kittyImg,
        title: "Day 1: The Queen's Arrival 👑",
        desc: "Slipped into the library balcony silently. We didn't find her; she found us and claimed the balcony cushion.",
      },
      {
        image:
          "https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&q=80&w=600",
        title: "Naughty Moment: Pigeon Hunter 🕊️",
        desc: "Stared at a pigeon on the tin roof for 6 hours without blinking. She didn't catch it, but the pigeon left out of anxiety.",
      },
      {
        image:
          "https://images.unsplash.com/photo-1548247416-ec66f4900b2e?auto=format&fit=crop&q=80&w=600",
        title: "Favorite Thing: Balcony Sunbeams ☀️",
        desc: "Kitty sits in the square of warm sunlight. If the sunbeam moves across the floor, Kitty slowly slides with it.",
      },
    ],
  },
  {
    slug: "tommy",
    name: "Tommy",
    emoji: "🐕",
    avatar: tommyImg,
    slides: [
      {
        image: tommyImg,
        title: "Day 1: Tiny Monster 🍼",
        desc: "Found shivering in a monsoon puddle. A student picked him up and dried him with their favorite winter scarf.",
      },
      {
        image:
          "https://images.unsplash.com/photo-1503256207526-0d5d80fa2f47?auto=format&fit=crop&q=80&w=600",
        title: "Naughty Moment: Leaf Chase Chaos 🍃",
        desc: "Spotted running in circles chasing a leaf, got dizzy, and knocked over a stack of plastic tea cups. Oops!",
      },
      {
        image:
          "https://images.unsplash.com/photo-1477884213960-b131f91f914d?auto=format&fit=crop&q=80&w=600",
        title: "Favorite Thing: His Scarf 🧣",
        desc: "Tommy will not leave for a run without his red woolen scarf. He acts like a super-hero in it.",
      },
    ],
  },
];

export function InstagramStories() {
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  const closeStories = useCallback(() => {
    setActiveStoryIndex(null);
    setActiveSlideIndex(0);
  }, []);

  const handleNext = useCallback(() => {
    if (activeStoryIndex === null) return;
    const petStory = storiesData[activeStoryIndex];
    if (activeSlideIndex < petStory.slides.length - 1) {
      setActiveSlideIndex(activeSlideIndex + 1);
    } else {
      if (activeStoryIndex < storiesData.length - 1) {
        setActiveStoryIndex(activeStoryIndex + 1);
        setActiveSlideIndex(0);
      } else {
        closeStories();
      }
    }
  }, [activeStoryIndex, activeSlideIndex, closeStories]);

  const handlePrev = useCallback(() => {
    if (activeStoryIndex === null) return;
    if (activeSlideIndex > 0) {
      setActiveSlideIndex(activeSlideIndex - 1);
    } else {
      if (activeStoryIndex > 0) {
        setActiveStoryIndex(activeStoryIndex - 1);
        setActiveSlideIndex(storiesData[activeStoryIndex - 1].slides.length - 1);
      }
    }
  }, [activeStoryIndex, activeSlideIndex]);

  // Auto-advance slides timer
  useEffect(() => {
    if (activeStoryIndex === null) return;

    const timer = setTimeout(() => {
      handleNext();
    }, 4500);

    return () => clearTimeout(timer);
  }, [activeStoryIndex, activeSlideIndex, handleNext]);

  const openStory = (idx: number) => {
    setActiveStoryIndex(idx);
    setActiveSlideIndex(0);
    toast.success(`Opening ${storiesData[idx].name}'s diary... 📸`);
  };

  const activePetStory = activeStoryIndex !== null ? storiesData[activeStoryIndex] : null;
  const currentSlide = activePetStory ? activePetStory.slides[activeSlideIndex] : null;

  return (
    <div className="w-full">
      {/* Horizontal Circle Row */}
      <div className="flex justify-center gap-4 py-4 overflow-x-auto scrollbar-none">
        {storiesData.map((pc, idx) => (
          <button
            key={pc.slug}
            onClick={() => openStory(idx)}
            className="flex flex-col items-center gap-1 focus:outline-none cursor-pointer group shrink-0"
          >
            {/* Glowing Border Circle */}
            <div className="rounded-full p-[2.5px] bg-linear-to-tr from-yellow-500 via-peach to-pink-500 group-hover:scale-105 active:scale-95 transition-transform duration-300">
              <div className="rounded-full border-2 border-white bg-white p-px">
                <img
                  src={pc.avatar}
                  alt={pc.name}
                  className="size-16 rounded-full object-cover shrink-0"
                />
              </div>
            </div>
            <span className="text-[10px] font-bold text-coffee/85">
              {pc.name} {pc.emoji}
            </span>
          </button>
        ))}
      </div>

      {/* Fullscreen Story Modal */}
      {activeStoryIndex !== null && activePetStory && currentSlide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md animate-fade-in select-none">
          <div className="relative w-full max-w-md h-full sm:h-[80vh] sm:rounded-3xl overflow-hidden bg-coffee flex flex-col justify-between">
            {/* Top Indicator Bars */}
            <div className="absolute top-3 left-4 right-4 z-20 flex gap-1">
              {activePetStory.slides.map((_, idx) => (
                <div key={idx} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className={
                      "h-full rounded-full transition-all duration-300 " +
                      (idx < activeSlideIndex
                        ? "bg-white w-full"
                        : idx === activeSlideIndex
                          ? "bg-white animate-story-progress"
                          : "bg-white/0 w-0")
                    }
                    style={{
                      animationDuration: idx === activeSlideIndex ? "4.5s" : "0s",
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Slide Header Info */}
            <div className="absolute top-7 left-4 right-4 z-20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img
                  src={activePetStory.avatar}
                  alt=""
                  className="size-9 rounded-full object-cover border-2 border-white"
                />
                <div>
                  <h4 className="text-white text-xs font-bold font-display">
                    {activePetStory.name} {activePetStory.emoji}
                  </h4>
                  <p className="text-[9px] text-white/60">@{activePetStory.slug}_diaries</p>
                </div>
              </div>
              <button
                onClick={closeStories}
                className="h-8 w-8 rounded-full bg-black/45 text-white flex items-center justify-center font-bold text-sm hover:bg-black/60 cursor-pointer"
              >
                ✖
              </button>
            </div>

            {/* Click/Tap Areas (Left and Right sides of screen) */}
            <div
              className="absolute inset-y-0 left-0 w-1/3 z-10 cursor-pointer"
              onClick={handlePrev}
            />
            <div
              className="absolute inset-y-0 right-0 w-1/3 z-10 cursor-pointer"
              onClick={handleNext}
            />

            {/* Story Slide Image */}
            <div className="w-full flex-1 bg-coffee/80 flex items-center justify-center relative overflow-hidden">
              <img
                src={currentSlide.image}
                alt=""
                className="w-full h-full object-cover sm:rounded-t-3xl"
              />
              {/* Soft vignette overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-black/50" />
            </div>

            {/* Slide Text Content & Dialog */}
            <div className="p-5 bg-black/85 text-cream z-20 space-y-2 border-t border-white/10 select-text">
              <h3 className="font-display text-lg text-peach">{currentSlide.title}</h3>
              <p className="text-cream/80 leading-relaxed font-hand text-lg">
                "{currentSlide.desc}"
              </p>

              <div className="pt-2 flex items-center justify-between">
                <button
                  onClick={() => {
                    toast.success(`You booped ${activePetStory.name}! ❤️`);
                  }}
                  className="rounded-full bg-white/10 px-4 py-1.5 text-[10px] font-bold hover:bg-white/20 active:scale-95 transition-transform cursor-pointer"
                >
                  ❤️ Send Love
                </button>
                <span className="text-[9px] text-white/40 uppercase tracking-wider">
                  Tap sides to navigate
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
