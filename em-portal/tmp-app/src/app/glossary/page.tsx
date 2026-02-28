import Link from "next/link";
import { GlossaryCard } from "@/components/glossary-card";
import { getCollection } from "@/lib/content";

export default function GlossaryPage() {
  const glossary = getCollection("glossary");
  const quick = ["accountability", "indexicality", "reflexivity", "turn-taking", "repair"];
  const requiredByStage = {
    理解: ["accountability", "indexicality", "reflexivity", "context"],
    練習: ["turn-taking", "adjacency-pair", "repair", "transcript", "sequence"],
    自力実践: ["validity", "ethics", "anonymization", "presentation"],
  } as const;
  const glossaryMap = new Map(glossary.map((item) => [item.slug, item]));

  return (
    <section>
      <div className="card section-hero section-hero-glossary reveal">
        <p className="section-kicker">用語集</p>
        <h1>用語集</h1>
        <p>
          授業で頻出する語を、短い定義・身近な例・使い方の3点で確認できます。
          まずここで意味をつかみ、各授業ページで使ってください。
        </p>
        <p className="meta">全{glossary.length}語</p>

        <section className="card" style={{ marginTop: "0.9rem", padding: "0.9rem" }} aria-label="必修語">
          <p className="meta" style={{ marginTop: 0 }}>必修語（学習段階別）</p>
          <div className="grid two">
            {Object.entries(requiredByStage).map(([stage, slugs]) => (
              <article key={stage}>
                <p className="meta" style={{ marginBottom: "0.35rem" }}>{stage}</p>
                <div className="tags">
                  {slugs.map((slug) => (
                    <Link key={slug} href={`/glossary/${slug}`} className="tag">
                      {String(glossaryMap.get(slug)?.title ?? slug)}
                    </Link>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <div className="chip-row" aria-label="頻出語">
          {quick.map((slug) => (
            <Link key={slug} href={`/glossary/${slug}`} className="chip-link">
              {String(glossaryMap.get(slug)?.title ?? slug)}
            </Link>
          ))}
        </div>
      </div>

      <div className="grid two">
        {glossary.map((item) => (
          <GlossaryCard key={item.slug} doc={item} href={`/glossary/${item.slug}`} />
        ))}
      </div>
    </section>
  );
}
