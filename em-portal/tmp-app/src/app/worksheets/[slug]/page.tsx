import Link from "next/link";
import { notFound } from "next/navigation";
import { MarkdownBody } from "@/components/markdown-body";
import { PrintButton } from "@/components/print-button";
import { SourceLinks } from "@/components/source-links";
import { getCollection, getDocBySlug } from "@/lib/content";

export function generateStaticParams() {
  return getCollection("worksheets").map((item) => ({ slug: item.slug }));
}

export default async function WorksheetDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const worksheet = getDocBySlug("worksheets", slug);
  if (!worksheet) notFound();

  return (
    <article>
      <header className="card detail-hero detail-hero-worksheet reveal">
        <p className="section-kicker">ワーク</p>
        <h1>{worksheet.title}</h1>
        <div className="detail-meta-row">
          <span className="detail-pill">{String(worksheet.duration_min ?? 20)}分</span>
          <span className="detail-pill">提出用</span>
          <PrintButton label="ワークを印刷" />
        </div>
        <div className="tags">
          {worksheet.tags.map((tag) => (
            <Link key={tag} href={`/tags/${encodeURIComponent(tag)}`} className="tag">
              {tag}
            </Link>
          ))}
        </div>
      </header>

      <section className="card detail-body reveal">
        <MarkdownBody body={worksheet.body} />
      </section>
      <SourceLinks sourceIds={worksheet.sources} />
    </article>
  );
}
