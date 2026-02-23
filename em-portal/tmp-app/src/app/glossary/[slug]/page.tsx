import Link from "next/link";
import { notFound } from "next/navigation";
import { MarkdownBody } from "@/components/markdown-body";
import { PrintButton } from "@/components/print-button";
import { SourceLinks } from "@/components/source-links";
import { getCollection, getDocBySlug } from "@/lib/content";
import { getStatusLabel, getStatusValue } from "@/lib/status-filter";

export function generateStaticParams() {
  return getCollection("glossary").map((item) => ({ slug: item.slug }));
}

export default async function GlossaryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const term = getDocBySlug("glossary", slug);
  if (!term) notFound();
  const aliases = Array.isArray(term.aliases) ? term.aliases.map(String).filter(Boolean) : [];
  const related = Array.isArray(term.related) ? term.related.map(String).filter(Boolean) : [];
  const examples = Array.isArray(term.examples) ? term.examples.map(String).filter(Boolean) : [];

  return (
    <article>
      <header className="card detail-hero detail-hero-glossary reveal">
        <p className="section-kicker">用語集</p>
        <h1>{term.title}</h1>
        <div className="detail-meta-row">
          <PrintButton label="用語を印刷" />
        </div>
        <div className="tags">
          {term.tags.map((tag) => (
            <Link key={tag} href={`/tags/${encodeURIComponent(tag)}`} className="tag">
              {tag}
            </Link>
          ))}
        </div>
      </header>

      <section className="card reveal" aria-label="用語概要">
        <h2 style={{ marginTop: 0 }}>用語概要</h2>
        <div className="grid two">
          <div>
            <p className="meta">状態</p>
            <p>{getStatusLabel(getStatusValue(term.status))}</p>
          </div>
          <div>
            <p className="meta">出典数</p>
            <p>{term.sources.length}件</p>
          </div>
        </div>
        {aliases.length ? (
          <>
            <p className="meta">別名・言い換え</p>
            <div className="tags" aria-label="別名・言い換え">
              {aliases.map((item) => (
                <span key={item} className="tag">{item}</span>
              ))}
            </div>
          </>
        ) : null}
        {related.length ? (
          <>
            <p className="meta">関連語</p>
            <div className="tags" aria-label="関連語">
              {related.map((item) => (
                <Link key={item} href={`/glossary/${encodeURIComponent(item)}`} className="tag">
                  {item}
                </Link>
              ))}
            </div>
          </>
        ) : null}
        {examples.length ? (
          <>
            <p className="meta">例のカテゴリ</p>
            <div className="tags" aria-label="例のカテゴリ">
              {examples.map((item) => (
                <span key={item} className="tag">{item}</span>
              ))}
            </div>
          </>
        ) : null}
      </section>

      <section className="card detail-body reveal">
        <MarkdownBody body={term.body} />
      </section>
      <SourceLinks sourceIds={term.sources} />
    </article>
  );
}
