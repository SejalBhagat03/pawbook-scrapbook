import { useState, useEffect } from "react";
import { resolveAsset } from "@/lib/storage";

export function PetPhoto({
  slug,
  image,
  className,
}: {
  slug: string;
  image: string;
  className?: string;
}) {
  const [accessory, setAccessory] = useState<string | null>(null);

  useEffect(() => {
    const handleUpdate = () => {
      setAccessory(localStorage.getItem(`pawbook-accessory-${slug}`));
    };
    handleUpdate();
    window.addEventListener("pawbook-accessory-updated", handleUpdate);
    return () => window.removeEventListener("pawbook-accessory-updated", handleUpdate);
  }, [slug]);

  return (
    <div className={`relative ${className || "h-full w-full"}`}>
      <img
        src={resolveAsset(image)}
        alt=""
        className="h-full w-full object-cover"
        style={slug === "coco" ? { objectPosition: "center 25%" } : undefined}
      />
      {accessory === "crown" && (
        <span
          className="absolute -top-1.5 left-1/2 -translate-x-1/2 text-4xl select-none drop-shadow z-10 animate-bounce"
          style={{ animationDuration: "2s" }}
        >
          👑
        </span>
      )}
      {accessory === "scarf" && (
        <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-4xl select-none drop-shadow z-10">
          🧣
        </span>
      )}
      {accessory === "glasses" && (
        <span className="absolute top-10 left-1/2 -translate-x-1/2 text-3xl select-none drop-shadow z-10">
          🕶️
        </span>
      )}
      {accessory === "hat" && (
        <span className="absolute -top-3 left-1/3 text-4xl select-none drop-shadow z-10 rotate-12">
          🥳
        </span>
      )}
    </div>
  );
}
