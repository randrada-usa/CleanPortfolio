import type { GitHubContribution } from "~/lib/github-contributions";

// Last known contribution history, shown only when live GitHub data can't be loaded.
// Captured 2026-10-02. Refresh it by replacing the arrays with newer data.
export const snapshotCapturedOn = "2026-10-02";
const startDate = "2026-01-01";
const counts = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,9,7,0,1,1,7,6,0,0,4,0,3,0,1,1,6,5,2,0,5,1,3,5,3,3,2,5,3,5,1,0,0,0,0,0,0,1,1,0,0,2,0,0,3,7,3,7,11,4,2,0,1,10,16,12,3,1,3,3,0,15,13,11,4,1,17,15,11,1,0,0,7,0,5,14,11,6,0,2,0,4,0,1,0,0,0,0,0,1,2,3,0,0,0,1,2,1,1,8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,21,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,12,14,0,27,5,4,5,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,6,0,2,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,8,12,1,1,15,1,20,0,19,20,18,4,14,10,4,19,21,8,40,5,11,8,7,13,31,22,18,17,14,11,5,4,11,9,4,11,13,11,0,3,9,12,15,3,4,4,24];
const levels = "00000000000000000000000000000000000001220112100101011111011111111111000000110010012122110123211110332113321002013210101010000011100011112000000000000000001400010000000000000230411110000000000000000000001000101100010000000000000122113140443132144241222344333211221232012231114";

export const githubContributionsSnapshot: GitHubContribution[] = counts.map((count, index) => {
  const date = new Date(`${startDate}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + index);
  return { date: date.toISOString().slice(0, 10), count, level: Number(levels[index]) };
});
