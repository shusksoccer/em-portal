import Link from "next/link";
import { getCollection } from "@/lib/content";

const toolCards = [
  {
    badge: "語",
    href: "/glossary",
    label: "用語集",
    when: "概念の意味が分からないとき",
    desc: "アカウンタビリティ・インデクシカリティなど、授業で使うEM概念を短く確認できます。探究サイクルの段階ごとに整理されています。",
    kind: "ref-card-glossary",
  },
  {
    badge: "Q",
    href: "/faq",
    label: "FAQ",
    when: "詰まって先に進めないとき",
    desc: "観察・記述・分析・まとめのつまずきポイントを、探究サイクルの段階別に並べています。まず自分のステージの塊を開いてください。",
    kind: "ref-card-faq",
  },
  {
    badge: "図",
    href: "/figures",
    label: "図解ギャラリー",
    when: "手順や概念を目で確認したいとき",
    desc: "1図1主張のSVG図解。授業投影・配布資料のどちらでも使えます。観察ログ・転記テンプレート・ターン構造など。",
    kind: "ref-card-figures",
  },
  {
    badge: "文",
    href: "/library",
    label: "文献リスト",
    when: "理論を深く掘り下げたいとき",
    desc: "EMとCAの基本文献を学習段階別に整理しています。まずcoreから読み始め、必要に応じてsupplementを参照してください。",
    kind: "ref-card-library",
  },
  {
    badge: "人",
    href: "/people",
    label: "研究者紹介",
    when: "研究者の背景と貢献を知りたいとき",
    desc: "Garfinkel・Sacks・Schegloff・Jeffersonなど、EMとCAの主要人物を「覚える一言」つきで紹介しています。",
    kind: "ref-card-people",
  },
];

const cycleSections = [
  {
    step: "観察する",
    slug: "observe",
    color: "cycle-observe",
    links: [
      { href: "/glossary/observation",          label: "観察",        kind: "用語" },
      { href: "/glossary/background-expectancies", label: "背景期待",  kind: "用語" },
      { href: "/glossary/fieldnote",            label: "フィールドノート", kind: "用語" },
      { href: "/glossary/ethics",               label: "倫理",        kind: "用語" },
      { href: "/figures/fig-observation-log",   label: "観察ログ見本", kind: "図" },
      { href: "/figures/fig-ethics-checklist",  label: "倫理チェック", kind: "図" },
    ],
  },
  {
    step: "記述する",
    slug: "describe",
    color: "cycle-describe",
    links: [
      { href: "/glossary/description",          label: "記述",        kind: "用語" },
      { href: "/glossary/transcript",           label: "転記",        kind: "用語" },
      { href: "/glossary/data-session",         label: "データセッション", kind: "用語" },
      { href: "/figures/fig-transcript-template", label: "転記テンプレート", kind: "図" },
      { href: "/figures/fig-observe-describe-analyze", label: "3ステップ関係図", kind: "図" },
      { href: "/people/jefferson",              label: "Jefferson",   kind: "人物" },
    ],
  },
  {
    step: "分析する",
    slug: "analyze",
    color: "cycle-analyze",
    links: [
      { href: "/glossary/turn-taking",          label: "ターンテイキング", kind: "用語" },
      { href: "/glossary/adjacency-pair",       label: "隣接ペア",    kind: "用語" },
      { href: "/glossary/repair",               label: "修復",        kind: "用語" },
      { href: "/glossary/breaching",            label: "ブリーチング", kind: "用語" },
      { href: "/figures/fig-turn-structure",    label: "ターン構造",  kind: "図" },
      { href: "/figures/fig-breaching-safe",    label: "安全なブリーチング", kind: "図" },
      { href: "/people/sacks",                  label: "Sacks",       kind: "人物" },
    ],
  },
  {
    step: "まとめる",
    slug: "present",
    color: "cycle-present",
    links: [
      { href: "/glossary/validity",             label: "妥当性",      kind: "用語" },
      { href: "/glossary/presentation",         label: "発表",        kind: "用語" },
      { href: "/glossary/inference",            label: "推論",        kind: "用語" },
      { href: "/figures/fig-presentation-map",  label: "発表構成マップ", kind: "図" },
      { href: "/library",                       label: "文献：自力実践向け", kind: "文献" },
    ],
  },
];

export default function ReferencePage() {
  const glossaryCount = getCollection("glossary").length;
  const faqCount      = getCollection("faq").length;
  const figureCount   = getCollection("figures").length;
  const libraryCount  = getCollection("library").filter(
    (d) => String(d.content_track ?? "") !== "draft"
  ).length;
  const peopleCount   = getCollection("people").length;

  const counts: Record<string, number> = {
    "/glossary": glossaryCount,
    "/faq":      faqCount,
    "/figures":  figureCount,
    "/library":  libraryCount,
    "/people":   peopleCount,
  };

  return (
    <>
      {/* Hero */}
      <section className="card home-hero reveal">
        <p className="section-kicker">フィールドキット</p>
        <h1>参照・道具箱</h1>
        <p className="home-hero-lead">
          詰まったとき・深めたいとき、問いの種類に合わせて道具を選んでください。
          下の「サイクル別リンク」では、今いる探究ステージから直接ジャンプできます。
        </p>
      </section>

      {/* Tool Cards */}
      <section className="card reveal">
        <p className="section-kicker">道具を選ぶ</p>
        <h2>5つの参照ツール</h2>
        <div className="ref-hub-grid" style={{ marginTop: "0.9rem" }}>
          {toolCards.map((tool) => (
            <Link key={tool.href} href={tool.href} className={`ref-hub-card ${tool.kind}`}>
              <div className="ref-hub-card-head">
                <span className="ref-hub-badge">{tool.badge}</span>
                <div>
                  <strong className="ref-hub-label">{tool.label}</strong>
                  <span className="ref-hub-count">
                    {counts[tool.href] ? `${counts[tool.href]}件` : ""}
                  </span>
                </div>
              </div>
              <p className="ref-hub-when">こんなとき：{tool.when}</p>
              <p className="ref-hub-desc">{tool.desc}</p>
              <span className="ref-hub-arrow">→</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Cycle Quick Links */}
      <section className="card reveal">
        <p className="section-kicker">サイクル別クイックリンク</p>
        <h2>今いるステージから直接開く</h2>
        <p className="meta" style={{ margin: "0.2rem 0 1rem" }}>
          探究サイクルの段階ごとに、よく使う用語・図解・人物をまとめています。
        </p>
        <div className="ref-cycle-grid">
          {cycleSections.map((section) => (
            <div key={section.slug} className={`ref-cycle-section ref-cycle-${section.slug}`}>
              <h3 className="ref-cycle-step">{section.step}</h3>
              <ul className="ref-cycle-links">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href}>
                      <span className="ref-cycle-kind">{link.kind}</span>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Search shortcut */}
      <section className="card reveal" style={{ textAlign: "center", padding: "1.2rem" }}>
        <p className="meta">特定の語を探している場合</p>
        <Link href="/search" className="chip-link chip-link-primary" style={{ display: "inline-flex", marginTop: "0.4rem" }}>
          サイト内検索を開く
        </Link>
      </section>
    </>
  );
}
