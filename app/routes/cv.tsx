import type { MetaFunction } from "react-router";
import { Download, ExternalLink, FileText } from "lucide-react";
import { Footer, Header, Reveal } from "~/components/ui";
import { canonicalMeta } from "~/lib/seo";

const cvPdf = "/assets/cv/Rey-Jane-Andrada-CV-2026-11-v4.pdf";
// One preview image per PDF page. Use new file names for each update so cached copies never show old pages.
const cvPages = [
  "/assets/cv/rey-jane-andrada-cv-2026-11-v4-page-1.webp",
  "/assets/cv/rey-jane-andrada-cv-2026-11-v4-page-2.webp",
];

export function headers() {
  return { "Cache-Control": "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400" };
}

export const meta: MetaFunction = () => [
  { title: "Curriculum Vitae — Rey Jane Andrada" },
  { name: "description", content: "View or download Rey Jane Andrada's curriculum vitae." },
  canonicalMeta("/cv"),
];

export default function CvPage() {
  return (
    <main className="detail-page cv-page">
      <Header inner backTo="/#about" />
      <Reveal className="detail-main cv-main" amount={0.02}>
        <section className="cv-hero">
          <div className="detail-tags tag-list"><span>Curriculum Vitae</span><span>PDF · {cvPages.length} pages</span></div>
          <div className="cv-title">
            <p className="kicker">/CV</p>
            <h1>Experience, projects, and technical foundations.</h1>
            <p className="lead">A concise overview of my backend-focused development work, leadership experience, and growing data-engineering foundation.</p>
            <div className="detail-actions">
              <a className="button button-dark" href={cvPdf} download="Rey-Jane-Andrada-CV.pdf"><Download size={18} /> Download PDF</a>
              <a className="button" href={cvPdf} target="_blank" rel="noreferrer">Open PDF <ExternalLink size={18} /></a>
            </div>
          </div>
          <aside className="detail-meta cv-meta">
            <div className="meta-item"><span>Format</span><strong>PDF</strong></div>
            <div className="meta-item"><span>Length</span><strong>{cvPages.length} pages</strong></div>
            <div className="meta-item"><span>Updated</span><strong>November 2026</strong></div>
          </aside>
        </section>

        <section className="cv-document" aria-labelledby="cv-preview-title">
          <div className="cv-document-heading">
            <div>
              <p className="kicker">/DOCUMENT PREVIEW</p>
              <h2 id="cv-preview-title">Rey Jane Andrada</h2>
            </div>
            <FileText aria-hidden="true" size={30} strokeWidth={1.5} />
          </div>
          <div className="cv-pages">
            {cvPages.map((page, index) => (
              <div className="cv-page-sheet" key={page}>
                <img
                  src={page}
                  width={1530}
                  height={1980}
                  alt={`Page ${index + 1} of ${cvPages.length} of Rey Jane Andrada's curriculum vitae`}
                  loading={index === 0 ? "eager" : "lazy"}
                  decoding="async"
                  draggable={false}
                />
              </div>
            ))}
          </div>
        </section>
      </Reveal>
      <Footer />
    </main>
  );
}
