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
          迷ったらL1から順番に進めてください。各授業は「授業ページ → 対応ワーク提出」の流れで進みます。
        </p>
        <div className="chip-row" style={{ marginTop: "0.4rem" }}>
          <Link href="/curriculum/l1-what-is-em" className="chip-link">L1から始める</Link>
          <Link href="/worksheets/ws-l1" className="chip-link">WS1を先に開く</Link>
        </div>
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
        <section className="card" style={{ marginTop: "0.9rem", padding: "0.9rem" }} aria-label="到達基準">
          <p className="meta" style={{ marginTop: 0 }}>到達基準（全コマ共通）</p>
          <ul style={{ margin: "0.4rem 0 0 1rem" }}>
            <li>主張とデータ箇所を対応づける</li>
            <li>別解や限界を1点以上書く</li>
            <li>同意・匿名化・安全性の確認を残す</li>
          </ul>
        </section>
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
          <DocCard key={lesson.slug} doc={lesson} href={`/curriculum/${lesson.slug}`} kind="lessons" />
        ))}
      </div>
    </section>
  );
}
