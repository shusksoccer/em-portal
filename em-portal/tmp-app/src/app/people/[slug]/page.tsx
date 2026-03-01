import Link from "next/link";
import { notFound } from "next/navigation";
import { MarkdownBody } from "@/components/markdown-body";
import { PrintButton } from "@/components/print-button";
import { SourceLinks } from "@/components/source-links";
import { getCollection, getDocBySlug } from "@/lib/content";

export function generateStaticParams() {
  return getCollection("people").map((item) => ({ slug: item.slug }));
}

export default async function PeopleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const person = getDocBySlug("people", slug);
  if (!person) notFound();

  const usedInLessons = Array.isArray(person.used_in_lessons)
    ? person.used_in_lessons.map(String).filter(Boolean)
    : [];

  return (
    <article>
      <header className="card detail-hero reveal">
        <p className="section-kicker">研究者</p>
        <h1>{person.title}</h1>
        <div className="detail-meta-row">
          <PrintButton label="人物ページを印刷" />
        </div>
        {person.tags.length > 0 ? (
          <div className="tags">
            {person.tags.map((tag) => (
              <Link key={tag} href={`/tags/${encodeURIComponent(tag)}`} className="tag">
                {tag}
              </Link>
            ))}
          </div>
        ) : null}
        {usedInLessons.length > 0 ? (
          <div style={{ marginTop: "0.6rem" }}>
            <span className="meta">この人物を使う授業: </span>
            {usedInLessons.map((lessonSlug) => (
              <Link
                key={lessonSlug}
                href={`/curriculum/${lessonSlug}`}
                className="chip-link"
                style={{ marginLeft: "0.3rem" }}
              >
                {lessonSlug}
              </Link>
            ))}
          </div>
        ) : null}
      </header>

      <section className="card detail-body reveal">
        <MarkdownBody body={person.body} />
      </section>
      <SourceLinks sourceIds={person.sources} />
    </article>
  );
}
