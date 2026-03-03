import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MarkdownBody } from "@/components/markdown-body";
import { PrintButton } from "@/components/print-button";
import { SourceLinks } from "@/components/source-links";
import { getCollection, getDocBySlug } from "@/lib/content";

const FIGURE_ASSET_VERSION = "ja-svg-20260303-2";

export function generateStaticParams() {
  return getCollection("figures").map((item) => ({ slug: item.slug }));
}

export default async function FigureDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const figure = getDocBySlug("figures", slug);
  if (!figure) notFound();

  return (
    <article>
      <header className="card detail-hero detail-hero-figure reveal">
        <p className="section-kicker">図解</p>
        <h1>{figure.title}</h1>
        <p className="meta">代替テキスト: {String(figure.alt ?? "")}</p>
        <div className="detail-meta-row">
          <PrintButton label="図解を印刷" />
        </div>
        <div className="tags">
          {figure.tags.map((tag) => (
            <Link key={tag} href={`/tags/${encodeURIComponent(tag)}`} className="tag">
              {tag}
            </Link>
          ))}
        </div>
      </header>

      <div className="card detail-figure-frame reveal" style={{ padding: "0.75rem" }}>
        <Image
          src={`/figures/${figure.slug}.svg?v=${FIGURE_ASSET_VERSION}`}
          alt={String(figure.alt ?? figure.title)}
          width={1200}
          height={720}
          style={{ width: "100%", height: "auto", borderRadius: "10px" }}
        />
      </div>

      <section className="card detail-body reveal">
        <MarkdownBody body={figure.body} />
      </section>
      <SourceLinks sourceIds={figure.sources} />
    </article>
  );
}
