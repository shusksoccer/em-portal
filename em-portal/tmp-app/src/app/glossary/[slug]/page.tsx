import Link from "next/link";
import { notFound } from "next/navigation";
import { CycleBar, type CycleStep } from "@/components/cycle-bar";
import { MarkdownBody } from "@/components/markdown-body";
import { PrintButton } from "@/components/print-button";
import { SourceLinks } from "@/components/source-links";
import { getCollection, getDocBySlug } from "@/lib/content";

// ── サイクルステップ・フェーズ分類 ──────────────────
const OBSERVE_SLUGS = new Set([
  "accountability", "indexicality", "reflexivity", "context",
  "background-expectancies", "norm", "observation", "description",
  "fieldnote", "anonymization", "consent", "deviation", "embodiment",
]);
const DESCRIBE_SLUGS = new Set([
  "transcript", "sequence", "turn-taking", "adjacency-pair", "repair",
  "overlap", "silence", "gaze", "membership-categorization", "breaching",
  "ethics", "data-session", "institutional-talk",
]);

function getGlossaryCycleStep(slug: string): CycleStep {
  if (OBSERVE_SLUGS.has(slug)) return "observe";
  if (DESCRIBE_SLUGS.has(slug)) return "describe";
  return "present";
}

type Phase = "understand" | "practice" | "apply";

function getGlossaryPhase(slug: string): Phase {
  if (OBSERVE_SLUGS.has(slug)) return "understand";
  if (DESCRIBE_SLUGS.has(slug)) return "practice";
  return "apply";
}

const phaseLabel: Record<Phase, string> = {
  understand: "観察する",
  practice:   "記述・分析する",
  apply:      "まとめる",
};

export function generateStaticParams() {
  return getCollection("glossary").map((item) => ({ slug: item.slug }));
}

export default async function GlossaryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const term = getDocBySlug("glossary", slug);
  if (!term) notFound();

  const aliases       = Array.isArray(term.aliases)        ? term.aliases.map(String).filter(Boolean)        : [];
  const related       = Array.isArray(term.related)        ? term.related.map(String).filter(Boolean)        : [];
  const examples      = Array.isArray(term.examples)       ? term.examples.map(String).filter(Boolean)       : [];
  const usedInLessons = Array.isArray(term.used_in_lessons) ? term.used_in_lessons.map(String).filter(Boolean) : [];

  const cycleStep = getGlossaryCycleStep(slug);
  const phase     = getGlossaryPhase(slug);

  // 関連語のタイトルを解決
  const glossaryDocs = getCollection("glossary");
  const resolveTitle = (s: string) => glossaryDocs.find((g) => g.slug === s)?.title ?? s;

  // 授業タイトルを解決
  const lessonDocs = getCollection("lessons");
  const resolveLessonTitle = (s: string) => lessonDocs.find((l) => l.slug === s)?.title ?? s;

  const hasMetaSection = aliases.length > 0 || related.length > 0 || examples.length > 0 || usedInLessons.length > 0;

  return (
    <article>
      <CycleBar current={cycleStep} />

      <header className="card detail-hero detail-hero-glossary reveal">
        <p className="section-kicker">用語集</p>
        <h1>{term.title}</h1>
        <div className="detail-meta-row">
          <span className={`phase-badge phase-${phase}`}>{phaseLabel[phase]}</span>
          <PrintButton label="用語を印刷" />
        </div>
        <div className="tags">
          {term.tags.map((tag) => (
            <Link key={tag} href={`/tags/${encodeURIComponent(tag)}`} className="tag">
              {tag}
            </Link>
          ))}
        </div>
      </header>

      {hasMetaSection ? (
        <section className="card reveal" aria-label="用語概要">
          <h2 style={{ marginTop: 0 }}>用語概要</h2>

          {aliases.length ? (
            <>
              <p className="meta">別名・言い換え</p>
              <div className="tags" style={{ marginTop: "0.3rem" }} aria-label="別名・言い換え">
                {aliases.map((item) => (
                  <span key={item} className="tag">{item}</span>
                ))}
              </div>
            </>
          ) : null}

          {related.length ? (
            <>
              <p className="meta" style={{ marginTop: aliases.length ? "0.8rem" : 0 }}>関連語</p>
              <div className="chip-row" style={{ marginTop: "0.35rem" }} aria-label="関連語">
                {related.map((r) => (
                  <Link key={r} href={`/glossary/${encodeURIComponent(r)}`} className="chip-link">
                    <small>用語</small> {resolveTitle(r)}
                  </Link>
                ))}
              </div>
            </>
          ) : null}

          {examples.length ? (
            <>
              <p className="meta" style={{ marginTop: "0.8rem" }}>例のカテゴリ</p>
              <div className="tags" style={{ marginTop: "0.3rem" }} aria-label="例のカテゴリ">
                {examples.map((item) => (
                  <span key={item} className="tag">{item}</span>
                ))}
              </div>
            </>
          ) : null}

          {usedInLessons.length ? (
            <>
              <p className="meta" style={{ marginTop: "0.8rem" }}>この用語を使う授業</p>
              <div className="chip-row" style={{ marginTop: "0.35rem" }}>
                {usedInLessons.map((lessonSlug) => (
                  <Link key={lessonSlug} href={`/curriculum/${lessonSlug}`} className="chip-link">
                    <small>授業</small> {resolveLessonTitle(lessonSlug)}
                  </Link>
                ))}
              </div>
            </>
          ) : null}

          <section style={{ marginTop: "1rem" }} aria-label="次のアクション">
            <p className="meta" style={{ marginBottom: "0.4rem" }}>次のアクション</p>
            <div className="chip-row" style={{ marginTop: 0 }}>
              <Link href="/glossary" className="chip-link">用語集一覧へ戻る</Link>
              <Link href="/faq" className="chip-link">FAQで詰まりを確認</Link>
            </div>
          </section>
        </section>
      ) : null}

      <section className="card detail-body reveal">
        <MarkdownBody body={term.body} />
      </section>

      <SourceLinks sourceIds={term.sources} />
    </article>
  );
}
