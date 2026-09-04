import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import * as Dialog from "@radix-ui/react-dialog";
import { Code2, ExternalLink, X } from "lucide-react";
import { useState } from "react";
import { useLoaderData, useLocation } from "react-router";
import { Footer, Header, ProjectCard, Reveal } from "~/components/ui";
import { getProjects } from "~/lib/content.server";
import { projectDetailImage } from "~/lib/images";

export async function loader({ params }: LoaderFunctionArgs) {
  const projects = await getProjects();
  const project = projects.find((item) => item.slug === params.slug);
  if (!project) throw new Response("Not Found", { status: 404 });
  return { project, related: projects.filter((item) => item.slug !== project.slug).slice(0, 2) };
}

export function headers() {
  return { "Cache-Control": "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400" };
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const project = data?.project;
  return [
    { title: project ? `${project.title} — Rey Jane Andrada` : "Project Not Found" },
    { name: "description", content: project?.summary ?? "Project case study by Rey Jane Andrada." },
  ];
};

export default function ProjectDetail() {
  const { project, related } = useLoaderData<typeof loader>();
  const location = useLocation();
  const [privateNoticeOpen, setPrivateNoticeOpen] = useState(false);
  const requestedBackTo = (location.state as { backTo?: string } | null)?.backTo;
  const backTo = requestedBackTo === "/projects" ? "/projects" : "/#projects";
  const unavailable = (label: string) => {
    if (project.slug === "wave-and-wish") {
      setPrivateNoticeOpen(true);
      return;
    }
    window.alert(`${label} is currently unavailable for ${project.title}.`);
  };

  return (
    <main className="detail-page">
      <Header inner backTo={backTo} />
      <Reveal className="detail-main" amount={0.02}>
        <section className="detail-hero">
          <div className="detail-tags tag-list"><span>{project.projectType}</span><span>{project.team}</span></div>
          <div className="detail-title">
            <h1>{project.title}</h1>
            <p className="lead">{project.summary}</p>
            <div className="detail-actions">
              {project.githubUrl ? (
                <a className="button" href={project.githubUrl} target="_blank" rel="noreferrer"><Code2 size={18} /> GitHub</a>
              ) : (
                <button className="button" type="button" onClick={() => unavailable("GitHub repository")}><Code2 size={18} /> GitHub</button>
              )}
              {project.liveUrl ? (
                <a className="button button-dark" href={project.liveUrl} target="_blank" rel="noreferrer">View Live <ExternalLink size={18} /></a>
              ) : (
                <button className="button button-dark" type="button" onClick={() => unavailable("Live version")}>View Live <ExternalLink size={18} /></button>
              )}
            </div>
          </div>
          <aside className="detail-meta">
            <div className="meta-item"><span>My Role</span><strong>{project.role}</strong></div>
            <div className="meta-item"><span>Timeline</span><strong>{project.timeline}</strong></div>
            <div className="meta-item"><span>Stack</span><strong>{project.tags.join(" · ")}</strong></div>
          </aside>
        </section>
        <img className="detail-image" {...projectDetailImage(project.image)} alt={`${project.title} project`} loading="eager" fetchPriority="high" decoding="async" />
        <section className="case-study">
          <h2>/CASE STUDY</h2>
          <div>
            <div className="case-block"><h3>The challenge</h3><p>{project.challenge}</p></div>
            <div className="case-block"><h3>Technical approach</h3><ul>{project.approach.map((item) => <li key={item}>{item}</li>)}</ul></div>
            <div className="case-block"><h3>Results</h3><div className="result-grid">{project.results.map((item) => <div key={item}>{item}</div>)}</div></div>
          </div>
        </section>
        <section className="more-section">
          <h2>/MORE PROJECTS</h2>
          <div className="project-grid">{related.map((item) => <ProjectCard key={item.slug} project={item} backTo={backTo} />)}</div>
        </section>
      </Reveal>
      <Footer />
      <Dialog.Root open={privateNoticeOpen} onOpenChange={setPrivateNoticeOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="private-dialog-overlay" />
          <Dialog.Content className="private-dialog-content">
            <Dialog.Close className="private-dialog-close" aria-label="Close private project notice"><X size={20} /></Dialog.Close>
            <span className="private-dialog-label">PRIVATE COMMISSION</span>
            <Dialog.Title>Wave &amp; Wish is not publicly accessible.</Dialog.Title>
            <Dialog.Description>
              This project was created as a private commission, so both the live version and source repository are private.
            </Dialog.Description>
            <Dialog.Close className="button button-dark private-dialog-action">Understood</Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </main>
  );
}
