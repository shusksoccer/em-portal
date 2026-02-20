import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

export type MaterialMeta = {
  slug: string;
  title: string;
};

function contentDir() {
  const fromEnv = process.env.CONTENT_DIR?.trim();
  if (fromEnv) {
    return path.isAbsolute(fromEnv)
      ? fromEnv
      : path.resolve(process.cwd(), fromEnv);
  }
  return path.join(process.cwd(), "..", "content");
}

export function listSlugs(): string[] {
  const dir = contentDir();
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

export function listMaterials(): MaterialMeta[] {
  const slugs = listSlugs();
  const dir = contentDir();

  const items = slugs.map((slug) => {
    const raw = fs.readFileSync(path.join(dir, `${slug}.md`), "utf8");
    const { data } = matter(raw);
    const title =
      typeof data?.title === "string" && data.title.trim()
        ? data.title.trim()
        : slug;
    return { slug, title };
  });

  items.sort((a, b) => a.slug.localeCompare(b.slug, "ja"));
  return items;
}

export async function getMaterialHtml(slug: string) {
  const dir = contentDir();
  const raw = fs.readFileSync(path.join(dir, `${slug}.md`), "utf8");
  const { data, content } = matter(raw);

  const processed = await remark().use(html).process(content);
  const contentHtml = processed.toString();

  const title =
    typeof data?.title === "string" && data.title.trim()
      ? data.title.trim()
      : slug;

  return { title, contentHtml };
}
