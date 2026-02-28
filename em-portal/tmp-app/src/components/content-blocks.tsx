import type { ReactNode } from "react";

type BlockProps = { children: ReactNode; className?: string };

export function ConceptBlock({ children, title }: { children: ReactNode; title?: string }) {
  return (
    <div className="concept-block">
      <span className="concept-block-label">概念</span>
      {title ? <h3>{title}</h3> : null}
      {children}
    </div>
  );
}

export function ExampleBlock({ children, title }: { children: ReactNode; title?: string }) {
  return (
    <div className="example-block">
      <span className="example-block-label">具体例</span>
      {title ? <p style={{ fontWeight: 600, margin: "0 0 0.4rem" }}>{title}</p> : null}
      {children}
    </div>
  );
}

export function TranscriptBlock({
  lines,
  annotation,
  label = "会話転写",
}: {
  lines: { no: number; text: string }[];
  annotation?: string;
  label?: string;
}) {
  return (
    <div className="transcript-block">
      <span className="transcript-block-label">{label}</span>
      {lines.map((line) => (
        <div key={line.no} className="transcript-line">
          <span className="transcript-line-no">{line.no}</span>
          <span>{line.text}</span>
        </div>
      ))}
      {annotation ? <div className="transcript-annotation">{annotation}</div> : null}
    </div>
  );
}

export function ExerciseBlock({ children, title }: { children: ReactNode; title?: string }) {
  return (
    <div className="exercise-block">
      <span className="exercise-block-label">やること</span>
      {title ? <p style={{ fontWeight: 600, margin: "0 0 0.4rem", color: "#1a3070" }}>{title}</p> : null}
      {children}
    </div>
  );
}

export function CautionBlock({ children }: BlockProps) {
  return (
    <div className="caution-block">
      <span className="caution-block-label">よくある誤り</span>
      {children}
    </div>
  );
}

export function CheckpointBlock({ items }: { items: string[] }) {
  return (
    <div className="checkpoint-block">
      <span className="checkpoint-block-label">この授業の到達目標</span>
      <ul className="checkpoint-list">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
