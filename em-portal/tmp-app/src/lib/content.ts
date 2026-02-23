import fs from "node:fs";
import path from "node:path";

export type ContentKind =
  | "lessons"
  | "worksheets"
  | "glossary"
  | "figures"
  | "library"
  | "people"
  | "faq";

export type SourceItem = {
  id: string;
  title: string;
  author: string;
  year: number;
  url: string;
  type: string;
  key_points: string[];
  reliability: "高" | "中" | "低";
};

export type ContentDoc = {
  kind: ContentKind;
  slug: string;
  title: string;
  tags: string[];
  sources: string[];
  body: string;
  [key: string]: unknown;
};

const CONTENT_ROOT = path.join(process.cwd(), "content");
const SOURCES_PATH = path.join(CONTENT_ROOT, "_sources", "sources.yml");
const UTF8_BOM = "\uFEFF";

function stripBom(text: string): string {
  return text.startsWith(UTF8_BOM) ? text.slice(1) : text;
}

function parseScalarValue(raw: string): unknown {
  const value = raw.trim();
  if (!value) return "";
  if (value.startsWith("[") || value.startsWith("{")) {
    return JSON.parse(value);
  }
  if (value === "true") return true;
  if (value === "false") return false;
  if (!Number.isNaN(Number(value)) && value !== "") return Number(value);
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }
  return value;
}

function parseFrontmatter(file: string): { data: Record<string, unknown>; body: string } {
  const normalized = stripBom(file);
  if (!normalized.startsWith("---\n")) {
    return { data: {}, body: normalized };
  }
  const second = normalized.indexOf("\n---\n", 4);
  if (second === -1) {
    return { data: {}, body: normalized };
  }
  const fmRaw = normalized.slice(4, second).trim();
  const body = normalized.slice(second + 5).trim();
  const data: Record<string, unknown> = {};
  for (const line of fmRaw.split("\n")) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    const rawValue = line.slice(idx + 1);
    data[key] = parseScalarValue(rawValue);
  }
  return { data, body };
}

export function getCollection(kind: ContentKind): ContentDoc[] {
  const dir = path.join(CONTENT_ROOT, kind);
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const docs = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .map((entry) => {
      const fullPath = path.join(dir, entry.name);
      const raw = fs.readFileSync(fullPath, "utf-8");
      const { data, body } = parseFrontmatter(raw);
      const slug = String(data.slug ?? entry.name.replace(/\.md$/, ""));
      const title = String(data.title ?? data.term ?? slug);
      const tags = Array.isArray(data.tags) ? (data.tags as string[]) : [];
      const sources = Array.isArray(data.sources) ? (data.sources as string[]) : [];
      return {
        ...data,
        kind,
        slug,
        title,
        tags,
        sources,
        body,
      } as ContentDoc;
    });
  if (kind === "lessons") {
    docs.sort((a, b) => Number(a.lesson_no ?? 0) - Number(b.lesson_no ?? 0));
  } else {
    docs.sort((a, b) => a.title.localeCompare(b.title, "ja"));
  }
  return docs;
}

export function getDocBySlug(kind: ContentKind, slug: string): ContentDoc | undefined {
  return getCollection(kind).find((item) => item.slug === slug);
}

export function getAllDocs(): ContentDoc[] {
  return [
    ...getCollection("lessons"),
    ...getCollection("worksheets"),
    ...getCollection("glossary"),
    ...getCollection("figures"),
    ...getCollection("library"),
    ...getCollection("people"),
    ...getCollection("faq"),
  ];
}

export function getTagMap(): Record<string, number> {
  const map: Record<string, number> = {};
  for (const doc of getAllDocs()) {
    for (const tag of doc.tags) {
      map[tag] = (map[tag] ?? 0) + 1;
    }
  }
  return Object.fromEntries(
    Object.entries(map).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "ja")),
  );
}

export function getDocsByTag(tag: string): ContentDoc[] {
  return getAllDocs().filter((doc) => doc.tags.includes(tag));
}

export function getSources(): SourceItem[] {
  const raw = fs.readFileSync(SOURCES_PATH, "utf-8");
  return JSON.parse(stripBom(raw)) as SourceItem[];
}

export function getSourcesByIds(ids: string[]): SourceItem[] {
  const sourceMap = new Map(getSources().map((item) => [item.id, item]));
  return ids.map((id) => sourceMap.get(id)).filter((item): item is SourceItem => Boolean(item));
}

