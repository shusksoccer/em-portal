import Link from "next/link";
import { MarkdownBody } from "@/components/markdown-body";
import { SourceLinks } from "@/components/source-links";
import { getCollection } from "@/lib/content";
import {
  STATUS_OPTIONS,
  type StatusFilter,
  getStatusLabel,
  getStatusValue,
  parseStatusFilter,
} from "@/lib/status-filter";

export default async function LibraryPage({
  searchParams,
}: {
  searchParams?: Promise<{ status?: string | string[] }>;
}) {
  const docs = getCollection("library");
  const filterChips = ["基礎", "観察", "会話分析", "倫理", "発表"];
  const params = searchParams ? await searchParams : {};
  const statusFilter = parseStatusFilter(params?.status);

  const statusCounts = {
    all: docs.length,
    inbox: docs.filter((doc) => getStatusValue(doc.status) === "inbox").length,
    reviewed: docs.filter((doc) => getStatusValue(doc.status) === "reviewed").length,
    published: docs.filter((doc) => getStatusValue(doc.status) === "published").length,
    unknown: docs.filter((doc) => getStatusValue(doc.status) === "unknown").length,
  } satisfies Record<StatusFilter, number>;

  const filteredDocs = statusFilter === "all"
    ? docs
    : docs.filter((doc) => getStatusValue(doc.status) === statusFilter);

  return (
    <section>
      <div className="card section-hero section-hero-library reveal">
        <p className="section-kicker">文献</p>
        <h1>文献リスト</h1>
        <p>
          授業で使う順に読みやすい短い文献メモです。難易度・用途・読むポイントが先に見える形にしています。
        </p>
        <p className="meta">状態: {getStatusLabel(statusFilter)} / {filteredDocs.length}件表示</p>
        <div className="chip-row" aria-label="状態フィルタ">
          {STATUS_OPTIONS.map((status) => {
            const href = status === "all" ? "/library" : `/library?status=${status}`;
            return (
              <Link key={status} href={href} className="chip-link" aria-current={statusFilter === status ? "page" : undefined}>
                {getStatusLabel(status)} ({statusCounts[status]})
              </Link>
            );
          })}
        </div>
        <div className="chip-row">
          {filterChips.map((tag) => (
            <Link key={tag} href={`/tags/${encodeURIComponent(tag)}`} className="chip-link">
              {tag}
            </Link>
          ))}
        </div>
      </div>

      <div className="grid">
        {filteredDocs.map((doc) => (
          <article key={doc.slug} className="card">
            <div className="library-head">
              <div>
                <h2>{doc.title}</h2>
                <p className="meta">
                  著者: {String(doc.author ?? "-")} / 年: {String(doc.year ?? "-")} / 状態: {getStatusLabel(getStatusValue(doc.status))}
                </p>
              </div>
              <div className="library-meta-box">
                <span>難易度: {String(doc.difficulty ?? "-")}</span>
                <span>用途: {String(doc.use_case ?? "-")}</span>
              </div>
            </div>
            <p>
              <Link href={String(doc.url ?? "#")} target="_blank" rel="noreferrer">
                外部リンクを開く
              </Link>
            </p>
            <MarkdownBody body={doc.body} />
            <SourceLinks sourceIds={doc.sources} />
          </article>
        ))}
      </div>
    </section>
  );
}
