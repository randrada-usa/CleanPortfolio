import assert from "node:assert/strict";
import { test } from "node:test";

const days = [{ date: "2026-10-19", count: 3, level: 2 }];
const cacheKey = "portfolio:github-contributions:v1:randrada-usa";
let moduleId = 0;
const freshModule = () => import(`../app/lib/github-contributions.ts?test=${++moduleId}`);
const response = (contributions = days) => ({ ok: true, json: async () => ({ contributions }) });

function setup(t, fetcher, initialCache) {
  const values = new Map(initialCache === undefined ? [] : [[cacheKey, initialCache]]);
  const storage = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  };
  const originalStorage = Object.getOwnPropertyDescriptor(globalThis, "sessionStorage");
  Object.defineProperty(globalThis, "sessionStorage", { configurable: true, value: storage });
  t.mock.method(globalThis, "fetch", fetcher);
  t.after(() => {
    if (originalStorage) Object.defineProperty(globalThis, "sessionStorage", originalStorage);
    else delete globalThis.sessionStorage;
  });
  return { values, storage };
}

test("shares an in-flight request and reuses the result on later visits", async (t) => {
  let resolveResponse;
  const { values } = setup(t, () => new Promise((resolve) => { resolveResponse = resolve; }));
  const cache = await freshModule();
  assert.equal(cache.getCachedGitHubContributions(), null);
  const first = cache.loadGitHubContributions();
  const second = cache.loadGitHubContributions();
  assert.equal(first, second);
  resolveResponse(response());
  assert.deepEqual(await first, days);
  assert.deepEqual(await cache.loadGitHubContributions(), days);
  assert.deepEqual(cache.getCachedGitHubContributions(), days);
  assert.equal(fetch.mock.callCount(), 1);
  assert.equal(fetch.mock.calls[0].arguments[0], "https://github-contributions-api.jogruber.de/v4/randrada-usa?y=last");
  assert.deepEqual(JSON.parse(values.get(cacheKey)), days);
});

test("restores the session after a module reload without another request", async (t) => {
  setup(t, async () => response());
  await (await freshModule()).loadGitHubContributions();
  const reloaded = await freshModule();
  assert.deepEqual(await reloaded.loadGitHubContributions(), days);
  assert.equal(fetch.mock.callCount(), 1);
});

for (const stored of ["not json", JSON.stringify([{ date: "bad", count: -1, level: 9 }])]) {
  test(`ignores invalid session cache: ${stored}`, async (t) => {
    setup(t, async () => response(), stored);
    assert.deepEqual(await (await freshModule()).loadGitHubContributions(), days);
    assert.equal(fetch.mock.callCount(), 1);
  });
}

test("keeps successful results in memory when session storage is blocked", async (t) => {
  const { storage } = setup(t, async () => response());
  storage.getItem = () => { throw new Error("Storage blocked"); };
  storage.setItem = () => { throw new Error("Storage blocked"); };
  const cache = await freshModule();
  assert.deepEqual(await cache.loadGitHubContributions(), days);
  assert.deepEqual(await cache.loadGitHubContributions(), days);
  assert.equal(fetch.mock.callCount(), 1);
});

for (const failure of [
  () => Promise.reject(new Error("Network failure")),
  async () => ({ ok: false }),
  async () => response([{ date: "2026-10-19", count: -1, level: 2 }]),
]) {
  test("retries after a failed request without caching the failure", async (t) => {
    let calls = 0;
    const { values } = setup(t, () => ++calls === 1 ? failure() : Promise.resolve(response()));
    const cache = await freshModule();
    await assert.rejects(cache.loadGitHubContributions());
    assert.equal(cache.getCachedGitHubContributions(), null);
    assert.equal(values.size, 0);
    assert.deepEqual(await cache.loadGitHubContributions(), days);
    assert.equal(fetch.mock.callCount(), 2);
  });
}

test("caches a valid empty contribution list", async (t) => {
  setup(t, async () => response([]));
  const cache = await freshModule();
  assert.deepEqual(await cache.loadGitHubContributions(), []);
  assert.deepEqual(await cache.loadGitHubContributions(), []);
  assert.equal(fetch.mock.callCount(), 1);
});
