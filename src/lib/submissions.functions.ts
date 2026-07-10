import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const submitSchema = z.object({
  name: z.string().trim().min(1).max(80),
  species: z.string().trim().min(1).max(40),
  location: z.string().trim().min(1).max(120),
  story: z.string().trim().min(10).max(2000),
  photoRef: z.string().min(3).max(300),
  videoRef: z.string().max(300).optional().nullable(),
});

export const submitFoundFriend = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => submitSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { error, data: row } = await supabase
      .from("found_friends")
      .insert({
        submitted_by: userId,
        name: data.name,
        species: data.species,
        location: data.location,
        story: data.story,
        photo_url: data.photoRef,
        video_url: data.videoRef ?? null,
        status: "pending",
      })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return row;
  });

export const listMySubmissions = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("found_friends")
      .select("*")
      .eq("submitted_by", context.userId)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data;
  });

export const listPendingSubmissions = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (!isAdmin) throw new Error("Forbidden");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("found_friends")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data;
  });

export const getPendingSubmissionsCount = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (!isAdmin) return { count: 0 };

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { count, error } = await supabaseAdmin
      .from("found_friends")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending");
    if (error) throw new Error(error.message);
    return { count: count || 0 };
  });

const reviewSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["approved", "rejected"]),
});

export const reviewSubmission = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => reviewSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (!isAdmin) throw new Error("Forbidden");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error, data: row } = await supabaseAdmin
      .from("found_friends")
      .update({
        status: data.status,
        reviewed_by: context.userId,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", data.id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return row;
  });

export const checkIsAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    return { isAdmin: Boolean(data) };
  });

// Allow guest/anonymous uploads and submissions
export const uploadGuestPhoto = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    return z
      .object({
        base64: z.string(),
        fileName: z.string(),
        contentType: z.string(),
      })
      .parse(input);
  })
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const buffer = Buffer.from(data.base64, "base64");
    const bucket = "animal-photos";
    const ext = data.fileName.split(".").pop()?.toLowerCase() ?? "bin";
    const path = `guest/${crypto.randomUUID()}.${ext}`;

    // Auto-create storage bucket if it does not exist
    try {
      const { data: buckets } = await supabaseAdmin.storage.listBuckets();
      const exists = buckets?.some((b) => b.id === bucket);
      if (!exists) {
        await supabaseAdmin.storage.createBucket(bucket, {
          public: true,
          fileSizeLimit: 10485760, // 10MB
        });
      }
    } catch (err) {
      console.warn("Storage bucket checks failed:", err);
    }

    const { error } = await supabaseAdmin.storage.from(bucket).upload(path, buffer, {
      cacheControl: "3600",
      upsert: false,
      contentType: data.contentType,
    });

    if (error) throw new Error(error.message);
    return { path: `${bucket}/${path}` };
  });

export const submitGuestFriend = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    return z
      .object({
        name: z.string().trim().max(80),
        species: z.string().trim().min(1).max(40),
        location: z.string().trim().max(120).optional(),
        story: z.string().trim().min(10).max(2000),
        photoRef: z.string().min(3).max(300),
        videoRef: z.string().max(300).optional().nullable(),
        tags: z.array(z.string()).optional(),
      })
      .parse(input);
  })
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Get fallback user ID from Auth to satisfy foreign key constraints
    let fallbackUserId = "00000000-0000-0000-0000-000000000000";
    try {
      const { data: usersData, error: usersErr } = await supabaseAdmin.auth.admin.listUsers();
      if (!usersErr && usersData.users && usersData.users.length > 0) {
        fallbackUserId = usersData.users[0].id;
      } else {
        const { data: roles } = await supabaseAdmin.from("user_roles").select("user_id").limit(1);
        if (roles && roles.length > 0) {
          fallbackUserId = roles[0].user_id;
        }
      }
    } catch (e) {
      console.error("Failed to query fallback user ID for guest upload:", e);
    }

    const formattedStory = `${data.story} [guest:true][tags:${(data.tags || []).join(",")}]`;

    const { error, data: row } = await supabaseAdmin
      .from("found_friends")
      .insert({
        submitted_by: fallbackUserId,
        name: data.name || "New Paw Friend",
        species: data.species,
        location: data.location || "Cozy Corner",
        story: formattedStory,
        photo_url: data.photoRef,
        video_url: data.videoRef ?? null,
        status: "pending",
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return row;
  });

export const deleteSubmission = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (!isAdmin) throw new Error("Forbidden");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("found_friends").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { success: true };
  });
