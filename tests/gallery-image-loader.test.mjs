import assert from "node:assert/strict";
import { test } from "node:test";
import { createGalleryImageLoader } from "../app/lib/gallery-image-loader.ts";

test("shares a preload with a user request and promotes its priority while decoding", async () => {
  const created = [];
  let finish;
  const load = createGalleryImageLoader(() => {
    const image = { decode: () => new Promise(resolve => { finish = resolve; }) };
    created.push(image);
    return image;
  });
  const source = { src: "large.webp", srcSet: "small.webp 480w, large.webp 1600w", sizes: "90vw" };
  const warm = load(source);
  let decoded = false;
  warm.then(() => { decoded = true; });
  assert.equal(load(source, "high"), warm);
  assert.equal(created.length, 1);
  assert.equal(created[0].fetchPriority, "high");
  assert.equal(created[0].sizes, source.sizes);
  assert.equal(created[0].srcset, source.srcSet);
  assert.equal(decoded, false);
  finish();
  await warm;
  assert.equal(decoded, true);
});

test("a failed photo can retry instead of reusing a rejected preload", async () => {
  let calls = 0;
  const load = createGalleryImageLoader(() => ({ decode: () => ++calls === 1 ? Promise.reject(new Error("offline")) : Promise.resolve() }));
  await assert.rejects(load({ src: "photo.webp" }));
  await load({ src: "photo.webp" });
  assert.equal(calls, 2);
});

test("preloads the correct responsive candidate when enlarged sizes differ", async () => {
  let calls = 0;
  const load = createGalleryImageLoader(() => ({ decode: () => { calls++; return Promise.resolve(); } }));
  await load({ src: "photo.webp", sizes: "80vw" });
  await load({ src: "photo.webp", sizes: "96vw" });
  assert.equal(calls, 2);
});

test("bounds retained decoded images rather than keeping every visited gallery in memory", async () => {
  let calls = 0;
  const load = createGalleryImageLoader(() => ({ decode: () => { calls++; return Promise.resolve(); } }));
  for (let index = 0; index < 13; index++) await load({ src: `${index}.webp` });
  await load({ src: '0.webp' });
  assert.equal(calls, 14);
});
