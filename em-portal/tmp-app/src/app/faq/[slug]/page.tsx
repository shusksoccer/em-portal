import Link from "next/link";
import { notFound } from "next/navigation";
import { MarkdownBody } from "@/components/markdown-body";
import { PrintButton } from "@/components/print-button";
import { SourceLinks } from "@/components/source-links";
import { getCollection, getDocBySlug } from "@/lib/content";

export function generateStaticParams() {
  return getCollection("faq").map((item) => ({ slug: item.slug }));
}

export default async function FaqDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const faq = getDocBySlug("faq", slug);
  if (!faq) notFound();

  return (
    <article>
      <header className="card detail-hero reveal">
        <p className="section-kicker">FAQ</p>
        <h1>{faq.title}</h1>
        <div className="detail-meta-row">
          <PrintButton label="FAQを印刷" />
        </div>
        {faq.tags.length > 0 ? (
          <div className="tags">
            {faq.tags.map((tag) => (
              <Link key={tag} href={`/tags/${encodeURIComponent(tag)}`} className="tag">
                {tag}
              </Link>
            ))}
          </div>
        ) : null}
      </header>

      <section className="card detail-body reveal">
        <MarkdownBody body={faq.body} />
      </section>
      <SourceLinks sourceIds={faq.sources} />
    </article>
  );
}
