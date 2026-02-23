import Link from "next/link";
import type { ContentDoc } from "@/lib/content";
import { getStatusLabel, getStatusValue } from "@/lib/status-filter";

type Props = {
  doc: ContentDoc;
  href: string;
};

export function DocCard({ doc, href }: Props) {
  return (
    <article className="card">
      <h2>
        <Link href={href}>{doc.title}</Link>
      </h2>
      {"lesson_no" in doc && doc.lesson_no ? (
        <p className="meta">授業 {String(doc.lesson_no)} コマ目</p>
      ) : null}
      <p className="meta">状態: {getStatusLabel(getStatusValue(doc.status))}</p>
      {doc.tags.length ? (
        <div className="tags" aria-label="タグ">
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
