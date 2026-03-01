import Link from "next/link";
import { getSourcesByIds } from "@/lib/content";

type Props = {
  sourceIds: string[];
};

export function SourceLinks({ sourceIds }: Props) {
  if (sourceIds.length === 0) return null;
  const sources = getSourcesByIds(sourceIds);
  if (sources.length === 0) return null;

  return (
    <section className="card source-links" aria-label="参考文献">
      <h2>参考リンク</h2>
      <ul>
        {sources.map((source) => (
          <li key={source.id}>
            {source.url.startsWith("/") ? (
              <Link href={source.url}>{source.title}</Link>
            ) : (
              <a href={source.url} target="_blank" rel="noreferrer">
                {source.title}
              </a>
            )}{" "}
            <span className="meta">
              ({source.author}, {source.year}, 信頼度: {source.reliability})
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
