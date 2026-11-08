import { getGitHubContributions } from "~/lib/github-contributions.server";

export async function loader() {
  try {
    const { contributions, source } = await getGitHubContributions(process.env.GITHUB_TOKEN);
    return Response.json({ contributions, source }, {
      headers: {
        // Vercel's CDN keeps this for 6 hours and serves the old copy while refreshing for up to a day.
        "Cache-Control": "public, max-age=0, s-maxage=21600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("[github-contributions] All sources failed:", error);
    // The page falls back to its bundled snapshot. Don't cache failures.
    return Response.json({ error: "GitHub activity is unavailable right now." }, {
      status: 503,
      headers: { "Cache-Control": "no-store" },
    });
  }
}
