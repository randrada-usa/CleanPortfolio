import type { MetaFunction } from "react-router";
import { Download, ExternalLink, FileText } from "lucide-react";
import { Header, PageFooter, Reveal } from "~/components/ui";

const cvPdf = "/assets/cv/Rey-Jane-Andrada-CV-2026-08.pdf";
const cvPreview = "/assets/cv/rey-jane-andrada-cv-preview-2026-08-v2.webp";

export function headers() {
  return { "Cache-Control": "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400" };
}

export const meta: MetaFunction = () => [
  { title: "Curriculum Vitae — Rey Jane Andrada" },
  { name: "description", content: "View or download Rey Jane Andrada's curriculum vitae." },
];

export default function CvPage() {
  return (
    <main className="detail-page cv-page">
      <Header inner backTo="/#about" />
      <Reveal className="detail-main cv-main" amount={0.02}>
        <section className="cv-hero">
          <div className="detail-tags tag-list"><span>Curriculum Vitae</span><span>PDF · 1 page</span></div>
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
            <div className="meta-item"><span>Length</span><strong>One page</strong></div>
            <div className="meta-item"><span>Updated</span><strong>August 2026</strong></div>
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
          <a className="cv-pdf-preview" href={cvPdf} target="_blank" rel="noreferrer" aria-label="Open Rey Jane Andrada's CV as a PDF">
            <img src={cvPreview} alt="Preview of Rey Jane Andrada's current one-page curriculum vitae" />
          </a>
          <a className="cv-mobile-preview" href={cvPdf} target="_blank" rel="noreferrer" aria-label="Open Rey Jane Andrada's CV as a PDF">
            <img src={cvPreview} alt="Preview of Rey Jane Andrada's one-page curriculum vitae" />
            <span>Tap to open the full PDF <ExternalLink size={17} /></span>
          </a>
        </section>
      </Reveal>
      <PageFooter />
    </main>
  );
}
