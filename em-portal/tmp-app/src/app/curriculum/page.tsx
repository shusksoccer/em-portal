import Link from "next/link";
import { DocCard } from "@/components/doc-card";
import { getCollection } from "@/lib/content";

function getLessonPhase(slug: string): "understand" | "practice" | "apply" {
  if (["l1-what-is-em", "l2-how-to-observe"].includes(slug)) return "understand";
  if (["l3-how-to-describe", "l4-ca-entry", "l5-breaching"].includes(slug)) return "practice";
  return "apply";
}

const phaseGroups = [
  { phase: "understand" as const, label: "理解フェーズ", sub: "L1–L2｜EMとは何か・観察する" },
  { phase: "practice" as const, label: "実践フェーズ", sub: "L3–L5｜記述・会話分析・ブリーチング" },
  { phase: "apply" as const, label: "統合フェーズ", sub: "L6｜テーマ化と発表" },
] as const;

export default function CurriculumPage() {
  const lessons = getCollection("lessons");

  return (
    <section>
      <div className="card section-hero section-hero-curriculum reveal">
        <p className="section-kicker">カリキュラム</p>
        <h1>カリキュラム</h1>
        <p>
          6コマを「理解 → 実践 → 統合」の順で進めます。迷った場合は理解フェーズ（L1）から順に進んでください。
        </p>
        <div className="chip-row" style={{ marginTop: "0.4rem" }}>
          <Link href="/curriculum/l1-what-is-em" className="chip-link">L1から始める</Link>
          <Link href="/worksheets/ws-l1" className="chip-link">WS1を先に開く</Link>
        </div>
      </div>

      <div style={{ display: "grid", gap: "1.5rem", marginTop: "1.2rem" }}>
        {phaseGroups.map(({ phase, label, sub }) => {
          const groupLessons = lessons.filter((lesson) => getLessonPhase(lesson.slug) === phase);
          if (groupLessons.length === 0) return null;
          return (
            <section key={phase}>
              <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.25rem" }}>{label}</h2>
              <p className="meta" style={{ margin: "0 0 0.6rem" }}>{sub}</p>
              <div className="grid">
                {groupLessons.map((lesson) => (
                  <DocCard key={lesson.slug} doc={lesson} href={`/curriculum/${lesson.slug}`} kind="lessons" />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </section>
  );
}
