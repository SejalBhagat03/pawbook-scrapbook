import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { y as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { n as SectionHeading, t as PageShell } from "./SiteChrome-D0iB99sW.mjs";
import { i as reviewSubmission, o as useServerFn, r as listPendingSubmissions, t as checkIsAdmin } from "./submissions.functions-BVJQlA9q.mjs";
import { n as SignedVideo, t as SignedImage } from "./SignedImage-Cs4AUWaF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.moderation-DbRIH9HX.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ModerationPage() {
	const router = useRouter();
	const isAdminFn = useServerFn(checkIsAdmin);
	const listFn = useServerFn(listPendingSubmissions);
	const reviewFn = useServerFn(reviewSubmission);
	const [isAdmin, setIsAdmin] = (0, import_react.useState)(null);
	const [rows, setRows] = (0, import_react.useState)([]);
	const [filter, setFilter] = (0, import_react.useState)("pending");
	(0, import_react.useEffect)(() => {
		isAdminFn().then((r) => setIsAdmin(r.isAdmin));
	}, [isAdminFn]);
	(0, import_react.useEffect)(() => {
		if (isAdmin) listFn().then((data) => setRows(data ?? []));
	}, [isAdmin, listFn]);
	async function handleReview(id, status) {
		try {
			await reviewFn({ data: {
				id,
				status
			} });
			toast.success(status === "approved" ? "Approved 🌸" : "Marked as rejected");
			const data = await listFn();
			setRows(data ?? []);
			router.invalidate();
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Failed");
		}
	}
	if (isAdmin === null) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-10 text-center text-sm text-coffee/60",
		children: "Checking access…"
	}) });
	if (!isAdmin) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-md p-10 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-4xl",
				children: "🔒"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-display text-2xl",
				children: "Just for moderators"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 text-sm text-coffee/70",
				children: [
					"Your account doesn't have moderator access. If you should — ask a PawBook admin to grant you the ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
						className: "rounded bg-cream/70 px-1",
						children: "admin"
					}),
					" role."
				]
			})
		]
	}) });
	const filtered = filter === "all" ? rows : rows.filter((r) => r.status === filter);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-5xl px-4 pt-8 sm:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
				eyebrow: "Admin",
				title: "Moderation queue"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-6 flex flex-wrap gap-2",
				children: [
					"pending",
					"approved",
					"rejected",
					"all"
				].map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setFilter(f),
					className: "rounded-full px-4 py-1.5 text-xs font-bold capitalize transition " + (filter === f ? "bg-coffee text-cream" : "bg-white text-coffee/70 hover:bg-cream"),
					children: [
						f,
						" ",
						f !== "all" && `(${rows.filter((r) => r.status === f).length})`
					]
				}, f))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [filtered.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-2xl border border-dashed border-coffee/20 bg-white/50 p-8 text-center text-sm text-coffee/60",
					children: "Nothing here right now 🌿"
				}), filtered.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "scrapbook-shadow flex flex-col gap-4 rounded-2xl bg-white p-4 sm:flex-row",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignedImage, {
						storageRef: r.photo_url,
						alt: r.name,
						className: "h-40 w-full rounded-xl object-cover sm:w-40"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-display text-xl",
										children: r.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "rounded-full bg-sage/40 px-2 py-0.5 text-[10px] font-bold uppercase",
										children: r.species
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase " + (r.status === "pending" ? "bg-yellow/50" : r.status === "approved" ? "bg-sage/60" : "bg-peach/60"),
										children: r.status
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-xs text-coffee/60",
								children: [
									"📍 ",
									r.location,
									" · submitted ",
									new Date(r.created_at).toLocaleString()
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-coffee/80",
								children: r.story
							}),
							r.video_url && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignedVideo, {
									storageRef: r.video_url,
									className: "max-h-56 rounded-lg"
								})
							}),
							r.status === "pending" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => handleReview(r.id, "approved"),
									className: "rounded-full bg-sage px-4 py-1.5 text-xs font-bold text-coffee hover:scale-105",
									children: "Approve 🌸"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => handleReview(r.id, "rejected"),
									className: "rounded-full border border-coffee/20 bg-white px-4 py-1.5 text-xs font-bold text-coffee hover:bg-cream",
									children: "Reject"
								})]
							})
						]
					})]
				}, r.id))]
			})
		]
	}) });
}
//#endregion
export { ModerationPage as component };
