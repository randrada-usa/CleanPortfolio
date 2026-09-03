import { preload } from "react-dom";
import type { ResponsiveImage } from "./images";

export function canPreloadImages() {
  if (typeof navigator === "undefined") return false;
  const connection = (navigator as Navigator & {
    connection?: { saveData?: boolean; effectiveType?: string };
  }).connection;
  return !connection?.saveData && !["slow-2g", "2g"].includes(connection?.effectiveType ?? "");
}

export function preloadImage(image: ResponsiveImage) {
  if (!canPreloadImages()) return;
  preload(image.src, {
    as: "image",
    imageSrcSet: image.srcSet,
    imageSizes: image.sizes,
    fetchPriority: "low",
  });
}
