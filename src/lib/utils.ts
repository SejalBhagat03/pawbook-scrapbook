import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function copyToClipboard(text: string, onSuccess: () => void, onError: () => void) {
  const fallbackCopy = () => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      const successful = document.execCommand("copy");
      if (successful) {
        onSuccess();
      } else {
        onError();
      }
    } catch (err) {
      onError();
    }
    document.body.removeChild(textArea);
  };

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard
      .writeText(text)
      .then(onSuccess)
      .catch((err) => {
        console.error("Async clipboard copy failed, falling back", err);
        fallbackCopy();
      });
  } else {
    fallbackCopy();
  }
}

export function shareContent(
  options: { title: string; text: string; url: string },
  onSuccess: () => void,
  onError?: () => void,
) {
  if (navigator.share) {
    navigator
      .share({
        title: options.title,
        text: options.text,
        url: options.url,
      })
      .then(onSuccess)
      .catch((err) => {
        // Only trigger clipboard fallback if share failed, not if user cancelled (AbortError)
        if (err.name !== "AbortError") {
          copyToClipboard(options.url, onSuccess, onError || (() => {}));
        }
      });
  } else {
    copyToClipboard(options.url, onSuccess, onError || (() => {}));
  }
}
