import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUp, ArrowUpRight, Code2, Mail, Menu, X } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation } from "react-router";
import type { Certification, Project } from "~/data/site";
import { socialLinks, talkLink } from "~/data/site";
import { projectCardImage, projectDetailImage } from "~/lib/images";
import { preloadImage } from "~/lib/image-preload";

export function ArrowIcon() {
  return <ArrowUpRight aria-hidden="true" size={18} strokeWidth={1.7} />;
}

export function Reveal({
  children,
  className,
  delay = 0,
  amount = 0.1,
  distance = 28,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  amount?: number | "some" | "all";
  distance?: number;
}) {
  const reducedMotion = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reducedMotion ? false : { opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={reducedMotion ? { duration: 0 } : { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function Availability({ compact = false }: { compact?: boolean }) {
  return (
    <span className={compact ? "availability compact" : "availability"}>
      <i aria-hidden="true" /> Open to Opportunities
    </span>
  );
}

const navLinks = [
  { id: "projects", label: "Projects", href: "/#projects" },
  { id: "certifications", label: "Certifications", href: "/#certifications" },
  { id: "experience", label: "Experience", href: "/#experience" },
  { id: "contact", label: "Contact", href: "/#contact" },
] as const;

type NavSection = typeof navLinks[number]["id"];

function sectionFromPath(pathname: string): NavSection | null {
  if (pathname.startsWith("/projects")) return "projects";
  if (pathname.startsWith("/certifications")) return "certifications";
  return null;
}

export function Header({ inner = false, backTo = "/" }: { inner?: boolean; backTo?: string }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const location = useLocation();
  const [activeSection, setActiveSection] = useState<NavSection | null>(() => sectionFromPath(location.pathname));

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    if (inner) return;
    const onScroll = () => setScrolled(window.scrollY > 70);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [inner]);

  useEffect(() => {
    const routeSection = sectionFromPath(location.pathname);
    if (location.pathname !== "/") {
      setActiveSection(routeSection);
      return;
    }

    let frame = 0;
    const updateActiveSection = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const marker = window.innerHeight * .42;
        const visible = navLinks.find(({ id }) => {
          const section = document.getElementById(id);
          if (!section) return false;
          const bounds = section.getBoundingClientRect();
          return bounds.top <= marker && bounds.bottom > marker;
        });
        setActiveSection(visible?.id ?? null);
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
  }, [location.pathname]);

  return (
    <>
      <header className={`${inner ? "site-header inner-header" : "site-header"} ${scrolled ? "scrolled" : ""}`}>
        <div className="header-inner">
          {inner ? <Link className="back-pill" to={backTo} prefetch="intent">← Back</Link> : <Availability compact />}
          <nav className="desktop-nav" aria-label="Primary navigation">
            {navLinks.map(({ id, label, href }) => (
              <Link className={activeSection === id ? "is-active" : undefined} aria-current={activeSection === id ? "location" : undefined} key={id} to={href}>
                {label}
              </Link>
            ))}
          </nav>
          {!inner && (
            <a className="button header-cta" href={talkLink} target="_blank" rel="noreferrer">
              Let’s talk
            </a>
          )}
          {inner && <Availability compact />}
          {!inner && (
            <button className="menu-trigger" type="button" onClick={() => setOpen(true)} aria-label="Open menu">
              <Menu size={20} />
            </button>
          )}
        </div>
      </header>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                className="mobile-menu"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
              >
                <button type="button" onClick={() => setOpen(false)} aria-label="Close menu"><X /></button>
                <nav className="mobile-navigation" aria-label="Mobile navigation">
                  {navLinks.map(({ id, label, href }) => (
                    <Link
                      className={activeSection === id ? "is-active" : undefined}
                      aria-current={activeSection === id ? "location" : undefined}
                      key={id}
                      to={href}
                      onClick={() => setOpen(false)}
                    >
                      {label}
                    </Link>
                  ))}
                </nav>
                <a
                  className="button button-light"
                  href={talkLink}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setOpen(false)}
                >
                  Let’s Talk <ArrowIcon />
                </a>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}

export function SocialPill({ type, label }: { type: keyof typeof socialLinks; label: string }) {
  const Icon = type === "github" ? Code2 : Mail;
  return (
    <a className={`social-pill social-${type}`} href={socialLinks[type]} target={type === "email" ? undefined : "_blank"} rel="noreferrer">
      {type === "linkedin" ? (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
          <rect x="1" y="1" width="16" height="16" rx="1" stroke="currentColor" strokeWidth="1.35" />
          <circle cx="5.3" cy="5.5" r="1" fill="currentColor" />
          <path d="M5.3 8.4v5.2M8.6 13.6V8.4m0 2.4c0-1.5.8-2.5 2.2-2.5 1.5 0 2.2 1 2.2 2.5v2.8" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : <Icon size={16} aria-hidden="true" />} {label}
    </a>
  );
}

export function ProjectCard({
  project,
  priority = false,
  backTo = "/#projects",
  revealDelay,
}: {
  project: Project;
  priority?: boolean;
  backTo?: string;
  revealDelay?: number;
}) {
  const reducedMotion = useReducedMotion();
  return (
    <motion.article
      className="project-card"
      initial={revealDelay === undefined || reducedMotion ? false : { opacity: 0, y: 28 }}
      whileInView={revealDelay === undefined ? undefined : { opacity: 1, y: 0, transition: reducedMotion ? { duration: 0 } : { duration: 0.7, delay: revealDelay, ease: [0.22, 1, 0.36, 1] } }}
      viewport={{ once: true, amount: 0.15 }}
      whileHover={{ y: -6, transition: { duration: 0.25 } }}
    >
      <Link
        to={`/projects/${project.slug}`} state={{ backTo }} prefetch="intent" aria-label={`View ${project.title}`}
        onPointerEnter={(event) => { if (event.pointerType !== "touch") preloadImage(projectDetailImage(project.image)); }}
        onFocus={() => preloadImage(projectDetailImage(project.image))}
        onPointerDown={() => preloadImage(projectDetailImage(project.image))}
      >
        <div className="card-media">
          <img {...projectCardImage(project.image)} alt={`${project.title} interface`} loading={priority ? "eager" : "lazy"} decoding="async" />
          <span className="card-label">{project.eyebrow}</span>
          <span className="card-arrow"><ArrowIcon /></span>
        </div>
        <div className="card-body">
          <h3>{project.title}</h3>
          <p>{project.summary}</p>
          <div className="tag-list">{project.tags.slice(0, 4).map((tag) => <span key={tag}>{tag}</span>)}</div>
        </div>
      </Link>
    </motion.article>
  );
}

export function CertificationCard({
  certification,
  backTo = "/#certifications",
  revealDelay,
}: {
  certification: Certification;
  backTo?: string;
  revealDelay?: number;
}) {
  const reducedMotion = useReducedMotion();
  return (
    <motion.article
      className="cert-card"
      initial={revealDelay === undefined || reducedMotion ? false : { opacity: 0, y: 28 }}
      whileInView={revealDelay === undefined ? undefined : { opacity: 1, y: 0, transition: reducedMotion ? { duration: 0 } : { duration: 0.7, delay: revealDelay, ease: [0.22, 1, 0.36, 1] } }}
      viewport={{ once: true, amount: 0.15 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.22 }}
    >
      <Link to={`/certifications/${certification.slug}`} state={{ backTo }} prefetch="intent" aria-label={`View ${certification.title}`}>
        <div className="cert-media"><img src={certification.image} alt={`${certification.title} certificate`} loading="lazy" /></div>
        <h3>{certification.title}</h3>
        <div className="tag-list"><span>{certification.category}</span><span>{certification.issuer}</span></div>
      </Link>
    </motion.article>
  );
}

export function Footer() {
  const scrollToTop = () => {
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer id="contact" className="contact-section">
      <Reveal className="contact-main" distance={0}>
        <h2>HAVE A PROJECT IN MIND?</h2>
        <p>Let’s turn ideas into reliable systems that deliver real impact.</p>
        <a className="button button-dark" href={socialLinks.email}>Contact Me <ArrowIcon /></a>
      </Reveal>
      <Reveal className="footer-links" delay={0.08}>
        <Link className="identity-pill" to="/#home" prefetch="intent"><img src="/assets/photos/contact-avatar.webp" alt="" /> Rey Jane Andrada</Link>
        <SocialPill type="github" label="GitHub" />
        <SocialPill type="linkedin" label="LinkedIn" />
        <SocialPill type="email" label="Email" />
        <button className="back-to-top" type="button" onClick={scrollToTop} aria-label="Back to top"><ArrowUp size={20} /></button>
      </Reveal>
    </footer>
  );
}

export function PageFooter() {
  return <Reveal className="page-bottom"><Availability compact /></Reveal>;
}
