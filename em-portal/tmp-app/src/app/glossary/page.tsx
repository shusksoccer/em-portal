import Link from "next/link";
import { DocCard } from "@/components/doc-card";
import { getCollection } from "@/lib/content";
import { STATUS_OPTIONS, getStatusLabel, getStatusValue, parseStatusFilter } from "@/lib/status-filter";

export default async function GlossaryPage({
  searchParams,
}: {
  searchParams?: Promise<{ status?: string | string[] }>;
}) {
  const glossary = getCollection("glossary");
  const quick = ["accountability", "indexicality", "reflexivity", "turn-taking", "repair"];
  const params = searchParams ? await searchParams : {};
  const statusFilter = parseStatusFilter(params?.status);
  const filtered = statusFilter === "all"
    ? glossary
    : glossary.filter((item) => getStatusValue(item.status) === statusFilter);

  const counts = {
    all: glossary.length,
    inbox: glossary.filter((item) => getStatusValue(item.status) === "inbox").length,
    reviewed: glossary.filter((item) => getStatusValue(item.status) === "reviewed").length,
    published: glossary.filter((item) => getStatusValue(item.status) === "published").length,
    unknown: glossary.filter((item) => getStatusValue(item.status) === "unknown").length,
  } as const;

  return (
    <section>
      <div className="card section-hero section-hero-glossary reveal">
        <p className="section-kicker">用語集</p>
        <h1>用語集</h1>
        <p>
          授業で頻出する語を、短い定義・身近な例・使い方の3点で確認できます。
          まずここで意味をつかみ、各授業ページで使ってください。
        </p>
        <p className="meta">状態: {getStatusLabel(statusFilter)} / {filtered.length}件表示</p>
        <div className="chip-row" aria-label="状態フィルタ">
          {STATUS_OPTIONS.map((status) => (
            <Link key={status} href={status === "all" ? "/glossary" : `/glossary?status=${status}`} className="chip-link" aria-current={statusFilter === status ? "page" : undefined}>
              {getStatusLabel(status)} ({counts[status]})
            </Link>
          ))}
        </div>
        <div className="chip-row" aria-label="頻出語">
          {quick.map((slug) => (
            <Link key={slug} href={`/glossary/${slug}`} className="chip-link">
              {slug}
            </Link>
          ))}
        </div>
      </div>

      <div className="grid two">
        {filtered.map((item) => (
          <DocCard key={item.slug} doc={item} href={`/glossary/${item.slug}`} />
        ))}
      </div>
    </section>
  );
}
