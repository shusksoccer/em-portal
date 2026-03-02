import Link from "next/link";

const principles = [
  {
    no: "原則1",
    title: "データから出発する",
    body: "「こう感じた」「こう思った」ではなく、観察した事実（発話・行為・順序）を根拠にします。主張には必ずデータの箇所を対応づけます。",
  },
  {
    no: "原則2",
    title: "事実と評価を分ける",
    body: "「マナーが悪い」「不自然だ」という評価は記述ではありません。何が起きたかを、再現できる形で書きます。評価は分析フェーズで改めて問います。",
  },
  {
    no: "原則3",
    title: "倫理を先に確保する",
    body: "同意・匿名化・安全性は観察を始める前に確認します。特にブリーチング実験は、他者に不快感を与えない範囲で行います。",
  },
  {
    no: "原則4",
    title: "限界と別解を書く",
    body: "分析の結論を書いたら、その解釈の限界や別の読み方を1点以上示します。これがEMの妥当性を支えます。",
  },
];

export default function IntroPage() {
  return (
    <>
      {/* Hero */}
      <section className="card home-hero reveal">
        <p className="section-kicker">EMとは</p>
        <h1>社会の秩序は、どうやって作られているか</h1>
        <p className="home-hero-lead">
          エスノメソドロジー（EM）は、「当たり前」の中に問いを立てる研究です。
          会話が成立する、列に並ぶ、挨拶が返ってくる——なぜこれらはうまくいくのでしょうか。
          EMは「なぜ」より先に「<strong>どうやって</strong>」を問います。
        </p>
        <div className="chip-row" style={{ marginTop: "0.9rem" }}>
          <Link href="/curriculum/l1-what-is-em" className="chip-link chip-link-primary">L1で観察を始める</Link>
          <Link href="/glossary" className="chip-link">用語集を開く</Link>
        </div>
      </section>

      {/* EM の核心 */}
      <section className="card reveal">
        <p className="section-kicker">EMの核心</p>
        <h2>「当たり前」を外から見る</h2>
        <p>
          私たちは日常の中で無数の「暗黙のルール」に従っています。
          でも、それを意識することはほとんどありません。
          EMはその暗黙のルールを「<strong>背景期待</strong>」と呼び、
          それがどのように維持・更新されているかを観察・記述・分析します。
        </p>
        <div className="intro-example-row">
          <div className="intro-example-card">
            <p className="intro-example-label">気づく前</p>
            <p>「会話はふつう成立するもの」</p>
          </div>
          <span className="intro-example-arrow">→</span>
          <div className="intro-example-card intro-example-card-after">
            <p className="intro-example-label">EMの問い</p>
            <p>「どうやって話す順番が決まっているのか？」</p>
          </div>
        </div>
        <p className="meta" style={{ marginTop: "0.8rem" }}>
          この「どうやって」が、観察の出発点です。
        </p>
      </section>

      {/* 探究サイクル */}
      <section className="card reveal">
        <p className="section-kicker">探究の進め方</p>
        <h2>観察・記述・分析・発表を繰り返す</h2>
        <p style={{ marginBottom: "0.9rem" }}>
          EMは一度きりの手順ではありません。観察するたびに見方が深まり、
          記述するたびに事実の輪郭が鮮明になります。
        </p>
        <div className="intro-cycle-row">
          {[
            { step: "観察", desc: "フィールドで事実を記録" },
            { step: "記述", desc: "判断なしに言語化" },
            { step: "分析", desc: "規則性を取り出す" },
            { step: "発表", desc: "データで根拠を示す" },
          ].map((item, i, arr) => (
            <div key={item.step} className="intro-cycle-item">
              <span className="intro-cycle-step">{item.step}</span>
              <span className="intro-cycle-desc">{item.desc}</span>
              {i < arr.length - 1 && <span className="intro-cycle-sep">→</span>}
            </div>
          ))}
        </div>
        <p className="meta" style={{ marginTop: "0.6rem" }}>↺ 発表後はふり返り、再び観察へ戻ります</p>
      </section>

      {/* 実践の原則 */}
      <section className="card reveal">
        <p className="section-kicker">実践の原則</p>
        <h2>観察・記述・分析のときに守ること</h2>
        <div style={{ display: "grid", gap: "0.75rem", marginTop: "0.8rem" }}>
          {principles.map((p) => (
            <div key={p.no} className="intro-principle">
              <span className="intro-principle-no">{p.no}</span>
              <div>
                <strong className="intro-principle-title">{p.title}</strong>
                <p className="intro-principle-body">{p.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 次のアクション */}
      <section className="card reveal">
        <p className="section-kicker">次のステップ</p>
        <h2>さっそく観察を始めましょう</h2>
        <div className="grid two" style={{ marginTop: "0.8rem" }}>
          <Link href="/curriculum/l1-what-is-em" className="intro-action-card">
            <strong>L1：EMとは何か</strong>
            <p>最初の授業でEMの見方をつかみます</p>
            <span className="intro-action-arrow">→</span>
          </Link>
          <Link href="/worksheets/ws-l1" className="intro-action-card">
            <strong>WS1：観察ログ</strong>
            <p>今日の観察をその場で記録します</p>
            <span className="intro-action-arrow">→</span>
          </Link>
        </div>
        <div className="chip-row" style={{ marginTop: "0.9rem" }}>
          <Link href="/glossary/background-expectancies" className="chip-link">背景期待とは</Link>
          <Link href="/glossary/indexicality" className="chip-link">インデクシカリティとは</Link>
          <Link href="/people/garfinkel" className="chip-link">Garfinkelを知る</Link>
        </div>
      </section>
    </>
  );
}
