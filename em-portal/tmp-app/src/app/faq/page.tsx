import Link from "next/link";
import { MarkdownBody } from "@/components/markdown-body";
import { SourceLinks } from "@/components/source-links";
import { getCollection } from "@/lib/content";
import { STATUS_OPTIONS, getStatusLabel, getStatusValue, parseStatusFilter } from "@/lib/status-filter";

export default async function FaqPage({
  searchParams,
}: {
  searchParams?: Promise<{ status?: string | string[] }>;
}) {
  const faqs = getCollection("faq");
  const params = searchParams ? await searchParams : {};
  const statusFilter = parseStatusFilter(params?.status);
  const filtered = statusFilter === "all"
    ? faqs
    : faqs.filter((faq) => getStatusValue(faq.status) === statusFilter);

  const counts = {
    all: faqs.length,
    inbox: faqs.filter((faq) => getStatusValue(faq.status) === "inbox").length,
    reviewed: faqs.filter((faq) => getStatusValue(faq.status) === "reviewed").length,
    published: faqs.filter((faq) => getStatusValue(faq.status) === "published").length,
    unknown: faqs.filter((faq) => getStatusValue(faq.status) === "unknown").length,
  } as const;

  return (
    <section>
      <div className="card section-hero section-hero-faq reveal">
        <p className="section-kicker">FAQ</p>
        <h1>よくある質問</h1>
        <p>
          授業で止まりやすいポイントを短く確認できます。回答は短く、チェック項目は共通でそろえています。
        </p>
        <p className="meta">
          状態: {getStatusLabel(statusFilter)} / {filtered.length}件表示
        </p>
        <div className="chip-row" aria-label="状態フィルタ">
          {STATUS_OPTIONS.map((status) => (
            <Link
              key={status}
              href={status === "all" ? "/faq" : `/faq?status=${status}`}
              className="chip-link"
              aria-current={statusFilter === status ? "page" : undefined}
            >
              {getStatusLabel(status)} ({counts[status]})
            </Link>
          ))}
        </div>
      </div>
      <div className="grid reveal">
        {filtered.map((faq, index) => (
          <article key={faq.slug} className="card faq-card">
            <p className="faq-index">Q{index + 1}</p>
            <h2>{faq.title}</h2>
            <p className="meta">状態: {getStatusLabel(getStatusValue(faq.status))}</p>
            <MarkdownBody body={faq.body} />
            <SourceLinks sourceIds={faq.sources} />
          </article>
        ))}
      </div>
    </section>
  );
}
