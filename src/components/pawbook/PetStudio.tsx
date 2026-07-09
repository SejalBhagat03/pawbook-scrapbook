import { useState, useEffect } from "react";
import { toast } from "sonner";
import { animals } from "@/lib/pawbook-data";
import { playPop } from "@/lib/sound";

export function PetStudio() {
  const [selectedPet, setSelectedPet] = useState(animals[0].slug);
  const [accessory, setAccessory] = useState<string | null>(null);

  const activePet = animals.find((a) => a.slug === selectedPet) || animals[0];

  useEffect(() => {
    setAccessory(localStorage.getItem(`pawbook-accessory-${selectedPet}`));
  }, [selectedPet]);

  const selectAccessory = (acc: string | null) => {
    if (acc) {
      localStorage.setItem(`pawbook-accessory-${selectedPet}`, acc);
      toast.success(`${activePet.name} looks adorable wearing that! 🐾✨`);
    } else {
      localStorage.removeItem(`pawbook-accessory-${selectedPet}`);
    }
    setAccessory(acc);
    playPop();
    // Dispatch event to update other photos on the page
    window.dispatchEvent(new Event("pawbook-accessory-updated"));
  };

  return (
    <div className="w-full h-full flex flex-col justify-between items-center text-center">
      <div>
        <h3 className="font-display text-2xl mb-1 text-coffee">🎨 Pet Studio</h3>
        <p className="text-[10px] text-coffee/60 mb-4 max-w-xs mx-auto">
          Dress up your favorite village friends with cute hats and accessories!
        </p>
      </div>

      {/* Select Pet */}
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar w-full justify-center py-1">
        {animals.map((a) => (
          <button
            key={a.slug}
            onClick={() => setSelectedPet(a.slug)}
            className={`px-2.5 py-1 rounded-full text-xs font-bold transition cursor-pointer truncate ${selectedPet === a.slug ? "bg-coffee text-cream" : "bg-cream border border-coffee/10 hover:bg-cream/40"}`}
          >
            {a.name}
          </button>
        ))}
      </div>

      {/* Polaroid Preview */}
      <div className="relative border border-coffee/10 bg-white p-2.5 pb-6 scrapbook-shadow w-40 aspect-square my-3 flex flex-col justify-between overflow-hidden">
        <div className={`relative aspect-square overflow-hidden rounded-sm bg-${activePet.color}`}>
          <img src={activePet.image} alt={activePet.name} className="h-full w-full object-cover" />

          {/* Accessory Overlays */}
          {accessory === "crown" && (
            <span
              className="absolute -top-1 left-1/2 -translate-x-1/2 text-3xl select-none drop-shadow z-10 animate-bounce"
              style={{ animationDuration: "2s" }}
            >
              👑
            </span>
          )}
          {accessory === "scarf" && (
            <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-3xl select-none drop-shadow z-10">
              🧣
            </span>
          )}
          {accessory === "glasses" && (
            <span className="absolute top-6 left-1/2 -translate-x-1/2 text-2xl select-none drop-shadow z-10">
              🕶️
            </span>
          )}
          {accessory === "hat" && (
            <span className="absolute -top-2 left-1/3 text-3xl select-none drop-shadow z-10 rotate-12">
              🥳
            </span>
          )}
        </div>
      </div>

      {/* Accessories Grid */}
      <div className="w-full">
        <p className="text-[9px] font-bold text-coffee/50 uppercase tracking-wider mb-2">
          Select Accessory:
        </p>
        <div className="grid grid-cols-5 gap-1 text-sm">
          <button
            onClick={() => selectAccessory(null)}
            className={`py-1.5 rounded-lg border text-xs font-bold cursor-pointer ${!accessory ? "bg-coffee text-cream" : "bg-white border-coffee/10 hover:bg-cream/40"}`}
            title="Remove item"
          >
            ❌
          </button>
          <button
            onClick={() => selectAccessory("crown")}
            className={`py-1.5 rounded-lg border text-lg cursor-pointer ${accessory === "crown" ? "bg-coffee border-coffee" : "bg-white border-coffee/10 hover:bg-cream/40"}`}
            title="Crown"
          >
            👑
          </button>
          <button
            onClick={() => selectAccessory("scarf")}
            className={`py-1.5 rounded-lg border text-lg cursor-pointer ${accessory === "scarf" ? "bg-coffee border-coffee" : "bg-white border-coffee/10 hover:bg-cream/40"}`}
            title="Scarf"
          >
            🧣
          </button>
          <button
            onClick={() => selectAccessory("glasses")}
            className={`py-1.5 rounded-lg border text-lg cursor-pointer ${accessory === "glasses" ? "bg-coffee border-coffee" : "bg-white border-coffee/10 hover:bg-cream/40"}`}
            title="Glasses"
          >
            🕶️
          </button>
          <button
            onClick={() => selectAccessory("hat")}
            className={`py-1.5 rounded-lg border text-lg cursor-pointer ${accessory === "hat" ? "bg-coffee border-coffee" : "bg-white border-coffee/10 hover:bg-cream/40"}`}
            title="Party Hat"
          >
            🥳
          </button>
        </div>
      </div>
    </div>
  );
}
