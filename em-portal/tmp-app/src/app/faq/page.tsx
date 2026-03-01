import { DocCard } from "@/components/doc-card";
import { getCollection } from "@/lib/content";

const faqGroups = [
  {
    label: "EMの基礎を理解する",
    sub: "最初に確認する質問",
    slugs: ["faq-1", "faq-11", "faq-12", "faq-13"],
  },
  {
    label: "観察とデータ記述",
    sub: "L2-L3 で使う",
    slugs: ["faq-3", "faq-9", "faq-14", "faq-16"],
  },
  {
    label: "分析と発表",
    sub: "L4-L6 で使う",
    slugs: ["faq-6", "faq-7", "faq-10", "faq-15"],
  },
  {
    label: "運用・AI活用",
    sub: "授業運営で迷ったとき",
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
        <p>つまずきやすい質問をステージ別に並べています。必要な塊だけ見れば次の行動を決めやすくなります。</p>
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
