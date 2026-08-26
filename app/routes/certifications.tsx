import type { MetaFunction } from "react-router";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useLoaderData, useSearchParams } from "react-router";
import { CertificationCard, Header, PageFooter, Reveal } from "~/components/ui";
import { certificationCategories, type CertificationCategory } from "~/data/site";
import { getCertifications } from "~/lib/content.server";

export async function loader() { return getCertifications(); }

export const meta: MetaFunction = () => [
  { title: "Certifications — Rey Jane Andrada" },
  { name: "description", content: "Data, AI, cloud, development, and hackathon credentials earned by Rey Jane Andrada." },
];

export default function CertificationsArchive() {
  const certifications = useLoaderData<typeof loader>();
  const [params, setParams] = useSearchParams();
  const initial = params.get("category");
  const [category, setCategory] = useState<"All" | CertificationCategory>(
    certificationCategories.includes(initial as CertificationCategory) ? initial as CertificationCategory : "All",
  );
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return certifications.filter((item) => {
      const matchesCategory = category === "All" || item.category === category;
      const matchesQuery = !needle || [item.title, item.issuer, item.category].join(" ").toLowerCase().includes(needle);
      return matchesCategory && matchesQuery;
    });
  }, [category, query]);

  const chooseCategory = (next: "All" | CertificationCategory) => {
    setCategory(next);
    if (next === "All") setParams({}); else setParams({ category: next });
  };

  return (
    <main className="archive-page">
      <Header inner />
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
          {filtered.length ? filtered.map((item) => <CertificationCard key={item.slug} certification={item} />) : <p className="empty-state">No certifications match that search.</p>}
        </div>
      </Reveal>
      <PageFooter />
    </main>
  );
}
