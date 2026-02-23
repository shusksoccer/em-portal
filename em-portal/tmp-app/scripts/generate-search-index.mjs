import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CONTENT_ROOT = path.join(ROOT, "content");
const OUT_PATH = path.join(ROOT, "public", "search-index.json");
const COLLECTIONS = ["lessons", "worksheets", "glossary", "figures", "library", "people", "faq"];
const STATUS_VALUES = new Set(["inbox", "reviewed", "published"]);
const UTF8_BOM = "\uFEFF";

function stripBom(text) {
  return text.startsWith(UTF8_BOM) ? text.slice(1) : text;
}

function parseScalarValue(raw) {
  const value = raw.trim();
  if (!value) return "";
  if (value.startsWith("[") || value.startsWith("{")) return JSON.parse(value);
  if (value === "true") return true;
  if (value === "false") return false;
  if (!Number.isNaN(Number(value)) && value !== "") return Number(value);
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1);
  }
  return value;
}

function parseFrontmatter(file) {
  const normalized = stripBom(file);
  if (!normalized.startsWith("---\n")) return { data: {}, body: normalized };
  const second = normalized.indexOf("\n---\n", 4);
  if (second === -1) return { data: {}, body: normalized };
  const fmRaw = normalized.slice(4, second).trim();
  const body = normalized.slice(second + 5).trim();
  const data = {};
  for (const line of fmRaw.split("\n")) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    const rawValue = line.slice(idx + 1);
    data[key] = parseScalarValue(rawValue);
  }
  return { data, body };
}

const rows = [];
for (const kind of COLLECTIONS) {
  const dir = path.join(CONTENT_ROOT, kind);
  if (!fs.existsSync(dir)) continue;
  const files = fs.readdirSync(dir).filter((name) => name.endsWith(".md"));
  for (const fileName of files) {
    const fullPath = path.join(dir, fileName);
    const raw = fs.readFileSync(fullPath, "utf-8");
    const { data, body } = parseFrontmatter(raw);
    rows.push({
      status: STATUS_VALUES.has(String(data.status ?? "").toLowerCase())
        ? String(data.status).toLowerCase()
        : "unknown",
      kind,
      slug: String(data.slug ?? fileName.replace(/\.md$/, "")),
      title: String(data.title ?? data.term ?? fileName),
      tags: Array.isArray(data.tags) ? data.tags : [],
      text: body.replace(/\s+/g, " ").trim(),
    });
  }
}

fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
fs.writeFileSync(OUT_PATH, JSON.stringify(rows, null, 2), "utf-8");
console.log(`Generated ${rows.length} search rows -> ${OUT_PATH}`);
