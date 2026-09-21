import type { MetaFunction } from "react-router";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
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
    if (next === "All") setParams({}); else setParams({ category: next });
  };

  return (
    <main className="archive-page">
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
          <button className={`filter-button ${category === "All" ? "active" : ""}`} onClick={() => chooseCategory("All")}>All</button>
          {certificationCategories.map((item) => (
            <button className={`filter-button ${category === item ? "active" : ""}`} key={item} onClick={() => chooseCategory(item)}>{item}</button>
          ))}
        </div>
        <div className="archive-grid">
          <AnimatePresence mode="popLayout">
            {filtered.length ? filtered.map((item, index) => (
              <motion.div
                className="filter-card-shell"
                key={item.slug}
                layout={!prefersReducedMotion}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 14, scale: .985 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: -8, scale: .985 }}
                transition={prefersReducedMotion ? { duration: 0 } : { duration: .3, ease: [.22, 1, .36, 1], layout: { duration: .36, ease: [.22, 1, .36, 1] } }}
              >
                <CertificationCard certification={item} backTo={`${location.pathname}${location.search}`} revealDelay={(index % 6) * 0.08} />
              </motion.div>
            )) : (
              <motion.p
                className="empty-state"
                key="empty-certifications"
                initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
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
