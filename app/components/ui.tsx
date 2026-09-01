import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Code2, Link2, Mail, Menu, X } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation } from "react-router";
import type { Certification, Project } from "~/data/site";
import { socialLinks, talkLink } from "~/data/site";

export function ArrowIcon() {
  return <ArrowUpRight aria-hidden="true" size={18} strokeWidth={1.7} />;
}

export function Reveal({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  amount?: number | "some" | "all";
  distance?: number;
}) {
  return <div className={className}>{children}</div>;
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
              <a className={activeSection === id ? "is-active" : undefined} aria-current={activeSection === id ? "location" : undefined} key={id} href={href}>
                {label}
              </a>
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
                    <a
                      className={activeSection === id ? "is-active" : undefined}
                      aria-current={activeSection === id ? "location" : undefined}
                      key={id}
                      href={href}
                      onClick={() => setOpen(false)}
                    >
                      {label}
                    </a>
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
  const Icon = type === "github" ? Code2 : type === "linkedin" ? Link2 : Mail;
  return (
    <a className={`social-pill social-${type}`} href={socialLinks[type]} target={type === "email" ? undefined : "_blank"} rel="noreferrer">
      <Icon size={16} aria-hidden="true" /> {label}
    </a>
  );
}

export function ProjectCard({
  project,
  priority = false,
  backTo = "/#projects",
}: {
  project: Project;
  priority?: boolean;
  backTo?: string;
}) {
  return (
    <motion.article
      className="project-card"
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25 }}
    >
      <Link to={`/projects/${project.slug}`} state={{ backTo }} prefetch="intent" aria-label={`View ${project.title}`}>
        <div className="card-media">
          <img src={project.image} alt={`${project.title} interface`} loading={priority ? "eager" : "lazy"} />
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
}: {
  certification: Certification;
  backTo?: string;
}) {
  return (
    <motion.article
      className="cert-card"
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
  return (
    <footer id="contact" className="contact-section">
      <Reveal className="contact-main" distance={0}>
        <Availability />
        <h2>HAVE A PROJECT IN MIND?</h2>
        <p>Let’s turn ideas into reliable systems that deliver real impact.</p>
        <a className="button button-dark" href={socialLinks.email}>Contact Me <ArrowIcon /></a>
      </Reveal>
      <Reveal className="footer-links" delay={0.08}>
        <span className="identity-pill"><img src="/assets/photos/contact-avatar.webp" alt="" /> Rey Jane Andrada</span>
        <SocialPill type="github" label="GitHub" />
        <SocialPill type="linkedin" label="LinkedIn" />
        <SocialPill type="email" label="Email" />
      </Reveal>
    </footer>
  );
}

export function PageFooter() {
  return <Reveal className="page-bottom"><Availability compact /></Reveal>;
}
