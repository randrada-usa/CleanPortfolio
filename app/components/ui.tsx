import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Code2, Link2, Mail, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import type { Certification, Project } from "~/data/site";
import { socialLinks } from "~/data/site";

export function ArrowIcon() {
  return <ArrowUpRight aria-hidden="true" size={18} strokeWidth={1.7} />;
}

export function Availability({ compact = false }: { compact?: boolean }) {
  return (
    <span className={compact ? "availability compact" : "availability"}>
      <i aria-hidden="true" /> Open to Opportunities
    </span>
  );
}

const navLinks = [
  ["Projects [03]", "/#projects"],
  ["Certifications [25]", "/#certifications"],
  ["Experience", "/#experience"],
  ["Contact", "/#contact"],
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
    <header className={`${inner ? "site-header inner-header" : "site-header"} ${scrolled ? "scrolled" : ""}`}>
      <div className="header-inner">
        {inner ? <Link className="back-pill" to="/">← Back</Link> : <Availability compact />}
        <nav className="desktop-nav" aria-label="Primary navigation">
          {navLinks.map(([label, href]) => <a key={label} href={href}>{label}</a>)}
        </nav>
        {!inner && <a className="button button-dark header-cta" href={socialLinks.email}>Let’s Talk <ArrowIcon /></a>}
        {inner && <Availability compact />}
        {!inner && (
          <button className="menu-trigger" onClick={() => setOpen(true)} aria-label="Open menu">
            <Menu />
          </button>
        )}
      </div>
      <AnimatePresence>
        {open && (
          <motion.div className="mobile-menu" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <button onClick={() => setOpen(false)} aria-label="Close menu"><X /></button>
            <nav aria-label="Mobile navigation">
              {navLinks.map(([label, href], index) => <a key={label} href={href}><span>0{index + 1}</span>{label}</a>)}
            </nav>
            <a className="button button-light" href={socialLinks.email}>Let’s Talk <ArrowIcon /></a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
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
  return (
    <motion.article className="project-card" whileHover={{ y: -6 }} transition={{ duration: 0.25 }}>
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
  return (
    <motion.article className="cert-card" whileHover={{ y: -5 }} transition={{ duration: 0.22 }}>
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
      <Availability />
      <h2>HAVE A PROJECT IN MIND?</h2>
      <p>Let’s turn ideas into reliable systems that deliver real impact.</p>
      <a className="button button-dark" href={socialLinks.email}>Contact Me <ArrowIcon /></a>
      <div className="footer-links">
        <span className="identity-pill"><img src="/assets/photos/063d74f9-f3e3-4fdc-b05a-a969275ddb9a.png" alt="" /> Rey Jane Andrada</span>
        <SocialPill type="github" label="GitHub" />
        <SocialPill type="linkedin" label="LinkedIn" />
        <SocialPill type="email" label="Email" />
      </div>
    </footer>
  );
}

export function PageFooter() {
  return <div className="page-bottom"><Availability compact /></div>;
}
