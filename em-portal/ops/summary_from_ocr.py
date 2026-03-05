import argparse
import json
import math
import re
from pathlib import Path


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


def read_note_source_file(note_path: Path) -> str | None:
    text = note_path.read_text(encoding="utf-8")
    m = re.search(r'^source_file:\s*"(.*)"\s*$', text, flags=re.MULTILINE)
    return m.group(1) if m else None


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


def clean_text(raw: str) -> str:
    text = raw.replace("\r", "").replace("\t", " ")
    text = re.sub(r"\n{3,}", "\n\n", text)
    text = re.sub(r"[ ]{2,}", " ", text)
    return text.strip()


def split_sentences(text: str) -> list[str]:
    parts = re.split(r"(?<=[。！？\?\!])\s*", text)
    sentences = [p.strip() for p in parts if p.strip()]
    return sentences


def extract_terms(text: str, top_n: int = 12) -> list[str]:
    candidates = []
    candidates += re.findall(r"[一-龥]{2,8}", text)
    candidates += re.findall(r"[ァ-ヴー]{2,12}", text)
    candidates += re.findall(r"[A-Za-z][A-Za-z0-9\-]{2,}", text)

    stop = {
        "こと",
        "もの",
        "ため",
        "これ",
        "それ",
        "よう",
        "など",
        "として",
        "について",
        "によって",
        "により",
        "から",
        "まで",
    }
    freq: dict[str, int] = {}
    for c in candidates:
        if c in stop:
            continue
        freq[c] = freq.get(c, 0) + 1

    ranked = sorted(freq.items(), key=lambda x: (-x[1], -len(x[0]), x[0]))
    return [w for w, _ in ranked[:top_n]]


def score_sentences(sentences: list[str], terms: list[str]) -> list[tuple[float, str]]:
    term_set = set(terms)
    scores = []
    for s in sentences:
        if len(s) < 12:
            continue
        hits = sum(1 for t in term_set if t in s)
        length = len(s)
        score = hits * 2 + math.log(1 + length)
        scores.append((score, s))
    scores.sort(key=lambda x: (-x[0], -len(x[1])))
    return scores


def build_summary(sentences: list[str], terms: list[str], max_sentences: int) -> list[str]:
    scored = score_sentences(sentences, terms)
    selected = []
    used = set()
    for _, s in scored:
        if s in used:
            continue
        selected.append(s)
        used.add(s)
        if len(selected) >= max_sentences:
            break
    return selected


def main() -> int:
    parser = argparse.ArgumentParser(description="Draft summary/points/glossary from OCR full text.")
    parser.add_argument("--portal-root", default=".", help="Path to em-portal root")
    parser.add_argument("--max-summary", type=int, default=3, help="Number of sentences in summary")
    parser.add_argument("--max-points", type=int, default=5, help="Number of important points")
    parser.add_argument("--max-terms", type=int, default=10, help="Number of glossary candidates")
    parser.add_argument("--match", default="", help="Regex to filter OCR full filenames (note stem)")
    args = parser.parse_args()

    portal_root = Path(args.portal_root).resolve()
    config = load_config(portal_root)
    obsidian_content = resolve_path(portal_root, config["obsidian"]["contentSourceDir"])
    if not obsidian_content or not obsidian_content.exists():
        raise FileNotFoundError("Obsidian contentSourceDir not found. Check portal.config.json.")

    library_dir = obsidian_content / "library"
    note_map = {}
    for note in library_dir.glob("*.md"):
        src = read_note_source_file(note)
        if src:
            note_map[note.stem] = note

    ocr_full_dir = obsidian_content.parent / "_ai" / "scratch" / "ocr_full"
    if not ocr_full_dir.exists():
        print("OCR full directory not found.")
        return 1

    pattern = re.compile(args.match) if args.match else None
    for full_path in sorted(ocr_full_dir.glob("*.txt")):
        stem = full_path.stem
        if pattern and not pattern.search(stem):
            continue
        note_path = note_map.get(stem)
        if not note_path:
            print(f"[Skip] Note not found for {stem}")
            continue

        raw = full_path.read_text(encoding="utf-8", errors="ignore")
        text = clean_text(raw)
        if not text:
            print(f"[Warn] Empty OCR for {stem}")
            continue

        sentences = split_sentences(text)
        terms = extract_terms(text, top_n=max(args.max_terms * 2, 12))
        summary = build_summary(sentences, terms, args.max_summary)
        points = build_summary(sentences, terms, args.max_points)
        glossary = terms[: args.max_terms]

        note_text = note_path.read_text(encoding="utf-8")
        summary_body = "\n".join([f"- {s}" for s in summary]) or "- "
        points_body = "\n".join([f"- {s}" for s in points]) or "- "
        glossary_body = "\n".join([f"- {t}" for t in glossary]) or "- "

        note_text = replace_or_append_section(
            note_text,
            "1. 要約（100-200字）",
            f"- （自動下書き）\n{summary_body}",
        )
        note_text = replace_or_append_section(
            note_text,
            "2. 重要ポイント（箇条書き）",
            f"- （自動下書き）\n{points_body}",
        )
        note_text = replace_or_append_section(
            note_text,
            "3. 用語候補（glossary）",
            f"- （自動下書き）\n{glossary_body}",
        )
        note_path.write_text(note_text, encoding="utf-8")
        print(f"[OK] {stem} -> {note_path.name}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
