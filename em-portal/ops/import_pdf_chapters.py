import argparse
import datetime as dt
import json
import re
from pathlib import Path

from pypdf import PdfReader


def load_config(portal_root: Path) -> dict:
    config_path = portal_root / "portal.config.json"
    if not config_path.exists():
        raise FileNotFoundError(f"portal.config.json not found: {config_path}")
    return json.loads(config_path.read_text(encoding="utf-8"))


def resolve_path(base: Path, value: str | None) -> Path | None:
    if not value:
        return None
    p = Path(value)
    return p if p.is_absolute() else (base / p).resolve()


def to_halfwidth_digits(text: str) -> str:
    trans = str.maketrans("０１２３４５６７８９", "0123456789")
    return text.translate(trans)


def parse_filename(name: str) -> dict:
    stem = Path(name).stem
    parts = stem.split("_", 2)
    info = {
        "raw_title": stem,
        "prefix_no": None,
        "book_title": None,
        "chapter_title": None,
        "page_range": None,
    }

    if len(parts) >= 2 and parts[0].isdigit():
        info["prefix_no"] = int(parts[0])
        info["book_title"] = parts[1]
        rest = parts[2] if len(parts) == 3 else ""
        rest = to_halfwidth_digits(rest)
        m = re.search(r"(.*?)(\d{1,4}-\d{1,4})$", rest)
        if m:
            info["chapter_title"] = m.group(1)
            info["page_range"] = m.group(2)
        else:
            info["chapter_title"] = rest
    else:
        info["chapter_title"] = stem

    if info["chapter_title"]:
        info["chapter_title"] = info["chapter_title"].strip()

    return info


def build_slug(prefix_no: int | None, chapter_title: str | None) -> str:
    if prefix_no is not None:
        return f"em-ch{prefix_no:02d}"
    if chapter_title:
        ascii_only = re.sub(r"[^a-z0-9]+", "-", chapter_title.lower()).strip("-")
        if ascii_only:
            return ascii_only
    return dt.datetime.now().strftime("%Y%m%d-%H%M%S")


def ensure_unique(path: Path) -> Path:
    if not path.exists():
        return path
    stem = path.stem
    for i in range(2, 100):
        candidate = path.with_name(f"{stem}-v{i}{path.suffix}")
        if not candidate.exists():
            return candidate
    return path


def extract_text_metrics(pdf_path: Path, max_pages: int = 2) -> dict:
    reader = PdfReader(str(pdf_path))
    page_count = len(reader.pages)
    text = ""
    for idx in range(min(max_pages, page_count)):
        try:
            text += reader.pages[idx].extract_text() or ""
        except Exception:
            pass
    text = text.strip()
    return {
        "page_count": page_count,
        "extract_chars": len(text),
    }


def render_markdown(meta: dict) -> str:
    updated_at = dt.datetime.now().strftime("%Y-%m-%d")
    title = meta["title"]
    slug = meta["slug"]
    tags = ["ai-collect", "inbox", "book"]
    tags_json = json.dumps(tags, ensure_ascii=False)
    sources_json = "[]"

    lines = [
        "---",
        f"slug: \"{slug}\"",
        f"title: \"{title}\"",
        f"tags: {tags_json}",
        f"sources: {sources_json}",
        "status: \"inbox\"",
        "source_url: \"\"",
        f"updated_at: \"{updated_at}\"",
        "ai_summary: \"\"",
        "ai_confidence: \"low\"",
        f"book_title: \"{meta['book_title']}\"",
        f"chapter_no: \"{meta['chapter_no']}\"",
        f"page_range: \"{meta['page_range']}\"",
        f"source_file: \"{meta['source_file']}\"",
        f"needs_ocr: {str(meta['needs_ocr']).lower()}",
        f"extracted_chars: {meta['extracted_chars']}",
        f"page_count: {meta['page_count']}",
        "---",
        "",
        f"# {title}",
        "",
        "## 0. 目的",
        "- この章の要点を授業向けに整理する。",
        "",
        "## 1. 要約（100-200字）",
        "- ",
        "",
        "## 2. 重要ポイント（箇条書き）",
        "- ",
        "",
        "## 3. 用語候補（glossary）",
        "- ",
        "",
        "## 4. 授業/FAQ化のヒント",
        "- ",
        "",
        "## 5. OCR/抽出メモ",
        f"- 抽出文字数（先頭数ページ）: {meta['extracted_chars']}",
        f"- OCRが必要: {'はい' if meta['needs_ocr'] else 'いいえ'}",
        "- ※著作権保護のため、全文はこのノートに保存しない。",
        "",
    ]
    return "\n".join(lines)


def main() -> int:
    parser = argparse.ArgumentParser(description="Import chapter PDFs into Obsidian library notes.")
    parser.add_argument("--portal-root", default=".", help="Path to em-portal root")
    parser.add_argument("--pdf-dir", default="", help="Directory with chapter PDFs")
    parser.add_argument("--dry-run", action="store_true", help="Do not write files")
    args = parser.parse_args()

    portal_root = Path(args.portal_root).resolve()
    config = load_config(portal_root)
    obsidian_content = resolve_path(portal_root, config["obsidian"]["contentSourceDir"])
    if not obsidian_content or not obsidian_content.exists():
        raise FileNotFoundError("Obsidian contentSourceDir not found. Check portal.config.json.")

    default_pdf_dir = obsidian_content / "_sources"
    fallback_pdf_dir = portal_root / "tmp-app" / "content" / "_sources"
    pdf_dir = Path(args.pdf_dir).resolve() if args.pdf_dir else default_pdf_dir
    if not pdf_dir.exists() or not list(pdf_dir.glob("*.pdf")):
        pdf_dir = fallback_pdf_dir

    library_dir = obsidian_content / "library"
    library_dir.mkdir(parents=True, exist_ok=True)

    pdf_files = sorted(pdf_dir.glob("*.pdf"))
    if not pdf_files:
        print(f"No PDFs found in {pdf_dir}")
        return 1

    for pdf_path in pdf_files:
        info = parse_filename(pdf_path.name)
        title_parts = []
        if info["chapter_title"]:
            title_parts.append(info["chapter_title"])
        title = "".join(title_parts) if title_parts else info["raw_title"]
        title = title.strip() or info["raw_title"]

        metrics = extract_text_metrics(pdf_path)
        needs_ocr = metrics["extract_chars"] < 200

        slug = build_slug(info["prefix_no"], info["chapter_title"])
        out_path = ensure_unique(library_dir / f"{slug}.md")

        meta = {
            "title": title,
            "slug": out_path.stem,
            "book_title": info["book_title"] or "エスノメソドロジー",
            "chapter_no": info["prefix_no"] if info["prefix_no"] is not None else "",
            "page_range": info["page_range"] or "",
            "source_file": pdf_path.name,
            "needs_ocr": needs_ocr,
            "extracted_chars": metrics["extract_chars"],
            "page_count": metrics["page_count"],
        }

        md = render_markdown(meta)
        print(f"[Plan] {pdf_path.name} -> {out_path}")
        if not args.dry_run:
            out_path.write_text(md, encoding="utf-8")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
