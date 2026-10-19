export function projectGalleryImages(cover: string, gallery: string[] = []): string[] {
  return [...new Set([cover, ...gallery].filter((image) => image.trim().length > 0))];
}
