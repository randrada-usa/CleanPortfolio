import assert from "node:assert/strict";
import { test } from "node:test";
import "./helpers/resolve-app-alias.mjs";

const { getGitHubContributions, fetchFromGitHub } = await import("../app/lib/github-contributions.server.ts");
const { githubContributionsSnapshot, snapshotCapturedOn } = await import("../app/data/github-contributions-snapshot.ts");

const json = (body, status = 200) => ({ ok: status >= 200 && status < 300, status, json: async () => body });
const graphqlBody = {
  data: { user: { contributionsCollection: { contributionCalendar: { weeks: [
    { contributionDays: [
      { date: "2026-11-01", contributionCount: 0, contributionLevel: "NONE" },
      { date: "2026-11-02", contributionCount: 7, contributionLevel: "THIRD_QUARTILE" },
    ] },
    { contributionDays: [{ date: "2026-11-08", contributionCount: 12, contributionLevel: "FOURTH_QUARTILE" }] },
  ] } } } },
};
const communityDays = [{ date: "2026-11-08", count: 2, level: 1 }];
const silence = (t) => t.mock.method(console, "warn", () => {});

test("uses the official GitHub API when a token is set and maps levels to 0-4", async () => {
  const calls = [];
  const fetcher = async (url, init) => { calls.push({ url, init }); return json(graphqlBody); };
  const result = await getGitHubContributions("token-123", fetcher);
  assert.equal(result.source, "github");
  assert.deepEqual(result.contributions, [
    { date: "2026-11-01", count: 0, level: 0 },
    { date: "2026-11-02", count: 7, level: 3 },
    { date: "2026-11-08", count: 12, level: 4 },
  ]);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, "https://api.github.com/graphql");
  assert.equal(calls[0].init.headers.Authorization, "Bearer token-123");
  assert.equal(JSON.parse(calls[0].init.body).variables.login, "randrada-usa");
});

test("skips GitHub and uses the community API when no token is set", async () => {
  const urls = [];
  const result = await getGitHubContributions(undefined, async (url) => { urls.push(url); return json({ contributions: communityDays }); });
  assert.deepEqual(result, { contributions: communityDays, source: "community" });
  assert.deepEqual(urls, ["https://github-contributions-api.jogruber.de/v4/randrada-usa?y=last"]);
});

for (const [name, failure] of [
  ["HTTP error", () => json({}, 401)],
  ["GraphQL error", () => json({ errors: [{ message: "Bad credentials" }] })],
  ["network error", () => { throw new Error("offline"); }],
]) {
  test(`falls back to the community API after a GitHub ${name}`, async (t) => {
    silence(t);
    const fetcher = async (url) => url.includes("api.github.com") ? failure() : json({ contributions: communityDays });
    assert.deepEqual(await getGitHubContributions("token", fetcher), { contributions: communityDays, source: "community" });
  });
}

test("rejects when every source fails so the route can return 503", async (t) => {
  silence(t);
  await assert.rejects(getGitHubContributions("token", async () => json({ error: "GitHub: Service unavailable." }, 503)));
});

test("rejects GitHub responses with impossible values", async () => {
  const bad = structuredClone(graphqlBody);
  bad.data.user.contributionsCollection.contributionCalendar.weeks[0].contributionDays[0].contributionCount = -1;
  await assert.rejects(fetchFromGitHub("token", async () => json(bad)));
});

test("bundled snapshot is valid, continuous, and ends on its capture date", () => {
  assert.equal(githubContributionsSnapshot.length, 275);
  assert.equal(githubContributionsSnapshot.reduce((sum, day) => sum + day.count, 0), 978);
  assert.equal(githubContributionsSnapshot.at(-1).date, snapshotCapturedOn);
  for (let i = 1; i < githubContributionsSnapshot.length; i++) {
    const gap = Date.parse(githubContributionsSnapshot[i].date) - Date.parse(githubContributionsSnapshot[i - 1].date);
    assert.equal(gap, 86_400_000, `gap before ${githubContributionsSnapshot[i].date}`);
  }
  assert.ok(githubContributionsSnapshot.every((day) => day.level >= 0 && day.level <= 4));
});
