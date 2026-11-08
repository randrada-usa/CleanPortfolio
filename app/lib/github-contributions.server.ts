import { githubUsername, isGitHubContributions, type GitHubContribution } from "~/lib/github-contributions";

export type ContributionSource = "github" | "community";

const contributionLevels: Record<string, number> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

const contributionsQuery = `
  query ($login: String!) {
    user(login: $login) {
      contributionsCollection {
        contributionCalendar {
          weeks { contributionDays { date contributionCount contributionLevel } }
        }
      }
    }
  }
`;

type FetchLike = typeof fetch;

/** Official GitHub GraphQL API. Needs a token, which can be read-only with no extra permissions. */
export async function fetchFromGitHub(token: string, fetcher: FetchLike = fetch, timeoutMs = 5000): Promise<GitHubContribution[]> {
  const response = await fetcher("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": "rey-portfolio",
    },
    body: JSON.stringify({ query: contributionsQuery, variables: { login: githubUsername } }),
    signal: AbortSignal.timeout(timeoutMs),
  });
  if (!response.ok) throw new Error(`GitHub API responded ${response.status}`);
  const payload = await response.json();
  if (payload?.errors?.length) throw new Error(`GitHub API error: ${payload.errors[0]?.message ?? "unknown"}`);
  const weeks: unknown = payload?.data?.user?.contributionsCollection?.contributionCalendar?.weeks;
  if (!Array.isArray(weeks)) throw new Error("GitHub API returned no contribution calendar");
  const contributions = weeks.flatMap((week) => (week?.contributionDays ?? []).map((day: {
    date: string;
    contributionCount: number;
    contributionLevel: string;
  }) => ({
    date: day.date,
    count: day.contributionCount,
    level: contributionLevels[day.contributionLevel] ?? 0,
  })));
  if (!isGitHubContributions(contributions)) throw new Error("GitHub API returned invalid contributions");
  return contributions;
}

/** Free community service. Used when no token is configured or GitHub's API fails. */
export async function fetchFromCommunity(fetcher: FetchLike = fetch, timeoutMs = 4000): Promise<GitHubContribution[]> {
  const response = await fetcher(`https://github-contributions-api.jogruber.de/v4/${githubUsername}?y=last`, {
    signal: AbortSignal.timeout(timeoutMs),
  });
  if (!response.ok) throw new Error(`Community API responded ${response.status}`);
  const data = await response.json();
  if (!isGitHubContributions(data?.contributions)) throw new Error("Community API returned invalid contributions");
  return data.contributions;
}

export async function getGitHubContributions(
  token: string | undefined,
  fetcher: FetchLike = fetch,
): Promise<{ contributions: GitHubContribution[]; source: ContributionSource }> {
  if (token) {
    try {
      return { contributions: await fetchFromGitHub(token, fetcher), source: "github" };
    } catch (error) {
      console.warn("[github-contributions] GitHub API failed, trying community API:", error);
    }
  }
  return { contributions: await fetchFromCommunity(fetcher), source: "community" };
}
