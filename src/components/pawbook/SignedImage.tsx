import { useEffect, useState } from "react";
import { signedUrlFor, resolveAsset } from "@/lib/storage";

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
    if (
      storageRef.startsWith("data:") ||
      storageRef.startsWith("blob:") ||
      storageRef.startsWith("http") ||
      storageRef.startsWith("/src/assets/") ||
      storageRef.startsWith("/") ||
      storageRef.endsWith(".jpg") ||
      storageRef.endsWith(".jpeg") ||
      storageRef.endsWith(".png") ||
      storageRef.endsWith(".webp")
    ) {
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
    if (
      storageRef.startsWith("data:") ||
      storageRef.startsWith("blob:") ||
      storageRef.startsWith("http") ||
      storageRef.startsWith("/src/assets/") ||
      storageRef.startsWith("/") ||
      storageRef.endsWith(".mp4") ||
      storageRef.endsWith(".webm")
    ) {
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
