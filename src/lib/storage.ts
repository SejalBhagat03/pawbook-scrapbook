import { supabase } from "@/integrations/supabase/client";

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
