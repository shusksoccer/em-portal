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

  const rubricItems = String(worksheet.rubric ?? "")
    .split(/[・/,]/)
    .map((item) => item.trim())
    .filter(Boolean);

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

      <section className="card reveal" aria-label="ワーク概要">
        <h2 style={{ marginTop: 0 }}>ワーク概要</h2>
        <div className="grid two">
          <div>
            <p className="meta">所要時間</p>
            <p>{String(worksheet.duration_min ?? 20)}分</p>
          </div>
          <div>
            <p className="meta">提出物</p>
            <p>{String(worksheet.deliverable ?? "記入済みワーク")}</p>
          </div>
        </div>
        {rubricItems.length ? (
          <>
            <p className="meta">評価観点</p>
            <div className="tags" aria-label="評価観点">
              {rubricItems.map((item) => (
                <span key={item} className="tag">
                  {item}
                </span>
              ))}
            </div>
          </>
        ) : null}
      </section>

      <section className="card detail-body reveal">
        <MarkdownBody body={worksheet.body} />
      </section>
      <SourceLinks sourceIds={worksheet.sources} />
    </article>
  );
}
