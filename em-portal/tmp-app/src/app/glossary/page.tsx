import { GlossaryCard } from "@/components/glossary-card";
import { getCollection } from "@/lib/content";

const glossaryCycleGroups = [
  {
    label: "観察するときの用語",
    sub: "L1–L2: フィールドに出る前に押さえる基本概念",
    phase: "understand" as const,
    slugs: [
      "accountability",
      "indexicality",
      "reflexivity",
      "context",
      "background-expectancies",
      "norm",
      "observation",
      "description",
      "fieldnote",
      "anonymization",
      "consent",
      "deviation",
      "embodiment",
    ],
  },
  {
    label: "記述・分析するときの用語",
    sub: "L3–L5: 転記・会話分析・ブリーチング実験で使う概念",
    phase: "practice" as const,
    slugs: [
      "transcript",
      "sequence",
      "turn-taking",
      "adjacency-pair",
      "repair",
      "overlap",
      "silence",
      "gaze",
      "membership-categorization",
      "breaching",
      "ethics",
      "data-session",
      "institutional-talk",
    ],
  },
  {
    label: "まとめる・発表するときの用語",
    sub: "L6: 分析結果を整理し、他者に伝えるための概念",
    phase: "apply" as const,
    slugs: ["presentation", "validity", "inference", "topic-management"],
  },
] as const;

const phaseLabel = {
  understand: "観察する",
  practice:   "記述・分析する",
  apply:      "まとめる",
} as const;

export default function GlossaryPage() {
  const glossary = getCollection("glossary");

  return (
    <section>
      <div className="card section-hero section-hero-glossary reveal">
        <p className="section-kicker">用語集</p>
        <h1>用語集</h1>
        <p>探究サイクルの段階ごとに並べています。今いるステージの用語から確認してください。</p>
        <p className="meta">全{glossary.length}語</p>
      </div>

      <div style={{ display: "grid", gap: "1.5rem", marginTop: "1.2rem" }}>
        {glossaryCycleGroups.map(({ label, sub, phase, slugs }) => {
          const groupTerms = glossary.filter((g) => slugs.includes(g.slug as never));
          if (groupTerms.length === 0) return null;

          return (
            <section key={label} className="reveal">
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.2rem" }}>
                <h2 style={{ fontSize: "1rem", fontWeight: 700, margin: 0 }}>{label}</h2>
                <span className={`phase-badge phase-${phase}`} style={{ fontSize: "0.72rem" }}>{phaseLabel[phase]}</span>
              </div>
              <p className="meta" style={{ margin: "0 0 0.6rem" }}>{sub}</p>
              <div className="grid">
                {groupTerms.map((term) => (
                  <GlossaryCard key={term.slug} doc={term} href={`/glossary/${term.slug}`} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </section>
  );
}
