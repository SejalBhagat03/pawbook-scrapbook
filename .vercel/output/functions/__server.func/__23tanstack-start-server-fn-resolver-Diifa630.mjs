//#region node_modules/.nitro/vite/services/ssr/assets/__23tanstack-start-server-fn-resolver-Diifa630.js
var manifest = {
	"01186f47e847f7adfa0e2c3586c5bf1f47b59f007aaf699f531c7ec2c1a9dbdd": {
		functionName: "weaveStory_createServerFn_handler",
		importer: () => import("./_ssr/ai-story.functions-DOb91PuS.mjs")
	},
	"20a38decdef8c675952deadb85b1547dce06dbf0a94425c1b96ab3a997f1be07": {
		functionName: "listPendingSubmissions_createServerFn_handler",
		importer: () => import("./_ssr/submissions.functions-_r9106wh.mjs")
	},
	"b7494ca3ec0cfffda02162b7144901d3d801970e9aa6a4c1c43a2a2160e03f98": {
		functionName: "checkIsAdmin_createServerFn_handler",
		importer: () => import("./_ssr/submissions.functions-_r9106wh.mjs")
	},
	"e0cc85a5a8be31942bbe2ca4fb51c8df1ebae75f28c8fdb538356acf397c4296": {
		functionName: "listMySubmissions_createServerFn_handler",
		importer: () => import("./_ssr/submissions.functions-_r9106wh.mjs")
	},
	"ef9df5a67f9b2f3ca428438b7a2f922a57fdcafe8f0d98308e6a961b917dc70e": {
		functionName: "submitFoundFriend_createServerFn_handler",
		importer: () => import("./_ssr/submissions.functions-_r9106wh.mjs")
	},
	"fd16551f73d4384b8d6b5d7c9928fe5f681bb1bbae03329d5d441d0bc656afa5": {
		functionName: "reviewSubmission_createServerFn_handler",
		importer: () => import("./_ssr/submissions.functions-_r9106wh.mjs")
	}
};
async function getServerFnById(id, access) {
	const serverFnInfo = manifest[id];
	if (!serverFnInfo) throw new Error("Server function info not found for " + id);
	const fnModule = serverFnInfo.module ?? await serverFnInfo.importer();
	if (!fnModule) throw new Error("Server function module not resolved for " + id);
	const action = fnModule[serverFnInfo.functionName];
	if (!action) throw new Error("Server function module export not resolved for serverFn ID: " + id);
	return action;
}
//#endregion
export { getServerFnById as t };
