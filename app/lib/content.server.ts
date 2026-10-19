import { createClient } from "@sanity/client";
import { certifications as localCertifications, projects as localProjects, projectOrder } from "~/data/site";
import type { Certification, Project } from "~/data/site";

const projectId = process.env.SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET || "production";
const apiVersion = process.env.SANITY_API_VERSION || "2026-08-25";

export const sanityClient = projectId
  ? createClient({ projectId, dataset, apiVersion, useCdn: true })
  : null;

function publicProjects(projects: Project[]) {
  const visible = process.env.NODE_ENV === "production"
    ? projects.filter((project) => project.published !== false)
    : projects;
  const order = new Map(projectOrder.map((slug, index) => [slug, index]));
  return [...visible].sort((a, b) =>
    (order.get(a.slug) ?? Number.MAX_SAFE_INTEGER) - (order.get(b.slug) ?? Number.MAX_SAFE_INTEGER),
  );
}

export async function getProjects(): Promise<Project[]> {
  if (!sanityClient) return publicProjects(localProjects);
  const content = await sanityClient.fetch<Project[]>(`*[_type == "project"] | order(order asc) {
    "slug": slug.current, published, title, eyebrow, summary, "image": image.asset->url,
    tags, role, team, timeline, projectType, challenge, approach, results,
    liveUrl, githubUrl, imageKind, achievement, availabilityNote, buildStory, youtubeVideoId, "gallery": gallery[].asset->url
  }`);
  return publicProjects(content.length ? content : localProjects);
}

export async function getCertifications(): Promise<Certification[]> {
  if (!sanityClient) return localCertifications;
  const content = await sanityClient.fetch<Certification[]>(`*[_type == "certification"] | order(order asc) {
    "slug": slug.current, title, issuer, category, "image": image.asset->url, year, description
  }`);
  return content.length ? content : localCertifications;
}
