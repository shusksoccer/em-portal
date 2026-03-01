import Link from "next/link";
import { notFound } from "next/navigation";
import { MarkdownBody } from "@/components/markdown-body";
import { PrintButton } from "@/components/print-button";
import { SourceLinks } from "@/components/source-links";
import { getCollection, getDocBySlug } from "@/lib/content";

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
  const usedInLessons = Array.isArray(term.used_in_lessons) ? term.used_in_lessons.map(String).filter(Boolean) : [];

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
        {usedInLessons.length > 0 ? (
          <div style={{ marginTop: "0.6rem" }}>
            <span className="meta">この用語を使う授業: </span>
            {usedInLessons.map((lessonSlug) => (
              <Link key={lessonSlug} href={`/curriculum/${lessonSlug}`} className="chip-link" style={{ marginLeft: "0.3rem" }}>
                {lessonSlug}
              </Link>
            ))}
          </div>
        ) : null}
      </header>

      {(aliases.length > 0 || related.length > 0 || examples.length > 0) ? (
        <section className="card reveal" aria-label="用語概要">
          <h2 style={{ marginTop: 0 }}>用語概要</h2>
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
      ) : null}

      <section className="card detail-body reveal">
        <MarkdownBody body={term.body} />
      </section>
      <SourceLinks sourceIds={term.sources} />
    </article>
  );
}
