import { useEffect, useRef, useState } from "react";
import { canPreloadImages, preloadImage } from "./image-preload";
import type { ResponsiveImage } from "./images";

// Keep the image list stable so accordion/hover changes don't restart observation.
export function usePreviewImages(images: ResponsiveImage[], media = "(min-width: 901px)") {
  const sectionRef = useRef<HTMLElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const screen = window.matchMedia(media);
    let observer: IntersectionObserver | undefined;
    const update = () => {
      setEnabled(screen.matches);
      observer?.disconnect();
      if (!screen.matches || !sectionRef.current || !canPreloadImages() || !("IntersectionObserver" in window)) return;

      observer = new IntersectionObserver((entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        images.forEach(preloadImage);
        observer?.disconnect();
      }, { rootMargin: "400px 0px" });
      observer.observe(sectionRef.current);
    };
    update();
    screen.addEventListener("change", update);
    return () => {
      observer?.disconnect();
      screen.removeEventListener("change", update);
    };
  }, [images, media]);

  return { sectionRef, enabled };
}
