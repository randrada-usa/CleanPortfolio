import type { MetaFunction } from "react-router";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useLoaderData } from "react-router";
import { Footer, Header, ProjectCard, Reveal } from "~/components/ui";
import { getProjects } from "~/lib/content.server";
import { canonicalMeta } from "~/lib/seo";

export async function loader() {
  const projects = await getProjects();
  const featuredSlugs = ["wave-and-wish", "iloilo-farmers-hub", "e-serbisyo-rizal"];
  const featuredOrder = new Map(featuredSlugs.map((slug, index) => [slug, index]));

  return projects
    .map((project, index) => ({ project, index }))
    .sort((a, b) => {
      const aOrder = featuredOrder.get(a.project.slug) ?? Number.MAX_SAFE_INTEGER;
      const bOrder = featuredOrder.get(b.project.slug) ?? Number.MAX_SAFE_INTEGER;
      return aOrder - bOrder || a.index - b.index;
    })
    .map(({ project }) => project);
}

export function headers() {
  return { "Cache-Control": "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400" };
}

export const meta: MetaFunction = () => [
  { title: "Projects — Rey Jane Andrada" },
  { name: "description", content: "Backend systems, digital platforms, and computer-vision projects by Rey Jane Andrada." },
  canonicalMeta("/projects"),
];

export default function ProjectsArchive() {
  const projects = useLoaderData<typeof loader>();
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return projects;
    return projects.filter((project) =>
      [project.title, project.summary, project.eyebrow, ...project.tags].join(" ").toLowerCase().includes(needle),
    );
  }, [query]);

  return (
    <main className="archive-page">
      <Header inner backTo="/#projects" />
      <Reveal className="archive-main" amount={0.02}>
        <h1 className="archive-title">/PROJECTS</h1>
        <p className="archive-count">{projects.length} projects</p>
        <div className="search-row">
          <label className="sr-only" htmlFor="project-search">Search projects</label>
          <div className="search-field">
            <Search aria-hidden="true" size={18} />
            <input id="project-search" className="search-input" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by title or tag…" />
          </div>
        </div>
        <div className="archive-grid">
          {filtered.length ? filtered.map((project, index) => <ProjectCard key={project.slug} project={project} backTo="/projects" revealDelay={(index % 6) * 0.08} />) : <p className="empty-state">No projects match that search.</p>}
        </div>
      </Reveal>
      <Footer />
    </main>
  );
}
