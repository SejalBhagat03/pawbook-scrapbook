import { supabase } from "@/integrations/supabase/client";

// Import all static local assets to resolve their production path at runtime
import bruno from "@/assets/bruno.png";
import coco from "@/assets/coco.png";
import moti from "@/assets/moti.png";
import kitty from "@/assets/kitty.png";
import tommy from "@/assets/tommy.png";
import postMoti from "@/assets/post-moti.png";
import postKitty from "@/assets/post-kitty.png";

const assetMap: Record<string, string> = {
  "/src/assets/bruno.jpg": bruno,
  "/src/assets/bruno.png": bruno,
  "/src/assets/coco.jpg": coco,
  "/src/assets/coco.png": coco,
  "/src/assets/moti.jpg": moti,
  "/src/assets/moti.png": moti,
  "/src/assets/kitty.jpg": kitty,
  "/src/assets/kitty.png": kitty,
  "/src/assets/tommy.jpg": tommy,
  "/src/assets/tommy.png": tommy,
  "/src/assets/post-moti.jpg": postMoti,
  "/src/assets/post-moti.png": postMoti,
  "/src/assets/post-kitty.jpg": postKitty,
  "/src/assets/post-kitty.png": postKitty,
  "bruno.jpg": bruno,
  "bruno.png": bruno,
  "coco.jpg": coco,
  "coco.png": coco,
  "moti.jpg": moti,
  "moti.png": moti,
  "kitty.jpg": kitty,
  "kitty.png": kitty,
  "tommy.jpg": tommy,
  "tommy.png": tommy,
  "post-moti.jpg": postMoti,
  "post-moti.png": postMoti,
  "post-kitty.jpg": postKitty,
  "post-kitty.png": postKitty,
};

export function resolveAsset(path: string | undefined | null): string {
  if (!path) return "";
  if (assetMap[path]) {
    return assetMap[path];
  }
  const filename = path.split("/").pop();
  if (filename && assetMap[filename]) {
    return assetMap[filename];
  }
  // If the path contains dynamic storage prefixes but doesn't exist locally,
  // return as-is so it can be signed or loaded from Supabase
  return path;
}

export type PawbookBucket = "animal-photos" | "memory-photos" | "pawbook-videos";

export async function uploadToBucket(
  bucket: PawbookBucket,
  file: File,
  userId: string,
): Promise<{ path: string }> {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "bin";
  const path = `${userId}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type,
  });
  if (error) throw error;
  return { path: `${bucket}/${path}` };
}

/** photo_url column stores "bucket/key". Get its public URL. */
export async function signedUrlFor(storageRef: string, expiresIn = 3600): Promise<string | null> {
  const [bucket, ...rest] = storageRef.split("/");
  const key = rest.join("/");
  if (!bucket || !key) return null;
  try {
    const { data } = supabase.storage.from(bucket).getPublicUrl(key);
    return data.publicUrl;
  } catch (err) {
    console.error("Failed to resolve public URL:", err);
    return null;
  }
}
