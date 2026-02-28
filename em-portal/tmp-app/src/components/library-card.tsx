import Link from "next/link";
import type { ContentDoc } from "@/lib/content";

export function LibraryCard({ doc, href }: { doc: ContentDoc; href: string }) {
  const difficulty = "difficulty" in doc ? String(doc.difficulty) : null;
  const year = "year" in doc ? String(doc.year) : null;
  const author = "author" in doc ? String(doc.author) : null;
  const useCase = "use_case" in doc ? String(doc.use_case) : null;

  return (
    <article className="card card-kind-library">
      <div className="library-head">
        <div>
          <h2 style={{ marginBottom: "0.2rem" }}>
            <Link href={href}>{doc.title}</Link>
          </h2>
          {author && year ? (
            <p className="meta" style={{ margin: 0 }}>{author}（{year}）</p>
          ) : null}
        </div>
        {difficulty ? (
          <span className="detail-pill">難易度: {difficulty}</span>
        ) : null}
      </div>
      {useCase ? (
        <p style={{ margin: "0.5rem 0 0", fontSize: "0.9rem", color: "var(--ink-soft)" }}>
          {useCase}
        </p>
      ) : null}
      {doc.tags.length > 0 ? (
        <div className="tags" style={{ marginTop: "0.5rem" }}>
          {doc.tags.map((tag) => (
            <Link key={tag} href={`/tags/${encodeURIComponent(tag)}`} className="tag">
              {tag}
            </Link>
          ))}
        </div>
      ) : null}
    </article>
  );
}
