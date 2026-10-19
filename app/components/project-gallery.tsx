import * as Dialog from "@radix-ui/react-dialog";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import type { Project } from "~/data/site";
import { projectThumbnailImage, projectDetailImage } from "~/lib/images";
import { projectGalleryImages } from "~/lib/project-gallery";

export function ProjectMedia({ project }: { project: Project }) {
  const images = projectGalleryImages(project.image, project.gallery);
  if (images.length <= 1) {
    return <img className={`detail-image${project.imageKind === "logo" ? " detail-image-logo" : ""}`} {...projectDetailImage(project.image)} alt={`${project.title} ${project.imageKind === "logo" ? "logo" : "project"}`} loading="eager" fetchPriority="high" decoding="async" />;
  }
  return <ProjectGallery key={JSON.stringify([project.slug, images])} title={project.title} images={images} />;
}

function ProjectGallery({ title, images }: { title: string; images: string[] }) {
  const [active, setActive] = useState(0);
  const stripRef = useRef<HTMLDivElement>(null);
  const move = (direction: number) => setActive((index) => (index + direction + images.length) % images.length);
  const keyboardNavigation = (event: KeyboardEvent<HTMLElement>) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      move(event.key === "ArrowLeft" ? -1 : 1);
    }
  };

  useEffect(() => {
    const strip = stripRef.current;
    const thumbnail = strip?.children[active] as HTMLElement | undefined;
    if (!strip || !thumbnail || !window.matchMedia("(max-width: 640px)").matches) return;
    strip.scrollTo({ left: thumbnail.offsetLeft - strip.offsetLeft - (strip.clientWidth - thumbnail.offsetWidth) / 2 });
  }, [active]);

  const controls = (expanded = false) => (
    <>
      <button className="gallery-arrow gallery-previous" type="button" aria-label="Previous image" onClick={() => move(-1)}><ArrowLeft size={20} /></button>
      <button className="gallery-arrow gallery-next" type="button" aria-label="Next image" onClick={() => move(1)}><ArrowRight size={20} /></button>
      <span className={`gallery-counter${expanded ? " gallery-counter-expanded" : ""}`} role="status" aria-live="polite" aria-atomic="true">{active + 1} / {images.length}</span>
    </>
  );

  return (
    <Dialog.Root>
      <section className="project-gallery" aria-label={`${title} image gallery`} onKeyDown={keyboardNavigation}>
        <div className="gallery-stage">
          <Dialog.Trigger asChild>
            <button className="gallery-open" type="button" aria-label={`Enlarge ${title} image ${active + 1}`}>
              <img {...projectDetailImage(images[active])} alt={`${title} — image ${active + 1} of ${images.length}`} loading="eager" fetchPriority={active === 0 ? "high" : "auto"} decoding="async" />
              <span className="gallery-enlarge-hint">View full image</span>
            </button>
          </Dialog.Trigger>
          {controls()}
        </div>
        <div className="gallery-thumbnails" ref={stripRef} aria-label="Choose a project image">
          {images.map((image, index) => (
            <button key={image} className="gallery-thumbnail" type="button" aria-label={`View image ${index + 1}`} aria-current={index === active ? "true" : undefined} onClick={() => setActive(index)}>
              <img {...projectThumbnailImage(image)} sizes="80px" alt="" loading="lazy" decoding="async" />
            </button>
          ))}
        </div>
      </section>
      <Dialog.Portal>
        <Dialog.Overlay className="gallery-dialog-overlay" />
        <Dialog.Content className="gallery-dialog" onKeyDown={keyboardNavigation}>
          <Dialog.Title className="sr-only">{title} image gallery</Dialog.Title>
          <Dialog.Description className="sr-only">Use the previous and next buttons or arrow keys to browse. Press Escape to close.</Dialog.Description>
          <Dialog.Close className="gallery-close" aria-label="Close full image"><X size={24} /></Dialog.Close>
          <img className="gallery-full-image" {...projectDetailImage(images[active])} sizes="96vw" alt={`${title} — image ${active + 1} of ${images.length}`} decoding="async" />
          {controls(true)}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
