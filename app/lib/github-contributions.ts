export type GitHubContribution = {
  date: string;
  count: number;
  level: number;
};

export const githubUsername = "randrada-usa";
const githubCacheKey = `portfolio:github-contributions:v1:${githubUsername}`;
let githubContributionsCache: GitHubContribution[] | null = null;
let githubContributionsRequest: Promise<GitHubContribution[]> | null = null;

function isGitHubContributions(value: unknown): value is GitHubContribution[] {
  return Array.isArray(value) && value.every((day) =>
    day && typeof day.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(day.date)
    && Number.isInteger(day.count) && day.count >= 0
    && Number.isInteger(day.level) && day.level >= 0 && day.level <= 4,
  );
}

export function loadGitHubContributions(): Promise<GitHubContribution[]> {
  if (githubContributionsCache) return Promise.resolve(githubContributionsCache);
  try {
    const stored: unknown = JSON.parse(sessionStorage.getItem(githubCacheKey) ?? "null");
    if (isGitHubContributions(stored)) {
      githubContributionsCache = stored;
      return Promise.resolve(stored);
    }
  } catch {
    // Memory caching still works when browser storage is unavailable.
  }
  if (!githubContributionsRequest) {
    githubContributionsRequest = fetch(`https://github-contributions-api.jogruber.de/v4/${githubUsername}?y=last`)
      .then(async (response) => {
        if (!response.ok) throw new Error("GitHub activity request failed");
        const data = await response.json();
        if (!isGitHubContributions(data?.contributions)) throw new Error("Invalid GitHub activity response");
        githubContributionsCache = data.contributions;
        try {
          sessionStorage.setItem(githubCacheKey, JSON.stringify(data.contributions));
        } catch {
          // Keep the successful result in memory even if storage is full or blocked.
        }
        return data.contributions;
      })
      .finally(() => { githubContributionsRequest = null; });
  }
  return githubContributionsRequest;
}

export function getCachedGitHubContributions() {
  return githubContributionsCache;
}
