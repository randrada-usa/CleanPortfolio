export type ResponsiveImage = { src: string; srcSet?: string; sizes?: string; width?: number; height?: number };

// Originals remain available; each view requests only the resolution it needs.
const localProjectImages = new Set([
  "/assets/projects/wave-and-wish.webp",
  "/assets/projects/IFC-v3.webp",
  "/assets/projects/e-serbisyo-rizal-v3.webp",
]);

export function projectCardImage(src: string) {
  // CMS images and future assets keep their original URL until variants exist.
  if (!localProjectImages.has(src)) return { src };

  const base = src.slice(0, -5);
  return {
    src: `${base}-card-800.webp`,
    srcSet: [480, 800, 1200].map((width) => `${base}-card-${width}.webp ${width}w`).join(", "),
    sizes: "(max-width: 640px) calc(100vw - 2rem), (max-width: 900px) 46vw, 464px",
    width: 1600,
    height: 900,
  };
}

export function projectDetailImage(src: string): ResponsiveImage {
  if (!localProjectImages.has(src)) return { src };

  const base = src.slice(0, -5);
  return {
    src: `${base}-detail-1600.webp`,
    srcSet: [
      ...[480, 800, 1200].map((width) => `${base}-card-${width}.webp ${width}w`),
      ...[1600, 1920].map((width) => `${base}-detail-${width}.webp ${width}w`),
    ].join(", "),
    sizes: "(max-width: 640px) calc(100vw - 2rem), (max-width: 1544px) 92vw, 1420px",
    width: 1600,
    height: 900,
  };
}

const localExperienceImages = new Set([
  "institute-of-computer-science", "ads-web-development-lead", "6-byte-studios",
  "holotech-society", "ads-senior-developer",
].map((name) => `/assets/experiences/${name}.webp`));

export function experiencePreviewImage(src: string): ResponsiveImage {
  if (!localExperienceImages.has(src)) return { src };

  const base = src.slice(0, -5);
  return {
    src: `${base}-preview-800.webp`,
    srcSet: `${base}-preview-400.webp 400w, ${base}-preview-800.webp 800w`,
    sizes: "(max-width: 1379px) 29vw, 400px",
  };
}
