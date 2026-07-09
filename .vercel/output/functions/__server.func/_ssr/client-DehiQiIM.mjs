import { t as createClient } from "../_libs/supabase__supabase-js.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/client-DehiQiIM.js
function isNewSupabaseApiKey(value) {
	return value.startsWith("sb_publishable_") || value.startsWith("sb_secret_");
}
function createSupabaseFetch(supabaseKey) {
	return (input, init) => {
		const headers = new Headers(typeof Request !== "undefined" && input instanceof Request ? input.headers : void 0);
		if (init?.headers) new Headers(init.headers).forEach((value, key) => headers.set(key, value));
		if (isNewSupabaseApiKey(supabaseKey) && headers.get("Authorization") === `Bearer ${supabaseKey}`) headers.delete("Authorization");
		headers.set("apikey", supabaseKey);
		return fetch(input, {
			...init,
			headers
		});
	};
}
function cleanEnvValue(val) {
	if (!val) return val;
	return val.replace(/^["']|["']$/g, "").trim();
}
function createSupabaseClient() {
	const SUPABASE_URL = cleanEnvValue("https://hhxsxdxrwnhekovhzlni.supabase.co");
	const SUPABASE_PUBLISHABLE_KEY = cleanEnvValue("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhoeHN4ZHhyd25oZWtvdmh6bG5pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMyNjAxMjksImV4cCI6MjA5ODgzNjEyOX0.JTygkKS3ut0xTsTky6GvBDqdlOz_sFqBAjtxl-f-cKo");
	console.log("[Supabase Init] URL found:", !!SUPABASE_URL, "| Key found:", !!SUPABASE_PUBLISHABLE_KEY);
	if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
		const message = `Missing Supabase environment variable(s): ${[...!SUPABASE_URL ? ["SUPABASE_URL"] : [], ...!SUPABASE_PUBLISHABLE_KEY ? ["SUPABASE_PUBLISHABLE_KEY"] : []].join(", ")}. Please configure them in your environment settings.`;
		console.error(`[Supabase] ${message}`);
		throw new Error(message);
	}
	return createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
		global: { fetch: createSupabaseFetch(SUPABASE_PUBLISHABLE_KEY) },
		auth: {
			storage: typeof window !== "undefined" ? localStorage : void 0,
			persistSession: true,
			autoRefreshToken: true
		}
	});
}
var MockSupabaseClient = class {
	error;
	auth;
	constructor(error) {
		this.error = error;
		this.auth = {
			onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
			getSession: () => Promise.resolve({ data: { session: null } })
		};
	}
	from() {
		return { select: () => ({ eq: () => ({ order: () => Promise.resolve({
			data: [],
			error: this.error
		}) }) }) };
	}
};
var _supabase;
var supabase = new Proxy({}, { get(target, prop, receiver) {
	if (!_supabase) try {
		_supabase = createSupabaseClient();
	} catch (err) {
		console.error("[Supabase Proxy Catch] Fallback to MockSupabaseClient:", err);
		_supabase = new MockSupabaseClient(err instanceof Error ? err : new Error(String(err)));
	}
	return Reflect.get(_supabase, prop, receiver);
} });
//#endregion
export { supabase as t };
