import Link from "next/link";
import { MarkdownBody } from "@/components/markdown-body";
import { SourceLinks } from "@/components/source-links";
import { getCollection } from "@/lib/content";
import { STATUS_OPTIONS, getStatusLabel, getStatusValue, parseStatusFilter } from "@/lib/status-filter";

export default async function PeoplePage({
  searchParams,
}: {
  searchParams?: Promise<{ status?: string | string[] }>;
}) {
  const docs = getCollection("people");
  const params = searchParams ? await searchParams : {};
  const statusFilter = parseStatusFilter(params?.status);
  const filtered = statusFilter === "all"
    ? docs
    : docs.filter((doc) => getStatusValue(doc.status) === statusFilter);

  const counts = {
    all: docs.length,
    inbox: docs.filter((doc) => getStatusValue(doc.status) === "inbox").length,
    reviewed: docs.filter((doc) => getStatusValue(doc.status) === "reviewed").length,
    published: docs.filter((doc) => getStatusValue(doc.status) === "published").length,
    unknown: docs.filter((doc) => getStatusValue(doc.status) === "unknown").length,
  } as const;

  return (
    <section>
      <div className="card section-hero section-hero-people reveal">
        <p className="section-kicker">研究者</p>
        <h1>研究者紹介</h1>
        <p>
          人物史を長く追うよりも、「授業でどの考え方を使うか」に焦点を当てたメモです。
          各ページは覚える一言つきで、配布資料の欄外解説に使えます。
        </p>
        <p className="meta">状態: {getStatusLabel(statusFilter)} / {filtered.length}件表示</p>
        <div className="chip-row" aria-label="状態フィルタ">
          {STATUS_OPTIONS.map((status) => (
            <Link key={status} href={status === "all" ? "/people" : `/people?status=${status}`} className="chip-link" aria-current={statusFilter === status ? "page" : undefined}>
              {getStatusLabel(status)} ({counts[status]})
            </Link>
          ))}
        </div>
      </div>
      <div className="grid two reveal">
        {filtered.map((doc) => (
          <article key={doc.slug} className="card profile-card">
            <h2>{doc.title}</h2>
            <p className="meta">状態: {getStatusLabel(getStatusValue(doc.status))}</p>
            <MarkdownBody body={doc.body} />
            <SourceLinks sourceIds={doc.sources} />
          </article>
        ))}
      </div>
    </section>
  );
}
