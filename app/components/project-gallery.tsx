import * as Dialog from "@radix-ui/react-dialog";
import { ArrowLeft, ArrowRight, Play, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import type { Project } from "~/data/site";
import { projectThumbnailImage, projectDetailImage } from "~/lib/images";
import { projectGalleryImages } from "~/lib/project-gallery";
import { canPreloadImages } from "~/lib/image-preload";
import { loadGalleryImage } from "~/lib/gallery-image-loader";

export function ProjectMedia({ project }: { project: Project }) {
  const images = projectGalleryImages(project.image, project.gallery);
  if (images.length <= 1 && !project.youtubeVideoId) {
    return <img className={`detail-image${project.imageKind === "logo" ? " detail-image-logo" : ""}`} {...projectDetailImage(project.image)} alt={`${project.title} ${project.imageKind === "logo" ? "logo" : "project"}`} loading="eager" fetchPriority="high" decoding="async" />;
  }
  return <ProjectGallery key={JSON.stringify([project.slug, images, project.youtubeVideoId])} title={project.title} images={images} youtubeVideoId={project.youtubeVideoId} />;
}

function ProjectGallery({ title, images, youtubeVideoId }: { title: string; images: string[]; youtubeVideoId?: string }) {
  const [active, setActive] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [imageError, setImageError] = useState(false);
  const requested = useRef(0);
  const requestId = useRef(0);
  const openRequestId = useRef(0);
  const [imageReady, setImageReady] = useState(false);
  const stageImageRef = useRef<HTMLImageElement>(null);
  const showingVideo = active === 0 && Boolean(youtubeVideoId);
  const stripRef = useRef<HTMLDivElement>(null);
  const source = (index: number, expanded = dialogOpen) => ({ ...projectDetailImage(images[index]), ...(expanded ? { sizes: "96vw" } : {}) });
  const warm = (index: number, expanded = dialogOpen) => {
    if (!canPreloadImages() || (index === 0 && youtubeVideoId)) return;
    void loadGalleryImage(source(index, expanded)).catch(() => {});
  };
  const select = (index: number) => {
    openRequestId.current++;
    requested.current = index;
    const id = ++requestId.current;
    setImageError(false);
    if (index === 0 && youtubeVideoId) {
      setActive(index);
      setPending(false);
      return;
    }
    setPending(true);
    void loadGalleryImage(source(index), "high").then(() => {
      if (id !== requestId.current) return;
      setActive(index);
      setImageReady(true);
      setPending(false);
    }).catch(() => {
      if (id !== requestId.current) return;
      requested.current = active;
      setPending(false);
      setImageError(true);
    });
  };
  const move = (direction: number) => select((requested.current + direction + images.length) % images.length);
  const changeDialogOpen = (open: boolean) => {
    const id = ++openRequestId.current;
    if (!open || showingVideo) {
      setDialogOpen(open);
      return;
    }
    void loadGalleryImage(source(active, true), "high").then(() => {
      if (id === openRequestId.current) setDialogOpen(true);
    }).catch(() => {
      if (id === openRequestId.current) setImageError(true);
    });
  };
  const keyboardNavigation = (event: KeyboardEvent<HTMLElement>) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      move(event.key === "ArrowLeft" ? -1 : 1);
    }
  };

  useEffect(() => () => { requestId.current++; openRequestId.current++; }, []);

  useEffect(() => {
    if (stageImageRef.current?.complete && stageImageRef.current.naturalWidth > 0) setImageReady(true);
  }, []);

  useEffect(() => {
    if (!showingVideo && !imageReady) return;
    if (!canPreloadImages()) return;
    const nearby = new Set([(active + 1) % images.length, (active - 1 + images.length) % images.length]);
    for (const index of nearby) {
      if (index !== active && !(index === 0 && youtubeVideoId)) {
        const image = { ...projectDetailImage(images[index]), ...(dialogOpen ? { sizes: "96vw" } : {}) };
        void loadGalleryImage(image).catch(() => {});
      }
    }
    if (!showingVideo && !dialogOpen) {
      void loadGalleryImage({ ...projectDetailImage(images[active]), sizes: "96vw" }).catch(() => {});
    }
  }, [active, dialogOpen, imageReady, images, showingVideo, youtubeVideoId]);

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
    <Dialog.Root open={dialogOpen} onOpenChange={changeDialogOpen}>
      <section className="project-gallery" aria-label={`${title} media gallery`} onKeyDown={keyboardNavigation}>
        <div className="gallery-stage" aria-busy={pending}>
          {showingVideo && !dialogOpen ? (
            <iframe
              className="gallery-video"
              src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(youtubeVideoId!)}?autoplay=1&mute=1&playsinline=1&rel=0`}
              title={`${title} video demo`}
              loading="lazy"
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          ) : (
          <Dialog.Trigger asChild>
            <button className="gallery-open" type="button" aria-label={`Enlarge ${title} image ${active + 1}`} onPointerEnter={() => warm(active, true)} onFocus={() => warm(active, true)}>
              <img ref={stageImageRef} {...projectDetailImage(images[active])} alt={`${title} — image ${active + 1} of ${images.length}`} loading="eager" fetchPriority={active === 0 ? "high" : "auto"} decoding="async" onLoad={() => setImageReady(true)} />
              <span className="gallery-enlarge-hint">View full image</span>
            </button>
          </Dialog.Trigger>
          )}
          {!showingVideo && images.length > 1 && controls()}
        </div>
        <div className="gallery-thumbnails" ref={stripRef} aria-label="Choose project media">
          {images.map((image, index) => (
            <button key={image} className="gallery-thumbnail" type="button" aria-label={index === 0 && youtubeVideoId ? `Play ${title} video` : `View image ${index + 1}`} aria-current={index === active ? "true" : undefined} onClick={() => select(index)} onPointerEnter={(event) => { if (event.pointerType !== "touch") warm(index); }} onFocus={() => warm(index)}>
              <img {...projectThumbnailImage(image)} sizes="80px" alt="" loading="lazy" decoding="async" />
              {index === 0 && youtubeVideoId && <Play className="gallery-video-icon" size={18} fill="currentColor" aria-hidden="true" />}
            </button>
          ))}
        </div>
        {imageError && <p role="status">This photo couldn't load. Select it again to retry.</p>}
      </section>
      <Dialog.Portal>
        <Dialog.Overlay className="gallery-dialog-overlay" />
        <Dialog.Content className="gallery-dialog" onKeyDown={keyboardNavigation} aria-busy={pending}>
          <Dialog.Title className="sr-only">{title} image gallery</Dialog.Title>
          <Dialog.Description className="sr-only">Use the previous and next buttons or arrow keys to browse. Press Escape to close.</Dialog.Description>
          <Dialog.Close className="gallery-close" aria-label="Close full image"><X size={24} /></Dialog.Close>
          {showingVideo ? <iframe className="gallery-full-image gallery-video" src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(youtubeVideoId!)}?autoplay=1&mute=1&playsinline=1&rel=0`} title={`${title} video demo`} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" /> : <img className="gallery-full-image" {...projectDetailImage(images[active])} sizes="96vw" alt={`${title} — image ${active + 1} of ${images.length}`} decoding="async" />}
          {controls(true)}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
