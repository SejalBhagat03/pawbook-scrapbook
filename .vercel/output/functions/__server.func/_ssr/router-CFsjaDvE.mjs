import { r as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-NrJBcFso.mjs";
import { n as require_jsx_runtime, r as require_react, t as QueryClientProvider } from "../_libs/react+tanstack__react-query.mjs";
import { t as animals } from "./pawbook-data-Cp5uqNrO.mjs";
import { M as redirect, c as HeadContent, d as createRouter, f as Outlet, g as Link, h as createRootRouteWithContext, m as createFileRoute, p as lazyRouteComponent, s as Scripts, y as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import "../_libs/sonner.mjs";
import { t as Route$17 } from "./paw-friends._slug-VAIW6shX.mjs";
import { t as Route$18 } from "./routes-BldT6_Vy.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/found-friends-C4MmZ5Cx.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var $$splitComponentImporter$13 = () => import("./found-friends-B7FZ3p_i.mjs");
var Route$16 = createFileRoute("/found-friends")({
	beforeLoad: () => {
		throw redirect({
			to: "/",
			hash: "found-friends",
			replace: true
		});
	},
	component: lazyRouteComponent($$splitComponentImporter$13, "component")
});
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/router-CFsjaDvE.js
var styles_default = "/assets/styles-BtyNgz3B.css";
function reportAppError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__appEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-cream px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md rounded-3xl border border-coffee/10 bg-white/80 p-8 text-center scrapbook-shadow",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-6xl",
					children: "🐾"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-4 font-display text-4xl text-coffee",
					children: "Lost in the garden"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-coffee/70",
					children: "This page wandered off chasing a butterfly. Let's head back home together."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "mt-6 inline-flex items-center justify-center rounded-full bg-coffee px-5 py-2.5 text-sm font-bold text-cream hover:bg-coffee/90",
					children: "Take me home"
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportAppError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-cream px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md rounded-3xl border border-coffee/10 bg-white p-8 text-center scrapbook-shadow",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-5xl",
					children: "🌧️"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-4 font-display text-2xl text-coffee",
					children: "A tiny storm passed through"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-coffee/70",
					children: "Something didn't load right. Give it another try."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "rounded-full bg-coffee px-5 py-2 text-sm font-bold text-cream hover:bg-coffee/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "rounded-full border border-coffee/20 bg-white px-5 py-2 text-sm font-bold text-coffee hover:bg-cream",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$15 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "PawBook — Where Every Paw Has a Story" },
			{
				name: "description",
				content: "A cozy digital world where street dogs, cats, birds and nature memories become characters with their own stories, profiles and diaries."
			},
			{
				name: "author",
				content: "Sejal"
			},
			{
				name: "theme-color",
				content: "#FFF7E8"
			},
			{
				property: "og:title",
				content: "PawBook — Where Every Paw Has a Story"
			},
			{
				property: "og:description",
				content: "Little paws. Big stories. A peaceful place where every street friend is remembered."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			},
			{
				name: "twitter:title",
				content: "PawBook — Where Every Paw Has a Story"
			}
		],
		links: [{
			rel: "stylesheet",
			href: styles_default
		}, {
			rel: "icon",
			href: "/favicon.svg",
			type: "image/svg+xml"
		}]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$15.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
	});
}
var $$splitComponentImporter$12 = () => import("./stories-KUlfjcx-.mjs");
var Route$14 = createFileRoute("/stories")({
	beforeLoad: () => {
		throw redirect({
			to: "/",
			hash: "stories",
			replace: true
		});
	},
	component: lazyRouteComponent($$splitComponentImporter$12, "component")
});
var BASE_URL = "";
var Route$13 = createFileRoute("/sitemap.xml")({ server: { handlers: { GET: async () => {
	const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` + [
		{
			path: "/",
			priority: "1.0",
			changefreq: "weekly"
		},
		{
			path: "/paw-friends",
			priority: "0.9",
			changefreq: "weekly"
		},
		{
			path: "/stories",
			priority: "0.8",
			changefreq: "daily"
		},
		{
			path: "/garden",
			priority: "0.7",
			changefreq: "weekly"
		},
		{
			path: "/explore",
			priority: "0.6",
			changefreq: "weekly"
		},
		{
			path: "/explore/map",
			priority: "0.6",
			changefreq: "weekly"
		},
		{
			path: "/explore/nature",
			priority: "0.6",
			changefreq: "weekly"
		},
		{
			path: "/explore/diary",
			priority: "0.6",
			changefreq: "weekly"
		},
		{
			path: "/explore/ai",
			priority: "0.5",
			changefreq: "monthly"
		},
		{
			path: "/about",
			priority: "0.5",
			changefreq: "monthly"
		},
		...animals.map((a) => ({
			path: `/paw-friends/${a.slug}`,
			priority: "0.8",
			changefreq: "weekly"
		}))
	].map((e) => `  <url><loc>${BASE_URL}${e.path}</loc><changefreq>${e.changefreq}</changefreq><priority>${e.priority}</priority></url>`).join("\n") + `\n</urlset>`;
	return new Response(xml, { headers: {
		"Content-Type": "application/xml",
		"Cache-Control": "public, max-age=3600"
	} });
} } } });
var $$splitComponentImporter$11 = () => import("./garden-CdLzHcU6.mjs");
var Route$12 = createFileRoute("/garden")({
	beforeLoad: () => {
		throw redirect({
			to: "/",
			hash: "garden",
			replace: true
		});
	},
	component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
var $$splitComponentImporter$10 = () => import("./explore-Dwf6k_2T.mjs");
var Route$11 = createFileRoute("/explore")({
	beforeLoad: () => {
		throw redirect({
			to: "/",
			hash: "explore",
			replace: true
		});
	},
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
var $$splitComponentImporter$9 = () => import("./auth-DSLx8Vaa.mjs");
var Route$10 = createFileRoute("/auth")({
	ssr: false,
	head: () => ({ meta: [{ title: "Sign in — PawBook" }, {
		name: "description",
		content: "Sign in to share the little friends you meet along the way."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("./about-DQpd10oJ.mjs");
var Route$9 = createFileRoute("/about")({
	head: () => ({ meta: [{ title: "The human behind PawBook · Sejal" }, {
		name: "description",
		content: "PawBook was built with technology and kindness by Sejal, to remember the small lives that cannot tell their own stories."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./route-Di7iQBCH.mjs");
var Route$8 = createFileRoute("/_authenticated")({
	ssr: false,
	beforeLoad: async () => {
		const { data, error } = await supabase.auth.getUser();
		if (error || !data.user) throw redirect({ to: "/auth" });
		return { user: data.user };
	},
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./paw-friends.index-B-mrObZQ.mjs");
var Route$7 = createFileRoute("/paw-friends/")({
	beforeLoad: () => {
		throw redirect({
			to: "/",
			hash: "paw-friends",
			replace: true
		});
	},
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var Route$6 = createFileRoute("/explore/")({ beforeLoad: () => {
	throw redirect({
		to: "/explore/map",
		replace: true
	});
} });
var $$splitComponentImporter$5 = () => import("./explore.nature-Be-U3RI5.mjs");
var Route$5 = createFileRoute("/explore/nature")({
	beforeLoad: () => {
		throw redirect({
			to: "/",
			hash: "explore",
			replace: true
		});
	},
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./explore.map-BkxOn9nq.mjs");
var Route$4 = createFileRoute("/explore/map")({
	beforeLoad: () => {
		throw redirect({
			to: "/",
			hash: "explore",
			replace: true
		});
	},
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./explore.diary-C3cHioqY.mjs");
var Route$3 = createFileRoute("/explore/diary")({
	beforeLoad: () => {
		throw redirect({
			to: "/",
			hash: "explore",
			replace: true
		});
	},
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./explore.ai-uOBjEs-8.mjs");
var Route$2 = createFileRoute("/explore/ai")({
	beforeLoad: ({ search }) => {
		throw redirect({
			to: "/",
			hash: "explore",
			search,
			replace: true
		});
	},
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./pet-studio-B310RBoc.mjs");
var Route$1 = createFileRoute("/_authenticated/pet-studio")({
	head: () => ({ meta: [{ title: "Pet Studio — Creator Panel" }, {
		name: "description",
		content: "Manage stories, matching quizzes, spin wheels, and pet profiles."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./admin.moderation-bnoQzqG5.mjs");
var Route = createFileRoute("/_authenticated/admin/moderation")({
	head: () => ({ meta: [{ title: "Moderation — PawBook" }] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var StoriesRoute = Route$14.update({
	id: "/stories",
	path: "/stories",
	getParentRoute: () => Route$15
});
var SitemapDotxmlRoute = Route$13.update({
	id: "/sitemap.xml",
	path: "/sitemap.xml",
	getParentRoute: () => Route$15
});
var GardenRoute = Route$12.update({
	id: "/garden",
	path: "/garden",
	getParentRoute: () => Route$15
});
var FoundFriendsRoute = Route$16.update({
	id: "/found-friends",
	path: "/found-friends",
	getParentRoute: () => Route$15
});
var ExploreRoute = Route$11.update({
	id: "/explore",
	path: "/explore",
	getParentRoute: () => Route$15
});
var AuthRoute = Route$10.update({
	id: "/auth",
	path: "/auth",
	getParentRoute: () => Route$15
});
var AboutRoute = Route$9.update({
	id: "/about",
	path: "/about",
	getParentRoute: () => Route$15
});
var AuthenticatedRouteRoute = Route$8.update({
	id: "/_authenticated",
	getParentRoute: () => Route$15
});
var IndexRoute = Route$18.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$15
});
var PawFriendsIndexRoute = Route$7.update({
	id: "/paw-friends/",
	path: "/paw-friends/",
	getParentRoute: () => Route$15
});
var ExploreIndexRoute = Route$6.update({
	id: "/",
	path: "/",
	getParentRoute: () => ExploreRoute
});
var PawFriendsSlugRoute = Route$17.update({
	id: "/paw-friends/$slug",
	path: "/paw-friends/$slug",
	getParentRoute: () => Route$15
});
var ExploreNatureRoute = Route$5.update({
	id: "/nature",
	path: "/nature",
	getParentRoute: () => ExploreRoute
});
var ExploreMapRoute = Route$4.update({
	id: "/map",
	path: "/map",
	getParentRoute: () => ExploreRoute
});
var ExploreDiaryRoute = Route$3.update({
	id: "/diary",
	path: "/diary",
	getParentRoute: () => ExploreRoute
});
var ExploreAiRoute = Route$2.update({
	id: "/ai",
	path: "/ai",
	getParentRoute: () => ExploreRoute
});
var AuthenticatedRouteRouteChildren = {
	AuthenticatedPetStudioRoute: Route$1.update({
		id: "/pet-studio",
		path: "/pet-studio",
		getParentRoute: () => AuthenticatedRouteRoute
	}),
	AuthenticatedAdminModerationRoute: Route.update({
		id: "/admin/moderation",
		path: "/admin/moderation",
		getParentRoute: () => AuthenticatedRouteRoute
	})
};
var AuthenticatedRouteRouteWithChildren = AuthenticatedRouteRoute._addFileChildren(AuthenticatedRouteRouteChildren);
var ExploreRouteChildren = {
	ExploreAiRoute,
	ExploreDiaryRoute,
	ExploreMapRoute,
	ExploreNatureRoute,
	ExploreIndexRoute
};
var rootRouteChildren = {
	IndexRoute,
	AuthenticatedRouteRoute: AuthenticatedRouteRouteWithChildren,
	AboutRoute,
	AuthRoute,
	ExploreRoute: ExploreRoute._addFileChildren(ExploreRouteChildren),
	FoundFriendsRoute,
	GardenRoute,
	SitemapDotxmlRoute,
	StoriesRoute,
	PawFriendsSlugRoute,
	PawFriendsIndexRoute
};
var routeTree = Route$15._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: new QueryClient() },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
