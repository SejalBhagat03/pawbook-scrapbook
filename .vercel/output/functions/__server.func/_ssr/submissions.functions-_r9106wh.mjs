import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-BiV6Ea5I.mjs";
import { n as objectType, r as stringType, t as enumType } from "../_libs/zod.mjs";
import { t as createServerRpc } from "./createServerRpc-B90ckaqP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/submissions.functions-_r9106wh.js
var submitSchema = objectType({
	name: stringType().trim().min(1).max(80),
	species: stringType().trim().min(1).max(40),
	location: stringType().trim().min(1).max(120),
	story: stringType().trim().min(10).max(2e3),
	photoRef: stringType().min(3).max(300),
	videoRef: stringType().max(300).optional().nullable()
});
var submitFoundFriend_createServerFn_handler = createServerRpc({
	id: "ef9df5a67f9b2f3ca428438b7a2f922a57fdcafe8f0d98308e6a961b917dc70e",
	name: "submitFoundFriend",
	filename: "src/lib/submissions.functions.ts"
}, (opts) => submitFoundFriend.__executeServer(opts));
var submitFoundFriend = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => submitSchema.parse(input)).handler(submitFoundFriend_createServerFn_handler, async ({ data, context }) => {
	const { supabase, userId } = context;
	const { error, data: row } = await supabase.from("found_friends").insert({
		submitted_by: userId,
		name: data.name,
		species: data.species,
		location: data.location,
		story: data.story,
		photo_url: data.photoRef,
		video_url: data.videoRef ?? null,
		status: "pending"
	}).select().single();
	if (error) throw new Error(error.message);
	return row;
});
var listMySubmissions_createServerFn_handler = createServerRpc({
	id: "e0cc85a5a8be31942bbe2ca4fb51c8df1ebae75f28c8fdb538356acf397c4296",
	name: "listMySubmissions",
	filename: "src/lib/submissions.functions.ts"
}, (opts) => listMySubmissions.__executeServer(opts));
var listMySubmissions = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(listMySubmissions_createServerFn_handler, async ({ context }) => {
	const { data, error } = await context.supabase.from("found_friends").select("*").eq("submitted_by", context.userId).order("created_at", { ascending: false });
	if (error) throw new Error(error.message);
	return data;
});
var listPendingSubmissions_createServerFn_handler = createServerRpc({
	id: "20a38decdef8c675952deadb85b1547dce06dbf0a94425c1b96ab3a997f1be07",
	name: "listPendingSubmissions",
	filename: "src/lib/submissions.functions.ts"
}, (opts) => listPendingSubmissions.__executeServer(opts));
var listPendingSubmissions = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(listPendingSubmissions_createServerFn_handler, async ({ context }) => {
	const { data: isAdmin } = await context.supabase.rpc("has_role", {
		_user_id: context.userId,
		_role: "admin"
	});
	if (!isAdmin) throw new Error("Forbidden");
	const { data, error } = await context.supabase.from("found_friends").select("*").order("created_at", { ascending: false });
	if (error) throw new Error(error.message);
	return data;
});
var reviewSchema = objectType({
	id: stringType().uuid(),
	status: enumType(["approved", "rejected"])
});
var reviewSubmission_createServerFn_handler = createServerRpc({
	id: "fd16551f73d4384b8d6b5d7c9928fe5f681bb1bbae03329d5d441d0bc656afa5",
	name: "reviewSubmission",
	filename: "src/lib/submissions.functions.ts"
}, (opts) => reviewSubmission.__executeServer(opts));
var reviewSubmission = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => reviewSchema.parse(input)).handler(reviewSubmission_createServerFn_handler, async ({ data, context }) => {
	const { data: isAdmin } = await context.supabase.rpc("has_role", {
		_user_id: context.userId,
		_role: "admin"
	});
	if (!isAdmin) throw new Error("Forbidden");
	const { error, data: row } = await context.supabase.from("found_friends").update({
		status: data.status,
		reviewed_by: context.userId,
		reviewed_at: (/* @__PURE__ */ new Date()).toISOString()
	}).eq("id", data.id).select().single();
	if (error) throw new Error(error.message);
	return row;
});
var checkIsAdmin_createServerFn_handler = createServerRpc({
	id: "b7494ca3ec0cfffda02162b7144901d3d801970e9aa6a4c1c43a2a2160e03f98",
	name: "checkIsAdmin",
	filename: "src/lib/submissions.functions.ts"
}, (opts) => checkIsAdmin.__executeServer(opts));
var checkIsAdmin = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(checkIsAdmin_createServerFn_handler, async ({ context }) => {
	const { data } = await context.supabase.rpc("has_role", {
		_user_id: context.userId,
		_role: "admin"
	});
	return { isAdmin: Boolean(data) };
});
//#endregion
export { checkIsAdmin_createServerFn_handler, listMySubmissions_createServerFn_handler, listPendingSubmissions_createServerFn_handler, reviewSubmission_createServerFn_handler, submitFoundFriend_createServerFn_handler };
