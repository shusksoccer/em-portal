import Link from "next/link";
import { DocCard } from "@/components/doc-card";
import { getCollection, getTagMap } from "@/lib/content";
import { STATUS_OPTIONS, getStatusLabel, getStatusValue, parseStatusFilter } from "@/lib/status-filter";

export default async function CurriculumPage({
  searchParams,
}: {
  searchParams?: Promise<{ status?: string | string[] }>;
}) {
  const lessons = getCollection("lessons");
  const tagMap = getTagMap();
  const focusTags = ["基礎", "観察", "記述", "会話分析", "倫理", "発表"];
  const params = searchParams ? await searchParams : {};
  const statusFilter = parseStatusFilter(params?.status);
  const filtered = statusFilter === "all"
    ? lessons
    : lessons.filter((lesson) => getStatusValue(lesson.status) === statusFilter);

  const counts = {
    all: lessons.length,
    inbox: lessons.filter((lesson) => getStatusValue(lesson.status) === "inbox").length,
    reviewed: lessons.filter((lesson) => getStatusValue(lesson.status) === "reviewed").length,
    published: lessons.filter((lesson) => getStatusValue(lesson.status) === "published").length,
    unknown: lessons.filter((lesson) => getStatusValue(lesson.status) === "unknown").length,
  } as const;

  return (
    <section>
      <div className="card section-hero section-hero-curriculum reveal">
        <p className="section-kicker">カリキュラム</p>
        <h1>カリキュラム</h1>
        <p>
          全6コマを、観察から発表まで順番に学ぶ構成です。各コマは50分想定で、
          次の授業につながる最小限の課題を含みます。
        </p>
        <p className="meta">
          状態: {getStatusLabel(statusFilter)} / {filtered.length}件表示
        </p>
        <div className="chip-row" aria-label="状態フィルタ">
          {STATUS_OPTIONS.map((status) => (
            <Link
              key={status}
              href={status === "all" ? "/curriculum" : `/curriculum?status=${status}`}
              className="chip-link"
              aria-current={statusFilter === status ? "page" : undefined}
            >
              {getStatusLabel(status)} ({counts[status]})
            </Link>
          ))}
        </div>
        <div className="stat-row" aria-label="カリキュラム情報">
          <div>
            <span>コマ数</span>
            <strong>{filtered.length}</strong>
          </div>
          <div>
            <span>総時間</span>
            <strong>{filtered.reduce((acc, lesson) => acc + Number(lesson.duration_min ?? 0), 0)}分</strong>
          </div>
          <div>
            <span>対象</span>
            <strong>高校探究</strong>
          </div>
        </div>
        <div className="chip-row" aria-label="注目タグ">
          {focusTags.map((tag) => (
            <Link key={tag} href={`/tags/${encodeURIComponent(tag)}`} className="chip-link">
              {tag} <small>({tagMap[tag] ?? 0})</small>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid">
        {filtered.map((lesson) => (
          <DocCard key={lesson.slug} doc={lesson} href={`/curriculum/${lesson.slug}`} />
        ))}
      </div>
    </section>
  );
}
