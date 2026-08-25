import type { MetaFunction } from "react-router";
import { useMemo, useState } from "react";
import { useLoaderData } from "react-router";
import { Header, PageFooter, ProjectCard } from "~/components/ui";
import { getProjects } from "~/lib/content.server";

export async function loader() { return getProjects(); }

export const meta: MetaFunction = () => [
  { title: "Projects — Rey Jane Andrada" },
  { name: "description", content: "Backend systems, digital platforms, and computer-vision projects by Rey Jane Andrada." },
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
      <Header inner />
      <div className="archive-main">
        <h1 className="archive-title">/PROJECTS</h1>
        <p className="archive-count">{projects.length} projects</p>
        <div className="search-row">
          <label className="sr-only" htmlFor="project-search">Search projects</label>
          <input id="project-search" className="search-input" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by title or tag…" />
        </div>
        <div className="archive-grid">
          {filtered.length ? filtered.map((project) => <ProjectCard key={project.slug} project={project} />) : <p className="empty-state">No projects match that search.</p>}
        </div>
      </div>
      <PageFooter />
    </main>
  );
}
