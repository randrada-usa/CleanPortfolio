import assert from "node:assert/strict";
import { test } from "node:test";
import { projectGalleryImages } from "../app/lib/project-gallery.ts";

test("a cover alone keeps the project in single-image mode", () => {
  assert.deepEqual(projectGalleryImages("cover.webp"), ["cover.webp"]);
});

test("a repeated cover and empty entries do not activate a gallery", () => {
  assert.deepEqual(projectGalleryImages("cover.webp", ["cover.webp", "", "  "]), ["cover.webp"]);
});

test("additional images follow the cover in their supplied order without duplicates", () => {
  assert.deepEqual(projectGalleryImages("cover.webp", ["second.webp", "cover.webp", "third.webp", "second.webp"]), ["cover.webp", "second.webp", "third.webp"]);
});
