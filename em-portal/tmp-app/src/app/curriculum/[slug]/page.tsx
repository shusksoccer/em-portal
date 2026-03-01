import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckpointBlock } from "@/components/content-blocks";
import { MarkdownBody } from "@/components/markdown-body";
import { PrintButton } from "@/components/print-button";
import { SourceLinks } from "@/components/source-links";
import { getCollection, getDocBySlug } from "@/lib/content";

type LessonLinkItem = {
  href: string;
  label: string;
  note?: string;
};

type LessonToolkit = {
  figures: LessonLinkItem[];
  glossary: LessonLinkItem[];
  worksheets: LessonLinkItem[];
  faqs: LessonLinkItem[];
  people: LessonLinkItem[];
};

function getLessonToolkit(slug: string): LessonToolkit | null {
  switch (slug) {
    case "l1-what-is-em":
      return {
        figures: [
          { href: "/figures/fig-learning-route", label: "学習ルート", note: "全体像を最初に確認" },
          { href: "/figures/fig-observe-describe-analyze", label: "観察→記述→分析", note: "3段階の関係" },
          { href: "/figures/fig-background-expectancy", label: "背景期待", note: "EMの土台" },
        ],
        glossary: [
          { href: "/glossary/accountability", label: "アカウンタビリティ" },
          { href: "/glossary/indexicality", label: "インデクシカリティ" },
          { href: "/glossary/reflexivity", label: "再帰性" },
          { href: "/glossary/context", label: "コンテクスト" },
        ],
        worksheets: [
          { href: "/worksheets/ws-l1", label: "WS1 観察ログ", note: "導入の記録テンプレ" },
        ],
        faqs: [
          { href: "/faq", label: "FAQ一覧", note: "つまずきポイント確認" },
        ],
        people: [
          { href: "/people/garfinkel", label: "Garfinkel", note: "EMの創始者" },
        ],
      };
    case "l2-how-to-observe":
      return {
        figures: [
          { href: "/figures/fig-observation-log", label: "観察ログの見本" },
          { href: "/figures/fig-ethics-checklist", label: "倫理チェック" },
        ],
        glossary: [
          { href: "/glossary/observation", label: "観察" },
          { href: "/glossary/fieldnote", label: "フィールドノート" },
          { href: "/glossary/anonymization", label: "匿名化" },
        ],
        worksheets: [{ href: "/worksheets/ws-l2", label: "WS2 観察チェック" }],
        faqs: [{ href: "/faq", label: "FAQ一覧", note: "観察・倫理の確認" }],
        people: [],
      };
    case "l3-how-to-describe":
      return {
        figures: [
          { href: "/figures/fig-observe-describe-analyze", label: "観察→記述→分析" },
          { href: "/figures/fig-transcript-template", label: "転記テンプレート" },
        ],
        glossary: [
          { href: "/glossary/description", label: "記述" },
          { href: "/glossary/transcript", label: "転記" },
          { href: "/glossary/data-session", label: "データセッション" },
        ],
        worksheets: [{ href: "/worksheets/ws-l3", label: "WS3 記述テンプレート" }],
        faqs: [{ href: "/faq", label: "FAQ一覧", note: "記述と分析の違い" }],
        people: [{ href: "/people/jefferson", label: "Jefferson", note: "転記記号の基礎" }],
      };
    case "l4-ca-entry":
      return {
        figures: [
          { href: "/figures/fig-turn-structure", label: "ターン構造" },
          { href: "/figures/fig-repair-pattern", label: "修復パターン" },
        ],
        glossary: [
          { href: "/glossary/turn-taking", label: "ターンテイキング" },
          { href: "/glossary/repair", label: "修復" },
          { href: "/glossary/adjacency-pair", label: "隣接ペア" },
        ],
        worksheets: [{ href: "/worksheets/ws-l4", label: "WS4 ターン分析" }],
        faqs: [{ href: "/faq", label: "FAQ一覧", note: "会話分析の基礎" }],
        people: [
          { href: "/people/sacks", label: "Sacks", note: "CAの基盤" },
          { href: "/people/schegloff", label: "Schegloff", note: "連鎖組織と修復" },
          { href: "/people/jefferson", label: "Jefferson", note: "転記と相互行為" },
        ],
      };
    case "l5-breaching":
      return {
        figures: [
          { href: "/figures/fig-breaching-safe", label: "安全なブリーチング" },
          { href: "/figures/fig-background-expectancy", label: "背景期待" },
          { href: "/figures/fig-ethics-checklist", label: "倫理チェック" },
        ],
        glossary: [
          { href: "/glossary/breaching", label: "ブリーチング" },
          { href: "/glossary/background-expectancies", label: "背景期待" },
          { href: "/glossary/ethics", label: "倫理" },
        ],
        worksheets: [{ href: "/worksheets/ws-l5", label: "WS5 ブリーチング分析" }],
        faqs: [{ href: "/faq", label: "FAQ一覧", note: "倫理と安全の確認" }],
        people: [{ href: "/people/garfinkel", label: "Garfinkel", note: "ブリーチング実験" }],
      };
    case "l6-project":
      return {
        figures: [
          { href: "/figures/fig-presentation-map", label: "発表マップ" },
          { href: "/figures/fig-learning-route", label: "学習ルート" },
        ],
        glossary: [
          { href: "/glossary/presentation", label: "発表" },
          { href: "/glossary/validity", label: "妥当性" },
          { href: "/glossary/anonymization", label: "匿名化" },
        ],
        worksheets: [{ href: "/worksheets/ws-l6", label: "WS6 発表設計シート" }],
        faqs: [{ href: "/faq", label: "FAQ一覧", note: "仕上げ時の確認" }],
        people: [],
      };
    default:
      return null;
  }
}

function getLessonPhase(slug: string): "understand" | "practice" | "apply" {
  if (["l1-what-is-em", "l2-how-to-observe"].includes(slug)) return "understand";
  if (["l3-how-to-describe", "l4-ca-entry", "l5-breaching"].includes(slug)) return "practice";
  return "apply";
}

const phaseLabel = {
  understand: "理解フェーズ",
  practice: "実践フェーズ",
  apply: "統合フェーズ",
} as const;

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

  const lessonToolkit = getLessonToolkit(lesson.slug);
  const objectives = Array.isArray(lesson.objectives) ? lesson.objectives : [];
  const lessonPhase = getLessonPhase(lesson.slug);
  const quickLinks = lessonToolkit
    ? [
        ...lessonToolkit.figures.map((item) => ({ ...item, kind: "図解" })),
        ...lessonToolkit.glossary.map((item) => ({ ...item, kind: "用語" })),
        ...lessonToolkit.worksheets.map((item) => ({ ...item, kind: "ワーク" })),
        ...lessonToolkit.faqs.map((item) => ({ ...item, kind: "FAQ" })),
        ...lessonToolkit.people.map((item) => ({ ...item, kind: "人物" })),
      ]
    : [];

  return (
    <article className="lesson-article">
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

      {lessonToolkit ? (
        <div className="lesson-nav-bar reveal">
          <span className="lesson-nav-bar-label">この授業のリンク集</span>
          {quickLinks.map((item) => (
            <Link key={item.href} href={item.href} className="chip-link" title={item.note}>
              <small>{item.kind}</small> {item.label}
            </Link>
          ))}
          {lesson.next
            ? (() => {
                const nextLesson = getDocBySlug("lessons", String(lesson.next));
                return (
                  <Link href={`/curriculum/${encodeURIComponent(String(lesson.next))}`} className="chip-link">
                    <small>次へ</small> {nextLesson?.title ?? String(lesson.next)}
                  </Link>
                );
              })()
            : null}
        </div>
      ) : null}

      <section className="card detail-body reveal">
        {objectives.length > 0 ? <CheckpointBlock items={objectives.map((item) => String(item))} /> : null}
        <MarkdownBody body={lesson.body} />
      </section>
      <SourceLinks sourceIds={lesson.sources} />
    </article>
  );
}
