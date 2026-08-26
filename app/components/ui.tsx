import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Code2, Link2, Mail, Menu, X } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import type { Certification, Project } from "~/data/site";
import { socialLinks } from "~/data/site";
import contactAvatar from "../../MyPhotos/DSC_5066.JPG";

export function ArrowIcon() {
  return <ArrowUpRight aria-hidden="true" size={18} strokeWidth={1.7} />;
}

export function Reveal({ children, className, delay = 0, amount = 0.12, distance = 18 }: { children: ReactNode; className?: string; delay?: number; amount?: number; distance?: number }) {
  const reduceMotion = useReducedMotion();
  const hidden = distance ? { opacity: 0, y: distance } : { opacity: 0 };
  const visible = distance ? { opacity: 1, y: 0 } : { opacity: 1 };
  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : hidden}
      whileInView={reduceMotion ? undefined : visible}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.78, delay, ease: [0.22, 1, 0.36, 1] }}
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
  { label: "Projects", count: "[03]", href: "/#projects" },
  { label: "Certifications", count: "[25]", href: "/#certifications" },
  { label: "Experience", count: "[05]", href: "/#experience" },
  { label: "Contact", count: null, href: "/#contact" },
] as const;

export function Header({ inner = false }: { inner?: boolean }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => setOpen(false), [location.pathname, location.hash]);
  useEffect(() => {
    if (inner) return;
    const onScroll = () => setScrolled(window.scrollY > 90);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [inner]);

  return (
    <>
      <header className={`${inner ? "site-header inner-header" : "site-header"} ${scrolled ? "scrolled" : ""}`}>
        <div className="header-inner">
          {inner ? <Link className="back-pill" to="/">← Back</Link> : <Availability compact />}
          <nav className="desktop-nav" aria-label="Primary navigation">
            {navLinks.map(({ label, count, href }) => <a key={label} href={href}>{label}{count && <small>{count}</small>}</a>)}
          </nav>
          {!inner && <a className="button header-cta" href={socialLinks.email}>Let’s talk</a>}
          {inner && <Availability compact />}
          {!inner && (
            <button className="menu-trigger" onClick={() => setOpen(true)} aria-label="Open menu">
              <Menu />
            </button>
          )}
        </div>
      </header>
      <AnimatePresence>
        {open && (
          <motion.div className="mobile-menu" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <button onClick={() => setOpen(false)} aria-label="Close menu"><X /></button>
            <nav aria-label="Mobile navigation">
              {navLinks.map(({ label, href }, index) => <a key={label} href={href}><span>0{index + 1}</span>{label}</a>)}
            </nav>
            <a className="button button-light" href={socialLinks.email}>Let’s Talk <ArrowIcon /></a>
          </motion.div>
        )}
      </AnimatePresence>
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

export function ProjectCard({ project, priority = false }: { project: Project; priority?: boolean }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.article
      className="project-card"
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      whileHover={reduceMotion ? undefined : { y: -6 }}
      transition={{ duration: 0.68, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link to={`/projects/${project.slug}`} aria-label={`View ${project.title}`}>
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

export function CertificationCard({ certification }: { certification: Certification }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.article
      className="cert-card"
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      whileHover={reduceMotion ? undefined : { y: -5 }}
      transition={{ duration: 0.68, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link to={`/certifications/${certification.slug}`} aria-label={`View ${certification.title}`}>
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
        <span className="identity-pill"><img src={contactAvatar} alt="" /> Rey Jane Andrada</span>
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
