# Current Task

## Task
- Obsidian + AI で収集・整理した内容を `em-portal` に反映し、授業で使える日本語ポータルとして運用できる状態に整える

## Current Scope
- [x] Obsidian / AI 運用スクリプトの整備（初期化・ノート作成・AI編集プロンプト・status一括付与）
- [x] 一覧ページ・検索ページの `status` フィルタ対応
- [x] 図解・用語・FAQ・人物・文献・ワークの日本語化と見やすさ改善
- [x] `curriculum` L1〜L6 に授業導線（図解 / 用語 / ワーク / FAQ）を追加
- [x] `WORKLOG` 運用の導入（中断時の再開性の確保）
- [x] GitHub / Vercel への継続反映フローを安定化
- [ ] 最終点検（主要ページの目視確認と微修正）

## Recent Changes
- `em-portal/tmp-app/src/app/page.tsx`（トップページ日本語化・導線整理）
- `em-portal/tmp-app/src/app/intro/page.tsx`（入門ページの再構成）
- `em-portal/tmp-app/src/app/curriculum/[slug]/page.tsx`（L1〜L6 授業導線）
- `em-portal/tmp-app/content/worksheets/ws-l1..ws-l6.md`（授業別に全面作り直し）
- `em-portal/tmp-app/content/glossary/*.md`（主要用語・テンプレ用語の日本語化）
- `em-portal/tmp-app/content/faq/faq-1..faq-10.md`（構成統一）
- `em-portal/tmp-app/src/app/faq/page.tsx`（短答先出し + 折りたたみ）
- `em-portal/tmp-app/src/app/library/page.tsx`（文献概要ブロック）
- `em-portal/tmp-app/src/app/people/page.tsx`（覚える一言の先出し）

## Open Issues / Notes
- トップページ・主要導線は改善済み。残りは細かい表現の揺れや、授業現場での使い勝手の微調整が中心。
- `status` 未設定の Markdown は `unknown` 表示になる（運用上は必要に応じて `published/reviewed/inbox` を付与）。
- `em-portal` 外（`../web`, `../scripts`, `../test`）の差分は別作業として分離して扱う。

## Next Resume Point
1. 主要ページを目視確認（`/`, `/intro`, `/curriculum/*`, `/worksheets/*`, `/glossary/*`, `/figures/*`, `/faq`, `/library`, `/people`）
2. 気になる文言・導線を数件修正
3. `build` 確認
4. GitHub push → Vercel 反映確認

## Validation
- `cmd /c "set npm_config_cache=.npm-cache&& npx.cmd --yes pnpm run build"` (`em-portal/tmp-app`) OK（継続確認）
