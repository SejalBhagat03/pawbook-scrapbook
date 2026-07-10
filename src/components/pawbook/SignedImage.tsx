import { useEffect, useState } from "react";
import { signedUrlFor, resolveAsset } from "@/lib/storage";

function isLocalAsset(ref: string): boolean {
  if (!ref) return false;
  if (
    ref.startsWith("data:") ||
    ref.startsWith("blob:") ||
    ref.startsWith("http:") ||
    ref.startsWith("https:") ||
    ref.startsWith("/src/assets/") ||
    ref.startsWith("src/assets/") ||
    ref.startsWith("/assets/")
  ) {
    return true;
  }
  const filename = ref.split("/").pop();
  const staticFiles = [
    "bruno.jpg",
    "coco.jpg",
    "moti.jpg",
    "kitty.jpg",
    "tommy.jpg",
    "post-moti.jpg",
    "post-kitty.jpg",
  ];
  if (filename && staticFiles.includes(filename)) {
    return true;
  }
  return false;
}

export function SignedImage({
  storageRef,
  alt,
  className,
}: {
  storageRef: string;
  alt: string;
  className?: string;
}) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    if (isLocalAsset(storageRef)) {
      setUrl(resolveAsset(storageRef));
      return;
    }
    let cancelled = false;
    signedUrlFor(storageRef).then((u) => {
      if (!cancelled) setUrl(u);
    });
    return () => {
      cancelled = true;
    };
  }, [storageRef]);
  if (!url) {
    return <div className={"animate-pulse bg-coffee/10 " + (className ?? "")} />;
  }
  return <img src={url} alt={alt} className={className} loading="lazy" />;
}

export function SignedVideo({ storageRef, className }: { storageRef: string; className?: string }) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    if (isLocalAsset(storageRef)) {
      setUrl(resolveAsset(storageRef));
      return;
    }
    let cancelled = false;
    signedUrlFor(storageRef).then((u) => {
      if (!cancelled) setUrl(u);
    });
    return () => {
      cancelled = true;
    };
  }, [storageRef]);
  if (!url) return <div className={"animate-pulse bg-coffee/10 " + (className ?? "")} />;
  return <video src={url} controls className={className} />;
}
