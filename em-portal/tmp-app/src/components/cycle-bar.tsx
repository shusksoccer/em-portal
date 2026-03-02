import Link from "next/link";

export type CycleStep = "observe" | "describe" | "analyze" | "present";

const CYCLE_STEPS: { step: CycleStep; label: string; href: string }[] = [
  { step: "observe",  label: "観察する", href: "/curriculum/l1-what-is-em" },
  { step: "describe", label: "記述する", href: "/curriculum/l3-how-to-describe" },
  { step: "analyze",  label: "分析する", href: "/curriculum/l4-ca-entry" },
  { step: "present",  label: "まとめる", href: "/curriculum/l6-project" },
];

const STEP_INDEX: Record<CycleStep, number> = {
  observe: 0,
  describe: 1,
  analyze: 2,
  present: 3,
};

export function CycleBar({ current }: { current: CycleStep }) {
  const currentIdx = STEP_INDEX[current];

  return (
    <nav className="cycle-bar" aria-label="探究サイクル（現在地）">
      {CYCLE_STEPS.map((s, i) => {
        const state =
          i < currentIdx ? "done" : i === currentIdx ? "current" : "upcoming";
        return (
          <span key={s.step} style={{ display: "contents" }}>
            <Link
              href={s.href}
              className={`cycle-bar-step cycle-bar-step--${state}`}
              aria-current={state === "current" ? "step" : undefined}
            >
              <span className="cycle-bar-dot" aria-hidden />
              <span className="cycle-bar-label">{s.label}</span>
            </Link>
            {i < CYCLE_STEPS.length - 1 && (
              <span
                className={`cycle-bar-connector${i < currentIdx ? " cycle-bar-connector--done" : ""}`}
                aria-hidden
              />
            )}
          </span>
        );
      })}
      <span className="cycle-bar-now" aria-hidden>今ここ ↑</span>
    </nav>
  );
}
