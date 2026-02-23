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

function getHostLabel(urlValue: unknown): string {
  const url = String(urlValue ?? "");
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "-";
  }
}

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
            <h2 style={{ marginBottom: "0.35rem" }}>{doc.title}</h2>
            <p className="meta" style={{ marginTop: 0 }}>
              著者: {String(doc.author ?? "-")} / 年: {String(doc.year ?? "-")} / 状態: {getStatusLabel(getStatusValue(doc.status))}
            </p>

            <section className="card" aria-label="文献概要" style={{ marginTop: "0.75rem", padding: "0.9rem" }}>
              <p className="meta" style={{ marginTop: 0 }}>文献概要</p>
              <div className="grid two">
                <div>
                  <p className="meta">難易度</p>
                  <p>{String(doc.difficulty ?? "-")}</p>
                </div>
                <div>
                  <p className="meta">使いどころ</p>
                  <p>{String(doc.use_case ?? "-")}</p>
                </div>
                <div>
                  <p className="meta">出典サイト</p>
                  <p>{getHostLabel(doc.url)}</p>
                </div>
                <div>
                  <p className="meta">外部リンク</p>
                  <p>
                    <Link href={String(doc.url ?? "#")} target="_blank" rel="noreferrer">
                      開く
                    </Link>
                  </p>
                </div>
              </div>
            </section>

            <details style={{ marginTop: "0.85rem" }}>
              <summary style={{ cursor: "pointer", fontWeight: 600 }}>メモを開く</summary>
              <div style={{ marginTop: "0.75rem" }}>
                <MarkdownBody body={doc.body} />
                <SourceLinks sourceIds={doc.sources} />
              </div>
            </details>
          </article>
        ))}
      </div>
    </section>
  );
}
