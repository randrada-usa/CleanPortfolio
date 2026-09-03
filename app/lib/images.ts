// Card-sized variants only: detail pages retain the original full-size images.
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
