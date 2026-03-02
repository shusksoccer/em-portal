import Link from "next/link";

const practiceSteps = [
  {
    no: "1",
    stage: "観察する",
    tagline: "当たり前を外から見る",
    desc: "固定観念を脇に置き、日常の場面を事実として記録します",
    href: "/curriculum/l1-what-is-em",
    lessons: "L1–L2",
    color: "cycle-observe",
  },
  {
    no: "2",
    stage: "記述する",
    tagline: "見たことを言語化する",
    desc: "フィールドノートや転記で、判断を交えず事実だけを書き残します",
    href: "/curriculum/l3-how-to-describe",
    lessons: "L3",
    color: "cycle-describe",
  },
  {
    no: "3",
    stage: "分析する",
    tagline: "秩序の仕組みを取り出す",
    desc: "ターン・修復・隣接ペアなど、相互行為の規則性を見つけます",
    href: "/curriculum/l4-ca-entry",
    lessons: "L4–L5",
    color: "cycle-analyze",
  },
  {
    no: "4",
    stage: "発表する",
    tagline: "発見を他者に伝える",
    desc: "データを根拠に分析を示し、妥当性と限界を明示します",
    href: "/curriculum/l6-project",
    lessons: "L6",
    color: "cycle-present",
  },
];

const observationPrompt = {
  theme: "今日の観察テーマ：順番の受け渡し",
  prompt:
    "次に誰かと会話するとき、話す順番がどうやって交代しているか観察してみましょう。明示的なルールはないはずなのに、なぜスムーズに進むのでしょうか？",
  hint: "「沈黙」「目線」「声の下がり方」はどんな役割を担っていますか？",
  hrefLesson: "/curriculum/l4-ca-entry",
  hrefWS: "/worksheets/ws-l1",
};

const fieldKit = [
  { href: "/glossary", label: "用語集", desc: "概念を短く確認", badge: "語" },
  { href: "/faq", label: "FAQ", desc: "つまずきを即解消", badge: "Q" },
  { href: "/figures", label: "図解", desc: "手順を図で確認", badge: "図" },
  { href: "/library", label: "文献", desc: "理論を深く掘る", badge: "文" },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="card home-hero reveal">
        <span className="home-kicker">EM 探究ポータル</span>
        <h1>日常の中に、秩序を見る</h1>
        <p className="home-hero-lead">
          エスノメソドロジー（EM）は、私たちが「当たり前」としている社会的秩序を、
          <strong>観察・記述・分析・発表</strong>の実践を通じて解き明かす研究手法です。
          まず身近な場面を観察することから始めます。
        </p>
        <div className="chip-row" style={{ marginTop: "0.9rem" }}>
          <Link href="/intro" className="chip-link chip-link-primary">EMとは何か（3分）</Link>
          <Link href="/curriculum/l1-what-is-em" className="chip-link">最初の授業へ</Link>
          <Link href="/curriculum" className="chip-link">全授業を見る</Link>
        </div>
      </section>

      {/* Practice Cycle */}
      <section className="card reveal">
        <p className="section-kicker">探究サイクル</p>
        <h2>EMの実践は、4ステップを繰り返す</h2>
        <p className="meta" style={{ margin: "0.2rem 0 1.1rem" }}>
          繰り返すたびに観察の精度が上がり、日常に埋め込まれた秩序が見えてきます。
        </p>
        <div className="practice-cycle">
          {practiceSteps.map((step) => (
            <Link key={step.stage} href={step.href} className={`cycle-step ${step.color}`}>
              <div className="cycle-step-head">
                <span className="cycle-no">{step.no}</span>
                <span className="cycle-lessons">{step.lessons}</span>
              </div>
              <strong className="cycle-label">{step.stage}</strong>
              <span className="cycle-tagline">{step.tagline}</span>
              <p className="cycle-desc">{step.desc}</p>
            </Link>
          ))}
        </div>
        <p className="cycle-loop-note">↺ 発表後にふり返り、再び観察へ戻ります</p>
      </section>

      {/* Observation Invitation */}
      <section className="card observation-invite reveal">
        <p className="section-kicker observation-kicker">今日の観察課題</p>
        <h2>{observationPrompt.theme}</h2>
        <p className="observation-prompt">{observationPrompt.prompt}</p>
        <p className="observation-hint">ヒント：{observationPrompt.hint}</p>
        <div className="chip-row" style={{ marginTop: "0.8rem" }}>
          <Link href={observationPrompt.hrefLesson} className="chip-link">関連授業を見る</Link>
          <Link href={observationPrompt.hrefWS} className="chip-link">観察ログを書く</Link>
        </div>
      </section>

      {/* Field Kit */}
      <section className="card reveal">
        <p className="section-kicker">フィールドキット</p>
        <h2>迷ったときの参照ツール</h2>
        <p className="meta" style={{ margin: "0.2rem 0 0.9rem" }}>
          概念が曖昧なとき、手順が詰まったときに開いてください。
        </p>
        <div className="ref-tools-grid">
          {fieldKit.map((tool) => (
            <Link key={tool.href} href={tool.href} className="ref-tool-card">
              <span className="ref-tool-badge">{tool.badge}</span>
              <div className="ref-tool-body">
                <strong>{tool.label}</strong>
                <p>{tool.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
