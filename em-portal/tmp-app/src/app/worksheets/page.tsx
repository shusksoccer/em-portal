import Link from "next/link";
import { DocCard } from "@/components/doc-card";
import { getCollection } from "@/lib/content";
import { STATUS_OPTIONS, getStatusLabel, getStatusValue, parseStatusFilter } from "@/lib/status-filter";

export default async function WorksheetsPage({
  searchParams,
}: {
  searchParams?: Promise<{ status?: string | string[] }>;
}) {
  const worksheets = getCollection("worksheets");
  const params = searchParams ? await searchParams : {};
  const statusFilter = parseStatusFilter(params?.status);
  const filtered = statusFilter === "all"
    ? worksheets
    : worksheets.filter((item) => getStatusValue(item.status) === statusFilter);

  const counts = {
    all: worksheets.length,
    inbox: worksheets.filter((item) => getStatusValue(item.status) === "inbox").length,
    reviewed: worksheets.filter((item) => getStatusValue(item.status) === "reviewed").length,
    published: worksheets.filter((item) => getStatusValue(item.status) === "published").length,
    unknown: worksheets.filter((item) => getStatusValue(item.status) === "unknown").length,
  } as const;

  return (
    <section>
      <div className="card section-hero section-hero-worksheets reveal">
        <p className="section-kicker">ワーク集</p>
        <h1>ワーク集</h1>
        <p>
          20分で実施できる配布用ワークです。記入欄、評価観点、発展課題を揃えてあるので、
          授業中でも宿題でも使えます。
        </p>
        <p className="meta">状態: {getStatusLabel(statusFilter)} / {filtered.length}件表示</p>
        <div className="chip-row" aria-label="状態フィルタ">
          {STATUS_OPTIONS.map((status) => (
            <Link key={status} href={status === "all" ? "/worksheets" : `/worksheets?status=${status}`} className="chip-link" aria-current={statusFilter === status ? "page" : undefined}>
              {getStatusLabel(status)} ({counts[status]})
            </Link>
          ))}
        </div>
        <div className="chip-row">
          <span className="chip-muted">20分想定</span>
          <span className="chip-muted">記入欄あり</span>
          <span className="chip-muted">簡易ルーブリック付き</span>
        </div>
      </div>

      <div className="grid two">
        {filtered.map((item) => (
          <DocCard key={item.slug} doc={item} href={`/worksheets/${item.slug}`} />
        ))}
      </div>
    </section>
  );
}
