import Image from "next/image";
import Link from "next/link";
import { getCollection } from "@/lib/content";
import { STATUS_OPTIONS, getStatusLabel, getStatusValue, parseStatusFilter } from "@/lib/status-filter";

export default async function FiguresPage({
  searchParams,
}: {
  searchParams?: Promise<{ status?: string | string[] }>;
}) {
  const figures = getCollection("figures");
  const params = searchParams ? await searchParams : {};
  const statusFilter = parseStatusFilter(params?.status);
  const filtered = statusFilter === "all"
    ? figures
    : figures.filter((item) => getStatusValue(item.status) === statusFilter);

  const counts = {
    all: figures.length,
    inbox: figures.filter((item) => getStatusValue(item.status) === "inbox").length,
    reviewed: figures.filter((item) => getStatusValue(item.status) === "reviewed").length,
    published: figures.filter((item) => getStatusValue(item.status) === "published").length,
    unknown: figures.filter((item) => getStatusValue(item.status) === "unknown").length,
  } as const;

  return (
    <section>
      <div className="card section-hero section-hero-figures reveal">
        <p className="section-kicker">図解</p>
        <h1>図解ギャラリー</h1>
        <p>
          授業の説明に使えるSVG図解です。1図1主張で作成しており、各図解ページで説明文と参考リンクを確認できます。
        </p>
        <p className="meta">状態: {getStatusLabel(statusFilter)} / {filtered.length}件表示</p>
        <div className="chip-row" aria-label="状態フィルタ">
          {STATUS_OPTIONS.map((status) => (
            <Link key={status} href={status === "all" ? "/figures" : `/figures?status=${status}`} className="chip-link" aria-current={statusFilter === status ? "page" : undefined}>
              {getStatusLabel(status)} ({counts[status]})
            </Link>
          ))}
        </div>
        <div className="chip-row">
          <span className="chip-muted">SVG {filtered.length}点</span>
          <span className="chip-muted">授業投影向け</span>
          <span className="chip-muted">alt付き</span>
        </div>
      </div>

      <div className="figure-gallery reveal" aria-label="図解一覧">
        {filtered.map((item) => (
          <Link key={item.slug} href={`/figures/${item.slug}`} className="figure-tile">
            <div className="figure-thumb">
              <Image src={`/figures/${item.slug}.svg`} alt={String(item.alt ?? item.title)} width={1200} height={720} />
            </div>
            <div className="figure-caption">
              <h2>{item.title}</h2>
              <p>{String(item.alt ?? "")}</p>
              <p className="meta">状態: {getStatusLabel(getStatusValue(item.status))}</p>
              <div className="tags">
                {item.tags.map((tag) => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
