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

function getLessonToolkit(slug: string): {
  figures: LessonLinkItem[];
  glossary: LessonLinkItem[];
  worksheets: LessonLinkItem[];
  faqs: LessonLinkItem[];
} | null {
  switch (slug) {
    case "l1-what-is-em":
      return {
        figures: [
          { href: "/figures/fig-learning-route", label: "学習ルート", note: "単元全体の流れを最初に共有" },
          { href: "/figures/fig-observe-describe-analyze", label: "観察・記述・分析", note: "役割の違いを説明" },
          { href: "/figures/fig-background-expectancy", label: "背景的期待", note: "EMの見方を導入" },
        ],
        glossary: [
          { href: "/glossary/accountability", label: "可説明可能性" },
          { href: "/glossary/indexicality", label: "文脈依存性" },
          { href: "/glossary/reflexivity", label: "反射性" },
          { href: "/glossary/context", label: "文脈" },
        ],
        worksheets: [
          { href: "/worksheets/ws-l1", label: "WS1 観察ログ", note: "授業内ミニ活動の提出用" },
        ],
        faqs: [
          { href: "/faq", label: "FAQ一覧", note: "心理学との違い / AI公開 / データ量などを確認" },
        ],
      };
    case "l2-how-to-observe":
      return {
        figures: [
          { href: "/figures/fig-observation-log", label: "観察ログの書き方" },
          { href: "/figures/fig-ethics-checklist", label: "倫理チェック" },
        ],
        glossary: [
          { href: "/glossary/observation", label: "観察" },
          { href: "/glossary/fieldnote", label: "フィールドノート" },
          { href: "/glossary/anonymization", label: "匿名化" },
        ],
        worksheets: [{ href: "/worksheets/ws-l2", label: "WS2 観察チェックシート" }],
        faqs: [{ href: "/faq", label: "FAQ一覧", note: "データ量・テーマ設定も確認可" }],
      };
    case "l3-how-to-describe":
      return {
        figures: [
          { href: "/figures/fig-observe-describe-analyze", label: "観察・記述・分析" },
          { href: "/figures/fig-transcript-template", label: "転写テンプレート" },
        ],
        glossary: [
          { href: "/glossary/description", label: "記述" },
          { href: "/glossary/transcript", label: "転写" },
          { href: "/glossary/data-session", label: "データセッション" },
        ],
        worksheets: [{ href: "/worksheets/ws-l3", label: "WS3 記述テンプレート" }],
        faqs: [{ href: "/faq", label: "FAQ一覧", note: "記述と分析の混同を確認" }],
      };
    case "l4-ca-entry":
      return {
        figures: [
          { href: "/figures/fig-turn-structure", label: "順番取りの基本構造" },
          { href: "/figures/fig-repair-pattern", label: "修復パターン" },
        ],
        glossary: [
          { href: "/glossary/turn-taking", label: "順番取り" },
          { href: "/glossary/repair", label: "修復" },
          { href: "/glossary/adjacency-pair", label: "隣接ペア" },
        ],
        worksheets: [{ href: "/worksheets/ws-l4", label: "WS4 ターン分けと修復" }],
        faqs: [{ href: "/faq", label: "FAQ一覧", note: "会話分析で何を数えるか等" }],
      };
    case "l5-breaching":
      return {
        figures: [
          { href: "/figures/fig-breaching-safe", label: "安全なブリーチング学習" },
          { href: "/figures/fig-background-expectancy", label: "背景的期待" },
          { href: "/figures/fig-ethics-checklist", label: "倫理チェック" },
        ],
        glossary: [
          { href: "/glossary/breaching", label: "ブリーチング" },
          { href: "/glossary/background-expectancies", label: "背景的期待" },
          { href: "/glossary/ethics", label: "倫理" },
        ],
        worksheets: [{ href: "/worksheets/ws-l5", label: "WS5 模擬ブリーチング分析" }],
        faqs: [{ href: "/faq", label: "FAQ一覧", note: "ブリーチングの安全運用を確認" }],
      };
    case "l6-project":
      return {
        figures: [
          { href: "/figures/fig-presentation-map", label: "発表構成マップ" },
          { href: "/figures/fig-learning-route", label: "学習ルート" },
        ],
        glossary: [
          { href: "/glossary/presentation", label: "発表" },
          { href: "/glossary/validity", label: "妥当性" },
          { href: "/glossary/anonymization", label: "匿名化" },
        ],
        worksheets: [{ href: "/worksheets/ws-l6", label: "WS6 発表計画シート" }],
        faqs: [{ href: "/faq", label: "FAQ一覧", note: "テーマの絞り込み・発表評価を確認" }],
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
        ...lessonToolkit.faqs.map((item) => ({ ...item, kind: "補助" })),
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
          {lesson.next ? (
            <Link href={`/curriculum/${encodeURIComponent(String(lesson.next))}`} className="chip-link">
              <small>次へ</small> {String(lesson.next)}
            </Link>
          ) : null}
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
