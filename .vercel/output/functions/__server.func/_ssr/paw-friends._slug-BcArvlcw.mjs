import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { i as getAnimal } from "./pawbook-data-CqSvBvet.mjs";
import { F as notFound, m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
require_jsx_runtime();
var $$splitNotFoundComponentImporter = () => import("./paw-friends._slug-CkuZMgkS.mjs");
var $$splitComponentImporter = () => import("./paw-friends._slug-DUkUJ7hF.mjs");
var Route = createFileRoute("/paw-friends/$slug")({
	loader: ({ params }) => {
		const animal = getAnimal(params.slug);
		if (!animal) throw notFound();
		return { animal };
	},
	head: ({ loaderData }) => {
		if (!loaderData) return { meta: [{ title: "Friend not found · PawBook" }, {
			name: "robots",
			content: "noindex"
		}] };
		const a = loaderData.animal;
		return { meta: [
			{ title: `${a.name} ${a.emoji} · PawBook` },
			{
				name: "description",
				content: `${a.bio} Read ${a.name}'s diary on PawBook.`
			},
			{
				property: "og:title",
				content: `${a.name} — "${a.nickname}"`
			},
			{
				property: "og:description",
				content: a.story
			}
		] };
	},
	component: lazyRouteComponent($$splitComponentImporter, "component"),
	notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter, "notFoundComponent")
});
//#endregion
export { Route as t };
