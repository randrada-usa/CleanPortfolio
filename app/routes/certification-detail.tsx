import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { useLoaderData } from "react-router";
import { CertificationCard, Header, PageFooter, Reveal } from "~/components/ui";
import { getCertifications } from "~/lib/content.server";

export async function loader({ params }: LoaderFunctionArgs) {
  const certifications = await getCertifications();
  const certification = certifications.find((item) => item.slug === params.slug);
  if (!certification) throw new Response("Not Found", { status: 404 });
  return {
    certification,
    related: certifications.filter((item) => item.category === certification.category && item.slug !== certification.slug).slice(0, 2),
  };
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const certification = data?.certification;
  return [
    { title: certification ? `${certification.title} — Rey Jane Andrada` : "Certification Not Found" },
    { name: "description", content: certification?.description ?? "Certification earned by Rey Jane Andrada." },
  ];
};

export default function CertificationDetail() {
  const { certification, related } = useLoaderData<typeof loader>();

  return (
    <main className="detail-page">
      <Header inner />
      <Reveal className="detail-main" amount={0.02}>
        <section className="detail-hero">
          <div className="detail-tags tag-list"><span>{certification.category}</span><span>{certification.issuer}</span></div>
          <div className="detail-title"><h1>{certification.title}</h1><p className="lead">{certification.description}</p></div>
          <aside className="detail-meta">
            <div className="meta-item"><span>Issuer</span><strong>{certification.issuer}</strong></div>
            <div className="meta-item"><span>Category</span><strong>{certification.category}</strong></div>
            {certification.year && <div className="meta-item"><span>Year</span><strong>{certification.year}</strong></div>}
          </aside>
        </section>
        <img className="detail-image certificate-detail-image" src={certification.image} alt={`${certification.title} certificate`} />
        <section className="more-section">
          <h2>/MORE CERTIFICATES</h2>
          <div className="archive-grid">{related.map((item) => <CertificationCard key={item.slug} certification={item} />)}</div>
        </section>
      </Reveal>
      <PageFooter />
    </main>
  );
}
