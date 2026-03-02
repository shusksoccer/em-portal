import { DocCard } from "@/components/doc-card";
import { getCollection } from "@/lib/content";

const faqGroups = [
  {
    label: "観察を始める前に",
    sub: "EMの見方と前提を確認する（L1–L2）",
    slugs: ["faq-1", "faq-11", "faq-12", "faq-13"],
  },
  {
    label: "フィールドで観察・記述する",
    sub: "観察ログ・転記で迷ったとき（L2–L3）",
    slugs: ["faq-3", "faq-9", "faq-14", "faq-16"],
  },
  {
    label: "データを分析・実験する",
    sub: "会話分析・ブリーチングで迷ったとき（L4–L5）",
    slugs: ["faq-6", "faq-7", "faq-10", "faq-15"],
  },
  {
    label: "授業運営・AI活用",
    sub: "運営や道具について",
    slugs: ["faq-2", "faq-4", "faq-8"],
  },
] as const;

export default function FaqPage() {
  const faqs = getCollection("faq");

  return (
    <section>
      <div className="card section-hero section-hero-faq reveal">
        <p className="section-kicker">FAQ</p>
        <h1>よくある質問</h1>
        <p>探究サイクルの段階ごとにつまずきやすい問いを並べています。今いるステージの塊だけ開いてください。</p>
        <p className="meta">全{faqs.length}件</p>
      </div>

      <div style={{ display: "grid", gap: "1.5rem", marginTop: "1.2rem" }}>
        {faqGroups.map(({ label, sub, slugs }) => {
          const groupFaqs = faqs.filter((f) => slugs.includes(f.slug as never));
          if (groupFaqs.length === 0) return null;

          return (
            <section key={label} className="reveal">
              <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.2rem" }}>{label}</h2>
              <p className="meta" style={{ margin: "0 0 0.6rem" }}>{sub}</p>
              <div className="grid">
                {groupFaqs.map((faq) => (
                  <DocCard key={faq.slug} doc={faq} href={`/faq/${faq.slug}`} kind="faq" />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </section>
  );
}
