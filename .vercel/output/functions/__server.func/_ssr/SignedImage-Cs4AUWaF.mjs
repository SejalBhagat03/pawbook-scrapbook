import { r as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-DehiQiIM.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/SignedImage-Cs4AUWaF.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
async function uploadToBucket(bucket, file, userId) {
	const ext = file.name.split(".").pop()?.toLowerCase() ?? "bin";
	const path = `${userId}/${crypto.randomUUID()}.${ext}`;
	const { error } = await supabase.storage.from(bucket).upload(path, file, {
		cacheControl: "3600",
		upsert: false,
		contentType: file.type
	});
	if (error) throw error;
	return { path: `${bucket}/${path}` };
}
/** photo_url column stores "bucket/key". Turn it into a short-lived signed URL. */
async function signedUrlFor(storageRef, expiresIn = 3600) {
	const [bucket, ...rest] = storageRef.split("/");
	const key = rest.join("/");
	if (!bucket || !key) return null;
	const { data } = await supabase.storage.from(bucket).createSignedUrl(key, expiresIn);
	return data?.signedUrl ?? null;
}
function SignedImage({ storageRef, alt, className }) {
	const [url, setUrl] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (storageRef.startsWith("data:") || storageRef.startsWith("blob:") || storageRef.startsWith("http")) {
			setUrl(storageRef);
			return;
		}
		let cancelled = false;
		signedUrlFor(storageRef).then((u) => {
			if (!cancelled) setUrl(u);
		});
		return () => {
			cancelled = true;
		};
	}, [storageRef]);
	if (!url) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "animate-pulse bg-coffee/10 " + (className ?? "") });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src: url,
		alt,
		className,
		loading: "lazy"
	});
}
function SignedVideo({ storageRef, className }) {
	const [url, setUrl] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (storageRef.startsWith("data:") || storageRef.startsWith("blob:") || storageRef.startsWith("http")) {
			setUrl(storageRef);
			return;
		}
		let cancelled = false;
		signedUrlFor(storageRef).then((u) => {
			if (!cancelled) setUrl(u);
		});
		return () => {
			cancelled = true;
		};
	}, [storageRef]);
	if (!url) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "animate-pulse bg-coffee/10 " + (className ?? "") });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
		src: url,
		controls: true,
		className
	});
}
//#endregion
export { SignedVideo as n, uploadToBucket as r, SignedImage as t };
