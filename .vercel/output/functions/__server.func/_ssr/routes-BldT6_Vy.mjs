import "../_runtime.mjs";
import { t as supabase } from "./client-NrJBcFso.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
require_react();
require_jsx_runtime();
var $$splitComponentImporter = () => import("./routes-DCtD_Rz-.mjs");
var Route = createFileRoute("/")({
	loader: async () => {
		const { data, error } = await supabase.from("found_friends").select("*").eq("status", "approved").order("created_at", { ascending: false });
		if (error) console.error(error.message);
		return { approved: data || [] };
	},
	head: () => ({ meta: [{ title: "PawBook — Little Paws. Big Stories." }, {
		name: "description",
		content: "Meet Coco, Moti, Kitty and Tommy — a cozy village of street friends whose stories live forever in PawBook."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
