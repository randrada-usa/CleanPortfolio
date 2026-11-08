import type { MetaFunction } from "react-router";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useState, type MouseEvent as ReactMouseEvent } from "react";
import { Link, useLoaderData } from "react-router";
import { Footer, Header, Reveal } from "~/components/ui";
import { experience } from "~/data/site";
import { getProjects } from "~/lib/content.server";
import { experiencePreviewImage } from "~/lib/images";
import { canonicalMeta } from "~/lib/seo";

export async function loader() {
  const projects = await getProjects();
  const titles = Object.fromEntries(projects.map((project) => [project.slug, project.title]));
  // Only link projects that are visible on this site (unpublished ones are hidden in production).
  return experience.map((item) => ({
    ...item,
    related: (item.relatedProjects ?? []).flatMap((slug) => titles[slug] ? [{ slug, title: titles[slug] }] : []),
  }));
}

export function headers() {
  return { "Cache-Control": "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400" };
}

export const meta: MetaFunction = () => [
  { title: "Experience — Rey Jane Andrada" },
  { name: "description", content: "Leadership and development roles held by Rey Jane Andrada, with what was built and led in each." },
  canonicalMeta("/experience"),
];

export default function ExperiencePage() {
  const roles = useLoaderData<typeof loader>();
  const [activeSlug, setActiveSlug] = useState(roles[0]?.slug);

  // Highlight the role nearest the upper part of the screen in the side index.
  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        // At the very bottom the last roles can't scroll up far enough, so pick the last one.
        if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
          setActiveSlug(roles[roles.length - 1]?.slug);
          return;
        }
        const marker = window.innerHeight * 0.35;
        let current = roles[0]?.slug;
        for (const role of roles) {
          const el = document.getElementById(role.slug);
          if (el && el.getBoundingClientRect().top <= marker) current = role.slug;
        }
        setActiveSlug(current);
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [roles]);

  const goToRole = (event: ReactMouseEvent<HTMLAnchorElement>, slug: string, index: number) => {
    event.preventDefault();
    const behavior: ScrollBehavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
    if (index === 0) {
      // The newest role sits right under the page title, so go to the very top.
      window.scrollTo({ top: 0, behavior });
      window.history.replaceState(window.history.state, "", window.location.pathname);
    } else {
      document.getElementById(slug)?.scrollIntoView({ behavior, block: "start" });
      window.history.replaceState(window.history.state, "", `#${slug}`);
    }
  };

  return (
    <main className="archive-page experience-page">
      <Header inner backTo="/#experience" />
      <Reveal className="archive-main" amount={0.02}>
        <h1 className="archive-title">/EXPERIENCE</h1>
        <p className="archive-count">{roles.length} roles · Building &amp; leading since 2023</p>
        <div className="experience-layout">
          <nav className="experience-index" aria-label="Roles">
            {roles.map((role, index) => (
              <a key={role.slug} href={index === 0 ? "#" : `#${role.slug}`} onClick={(event) => goToRole(event, role.slug, index)} aria-current={activeSlug === role.slug ? "true" : undefined}>
                <strong>{role.organization}</strong>
                <span>{role.role}</span>
              </a>
            ))}
          </nav>
          <div className="experience-entries">
            {roles.map((role) => (
              <article key={role.slug} id={role.slug} className="experience-entry">
                <figure className="experience-entry-image">
                  <img {...experiencePreviewImage(role.image)} sizes="(max-width: 900px) 92vw, 400px" alt={`${role.organization}`} loading="lazy" decoding="async" />
                </figure>
                <div className="experience-entry-body">
                  <time>{role.dates}</time>
                  <h2>{role.role}</h2>
                  <p className="experience-entry-org">{role.organization}</p>
                  {role.summary
                    ? <p className="experience-entry-summary">{role.summary}</p>
                    : <p className="experience-entry-summary experience-entry-pending">More details about this role are coming soon.</p>}
                  {role.highlights?.length ? (
                    <ul className="experience-entry-highlights">
                      {role.highlights.map((item) => <li key={item}>{item}</li>)}
                    </ul>
                  ) : null}
                  {role.tools?.length ? (
                    <div className="tag-list" aria-label="Tools used">
                      {role.tools.map((tool) => <span key={tool}>{tool}</span>)}
                    </div>
                  ) : null}
                  {role.related.length ? (
                    <div className="experience-entry-related">
                      <span>Related work</span>
                      {role.related.map((project) => (
                        <Link key={project.slug} to={`/projects/${project.slug}`} state={{ backTo: "/projects", projectOrigin: `/experience#${role.slug}` }} prefetch="intent">
                          {project.title} <ArrowUpRight aria-hidden="true" size={15} />
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </div>
      </Reveal>
      <Footer />
    </main>
  );
}
