//#region node_modules/.nitro/vite/services/ssr/assets/utils-CXLS34TX.js
function copyToClipboard(text, onSuccess, onError) {
	const fallbackCopy = () => {
		const textArea = document.createElement("textarea");
		textArea.value = text;
		textArea.style.position = "fixed";
		textArea.style.left = "-9999px";
		document.body.appendChild(textArea);
		textArea.focus();
		textArea.select();
		try {
			if (document.execCommand("copy")) onSuccess();
			else onError();
		} catch (err) {
			onError();
		}
		document.body.removeChild(textArea);
	};
	if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(onSuccess).catch((err) => {
		console.error("Async clipboard copy failed, falling back", err);
		fallbackCopy();
	});
	else fallbackCopy();
}
function shareContent(options, onSuccess, onError) {
	if (navigator.share) navigator.share({
		title: options.title,
		text: options.text,
		url: options.url
	}).then(onSuccess).catch((err) => {
		if (err.name !== "AbortError") copyToClipboard(options.url, onSuccess, onError || (() => {}));
	});
	else copyToClipboard(options.url, onSuccess, onError || (() => {}));
}
//#endregion
export { shareContent as t };
