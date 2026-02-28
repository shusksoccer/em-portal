import Link from "next/link";
import type { ContentDoc } from "@/lib/content";

type Props = {
  doc: ContentDoc;
  href: string;
};

export function GlossaryCard({ doc, href }: Props) {
  const excerpt = doc.body
    ? doc.body.replace(/^#+.*$/gm, "").trim().slice(0, 120)
    : "";

  return (
    <article className="card card-kind-glossary">
      <h2 style={{ marginBottom: "0.3rem" }}>
        <Link href={href}>{doc.title}</Link>
      </h2>
      {excerpt ? (
        <p className="meta" style={{ margin: "0 0 0.5rem", fontSize: "0.88rem", lineHeight: 1.6 }}>
          {excerpt}...
        </p>
      ) : null}
      {doc.tags.length > 0 ? (
        <div className="tags">
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
