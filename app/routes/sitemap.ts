import { getCertifications, getProjects } from "~/lib/content.server";
import { absoluteUrl } from "~/lib/seo";

function escapeXml(value: string) {
  return value.replace(/[<>&'\"]/g, (character) => ({
    "<": "&lt;",
    ">": "&gt;",
    "&": "&amp;",
    "'": "&apos;",
    "\"": "&quot;",
  })[character] ?? character);
}

export async function loader() {
  const [projects, certifications] = await Promise.all([getProjects(), getCertifications()]);
  const paths = [
    "/",
    "/projects",
    ...projects.map((project) => `/projects/${project.slug}`),
    "/certifications",
    ...certifications.map((certification) => `/certifications/${certification.slug}`),
    "/cv",
  ];
  const urls = paths.map((path) => `  <url><loc>${escapeXml(absoluteUrl(path))}</loc></url>`).join("\n");

  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
