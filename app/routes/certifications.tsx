import type { MetaFunction, ShouldRevalidateFunctionArgs } from "react-router";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Filter, Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLoaderData, useLocation, useSearchParams } from "react-router";
import { CertificationCard, Footer, Header, Reveal } from "~/components/ui";
import { certificationCategories, type CertificationCategory } from "~/data/site";
import { getCertifications } from "~/lib/content.server";
import { canonicalMeta } from "~/lib/seo";

function certificationPriority(title: string, issuer: string, category: "All" | CertificationCategory) {
  if (category === "Cloud & Development") {
    if (title === "Foundations of Prompt Engineering") return 0;
    if (title === "Python Developer Associate") return 1;
  }
  if (title === "Data Analyst Associate") return 0;
  if (title === "SQL Associate") return 1;
  if (title === "GitHub Foundations Certification") return 2;
  if (title === "AI Fundamentals") return 3;
  if (title === "Python Developer Associate") return 4;
  if (issuer === "Anthropic" || title.startsWith("Claude")) return 5;
  if (issuer.includes("AWS") || title.startsWith("AWS ")) return 6;
  if (issuer.includes("Cisco")) return 7;
  return 8;
}

export async function loader() { return getCertifications(); }

export function shouldRevalidate({ currentUrl, nextUrl, defaultShouldRevalidate }: ShouldRevalidateFunctionArgs) {
  if (currentUrl.pathname !== nextUrl.pathname) return defaultShouldRevalidate;

  const currentParams = new URLSearchParams(currentUrl.search);
  const nextParams = new URLSearchParams(nextUrl.search);
  currentParams.delete("category");
  nextParams.delete("category");
  return currentParams.toString() === nextParams.toString() ? false : defaultShouldRevalidate;
}

export function headers() {
  return { "Cache-Control": "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400" };
}

export const meta: MetaFunction = () => [
  { title: "Certifications — Rey Jane Andrada" },
  { name: "description", content: "Data, AI, cloud, development, and hackathon credentials earned by Rey Jane Andrada." },
  canonicalMeta("/certifications"),
];

export default function CertificationsArchive() {
  const certifications = useLoaderData<typeof loader>();
  const location = useLocation();
  const prefersReducedMotion = useReducedMotion();
  const [params, setParams] = useSearchParams();
  const initial = params.get("category");
  const [category, setCategory] = useState<"All" | CertificationCategory>(
    certificationCategories.includes(initial as CertificationCategory) ? initial as CertificationCategory : "All",
  );
  const [query, setQuery] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const filterToggleRef = useRef<HTMLButtonElement>(null);
  const filterOptionsRef = useRef<HTMLDivElement>(null);
  const animateFilterResults = !prefersReducedMotion && !isMobileViewport;

  useEffect(() => {
    const media = window.matchMedia("(max-width: 900px)");
    const updateViewport = () => setIsMobileViewport(media.matches);
    updateViewport();
    media.addEventListener("change", updateViewport);
    return () => media.removeEventListener("change", updateViewport);
  }, []);

  useEffect(() => {
    if (!filtersOpen) return;

    const closeOnOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node;
      if (filterToggleRef.current?.contains(target) || filterOptionsRef.current?.contains(target)) return;

      event.preventDefault();
      event.stopPropagation();
      setFiltersOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setFiltersOpen(false);
      filterToggleRef.current?.focus();
    };

    document.addEventListener("click", closeOnOutsideClick, true);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("click", closeOnOutsideClick, true);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [filtersOpen]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return certifications
      .map((item, index) => ({ item, index }))
      .filter(({ item }) => {
        const matchesCategory = category === "All" || item.category === category;
        const matchesQuery = !needle || [item.title, item.issuer, item.category].join(" ").toLowerCase().includes(needle);
        return matchesCategory && matchesQuery;
      })
      .sort((a, b) => certificationPriority(a.item.title, a.item.issuer, category) - certificationPriority(b.item.title, b.item.issuer, category) || a.index - b.index)
      .map(({ item }) => item);
  }, [certifications, category, query]);

  const chooseCategory = (next: "All" | CertificationCategory) => {
    setCategory(next);
    setFiltersOpen(false);
    if (next === "All") setParams({}, { replace: true, preventScrollReset: true });
    else setParams({ category: next }, { replace: true, preventScrollReset: true });
  };

  return (
    <main className={`archive-page${filtersOpen ? " cert-filters-open" : ""}`}>
      <Header inner backTo="/#certifications" />
      <Reveal className="archive-main" amount={0.02}>
        <h1 className="archive-title">/CERTIFICATIONS</h1>
        <p className="archive-count">{certifications.length} certifications</p>
        <div className="search-row">
          <label className="sr-only" htmlFor="cert-search">Search certifications</label>
          <div className="search-field">
            <Search aria-hidden="true" size={18} />
            <input id="cert-search" className="search-input" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by title or issuer…" />
          </div>
          <button ref={filterToggleRef} className={`cert-filter-toggle${filtersOpen ? " is-open" : ""}${category !== "All" ? " has-filter" : ""}`} type="button" aria-label={filtersOpen ? "Close certification filters" : "Open certification filters"} aria-expanded={filtersOpen} aria-controls="certification-filters" onClick={() => setFiltersOpen((open) => !open)}>
            {filtersOpen ? <X size={20} aria-hidden="true" /> : <Filter size={20} aria-hidden="true" />}
            {category !== "All" && <span className="sr-only">Current category: {category}</span>}
          </button>
          <div ref={filterOptionsRef} id="certification-filters" className={`cert-filter-options${filtersOpen ? " is-open" : ""}`} role="group" aria-label="Certification categories">
          <button className={`filter-button ${category === "All" ? "active" : ""}`} aria-pressed={category === "All"} onClick={() => chooseCategory("All")}>All</button>
          {certificationCategories.map((item) => (
            <button className={`filter-button ${category === item ? "active" : ""}`} aria-pressed={category === item} key={item} onClick={() => chooseCategory(item)}>{item}</button>
          ))}
          </div>
        </div>
        <div className="archive-grid">
          <AnimatePresence mode={animateFilterResults ? "popLayout" : "sync"} initial={animateFilterResults}>
            {filtered.length ? filtered.map((item, index) => (
              <motion.div
                className="filter-card-shell mobile-static-motion"
                key={item.slug}
                layout={animateFilterResults}
                initial={animateFilterResults ? { opacity: 0, y: 14, scale: .985 } : false}
                animate={animateFilterResults ? { opacity: 1, y: 0, scale: 1 } : undefined}
                exit={animateFilterResults ? { opacity: 0, y: -8, scale: .985 } : undefined}
                transition={animateFilterResults ? { duration: .3, ease: [.22, 1, .36, 1], layout: { duration: .36, ease: [.22, 1, .36, 1] } } : { duration: 0 }}
              >
                <CertificationCard certification={item} backTo={`${location.pathname}${location.search}`} revealDelay={(index % 6) * 0.08} />
              </motion.div>
            )) : (
              <motion.p
                className="empty-state mobile-static-motion"
                key="empty-certifications"
                initial={animateFilterResults ? { opacity: 0, y: 8 } : false}
                animate={animateFilterResults ? { opacity: 1, y: 0 } : undefined}
                exit={animateFilterResults ? { opacity: 0 } : undefined}
              >
                No certifications match that search.
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </Reveal>
      <Footer />
    </main>
  );
}
