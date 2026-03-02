import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckpointBlock } from "@/components/content-blocks";
import { CycleBar, type CycleStep } from "@/components/cycle-bar";
import { MarkdownBody } from "@/components/markdown-body";
import { PrintButton } from "@/components/print-button";
import { SourceLinks } from "@/components/source-links";
import { getCollection, getDocBySlug, type ContentDoc } from "@/lib/content";

// ── サイクルステップ（4段階） ─────────────────────
function getLessonCycleStep(slug: string): CycleStep {
  if (["l1-what-is-em", "l2-how-to-observe"].includes(slug)) return "observe";
  if (slug === "l3-how-to-describe") return "describe";
  if (["l4-ca-entry", "l5-breaching"].includes(slug)) return "analyze";
  return "present";
}

// ── フェーズバッジ（3段階、ヘッダー用） ───────────
function getLessonPhase(slug: string): "understand" | "practice" | "apply" {
  if (["l1-what-is-em", "l2-how-to-observe"].includes(slug)) return "understand";
  if (["l3-how-to-describe", "l4-ca-entry", "l5-breaching"].includes(slug)) return "practice";
  return "apply";
}

const phaseLabel = {
  understand: "観察する",
  practice:   "記述・分析する",
  apply:      "まとめる",
} as const;

// ── ツールキット：フロントマターから構築 ──────────
type QuickLink = { href: string; label: string; kind: string };

function buildQuickLinks(lesson: ContentDoc): QuickLink[] {
  const toSlugs = (field: unknown): string[] =>
    Array.isArray(field) ? (field as string[]) : [];

  const glossaryDocs  = getCollection("glossary");
  const figuresDocs   = getCollection("figures");
  const worksheetDocs = getCollection("worksheets");
  const peopleDocs    = getCollection("people");

  const resolve = (
    slugs: string[],
    kind: string,
    prefix: string,
    docs: ContentDoc[]
  ): QuickLink[] =>
    slugs.map((slug) => ({
      href:  `${prefix}/${slug}`,
      label: docs.find((d) => d.slug === slug)?.title ?? slug,
      kind,
    }));

  return [
    ...resolve(toSlugs(lesson.toolkit_figures),    "図解",  "/figures",    figuresDocs),
    ...resolve(toSlugs(lesson.toolkit_glossary),   "用語",  "/glossary",   glossaryDocs),
    ...resolve(toSlugs(lesson.toolkit_worksheets), "ワーク", "/worksheets", worksheetDocs),
    ...resolve(toSlugs(lesson.toolkit_people),     "人物",  "/people",     peopleDocs),
    { href: "/faq", label: "FAQ", kind: "FAQ" },
  ];
}

export function generateStaticParams() {
  return getCollection("lessons").map((lesson) => ({ slug: lesson.slug }));
}

export default async function LessonDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const lesson = getDocBySlug("lessons", slug);
  if (!lesson) notFound();

  const objectives  = Array.isArray(lesson.objectives) ? lesson.objectives : [];
  const lessonPhase = getLessonPhase(lesson.slug);
  const cycleStep   = getLessonCycleStep(lesson.slug);
  const quickLinks  = buildQuickLinks(lesson);

  return (
    <article className="lesson-article">
      <CycleBar current={cycleStep} />

      <header className="card detail-hero detail-hero-lesson reveal">
        <p className="section-kicker">授業</p>
        <h1>{lesson.title}</h1>
        <div className="detail-meta-row">
          <span className={`phase-badge phase-${lessonPhase}`}>{phaseLabel[lessonPhase]}</span>
          <span className="detail-pill">授業{String(lesson.lesson_no)}コマ目</span>
          <span className="detail-pill">{String(lesson.duration_min)}分</span>
          <PrintButton label="授業を印刷" />
        </div>
        <div className="tags">
          {lesson.tags.map((tag) => (
            <Link key={tag} href={`/tags/${encodeURIComponent(tag)}`} className="tag">
              {tag}
            </Link>
          ))}
        </div>
      </header>

      {quickLinks.length > 0 && (
        <div className="lesson-nav-bar reveal">
          <span className="lesson-nav-bar-label">この授業のリンク集</span>
          {quickLinks.map((item) => (
            <Link key={`${item.kind}-${item.href}`} href={item.href} className="chip-link">
              <small>{item.kind}</small> {item.label}
            </Link>
          ))}
          {lesson.next
            ? (() => {
                const nextLesson = getDocBySlug("lessons", String(lesson.next));
                return (
                  <Link
                    href={`/curriculum/${encodeURIComponent(String(lesson.next))}`}
                    className="chip-link"
                  >
                    <small>次へ</small> {nextLesson?.title ?? String(lesson.next)}
                  </Link>
                );
              })()
            : null}
        </div>
      )}

      <section className="card detail-body reveal">
        {objectives.length > 0 && (
          <CheckpointBlock items={objectives.map((item) => String(item))} />
        )}
        <MarkdownBody body={lesson.body} />
      </section>

      <SourceLinks sourceIds={lesson.sources} />
    </article>
  );
}
