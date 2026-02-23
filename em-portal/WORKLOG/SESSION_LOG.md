# Session Log

## 2026-02-23
- Added Obsidian AI workflow scripts under `em-portal/ops/` for setup, note creation, and edit-prompt generation.
- Added `status` filtering (`all/inbox/reviewed/published/unknown`) to major list pages in `tmp-app`.
- Added `status` display to `DocCard`; existing docs without status now fall back to `unknown`.
- Lint passed in `em-portal/tmp-app`.
- Added search-index `status` field and `/search` status filter UI.
- Regenerated `public/search-index.json` (currently 0 rows because content files are missing in this workspace state).
- Added `ops/Set-PortalContentStatus.ps1` for bulk status tagging of Obsidian content frontmatter (for use after content restore/sync).
- Researched ethnomethodology basics / CA resources on the web and created a Japanese starter content set (lesson, glossary, library, people, FAQ).
- Synced `test/em-portal/content` -> `em-portal/tmp-app/content`, regenerated search index (20 rows), and confirmed production build passes.
- Fixed mojibake text in `intro` page and `source-links` labels.
- Fixed remaining English/mixed UI labels on top/list/detail pages and status labels; rebuilt successfully.
- Added 10 figure description pages and expanded glossary to 16 core terms; search index now generates 40 rows.
- Added home page AI workflow shortcut section (Inbox / reviewed / published / search).
- Cleaned local `em-portal` worktree by restoring accidental `tmp-app/content` deletions and reverting a noisy `public/search-index.json` regeneration.
- Removed obsolete/untracked `ethnomethodology_portal_codex_instructions.md` (mojibake memo duplicate of WORKLOG usage notes).
- Expanded all `tmp-app/content/figures/*.md` detail pages with lesson-ready sections (`導入 / 活動 / 確認`) for classroom use.
- Hardened `tmp-app/src/lib/content.ts` and `tmp-app/scripts/generate-search-index.mjs` to strip UTF-8 BOM before parsing JSON/frontmatter (prevents build failures from PowerShell-saved files).
- Added classroom-ready concrete examples (school / SNS) to all figure detail pages to make explanations easier during lessons.
- Improved worksheet detail UI readability: added Japanese summary section (`所要時間 / 提出物 / 評価観点`) and fixed mojibake labels in shared doc cards.
- Simplified `library` list cards with a Japanese "文献概要" block and collapsible memo area; also fixed mojibake/metadata text in `content/library/lib-1.md`.
