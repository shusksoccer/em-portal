import { GlossaryCard } from "@/components/glossary-card";
import { getCollection } from "@/lib/content";

const glossaryPhaseGroups = [
  {
    label: "理解フェーズの用語",
    sub: "L1-L2: EMの基本概念と観察",
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
    label: "実践フェーズの用語",
    sub: "L3-L5: 記述・会話分析・ブリーチング",
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
    label: "統合フェーズの用語",
    sub: "L6: まとめと発表",
    slugs: ["presentation", "validity", "inference", "topic-management"],
  },
] as const;

export default function GlossaryPage() {
  const glossary = getCollection("glossary");

  return (
    <section>
      <div className="card section-hero section-hero-glossary reveal">
        <p className="section-kicker">用語集</p>
        <h1>用語集</h1>
        <p>授業で使う順に並べています。今のフェーズだけ見れば、必要語を先に絞れます。</p>
        <p className="meta">全{glossary.length}語</p>
      </div>

      <div style={{ display: "grid", gap: "1.5rem", marginTop: "1.2rem" }}>
        {glossaryPhaseGroups.map(({ label, sub, slugs }) => {
          const groupTerms = glossary.filter((g) => slugs.includes(g.slug as never));
          if (groupTerms.length === 0) return null;

          return (
            <section key={label} className="reveal">
              <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.2rem" }}>{label}</h2>
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
