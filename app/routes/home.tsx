import type { MetaFunction } from "react-router";
import { Link, useLoaderData } from "react-router";
import { AnimatePresence, motion, useMotionValue, useReducedMotion } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  certificationCategories,
  coreStack,
  experience,
  socialLinks,
  type Certification,
  type CertificationCategory,
  type Project,
} from "~/data/site";
import { ArrowIcon, Footer, Header, ProjectCard, Reveal, SocialPill } from "~/components/ui";
import { getCertifications, getProjects } from "~/lib/content.server";
import { experiencePreviewImage } from "~/lib/images";
import { usePreviewImages } from "~/lib/use-preview-images";
import { absoluteUrl, canonicalMeta } from "~/lib/seo";

export async function loader() {
  const [projects, certifications] = await Promise.all([getProjects(), getCertifications()]);
  const selectedProjectSlugs = [
    "wave-and-wish",
    "iloilo-farmers-hub",
    "e-serbisyo-rizal",
    "duely",
    "icslink",
    "praise-and-pray",
  ];
  const selectedProjects = selectedProjectSlugs
    .map((slug) => projects.find((project) => project.slug === slug))
    .filter((project): project is Project => Boolean(project));

  return { projects: selectedProjects, certifications };
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
  { property: "og:url", content: "https://www.devbyrey.me/" },
  { property: "og:image", content: "https://www.devbyrey.me/assets/brand/link-preview.png" },
  { property: "og:image:width", content: "1200" },
  { property: "og:image:height", content: "630" },
  { property: "og:image:alt", content: "Rey Jane Andrada — Backend-Focused Developer and Aspiring Data Engineer" },
  { name: "twitter:card", content: "summary_large_image" },
  { name: "twitter:title", content: "Rey Jane Andrada — Developer Portfolio" },
  { name: "twitter:description", content: "Reliable backend systems, practical applications, and a path toward data engineering." },
  { name: "twitter:image", content: "https://www.devbyrey.me/assets/brand/link-preview.png" },
  canonicalMeta("/"),
  {
    "script:ld+json": {
      "@context": "https://schema.org",
      "@type": "ProfilePage",
      "@id": absoluteUrl("/#profile-page"),
      url: absoluteUrl("/"),
      name: "Rey Jane Andrada — Developer Portfolio",
      mainEntity: {
        "@type": "Person",
        "@id": absoluteUrl("/#rey-jane-andrada"),
        name: "Rey Jane Andrada",
        url: absoluteUrl("/"),
        image: absoluteUrl("/assets/brand/link-preview.png"),
        jobTitle: "Backend-Focused Developer and Aspiring Data Engineer",
        gender: "Male",
        sameAs: [socialLinks.github, socialLinks.linkedin],
        knowsAbout: ["Backend Development", "Data Engineering", "Python", "TypeScript", "React", "SQL", "Firebase"],
      },
    },
  },
];

function AboutStack() {
  return (
    <section id="about" className="section about-section">
      <p className="ghost-word" aria-hidden="true">ABOUT</p>
      <div className="section-inner about-grid">
        <div className="about-copy">
          <Reveal><h2>I like building the parts that keep everything else reliable.</h2></Reveal>
          <Reveal delay={0.1}><p>
            I’m a Computer Science student and backend-focused developer based in the Philippines. My work spans database design,
            serverless functions, API integrations, secure workflows, and real-world interactive systems. I’m now deepening that
            foundation as I work toward data engineering.
          </p></Reveal>
          <Reveal className="about-actions" delay={0.2}>
            <Link className="button button-dark" to="/cv" prefetch="intent">View CV <ArrowIcon /></Link>
          </Reveal>
        </div>
        <div>
          <Reveal delay={0.15}><h2 className="core-stack-title">/CORE STACK</h2></Reveal>
          <div className="stack-grid">
            {Object.entries(coreStack).map(([group, items], index) => (
              <Reveal className="stack-group" delay={0.22 + index * 0.08} key={group}>
                <h3>{group}</h3>
                <div className="tag-list">{items.map((item) => <span key={item}>{item}</span>)}</div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProjectsSection({ projects }: { projects: Project[] }) {
  return (
    <section id="projects" className="section projects-section">
      <p className="ghost-word" aria-hidden="true">PROJECTS</p>
      <div className="section-inner">
        <Reveal><h2 className="section-heading">/SELECTED PROJECTS</h2></Reveal>
        <div className="project-grid">
          {projects.map((project, index) => <ProjectCard key={project.slug} project={project} revealDelay={index * 0.11} />)}
        </div>
        <Reveal className="center-action" delay={0.33}><Link className="button" to="/projects" prefetch="intent">View All Projects <ArrowIcon /></Link></Reveal>
      </div>
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
  const reducedMotion = useReducedMotion();
  const previewImages = useMemo(() => certificationCategories.flatMap((category) => {
    const image = certifications.find((item) => item.category === category)?.image;
    return image ? [{ src: image }] : [];
  }), [certifications]);
  const { sectionRef, enabled: showPreviews } = usePreviewImages(
    previewImages,
    "(min-width: 1101px) and (hover: hover) and (pointer: fine)",
  );

  return (
    <section ref={sectionRef} id="certifications" className="section certifications-section">
      <p className="ghost-word" aria-hidden="true">CERTIFICATIONS</p>
      <div className="section-inner">
        <Reveal><h2 className="section-heading">/CERTIFICATIONS</h2></Reveal>
        <div className="cert-accordion">
          {certificationCategories.map((category, index) => {
            const active = open === category;
            const items = certifications.filter((item) => item.category === category);
            return (
              <motion.div
                className={`cert-row ${active ? "open" : ""}`}
                key={category}
                initial={reducedMotion ? false : { opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={reducedMotion ? { duration: 0 } : { duration: 0.7, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
              >
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
                  {showPreviews && active && items[0]?.image && (
                    <motion.img
                      className="cert-preview"
                      src={items[0].image}
                      alt=""
                      aria-hidden="true"
                      loading="lazy"
                      decoding="async"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    />
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
        <Reveal className="center-action" delay={0.4}><Link className="button" to="/certifications" prefetch="intent">View All {certifications.length} <ArrowIcon /></Link></Reveal>
      </div>
    </section>
  );
}

const experiencePreviews = experience.flatMap((item) => item.image ? [experiencePreviewImage(item.image)] : []);

function ExperienceSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const pointerPosition = useRef<{ x: number; y: number } | null>(null);
  const reducedMotion = useReducedMotion();
  const { sectionRef, enabled: showPreviews } = usePreviewImages(experiencePreviews, "(min-width: 901px) and (hover: hover)");

  const syncPreview = useCallback(() => {
    const pointer = pointerPosition.current;
    if (!pointer || !showPreviews || reducedMotion) { setHoveredIndex(null); return; }

    const row = document.elementFromPoint(pointer.x, pointer.y)?.closest<HTMLElement>(".experience-row");
    if (!row || !sectionRef.current?.contains(row)) { setHoveredIndex(null); return; }

    const index = Number(row.dataset.experienceIndex);
    setHoveredIndex(experience[index]?.image ? index : null);

    // Keep the original cursor anchor, scaled with the preview from 200px to 300px.
    pointerX.set(pointer.x - 150);
    pointerY.set(pointer.y - 150);
  }, [pointerX, pointerY, reducedMotion, sectionRef, showPreviews]);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(syncPreview);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [syncPreview]);

  const trackPointer = (event: ReactPointerEvent<HTMLElement>) => {
    if (event.pointerType === "touch") return;
    pointerPosition.current = { x: event.clientX, y: event.clientY };
    syncPreview();
  };

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="section experience-section"
      onPointerMove={trackPointer}
      onPointerLeave={() => { pointerPosition.current = null; setHoveredIndex(null); }}
      onPointerCancel={() => { pointerPosition.current = null; setHoveredIndex(null); }}
    >
      <p className="ghost-word" aria-hidden="true">EXPERIENCE</p>
      <Reveal className="section-inner">
        <div className="experience-top">
          <h2 className="section-heading">/EXPERIENCE</h2>
          <p className="experience-tagline">Building &amp; leading since 2023</p>
        </div>
        <div className="experience-list">
          {experience.map((item, index) => (
            <motion.div
              className="experience-row"
              data-experience-index={index}
              key={`${item.organization}-${item.role}`}
              initial={reducedMotion ? false : { opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={reducedMotion ? { duration: 0 } : { duration: 0.7, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <div><h3>{item.organization}</h3><p>{item.role}</p></div>
              <time>{item.dates}</time>
            </motion.div>
          ))}
        </div>
      </Reveal>
      <AnimatePresence initial={false}>
        {showPreviews && !reducedMotion && hoveredIndex !== null && experience[hoveredIndex]?.image && (
          <motion.div
            key={hoveredIndex}
            className="experience-hover"
            style={{ left: pointerX, top: pointerY }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <img {...experiencePreviewImage(experience[hoveredIndex].image)} sizes="300px" alt="" decoding="async" />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

export default function Home() {
  const { projects, certifications } = useLoaderData<typeof loader>();
  const [heroReady, setHeroReady] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const revealHero = () => setHeroReady(true);
    document.addEventListener("portfolio:ready", revealHero);
    if (!document.querySelector(".portfolio-loader")) revealHero();
    return () => document.removeEventListener("portfolio:ready", revealHero);
  }, []);

  const heroEntrance = (delay: number) => reducedMotion
    ? { initial: false as const, animate: { opacity: 1, y: 0 }, transition: { duration: 0 } }
    : { initial: { opacity: 0, y: 16 }, animate: heroReady ? { opacity: 1, y: 0 } : undefined,
        transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } };

  useEffect(() => {
    const scrollKey = "portfolio-home-scroll";
    const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    const shouldRestorePosition = navigation?.type === "reload";
    let frame = 0;

    document.documentElement.classList.add("home-scrollbar");

    if (shouldRestorePosition) {
      const savedPosition = Number.parseFloat(sessionStorage.getItem(scrollKey) ?? "");
      if (Number.isFinite(savedPosition)) {
        requestAnimationFrame(() => requestAnimationFrame(() => window.scrollTo({ top: savedPosition })));
      }
    }

    const savePosition = () => sessionStorage.setItem(scrollKey, String(window.scrollY));
    const rememberPosition = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(savePosition);
    };
    const saveBeforeLeaving = () => {
      cancelAnimationFrame(frame);
      savePosition();
    };

    window.addEventListener("scroll", rememberPosition, { passive: true });
    window.addEventListener("pagehide", saveBeforeLeaving);

    return () => {
      cancelAnimationFrame(frame);
      savePosition();
      window.removeEventListener("scroll", rememberPosition);
      window.removeEventListener("pagehide", saveBeforeLeaving);
      document.documentElement.classList.remove("home-scrollbar");
    };
  }, []);

  return (
    <main>
      <section className="hero" id="home">
        <Header />
        <motion.h1 className="hero-name" aria-label="Rey Jane Andrada" {...heroEntrance(0)}>
          <span className="name-outline">REY JANE</span><span className="name-solid">ANDRADA</span>
        </motion.h1>
        <motion.img
          className="hero-photo"
          initial={reducedMotion ? false : { opacity: 0 }}
          animate={heroReady ? { opacity: 1 } : undefined}
          transition={reducedMotion ? { duration: 0 } : { duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          src="/assets/photos/hero-768.webp"
          srcSet="/assets/photos/hero-480.webp 480w, /assets/photos/hero-768.webp 768w, /assets/photos/hero-1024.webp 1024w"
          sizes="(max-width: 600px) 100vw, (max-width: 900px) 600px, (max-width: 1100px) and (orientation: portrait) 600px, (max-width: 1323px) 62vw, 820px"
          width={1024}
          height={1168}
          fetchPriority="high"
          alt="Rey Jane Andrada holding a laptop"
          draggable={false}
        />
        <motion.div className="hero-copy" {...heroEntrance(0.14)}>
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
        <motion.div className="hero-socials" {...heroEntrance(0.24)}>
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
