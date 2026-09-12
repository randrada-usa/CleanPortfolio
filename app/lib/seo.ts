export const siteUrl = "https://devbyrey.me";

export function absoluteUrl(path = "/") {
  return new URL(path, siteUrl).toString();
}

export function canonicalMeta(path = "/") {
  return { tagName: "link" as const, rel: "canonical", href: absoluteUrl(path) };
}
