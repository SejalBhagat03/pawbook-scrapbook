import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as PageShell } from "./SiteChrome-D0iB99sW.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/about-BtPuTvP4.js
var import_jsx_runtime = require_jsx_runtime();
function AboutPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PageShell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto max-w-3xl px-6 pt-14 pb-6 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-2 text-sm font-bold uppercase tracking-widest text-coffee/50",
				children: "❤️ About"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
				className: "font-display text-4xl sm:text-5xl md:text-6xl",
				children: ["The human behind ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-peach",
					children: "PawBook"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mx-auto mt-4 max-w-xl font-hand text-2xl text-coffee/80",
				children: "Created by Sejal ❤️"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mx-auto mt-2 max-w-xl text-coffee/70",
				children: "A project built with technology and kindness to save small stories of animals who cannot tell their own."
			})
		]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto max-w-3xl px-6 py-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-3xl border border-coffee/10 bg-white p-6 scrapbook-shadow sm:p-10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-hand text-2xl leading-snug text-coffee",
					children: "\"Every street animal has a name. Every little life deserves to be remembered.\""
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-coffee/70",
					children: "PawBook grew out of the belief that the tiny lives passing through our streets — the biscuit-loving Brunos, the rooftop-philosopher Kittys, the rain-soaked Tommys — are already characters in a story. This is a place to write it down."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 rounded-3xl border border-coffee/10 bg-white p-6 scrapbook-shadow sm:p-10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-bold uppercase tracking-widest text-coffee/60",
					children: "Built with"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 flex flex-wrap gap-2",
					children: [
						"React",
						"TypeScript",
						"Tailwind CSS",
						"AI",
						"Authentication",
						"Database",
						"Storage"
					].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "rounded-full bg-cream px-3 py-1 text-sm font-bold",
						children: t
					}, t))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 flex flex-wrap gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/paw-friends",
					className: "rounded-full bg-coffee px-5 py-2.5 text-sm font-bold text-cream",
					children: "Meet the friends"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/garden",
					className: "rounded-full border border-coffee/15 bg-white px-5 py-2.5 text-sm font-bold",
					children: "Visit the garden"
				})]
			})
		]
	})] });
}
//#endregion
export { AboutPage as component };
