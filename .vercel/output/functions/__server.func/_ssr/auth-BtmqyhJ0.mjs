import { r as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-DehiQiIM.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { t as PageShell } from "./SiteChrome-D0iB99sW.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-BtmqyhJ0.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AuthPage() {
	const navigate = useNavigate();
	const [mode, setMode] = (0, import_react.useState)("sign-in");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		supabase.auth.getSession().then(({ data }) => {
			if (data.session) navigate({ to: "/found-friends" });
		});
		const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
			if (session) navigate({ to: "/found-friends" });
		});
		return () => subscription.unsubscribe();
	}, [navigate]);
	async function handleEmail(e) {
		e.preventDefault();
		setBusy(true);
		try {
			if (mode === "sign-up") {
				const { error } = await supabase.auth.signUp({
					email,
					password,
					options: { emailRedirectTo: window.location.origin }
				});
				if (error) throw error;
				toast.success("Check your inbox to confirm your email 🐾");
			} else {
				const { error } = await supabase.auth.signInWithPassword({
					email,
					password
				});
				if (error) throw error;
				toast.success("Welcome back 🌸");
				navigate({ to: "/found-friends" });
			}
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Something went wrong");
		} finally {
			setBusy(false);
		}
	}
	async function handleGoogle() {
		setBusy(true);
		const { data, error } = await supabase.auth.signInWithOAuth({
			provider: "google",
			options: { redirectTo: window.location.origin + "/auth" }
		});
		if (error) {
			toast.error(error.message);
			setBusy(false);
		}
	}
	async function handleGuest() {
		setBusy(true);
		try {
			const { data, error } = await supabase.auth.signInAnonymously();
			if (error) throw error;
			toast.success("Welcome, Guest! 🐾");
			navigate({ to: "/found-friends" });
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Failed to sign in as guest");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-md px-6 pt-10",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "scrapbook-shadow rounded-3xl border border-coffee/10 bg-white/90 p-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-4xl",
							children: "🐾"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-2 font-display text-3xl",
							children: mode === "sign-in" ? "Welcome back" : "Join PawBook"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-coffee/70",
							children: "Share the little friends you meet on the street."
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: handleGoogle,
					disabled: busy,
					className: "mt-6 flex w-full items-center justify-center gap-2 rounded-full border border-coffee/20 bg-white px-4 py-2.5 text-sm font-semibold text-coffee hover:bg-cream disabled:opacity-50 cursor-pointer",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "🔆" }), " Continue with Google"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: handleGuest,
					disabled: busy,
					className: "mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-peach px-4 py-2.5 text-sm font-bold text-coffee hover:scale-105 transition-transform disabled:opacity-50 cursor-pointer",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "🐾" }), " Continue as Guest (No Login)"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "my-5 flex items-center gap-3 text-xs text-coffee/50",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px flex-1 bg-coffee/10" }),
						" or email",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px flex-1 bg-coffee/10" })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleEmail,
					className: "space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "email",
							required: true,
							value: email,
							onChange: (e) => setEmail(e.target.value),
							placeholder: "you@example.com",
							className: "w-full rounded-xl border border-coffee/15 bg-cream/40 px-4 py-2.5 text-sm outline-none focus:border-peach"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "password",
							required: true,
							minLength: 6,
							value: password,
							onChange: (e) => setPassword(e.target.value),
							placeholder: "Password",
							className: "w-full rounded-xl border border-coffee/15 bg-cream/40 px-4 py-2.5 text-sm outline-none focus:border-peach"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							disabled: busy,
							className: "w-full rounded-full bg-coffee px-5 py-2.5 text-sm font-bold text-cream hover:bg-coffee/90 disabled:opacity-50",
							children: mode === "sign-in" ? "Sign in" : "Create account"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setMode(mode === "sign-in" ? "sign-up" : "sign-in"),
					className: "mt-4 w-full text-center text-xs text-coffee/60 hover:text-peach",
					children: mode === "sign-in" ? "New here? Create an account" : "Already have an account? Sign in"
				})
			]
		})
	}) });
}
//#endregion
export { AuthPage as component };
