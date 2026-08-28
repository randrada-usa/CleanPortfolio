import type { MetaFunction } from "react-router";
import { Link, useLoaderData } from "react-router";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";
import { useEffect, useState } from "react";
import {
  certificationCategories,
  coreStack,
  experience,
  type Certification,
  type CertificationCategory,
  type Project,
} from "~/data/site";
import { ArrowIcon, Footer, Header, ProjectCard, Reveal, SocialPill } from "~/components/ui";
import { getCertifications, getProjects } from "~/lib/content.server";

const homeSections = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "certifications", label: "Certifications" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
] as const;

type HomeSectionId = typeof homeSections[number]["id"];

function HomeSectionRail() {
  const [activeSection, setActiveSection] = useState<HomeSectionId>("home");

  useEffect(() => {
    let frame = 0;

    const updateActiveSection = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const marker = window.innerHeight * 0.5;
        const sections = homeSections
          .map(({ id }) => ({ id, element: document.getElementById(id) }))
          .filter((section): section is { id: HomeSectionId; element: HTMLElement } => Boolean(section.element));
        const visible = sections.find(({ element }) => {
          const bounds = element.getBoundingClientRect();
          return bounds.top <= marker && bounds.bottom > marker;
        });

        if (visible) {
          setActiveSection(visible.id);
          return;
        }

        const nearest = sections.reduce<{ id: HomeSectionId; distance: number } | null>((closest, { id, element }) => {
          const bounds = element.getBoundingClientRect();
          const distance = Math.abs(bounds.top + bounds.height / 2 - marker);
          return !closest || distance < closest.distance ? { id, distance } : closest;
        }, null);
        if (nearest) setActiveSection(nearest.id);
      });
    };

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, []);

  return (
    <nav className="home-section-rail" aria-label="Page sections">
      {homeSections.map(({ id, label }) => {
        const active = activeSection === id;
        return (
          <a
            key={id}
            className={active ? "is-active" : undefined}
            href={`#${id}`}
            aria-label={`Go to ${label}`}
            aria-current={active ? "location" : undefined}
            onClick={() => setActiveSection(id)}
          >
            <span>{label}</span>
            <i aria-hidden="true" />
          </a>
        );
      })}
    </nav>
  );
}

export async function loader() {
  const [projects, certifications] = await Promise.all([getProjects(), getCertifications()]);
  return { projects, certifications };
}

export function headers() {
  return { "Cache-Control": "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400" };
}

export const meta: MetaFunction = () => [
  { title: "Rey Jane Andrada — Backend-Focused Developer & Aspiring Data Engineer" },
  {
    name: "description",
    content:
      "Backend-focused developer and aspiring data engineer building reliable systems, API integrations, and practical computer-vision experiences.",
  },
  { property: "og:title", content: "Rey Jane Andrada — Developer Portfolio" },
  { property: "og:description", content: "Reliable backend systems, practical applications, and a path toward data engineering." },
  { property: "og:type", content: "website" },
  { property: "og:url", content: "https://devbyrey.me/" },
  { property: "og:image", content: "https://devbyrey.me/assets/brand/link-preview.png" },
  { property: "og:image:width", content: "1200" },
  { property: "og:image:height", content: "630" },
  { property: "og:image:alt", content: "Rey Jane Andrada — Backend-Focused Developer and Aspiring Data Engineer" },
  { name: "twitter:card", content: "summary_large_image" },
  { name: "twitter:title", content: "Rey Jane Andrada — Developer Portfolio" },
  { name: "twitter:description", content: "Reliable backend systems, practical applications, and a path toward data engineering." },
  { name: "twitter:image", content: "https://devbyrey.me/assets/brand/link-preview.png" },
];

function AboutStack() {
  return (
    <section id="about" className="section about-section">
      <p className="ghost-word" aria-hidden="true">ABOUT</p>
      <Reveal className="section-inner about-grid">
        <div className="about-copy">
          <h2>I like building the parts that keep everything else reliable.</h2>
          <p>
            I’m a Computer Science student and backend-focused developer based in the Philippines. My work spans database design,
            serverless functions, API integrations, secure workflows, and real-world interactive systems. I’m now deepening that
            foundation as I work toward data engineering.
          </p>
          <div className="about-actions">
            <Link className="button button-dark" to="/cv" prefetch="intent">View CV <ArrowIcon /></Link>
          </div>
        </div>
        <div>
          <h2 className="core-stack-title">/CORE STACK</h2>
          <div className="stack-grid">
            {Object.entries(coreStack).map(([group, items]) => (
              <div className="stack-group" key={group}>
                <h3>{group}</h3>
                <div className="tag-list">{items.map((item) => <span key={item}>{item}</span>)}</div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function ProjectsSection({ projects }: { projects: Project[] }) {
  return (
    <section id="projects" className="section projects-section">
      <p className="ghost-word" aria-hidden="true">PROJECTS</p>
      <Reveal className="section-inner">
        <h2 className="section-heading">/SELECTED PROJECTS</h2>
        <div className="project-grid">
          {projects.map((project, index) => <ProjectCard key={project.slug} project={project} priority={index === 0} />)}
        </div>
        <div className="center-action"><Link className="button" to="/projects" prefetch="render">View All Projects <ArrowIcon /></Link></div>
      </Reveal>
    </section>
  );
}

const categoryCopy: Record<CertificationCategory, string> = {
  "Data & Analytics": "Credentials in data analysis, SQL, data engineering, and data science foundations.",
  "Artificial Intelligence": "Practical AI foundations, responsible use, prompt fluency, and generative-AI workflows.",
  "Cloud & Development": "Cloud, Python, containers, and the infrastructure foundations behind reliable software.",
  "Software & Tools": "Developer workflows, collaboration tools, and user-experience foundations.",
  "Hackathons & Events": "Rapid building, community participation, workshops, and collaborative technology events.",
};

function CertificationsSection({ certifications }: { certifications: Certification[] }) {
  const [open, setOpen] = useState<CertificationCategory | null>("Data & Analytics");

  useEffect(() => {
    const smallScreen = window.matchMedia("(max-width: 640px)");
    if (smallScreen.matches) setOpen(null);
  }, []);

  // Preload category preview images so accordion previews are instant
  useEffect(() => {
    certificationCategories.forEach((category) => {
      const firstItem = certifications.find((item) => item.category === category);
      if (firstItem?.image) {
        const img = new Image();
        img.src = firstItem.image;
      }
    });
  }, [certifications]);

  return (
    <section id="certifications" className="section certifications-section">
      <p className="ghost-word" aria-hidden="true">CERTIFICATIONS</p>
      <Reveal className="section-inner">
        <h2 className="section-heading">/CERTIFICATIONS</h2>
        <div className="cert-accordion">
          {certificationCategories.map((category) => {
            const active = open === category;
            const items = certifications.filter((item) => item.category === category);
            return (
              <div className={`cert-row ${active ? "open" : ""}`} key={category}>
                <button
                  className="cert-row-button"
                  aria-expanded={active}
                  onClick={() => setOpen(active ? null : category)}
                >
                  <span>{category.toUpperCase()}</span>
                  {active ? <X aria-hidden="true" /> : <ArrowUpRight aria-hidden="true" />}
                </button>
                <div className="cert-row-reveal" aria-hidden={!active}>
                  <div className="cert-row-clip">
                    <div className="cert-row-content">
                      <div className="cert-row-copy">
                        <p>
                          {categoryCopy[category]}<br />
                          {items.slice(0, 5).map((item, index) => (
                            <span key={item.slug}>
                              {item.title}{index < Math.min(items.length, 5) - 1 ? ", " : "."}
                              {category === "Data & Analytics" && index === 2 && <br />}
                            </span>
                          ))}
                        </p>
                        <Link className="button button-light" tabIndex={active ? 0 : -1} to={`/certifications?category=${encodeURIComponent(category)}`} prefetch="intent">
                          View More <ArrowIcon />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                <AnimatePresence initial={false}>
                  {active && items[0]?.image && (
                    <motion.img
                      className="cert-preview"
                      src={items[0].image}
                      alt=""
                      aria-hidden="true"
                      loading="eager"
                      decoding="async"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    />
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
        <div className="center-action"><Link className="button" to="/certifications" prefetch="render">View All 25 <ArrowIcon /></Link></div>
      </Reveal>
    </section>
  );
}

function ExperienceSection() {
  const [hovered, setHovered] = useState<string | null>(null);
  return (
    <section id="experience" className="section experience-section">
      <p className="ghost-word" aria-hidden="true">EXPERIENCE</p>
      <Reveal className="section-inner">
        <div className="experience-top">
          <h2 className="section-heading">/EXPERIENCE</h2>
          <p className="experience-tagline">Building &amp; leading since 2023</p>
        </div>
        <div className="experience-list">
          {experience.map((item) => (
            <div
              className="experience-row"
              key={`${item.organization}-${item.role}`}
              onMouseEnter={() => setHovered(item.role)}
              onMouseLeave={() => setHovered(null)}
            >
              <div><h3>{item.organization}</h3><p>{item.role}</p></div>
              <time>{item.dates}</time>
              <AnimatePresence>
                {hovered === item.role && item.image && (
                  <motion.img
                    className="experience-hover"
                    src={item.image}
                    alt=""
                    initial={{ opacity: 0, scale: .9, rotate: 2 }}
                    animate={{ opacity: 1, scale: 1, rotate: 6 }}
                    exit={{ opacity: 0, scale: .94 }}
                  />
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

export default function Home() {
  const { projects, certifications } = useLoaderData<typeof loader>();
  return (
    <main>
      <HomeSectionRail />
      <section className="hero" id="home">
        <Header />
        <motion.h1 className="hero-name" aria-label="Rey Jane Andrada" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .85, ease: [0.22, 1, 0.36, 1] }}>
          <span className="name-outline">REY JANE</span><span className="name-solid">ANDRADA</span>
        </motion.h1>
        <motion.img
          className="hero-photo"
          src="/assets/photos/063d74f9-f3e3-4fdc-b05a-a969275ddb9a.png"
          alt="Rey Jane Andrada holding a laptop"
          draggable={false}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: .95, delay: .12, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.div className="hero-copy" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8, delay: .28, ease: [0.22, 1, 0.36, 1] }}>
          <h1>Backend-Focused Developer<br />Aspiring Data Engineer</h1>
          <p>I build reliable backend systems and practical applications—then keep learning toward the data platforms behind them.</p>
          <span className="hero-location">
            <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
              <circle cx="12" cy="10" r="2.5" />
            </svg>
            Iloilo City, Philippines
          </span>
        </motion.div>
        <motion.div className="hero-socials" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .75, delay: .38, ease: [0.22, 1, 0.36, 1] }}>
          <SocialPill type="github" label="GitHub" />
          <SocialPill type="linkedin" label="LinkedIn" />
          <SocialPill type="email" label="Email" />
        </motion.div>
      </section>
      <AboutStack />
      <ProjectsSection projects={projects} />
      <CertificationsSection certifications={certifications} />
      <ExperienceSection />
      <Footer />
    </main>
  );
}
