# Phase 5 公開前固定チェック

実施日:
- 2026-02-28

目的:
- 公開候補として文言・status・ビルドの最終整合を確認し、再開ポイントを固定する。

## 1) 文言最終確認（主要ページ）

対象:
- `/` (`tmp-app/src/app/page.tsx`)
- `/intro` (`tmp-app/src/app/intro/page.tsx`)
- `/curriculum` 系
- `/worksheets` 系

確認結果:
- 各ページの冒頭で役割が明示されている（入口/前提共有/進行管理/提出）。
- 必修導線と補助導線が分離されている。
- ワーク詳細に「次のアクション」導線があり、行き止まりがない。

## 2) status 最終確認

確認方法:
- `tmp-app/content` 配下の公開対象 `.md` を対象に、`status` の未設定と許可外値を機械チェック
- 除外: `content/_drafts`, `content/_sources`

確認結果:
- 未設定: 0
- 許可外値: 0
- 備考: `_drafts/README.md` は公開導線外のため対象外

## 3) ビルド確認

実行コマンド:
- `npm.cmd run build`（`tmp-app`）

確認結果:
- 成功（prebuild: search-index 72行生成、Next.js build 成功）

## 固定判定

- Phase 5 の公開前固定条件（文言/status/build）は満たした。
- 以後は公開作業（コミット整理・デプロイ判断）フェーズへ移行可能。
