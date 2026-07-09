import { r as __toESM } from "../_runtime.mjs";
import { r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { k as isRedirect, y as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as TSS_SERVER_FUNCTION, l as createServerFn } from "./esm-Dova13aH.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-TcfOUr5h.mjs";
import { t as getServerFnById } from "../__23tanstack-start-server-fn-resolver-Dw4XLd3Z.mjs";
import { n as objectType, r as stringType, t as enumType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/useServerFn-CrZF2pjq.js
var import_react = /* @__PURE__ */ __toESM(require_react());
function useServerFn(serverFn) {
	const router = useRouter();
	return import_react.useCallback(async (...args) => {
		try {
			const res = await serverFn(...args);
			if (isRedirect(res)) throw res;
			return res;
		} catch (err) {
			if (isRedirect(err)) {
				err.options._fromLocation = router.stores.location.get();
				return router.navigate(router.resolveRedirect(err).options);
			}
			throw err;
		}
	}, [router, serverFn]);
}
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/createSsrRpc-DY8NFpoP.js
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/submissions.functions-DCXvzCfO.js
var submitSchema = objectType({
	name: stringType().trim().min(1).max(80),
	species: stringType().trim().min(1).max(40),
	location: stringType().trim().min(1).max(120),
	story: stringType().trim().min(10).max(2e3),
	photoRef: stringType().min(3).max(300),
	videoRef: stringType().max(300).optional().nullable()
});
var submitFoundFriend = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => submitSchema.parse(input)).handler(createSsrRpc("ef9df5a67f9b2f3ca428438b7a2f922a57fdcafe8f0d98308e6a961b917dc70e"));
createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("e0cc85a5a8be31942bbe2ca4fb51c8df1ebae75f28c8fdb538356acf397c4296"));
var listPendingSubmissions = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("20a38decdef8c675952deadb85b1547dce06dbf0a94425c1b96ab3a997f1be07"));
var reviewSchema = objectType({
	id: stringType().uuid(),
	status: enumType(["approved", "rejected"])
});
var reviewSubmission = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => reviewSchema.parse(input)).handler(createSsrRpc("fd16551f73d4384b8d6b5d7c9928fe5f681bb1bbae03329d5d441d0bc656afa5"));
var checkIsAdmin = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("b7494ca3ec0cfffda02162b7144901d3d801970e9aa6a4c1c43a2a2160e03f98"));
//#endregion
export { createSsrRpc as a, submitFoundFriend as i, listPendingSubmissions as n, useServerFn as o, reviewSubmission as r, checkIsAdmin as t };
