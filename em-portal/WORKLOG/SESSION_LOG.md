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
- Improved `glossary` readability: quick links now show Japanese term titles, detail pages include a Japanese summary block, and `accountability` text was de-mojibaked/refined.
- Fixed mojibake glossary entries `adjacency-pair` and `anonymization` with clean Japanese definitions/examples for classroom use.
- Cleaned residual UTF-8 BOM markers from `content/faq/faq-1.md` and `content/lessons/l1-what-is-em.md` (content unchanged, formatting hygiene).
- Replaced 14 placeholder glossary entries with Japanese classroom-ready definitions/examples (`context`, `data-session`, `deviation`, `embodiment`, `fieldnote`, `gaze`, `inference`, `institutional-talk`, `membership-categorization`, `norm`, `presentation`, `silence`, `topic-management`, `validity`).
- Standardized `faq-1` to `faq-10` into a consistent structure (`回答（短く） / 具体例（学校・SNS） / 注意点 / チェック`) and added missing `status` where needed.
- Improved `/faq` list readability: cards now show a short answer first, sort by FAQ number, and tuck full markdown/source details behind a collapsible section.
- Added an L1 lesson toolkit block to `/curriculum/[slug]` with direct links to key figures/glossary/worksheet/FAQ for in-class navigation.
- Aligned `library/lib-2` to `lib-5` with `読み方の目安` and more consistent classroom-facing notes to match `lib-1`.
- Improved `/people` list cards for classroom scanning: surface `覚える一言` first and move full memo/source blocks into collapsible sections.
- Rebuilt `/intro` as a practical entry page with quick-start steps, starter links (L1/figures/glossary/worksheet/FAQ), and an inline preview of the first lesson.
- Rewrote `ws-l1` to `ws-l6` from generic templates into lesson-specific worksheets aligned with L1-L6 objectives (observation, checking, data description, CA entry, safe breaching analysis, presentation planning).
- Expanded curriculum lesson toolkit links from L1-only to all lessons L1-L6, so each lesson page has direct links to relevant figures/glossary/worksheet/FAQ.
- Refined the home page (`/`) copy and labels to clear Japanese wording (AI workflow, 6-lesson timeline, and primary navigation cards) after earlier mojibake-heavy states.
- Rewrote `WORKLOG/CURRENT_TASK.md` and `WORKLOG/README.md` to remove mojibake and reflect the current project state/resume steps.

## 2026-02-28
- Added WORKLOG/RESTRUCTURE_PLAN.md as a phased execution guide for full site restructure toward the student self-practice goal.
- Rewrote WORKLOG/CURRENT_TASK.md to Phase-0 inventory mode with scope guards and no-skip phase gates.
- Updated WORKLOG/README.md to require RESTRUCTURE_PLAN.md usage during large refactors.
- Classified all `tmp-app/content/library/*.md` entries with goal-aligned frontmatter (`learning_stage`, `learning_role`, `recommended_order`, `content_track`) without editing body text.
- Updated `/library` listing to support stage filtering and to show goal-role metadata; library sort now follows `recommended_order`.
- Moved draft library content out of the public path to `tmp-app/content/_drafts/library` and renamed library files to purpose-oriented names.
- Added a hard guard in `/library` to hide `content_track: draft` from display and filters.
- Switched AI workflow emphasis from latest-refresh to EM knowledge enrichment by adding `ops/Build-AIKnowledgePrompt.ps1`, updating setup templates, and removing `ops/Build-AIRefreshPrompt.ps1`.
- Updated `README-運用.md` and `WORKLOG/LIBRARY_CLASSIFICATION.md` to match the new file layout and operating policy.
- Restarted Phase 0 in `CURRENT_TASK.md` after the pre-sorting work was completed.- Created WORKLOG/PHASE0_INVENTORY.md and started Phase-0 inventory baseline with the full library category pre-classified.

- Phase 0 progress: completed lesson-category inventory (l1-l6) in WORKLOG/PHASE0_INVENTORY.md; all six lessons classified as goal-critical, with missing status fields flagged for later normalization.

- Phase 0 progress: completed worksheet-category inventory (ws-l1-ws-l6); all worksheets classified as goal-critical and kept.

- Phase 0 progress: completed inventory for glossary (30), igures (10), aq (10), and people (4); flagged aq-2/aq-5 as a merge candidate due to duplicate intent.
- Updated WORKLOG/CURRENT_TASK.md checklist to reflect full-category inventory completion and draft-material separation done.

- Finalized Phase 0 duplicate cleanup in FAQ: merged key checklist points into aq-2.md and removed aq-5.md (duplicate breaching-policy question).
- Updated WORKLOG/PHASE0_INVENTORY.md and WORKLOG/CURRENT_TASK.md to mark Phase 0 completion and set next resume point to Phase 1 information design.

- Phase 1 started: created WORKLOG/PHASE1_SITEMAP.md (high-inquiry sitemap) and WORKLOG/PAGE_ROLE_SPEC.md (one-page-one-purpose role definitions).
- Updated WORKLOG/CURRENT_TASK.md to Phase 1 in-progress state and aligned next resume points to top/intro/curriculum role split implementation.

- Phase 1 implementation: rewrote / as route-only navigator, rewrote /intro as prerequisite page (no lesson-body duplication), and updated /curriculum header to explicitly require evidence/limitations/ethics outcomes.
- Build passed after Phase 1 page-role split implementation (pnpm run build, 2026-02-28).

- Phase 2 completed: added WORKLOG/PHASE2_ACTIONS.md with fixed action order and handoff items, and implemented /library priority display by content_track (core first, supplement collapsed section).
- Build passed after Phase 2 completion updates (pnpm run build, 2026-02-28).

- Phase 3 implementation: standardized all lesson markdown files (l1-l6) with high-inquiry sections (evidence/limits/ethics), fixed worksheet detail page mojibake and unified submission layout, and added stage-based required-term priority blocks to /glossary.
- Build passed after Phase 3 content/route updates (pnpm run build, 2026-02-28).
- Resumed from CURRENT_TASK Next Resume Point and completed Phase 3 route audit across `/`, `/intro`, `/curriculum/*`, and `/worksheets/*`; added `WORKLOG/PHASE3_ROUTE_AUDIT.md`.
- Added worksheet detail "next action" navigation in `tmp-app/src/app/worksheets/[slug]/page.tsx` to prevent dead-end flow (`FAQ`, `next lesson`, `curriculum`, `worksheets`).
- Created `WORKLOG/PHASE4_SCENARIOS.md` with A/B/C end-to-end validation routes and per-scenario success criteria.
- Updated `WORKLOG/CURRENT_TASK.md` to Phase 4 in-progress and set next resume points to scenario execution.
- Build passed after route audit micro-fix and Phase 4 scenario setup (`npm.cmd run build`, 2026-02-28).
- Executed Phase 4 static validation for scenarios A/B/C and recorded outcomes in `WORKLOG/PHASE4_VALIDATION_LOG.md`.
- Added L6-specific support links on worksheet detail (`fig-presentation-map`, `glossary/validity`, `library?stage=自力実践`) to strengthen scenario C completion flow.
- Build passed after Phase 4 scenario validation updates (`npm.cmd run build`, 2026-02-28).
- Phase 5 release-freeze checks completed and documented in `WORKLOG/PHASE5_RELEASE_CHECK.md` (major-page wording/status/build).
- Verified public content status integrity: missing status 0, invalid status 0 (excluding `_drafts`, `_sources`).
- Build passed for release-candidate freeze (`npm.cmd run build`, 2026-02-28).

