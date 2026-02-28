# Current Task

## Task
- 高校生が最終的に「自力でEMを実践できる」ことをゴールに、サイト構成・レイアウト・コンテンツを段階的に再構成する。
- 実行規約は `WORKLOG/RESTRUCTURE_PLAN.md` に従う。

## Current Phase
- `Phase 5: 公開前固定`（完了）

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

## Next Resume Point
1. 変更差分をレビューし、公開対象コミットを分割整理
2. デプロイ可否を判断（`tmp-app` と `../web` の反映方針を確定）
3. 公開後の運用ルール（status更新頻度・FAQ更新手順）を `WORKLOG` に追記

## Validation
- 各フェーズ完了時に `pnpm run build` を実施し、成功ログを残す
