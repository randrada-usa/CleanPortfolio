import type { ResponsiveImage } from "./images";

type DecodableImage = Pick<HTMLImageElement, "src" | "srcset" | "sizes" | "fetchPriority" | "decode">;

export function createGalleryImageLoader(createImage: () => DecodableImage = () => new Image()) {
  const cache = new Map<string, { image: DecodableImage; ready: Promise<void> }>();
  return (source: ResponsiveImage, priority: "low" | "high" = "low") => {
    const key = JSON.stringify([source.src, source.srcSet, source.sizes]);
    const existing = cache.get(key);
    if (existing) {
      if (priority === "high") existing.image.fetchPriority = "high";
      return existing.ready;
    }
    const image = createImage();
    image.fetchPriority = priority;
    image.sizes = source.sizes ?? "";
    image.srcset = source.srcSet ?? "";
    image.src = source.src;
    const ready = image.decode().catch((error) => {
      if (cache.get(key)?.image === image) cache.delete(key);
      throw error;
    });
    cache.set(key, { image, ready });
    // Keep decoded neighbors handy without retaining an entire large gallery.
    if (cache.size > 12) cache.delete(cache.keys().next().value!);
    return ready;
  };
}

export const loadGalleryImage = createGalleryImageLoader();
