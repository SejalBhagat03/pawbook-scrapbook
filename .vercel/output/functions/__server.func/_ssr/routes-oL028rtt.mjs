import "../_runtime.mjs";
import { t as supabase } from "./client-DehiQiIM.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
require_react();
require_jsx_runtime();
var $$splitComponentImporter = () => import("./routes-BT3UQc-D.mjs");
var Route = createFileRoute("/")({
	loader: async () => {
		try {
			const { data, error } = await supabase.from("found_friends").select("*").eq("status", "approved").order("created_at", { ascending: false });
			if (error) console.error("[loader] Supabase error:", error.message);
			return { approved: data || [] };
		} catch (err) {
			console.error("[loader] Supabase threw during SSR:", err);
			return { approved: [] };
		}
	},
	head: () => ({ meta: [{ title: "PawBook — Little Paws. Big Stories." }, {
		name: "description",
		content: "Meet Coco, Moti, Kitty and Tommy — a cozy village of street friends whose stories live forever in PawBook."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
