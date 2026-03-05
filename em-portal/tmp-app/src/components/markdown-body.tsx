import type { ReactNode } from "react";
import {
  CautionBlock,
  ConceptBlock,
  ExampleBlock,
  ExerciseBlock,
  TranscriptBlock,
} from "@/components/content-blocks";

type CustomBlockType = "concept" | "example" | "exercise" | "caution" | "transcript";

type ParsedSection =
  | { type: "line"; text: string }
  | { type: "custom-block"; blockType: CustomBlockType; title?: string; content: string };

function slugifyHeading(text: string): string {
  return text
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-ぁ-んァ-ン一-龠]/g, "")
    .toLowerCase();
}

function extractToc(body: string): { id: string; text: string }[] {
  return body
    .split("\n")
    .filter((line) => line.startsWith("## "))
    .map((line) => {
      const text = line.replace(/^##\s+/, "").trim();
      const id = slugifyHeading(text);
      return { id, text };
    })
    .filter((item) => item.id && item.text);
}

function getYoutubeId(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtu.be")) {
      return parsed.pathname.replace("/", "");
    }
    if (parsed.hostname.includes("youtube.com")) {
      return parsed.searchParams.get("v");
    }
  } catch {
    return null;
  }
  return null;
}

function getGoogleDriveFileId(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (!parsed.hostname.includes("drive.google.com")) return null;
    const match = parsed.pathname.match(/\/d\/([^/]+)/);
    return match?.[1] ?? null;
  } catch {
    return null;
  }
}

function parseCustomBlocks(lines: string[]): ParsedSection[] {
  const result: ParsedSection[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const match = line.match(/^:::(concept|example|exercise|caution|transcript)\s*(.*)?$/);
    if (!match) {
      result.push({ type: "line", text: line });
      i += 1;
      continue;
    }

    const blockType = match[1] as CustomBlockType;
    const title = match[2]?.trim() || undefined;
    const content: string[] = [];
    i += 1;
    while (i < lines.length && lines[i].trim() !== ":::") {
      content.push(lines[i]);
      i += 1;
    }
    if (i < lines.length && lines[i].trim() === ":::") {
      i += 1;
    }

    result.push({
      type: "custom-block",
      blockType,
      title,
      content: content.join("\n"),
    });
  }

  return result;
}

function renderInline(text: string): ReactNode {
  const regex = /(\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`)/g;
  const parts: ReactNode[] = [];
  let last = 0;
  let key = 0;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    if (match[2] !== undefined) parts.push(<strong key={key++}>{match[2]}</strong>);
    else if (match[3] !== undefined) parts.push(<em key={key++}>{match[3]}</em>);
    else if (match[4] !== undefined) parts.push(<code key={key++}>{match[4]}</code>);
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  if (parts.length === 0) return text;
  if (parts.length === 1 && typeof parts[0] === "string") return parts[0];
  return <>{parts}</>;
}

function renderBasicLines(content: string, keyPrefix: string): ReactNode[] {
  const lines = content.split("\n");
  const nodes: ReactNode[] = [];
  let listBuffer: ReactNode[] = [];
  let orderedListBuffer: ReactNode[] = [];
  let listKey = 0;

  const flushUnordered = () => {
    if (listBuffer.length) {
      nodes.push(
        <ul key={`${keyPrefix}-ul-${listKey++}`} className="prose-list">
          {listBuffer}
        </ul>,
      );
      listBuffer = [];
    }
  };

  const flushOrdered = () => {
    if (orderedListBuffer.length) {
      nodes.push(
        <ol key={`${keyPrefix}-ol-${listKey++}`} style={{ margin: "0.5rem 0 0.7rem 1.1rem", padding: 0 }}>
          {orderedListBuffer}
        </ol>,
      );
      orderedListBuffer = [];
    }
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (!trimmed) {
      flushUnordered();
      flushOrdered();
      nodes.push(<br key={`${keyPrefix}-br-${index}`} />);
      return;
    }

    if (trimmed.startsWith("- ")) {
      flushOrdered();
      listBuffer.push(<li key={`${keyPrefix}-li-${index}`}>{renderInline(trimmed.slice(2))}</li>);
      return;
    }

    const orderedMatch = trimmed.match(/^\d+\.\s+(.+)$/);
    if (orderedMatch) {
      flushUnordered();
      orderedListBuffer.push(<li key={`${keyPrefix}-oli-${index}`}>{renderInline(orderedMatch[1])}</li>);
      return;
    }

    flushUnordered();
    flushOrdered();
    nodes.push(<p key={`${keyPrefix}-p-${index}`}>{renderInline(trimmed)}</p>);
  });

  flushUnordered();
  flushOrdered();
  return nodes;
}

function renderCustomBlock(section: Extract<ParsedSection, { type: "custom-block" }>, index: number): ReactNode {
  const key = `cb-${section.blockType}-${index}`;
  const bodyNodes = renderBasicLines(section.content, key);

  if (section.blockType === "concept") {
    return <ConceptBlock key={key} title={section.title}>{bodyNodes}</ConceptBlock>;
  }
  if (section.blockType === "example") {
    return <ExampleBlock key={key} title={section.title}>{bodyNodes}</ExampleBlock>;
  }
  if (section.blockType === "exercise") {
    return <ExerciseBlock key={key} title={section.title}>{bodyNodes}</ExerciseBlock>;
  }
  if (section.blockType === "caution") {
    return <CautionBlock key={key}>{bodyNodes}</CautionBlock>;
  }

  const transcriptLines: { no: number; text: string }[] = [];
  const annotationLines: string[] = [];
  let inAnnotation = false;
  section.content.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) return;
    if (trimmed === "---") {
      inAnnotation = true;
      return;
    }
    if (inAnnotation) {
      annotationLines.push(trimmed);
      return;
    }
    const match = trimmed.match(/^(\d+)\s*[:：]\s*(.+)$/);
    if (match) {
      transcriptLines.push({ no: Number(match[1]), text: match[2] });
    }
  });

  if (!transcriptLines.length) {
    return <TranscriptBlock key={key} lines={[]} annotation={section.content} label={section.title || "会話転写"} />;
  }

  return (
    <TranscriptBlock
      key={key}
      lines={transcriptLines}
      annotation={annotationLines.join(" ")}
      label={section.title || "会話転写"}
    />
  );
}

function renderLine(line: string, index: number): ReactNode {
  const trimmed = line.trim();
  if (!trimmed) return <br key={`br-${index}`} />;

  if (trimmed.startsWith("### ")) return <h3 key={index}>{renderInline(trimmed.slice(4))}</h3>;
  if (trimmed.startsWith("## ")) {
    const text = trimmed.slice(3).trim();
    return <h2 key={index} id={slugifyHeading(text)}>{renderInline(text)}</h2>;
  }
  if (trimmed.startsWith("# ")) return <h1 key={index}>{renderInline(trimmed.slice(2))}</h1>;

  const ytId = getYoutubeId(trimmed);
  if (ytId) {
    return (
      <div key={index} className="embed">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${ytId}`}
          loading="lazy"
          title="YouTube video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    );
  }

  const driveId = getGoogleDriveFileId(trimmed);
  if (driveId) {
    return (
      <p key={index} className="link-row">
        <a href={`https://drive.google.com/file/d/${driveId}/view`} target="_blank" rel="noreferrer">
          Google Driveで開く
        </a>
      </p>
    );
  }

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return (
      <p key={index} className="link-row">
        <a href={trimmed} target="_blank" rel="noreferrer">
          {trimmed}
        </a>
      </p>
    );
  }

  if (/^\d+\)\s+/.test(trimmed)) {
    return <p key={index} className="step-line">{renderInline(trimmed)}</p>;
  }

  if (trimmed.includes(":") && trimmed.length < 56) {
    const [head, ...rest] = trimmed.split(":");
    if (rest.length > 0) {
      return (
        <p key={index}>
          <strong>{head}:</strong>
          {renderInline(rest.join(":"))}
        </p>
      );
    }
  }

  return <p key={index}>{renderInline(trimmed)}</p>;
}

export function MarkdownBody({ body }: { body: string }) {
  const toc = extractToc(body);
  const lines = body.split("\n");
  const sections = parseCustomBlocks(lines);
  const nodes: ReactNode[] = [];
  let listBuffer: ReactNode[] = [];
  let listKey = 0;

  const flushList = () => {
    if (listBuffer.length) {
      nodes.push(
        <ul key={`ul-${listKey++}`} className="prose-list">
          {listBuffer}
        </ul>,
      );
      listBuffer = [];
    }
  };

  sections.forEach((section, index) => {
    if (section.type === "custom-block") {
      flushList();
      nodes.push(renderCustomBlock(section, index));
      return;
    }

    const trimmed = section.text.trim();
    if (trimmed.startsWith("- ")) {
      listBuffer.push(<li key={`li-${index}`}>{renderInline(trimmed.slice(2))}</li>);
      return;
    }

    flushList();
    nodes.push(renderLine(section.text, index));
  });
  flushList();

  return (
    <div className="prose">
      {toc.length >= 2 ? (
        <nav aria-label="このページの目次" style={{ marginBottom: "1.2rem" }}>
          <p className="meta" style={{ marginBottom: "0.4rem" }}>目次</p>
          <ol style={{ margin: 0, paddingLeft: "1.2rem", fontSize: "0.9rem", lineHeight: 1.8 }}>
            {toc.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`} style={{ color: "var(--accent)" }}>{item.text}</a>
              </li>
            ))}
          </ol>
        </nav>
      ) : null}
      {nodes}
    </div>
  );
}
