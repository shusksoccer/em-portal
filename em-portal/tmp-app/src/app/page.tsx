import Link from "next/link";

export default function HomePage() {
  const startNow = [
    { href: "/intro", label: "前提を3分で確認", desc: "まずここだけ読めば開始できます。" },
    { href: "/curriculum/l1-what-is-em", label: "L1を始める", desc: "最初の授業でEMの見方をつかみます。" },
    { href: "/worksheets/ws-l1", label: "WS1を提出する", desc: "観察ログを1つ作って提出します。" },
    { href: "/curriculum", label: "次の授業を決める", desc: "L2以降の進行を確認します。" },
  ];

  const stuckHelp = [
    { href: "/faq", label: "詰まったとき: FAQ", desc: "まずここを見て30秒で再開。" },
    { href: "/glossary", label: "言葉が分からない: 用語", desc: "用語の意味を短く確認。" },
    { href: "/figures", label: "手順が分からない: 図解", desc: "流れを図で確認。" },
  ];

  return (
    <>
      <section className="card home-hero reveal">
        <span className="home-kicker">EM 探究ポータル</span>
        <h1>何をすればいいかが1分で分かる入口</h1>
        <p>
          迷ったらこのページだけ見てください。今やることは4つだけです。
          前提確認から始めて、最初の提出と次の授業決定まで進めます。
        </p>
        <div className="chip-row" style={{ marginTop: "0.8rem" }}>
          <Link href="/intro" className="chip-link">今すぐ始める</Link>
          <Link href="/curriculum" className="chip-link">全6コマを見る</Link>
        </div>
      </section>

      <section className="card reveal">
        <div className="timeline-head">
          <div>
            <p className="section-kicker">最短ルート</p>
            <h2>今やること（この順番）</h2>
          </div>
          <Link href="/intro">ステップ1へ</Link>
        </div>
        <div style={{ display: "grid", gap: "0.6rem", marginTop: "0.9rem" }}>
          {startNow.map((item, i) => (
            <Link key={item.href} href={item.href} className="step-card" style={{ textDecoration: "none", color: "inherit" }}>
              <span className="step-card-no">{i + 1}</span>
              <div className="step-card-body">
                <h3>{item.label}</h3>
                <p>{item.desc}</p>
              </div>
              <span style={{ color: "var(--accent)", fontSize: "1.2rem" }}>→</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="card reveal">
        <div className="timeline-head">
          <div>
            <p className="section-kicker">困ったとき</p>
            <h2>再開用リンク</h2>
          </div>
        </div>
        <div className="grid two home-links" aria-label="再開用リンク">
          {stuckHelp.map((item) => (
            <article key={item.href} className="card">
              <h3>
                <Link href={item.href}>{item.label}</Link>
              </h3>
              <p>{item.desc}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
