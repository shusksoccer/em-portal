# Current Task

## Task
- 高校生が最終的に「自力でEMを実践できる」ことをゴールに、サイト構成・レイアウト・コンテンツを段階的に再構成する。
- 実行規約は `WORKLOG/RESTRUCTURE_PLAN.md` に従う。
- 画面と導線の抜本改善は `WORKLOG/REDESIGN_SPEC.md` を優先仕様として反映する。

## Current Phase
- `REDESIGN_SPEC: Phase 2（コンテンツ統合）`（進行中）

## Phase Checklist
- [x] `curriculum/[slug]` の本文構造を高探究要件で統一
- [x] `worksheets/*` の提出条件を共通フォーマット化
- [x] `glossary` の必修語優先表示を実装
- [x] 主要ページの導線詰まりを目視で検証（`/`, `/intro`, `/curriculum/*`, `/worksheets/*`）
- [x] Phase 4検証シナリオの作成
- [x] シナリオA（概念理解のみ）の通し検証を実施
- [x] シナリオB（ワーク実施まで）の通し検証を実施
- [x] シナリオC（自力ミニ実践まで）の通し検証を実施
- [x] Phase 5 公開前固定（最終文言/status/build）へ移行
- [x] 主要ページ文言の最終確認を実施
- [x] `status` 未設定/許可外値チェックを実施（公開対象0件）
- [x] 公開候補版のbuild成功を確認
- [x] REDESIGN Phase 1（見た目の土台）実装
- [x] REDESIGN Phase 3（Markdown `:::block` + TEMPLATE）実装
- [x] REDESIGN 追加改善 A-D 実装（カード識別 / 用語バックリンク / ToC / library主フィルタ）
- [x] REDESIGN Phase 2（授業・用語の本文拡充）をコンテンツへ反映
- [x] 追加改善E（グローバルナビのステージ優先化）実施可否を決定・実装

## Scope Guard（今回触る範囲）
- `tmp-app/content/*`
- `tmp-app/src/app/*`
- `WORKLOG/*`

## Out Of Scope（今回触らない）
- `../web`, `../scripts`, `../test`, `../tools`
- デプロイ設定変更（Vercel設定自体の変更）

## Open Issues / Notes
- `library` の `core/supplement` 表示は実装済み。運用上は `status` 更新を継続する。
- `content/_sources` は一次資料群として公開導線外のまま維持する。
- Phase 3 の導線監査結果は `WORKLOG/PHASE3_ROUTE_AUDIT.md` を参照。
- Phase 4 の検証シナリオは `WORKLOG/PHASE4_SCENARIOS.md` を参照。
- Phase 4 の実施ログは `WORKLOG/PHASE4_VALIDATION_LOG.md` を参照。
- Phase 5 の公開前固定チェックは `WORKLOG/PHASE5_RELEASE_CHECK.md` を参照。
- REDESIGN の進捗は `WORKLOG/REDESIGN_SPEC.md` の Phase 1/3 完了、Phase 2（本文強化）待ち。

## Next Resume Point
1. `content/lessons/l1-l6.md` に `:::concept/example/exercise/caution/transcript` を使った本文拡充を反映
2. `content/glossary/*.md` を200〜400字に拡充し、授業文脈での使い方を追記
3. 追加改善E（ナビをステージ優先化）を実施するか最終判断

## Validation
- 各フェーズ完了時に `pnpm run build` を実施し、成功ログを残す
