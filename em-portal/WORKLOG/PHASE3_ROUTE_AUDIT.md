# Phase 3 導線監査メモ

実施日:
- 2026-02-28

対象:
- `/`
- `/intro`
- `/curriculum`
- `/curriculum/[slug]`
- `/worksheets`
- `/worksheets/[slug]`

監査観点:
- 迷子導線: 行き止まりにならないか
- 重複導線: 同じ役割の重複案内で混乱しないか
- リンク抜け: 学習行動に接続するリンクが欠けていないか

## 結果サマリ
- 迷子導線: 致命的な行き止まりはなし
- 重複導線: `/` はナビ、`/intro` は前提共有、`/curriculum` は進行管理に分離できている
- リンク抜け: `worksheets/[slug]` に「次の行動」が弱かったため補強を実施

## 主要確認ログ
1. `/` から `intro -> curriculum -> worksheets` の必修3ステップが常時見える
2. `/intro` で前提共有後に `L1` と `WS1` へ遷移できる
3. `/curriculum` から全授業詳細へ遷移できる
4. `/curriculum/[slug]` から関連 `figure/glossary/worksheet/faq` に遷移できる
5. `/worksheets/[slug]` から対応授業へ戻れる

## 修正（微修正）
- ファイル: `tmp-app/src/app/worksheets/[slug]/page.tsx`
- 変更: 「次のアクション」ブロックを追加
  - `FAQで詰まりを確認`
  - `次の授業へ進む`（`ws-l1`〜`ws-l5`）
  - `カリキュラム一覧へ戻る`（`ws-l6`）
  - `ワーク一覧を見る`
- 理由: ワーク詳細ページ閲覧後の遷移先を明示し、導線の詰まりを予防するため
