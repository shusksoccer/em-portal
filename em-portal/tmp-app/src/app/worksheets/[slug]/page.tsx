import Link from "next/link";
import { notFound } from "next/navigation";
import { MarkdownBody } from "@/components/markdown-body";
import { PrintButton } from "@/components/print-button";
import { SourceLinks } from "@/components/source-links";
import { getCollection, getDocBySlug } from "@/lib/content";

function getRubricItems(raw: unknown): string[] {
  return String(raw ?? "")
    .split(/[・,，/]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function getLessonHrefFromWorksheet(slug: string): string | null {
  const match = slug.match(/^ws-l(\d+)$/);
  if (!match) return null;
  const no = Number(match[1]);
  const map: Record<number, string> = {
    1: "/curriculum/l1-what-is-em",
    2: "/curriculum/l2-how-to-observe",
    3: "/curriculum/l3-how-to-describe",
    4: "/curriculum/l4-ca-entry",
    5: "/curriculum/l5-breaching",
    6: "/curriculum/l6-project",
  };
  return map[no] ?? null;
}

function getNextLessonHrefFromWorksheet(slug: string): string | null {
  const match = slug.match(/^ws-l(\d+)$/);
  if (!match) return null;
  const no = Number(match[1]);
  const map: Record<number, string> = {
    1: "/curriculum/l2-how-to-observe",
    2: "/curriculum/l3-how-to-describe",
    3: "/curriculum/l4-ca-entry",
    4: "/curriculum/l5-breaching",
    5: "/curriculum/l6-project",
  };
  return map[no] ?? null;
}

export function generateStaticParams() {
  return getCollection("worksheets").map((item) => ({ slug: item.slug }));
}

export default async function WorksheetDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const worksheet = getDocBySlug("worksheets", slug);
  if (!worksheet) notFound();

  const rubricItems = getRubricItems(worksheet.rubric);
  const lessonHref = getLessonHrefFromWorksheet(worksheet.slug);
  const nextLessonHref = getNextLessonHrefFromWorksheet(worksheet.slug);
  const finalPracticeLinks = worksheet.slug === "ws-l6"
    ? [
        { href: "/figures/fig-presentation-map", label: "発表構成マップを確認" },
        { href: "/glossary/validity", label: "妥当性の定義を確認" },
        { href: "/library?stage=自力実践", label: "自力実践向け文献を見る" },
      ]
    : [];

  return (
    <article>
      <header className="card detail-hero detail-hero-worksheet reveal">
        <p className="section-kicker">ワーク</p>
        <h1>{worksheet.title}</h1>
        <div className="detail-meta-row">
          <span className="detail-pill">{String(worksheet.duration_min ?? 20)}分</span>
          <span className="detail-pill">提出用</span>
          <PrintButton label="ワークを印刷" />
        </div>
        <div className="tags">
          {worksheet.tags.map((tag) => (
            <Link key={tag} href={`/tags/${encodeURIComponent(tag)}`} className="tag">
              {tag}
            </Link>
          ))}
        </div>
      </header>

      <section className="card reveal" aria-label="提出条件">
        <h2 style={{ marginTop: 0 }}>提出条件</h2>
        <div className="grid two">
          <div>
            <p className="meta">所要時間</p>
            <p>{String(worksheet.duration_min ?? 20)}分</p>
          </div>
          <div>
            <p className="meta">提出物</p>
            <p>{String(worksheet.deliverable ?? "記入済みワーク")}</p>
          </div>
        </div>
        {rubricItems.length ? (
          <>
            <p className="meta">評価観点</p>
            <div className="tags" aria-label="評価観点">
              {rubricItems.map((item) => (
                <span key={item} className="tag">
                  {item}
                </span>
              ))}
            </div>
          </>
        ) : null}
        {lessonHref ? (
          <p className="meta" style={{ marginTop: "0.8rem" }}>
            対応授業: <Link href={lessonHref}>授業ページへ戻る</Link>
          </p>
        ) : null}
        <section style={{ marginTop: "0.9rem" }} aria-label="次のアクション">
          <p className="meta" style={{ marginBottom: "0.4rem" }}>次のアクション</p>
          <div className="chip-row">
            <Link href="/faq" className="chip-link">FAQで詰まりを確認</Link>
            {nextLessonHref ? (
              <Link href={nextLessonHref} className="chip-link">次の授業へ進む</Link>
            ) : (
              <Link href="/curriculum" className="chip-link">カリキュラム一覧へ戻る</Link>
            )}
            <Link href="/worksheets" className="chip-link">ワーク一覧を見る</Link>
          </div>
          {finalPracticeLinks.length ? (
            <>
              <p className="meta" style={{ margin: "0.7rem 0 0.4rem" }}>仕上げ確認（L6向け）</p>
              <div className="chip-row">
                {finalPracticeLinks.map((item) => (
                  <Link key={item.href} href={item.href} className="chip-link">
                    {item.label}
                  </Link>
                ))}
              </div>
            </>
          ) : null}
        </section>
      </section>

      <section className="card detail-body reveal">
        <MarkdownBody body={worksheet.body} />
      </section>
      <SourceLinks sourceIds={worksheet.sources} />
    </article>
  );
}
