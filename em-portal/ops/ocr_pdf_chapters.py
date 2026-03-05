import argparse
import json
import re
import time
from pathlib import Path

from pdf2image import convert_from_path
import pytesseract


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


def find_poppler_path() -> Path | None:
    candidates = [
        Path(r"C:\Program Files\poppler-25.07.0\Library\bin"),
        Path(r"C:\Program Files\poppler-24.08.0\Library\bin"),
        Path(r"C:\Program Files\poppler-23.11.0\Library\bin"),
    ]
    for c in candidates:
        if (c / "pdftoppm.exe").exists():
            return c
    win_get = Path.home() / "AppData/Local/Microsoft/WinGet/Packages"
    if win_get.exists():
        for p in win_get.glob("**/pdftoppm.exe"):
            return p.parent
    return None


def read_note_source_file(note_path: Path) -> str | None:
    text = note_path.read_text(encoding="utf-8")
    m = re.search(r'^source_file:\s*"(.*)"\s*$', text, flags=re.MULTILINE)
    return m.group(1) if m else None


def update_frontmatter(text: str, key: str, value: str) -> str:
    pattern = rf'^{re.escape(key)}:\s*.*$'
    if re.search(pattern, text, flags=re.MULTILINE):
        return re.sub(pattern, f'{key}: "{value}"', text, flags=re.MULTILINE)
    return text


def update_frontmatter_number(text: str, key: str, value: int) -> str:
    pattern = rf'^{re.escape(key)}:\s*.*$'
    if re.search(pattern, text, flags=re.MULTILINE):
        return re.sub(pattern, f"{key}: {value}", text, flags=re.MULTILINE)
    return text


def update_frontmatter_bool(text: str, key: str, value: bool) -> str:
    pattern = rf'^{re.escape(key)}:\s*.*$'
    val = "true" if value else "false"
    if re.search(pattern, text, flags=re.MULTILINE):
        return re.sub(pattern, f"{key}: {val}", text, flags=re.MULTILINE)
    return text


def replace_or_append_section(text: str, heading: str, body: str) -> str:
    pattern = rf"^## {re.escape(heading)}\n(?:.*?\n)(?=^## |\Z)"
    if re.search(pattern, text, flags=re.MULTILINE | re.DOTALL):
        return re.sub(
            pattern,
            lambda _: f"## {heading}\n{body}\n",
            text,
            flags=re.MULTILINE | re.DOTALL,
        )
    return text.rstrip() + f"\n\n## {heading}\n{body}\n"


def run_ocr(pdf_path: Path, pages: int | None, poppler_path: Path | None, lang: str, dpi: int) -> str:
    images = convert_from_path(
        str(pdf_path),
        dpi=dpi,
        first_page=1,
        last_page=pages,
        poppler_path=str(poppler_path) if poppler_path else None,
    )
    chunks = []
    for img in images:
        chunks.append(pytesseract.image_to_string(img, lang=lang))
    return "\n".join(chunks).strip()


def main() -> int:
    parser = argparse.ArgumentParser(description="OCR chapter PDFs and update Obsidian notes.")
    parser.add_argument("--portal-root", default=".", help="Path to em-portal root")
    parser.add_argument("--pdf-dir", default="", help="Directory with chapter PDFs")
    parser.add_argument("--pages", type=int, default=2, help="Number of pages to OCR per PDF (0 = all pages)")
    parser.add_argument("--max-chars", type=int, default=1500, help="Max chars to store in note")
    parser.add_argument("--lang", default="jpn+eng", help="Tesseract language code")
    parser.add_argument("--tesseract-path", default="", help="Path to tesseract.exe")
    parser.add_argument("--poppler-path", default="", help="Path to poppler bin (pdftoppm.exe)")
    parser.add_argument("--dpi", type=int, default=200, help="DPI for OCR (lower = faster, higher = clearer)")
    parser.add_argument("--sleep", type=float, default=0.0, help="Sleep seconds between PDFs")
    parser.add_argument("--start", type=int, default=1, help="Start index (1-based) of PDFs to process")
    parser.add_argument("--end", type=int, default=0, help="End index (1-based) of PDFs to process, 0 = last")
    parser.add_argument("--match", default="", help="Regex to filter PDF filenames")
    parser.add_argument("--resume", action="store_true", help="Skip if OCR full file already exists")
    parser.add_argument("--store-full", action="store_true", help="Store full OCR text in _ai/scratch/ocr_full")
    parser.add_argument("--continue-on-error", action="store_true", help="Continue even if one PDF fails")
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

    tesseract_path = Path(args.tesseract_path) if args.tesseract_path else None
    if tesseract_path and tesseract_path.exists():
        pytesseract.pytesseract.tesseract_cmd = str(tesseract_path)

    if args.poppler_path:
        poppler_path = Path(args.poppler_path)
    else:
        poppler_path = find_poppler_path()

    library_dir = obsidian_content / "library"
    note_map = {}
    for note in library_dir.glob("*.md"):
        src = read_note_source_file(note)
        if src:
            note_map[src] = note

    scratch_dir = obsidian_content.parent / "_ai" / "scratch" / "ocr"
    scratch_dir.mkdir(parents=True, exist_ok=True)
    full_dir = obsidian_content.parent / "_ai" / "scratch" / "ocr_full"
    if args.store_full:
        full_dir.mkdir(parents=True, exist_ok=True)
    log_path = obsidian_content.parent / "_ai" / "scratch" / "ocr_log.txt"

    pdf_files = sorted(pdf_dir.glob("*.pdf"))
    if args.match:
        pattern = re.compile(args.match)
        pdf_files = [p for p in pdf_files if pattern.search(p.name)]
    if not pdf_files:
        print(f"No PDFs found in {pdf_dir}")
        return 1

    start = max(args.start, 1)
    end = args.end if args.end > 0 else len(pdf_files)
    if start > end or start > len(pdf_files):
        print("Invalid range. Check --start/--end.")
        return 1

    for idx, pdf_path in enumerate(pdf_files, start=1):
        if idx < start or idx > end:
            continue
        note_path = note_map.get(pdf_path.name)
        if not note_path:
            print(f"[Skip] Note not found for {pdf_path.name}")
            continue

        full_path = full_dir / f"{note_path.stem}.txt"
        if args.resume and args.store_full and full_path.exists():
            print(f"[Skip] Already OCRed {pdf_path.name}")
            continue

        try:
            pages = None if args.pages == 0 else args.pages
            text = run_ocr(pdf_path, pages, poppler_path, args.lang, args.dpi)
            if not text:
                print(f"[Warn] OCR empty for {pdf_path.name}")
                continue

            cleaned = text.replace("\r", "").replace("\t", " ").strip()
            cleaned = re.sub(r"\n{3,}", "\n\n", cleaned)
            excerpt = cleaned[: args.max_chars].rstrip()

            scratch_path = scratch_dir / f"{note_path.stem}.txt"
            scratch_path.write_text(excerpt, encoding="utf-8")
            if args.store_full:
                full_path.write_text(cleaned, encoding="utf-8")

            note_text = note_path.read_text(encoding="utf-8")
            note_text = update_frontmatter_bool(note_text, "needs_ocr", False)
            note_text = update_frontmatter_number(note_text, "extracted_chars", len(excerpt))
            note_text = replace_or_append_section(
                note_text,
                "OCR抜粋",
                f"（先頭{('全ページ' if args.pages == 0 else str(args.pages))}からの抜粋・最大{args.max_chars}文字）\n\n{excerpt}",
            )
            if args.store_full:
                note_text = replace_or_append_section(
                    note_text,
                    "OCR全文ファイル",
                    f"- {full_path}",
                )
            note_path.write_text(note_text, encoding="utf-8")
            log_path.write_text(f"[OK] {pdf_path.name}\n", encoding="utf-8", errors="ignore") if not log_path.exists() else log_path.write_text(log_path.read_text(encoding="utf-8", errors="ignore") + f"[OK] {pdf_path.name}\n", encoding="utf-8", errors="ignore")
            print(f"[OK] {pdf_path.name} -> {note_path.name}")
        except Exception as exc:
            log_path.write_text(f"[ERR] {pdf_path.name} {exc}\n", encoding="utf-8", errors="ignore") if not log_path.exists() else log_path.write_text(log_path.read_text(encoding="utf-8", errors="ignore") + f"[ERR] {pdf_path.name} {exc}\n", encoding="utf-8", errors="ignore")
            print(f"[ERR] {pdf_path.name} {exc}")
            if not args.continue_on_error:
                raise

        if args.sleep > 0:
            time.sleep(args.sleep)

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
