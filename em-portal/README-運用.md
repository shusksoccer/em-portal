# EM Portal 運用（ここだけで完結）

## 置き場所の考え方
- `em-portal/` : 運用の入口（押すファイル、設定ファイル）
- `em-portal/ops/` : 自動処理の中身（PowerShell）
- `em-portal/tmp-app/` : サイト本体（Next.js）

## まず使うファイル
- `更新して公開する.bat` : 確認 → 保存 → GitHub送信（Vercelは自動更新）
- `確認だけする.bat` : 確認だけ（送信しない）
- `portal.config.json` : 設定（Obsidian取り込み元など）
- `WORKLOG/` : 作業計画・進捗・再開ポイント（クラッシュ対策）

## Obsidian 連携（必要なときだけ）
- `portal.config.json` の `obsidian.contentSourceDir` に、Obsidian側の `content` フォルダの場所を書く
- 空のままなら、Obsidian取り込みはスキップされる

例:
```json
{
  "obsidian": {
    "contentSourceDir": "C:/Users/xxx/Documents/ObsidianVault/em-portal/content"
  }
}
```

## AIで情報収集・編集するための初期化（Obsidian側）
最初に1回だけ実行:

```powershell
powershell -ExecutionPolicy Bypass -File .\ops\Setup-ObsidianAIWorkspace.ps1
```

作成されるもの（Obsidianの `content/` と同じ階層）:
- `_templates/` : AI収集ノート/授業下書きテンプレート
- `_ai/prompts/in/` : AIに渡すプロンプト雛形
- `_ai/prompts/out/` : ノートから自動生成したプロンプト
- `_ai/scratch/` : 一時メモ
- `content/_sources/sources.yml` : 出典一覧（なければ初期化）

## AI収集ノートを作る（Obsidianに追加）
`library` を「情報収集の入口」に使う想定です。

```powershell
powershell -ExecutionPolicy Bypass -File .\ops\New-ObsidianResearchNote.ps1 `
  -Title "会話分析の入門記事" `
  -Kind library `
  -SourceUrl "https://example.com/article"
```

ポイント:
- `tags`, `sources` は配列のまま保持（ポータル側の読み込み前提）
- `status` は `inbox` → `reviewed` などで運用
- AI要約を入れても、最終公開前に人間レビュー前提

## status を一括で付ける（実データ復旧後/運用開始時）
実データの Markdown に `status` がまだ無い場合、Obsidian 側 `content/` に一括付与できます。

全カテゴリの未設定ノートに `inbox` を付与（既存 `status` は保持）:

```powershell
powershell -ExecutionPolicy Bypass -File .\ops\Set-PortalContentStatus.ps1 -Status inbox
```

`library` だけに付与:

```powershell
powershell -ExecutionPolicy Bypass -File .\ops\Set-PortalContentStatus.ps1 -Status inbox -Kind library
```

特定ノートだけ:

```powershell
powershell -ExecutionPolicy Bypass -File .\ops\Set-PortalContentStatus.ps1 -Status reviewed -Kind library -Slug lib-1 -Force
```

確認だけ（書き込まない）:

```powershell
powershell -ExecutionPolicy Bypass -File .\ops\Set-PortalContentStatus.ps1 -Status inbox -Kind library -WhatIf
```

## AI編集プロンプトをノートから生成
ObsidianのノートをAIへ渡す前に、frontmatter維持ルール付きのプロンプトを作れます。

```powershell
powershell -ExecutionPolicy Bypass -File .\ops\Build-AIEditPrompt.ps1 `
  -Kind library `
  -Slug kawaianalysis-intro
```

生成先:
- `.../_ai/prompts/out/*.md`

このファイルをAIへ渡し、返ってきたMarkdownをObsidianノートに反映します。

## AIで知識を充実させる（EM理解重視）
既存ノートの内容を、授業で使える形に深めたい場合:

```powershell
powershell -ExecutionPolicy Bypass -File .\ops\Build-AIKnowledgePrompt.ps1 `
  -Kind library `
  -Slug lib-1
```

ポイント:
- 既存frontmatterは保持
- EM概念の整理（定義・違い・誤解しやすい点）を強化
- 授業で使える具体例に落とし込む
- 不明点は断定せず `要確認` を残す

## 普段の流れ
1. Obsidian で内容を編集
2. `em-portal/更新して公開する.bat` をダブルクリック
3. 数分待つ
4. 公開サイトを開いて確認

## 何が自動で動くか
- Obsidian取り込み（設定がある場合）
- 検索データ更新
- 内容チェック
- サイト作成テスト
- GitHubへ送信
- Vercel 自動更新（連携済みの場合）
- 完了通知（音 + 音声） ※ `ops/Notify-TaskDone.ps1`

## 完了通知だけ鳴らしたいとき
手動でも実行できます。

```powershell
powershell -ExecutionPolicy Bypass -File .\ops\Notify-TaskDone.ps1 -Message "作業完了です"
```

音だけ不要なら:

```powershell
powershell -ExecutionPolicy Bypass -File .\ops\Notify-TaskDone.ps1 -Silent
```

## AI運用のおすすめ流れ（最小）
1. `New-ObsidianResearchNote.ps1` で `library` ノートを作る
2. 情報源URL・メモを貼る
3. 追記や整理は `Build-AIEditPrompt.ps1` でプロンプト生成
4. 知識を深めるときは `Build-AIKnowledgePrompt.ps1` を使う
5. AIで整理（frontmatter維持）
6. Obsidianで人間レビュー（要確認の潰し込み）
7. 必要に応じて `glossary` / `figures` / `lessons` に転記
8. `更新して公開する.bat` で公開更新

## 作業が落ちても再開しやすくする記録場所
- `WORKLOG/CURRENT_TASK.md`: 今回の目的・現在地・次回再開ポイント
- `WORKLOG/SESSION_LOG.md`: 作業ごとの追記ログ
- `WORKLOG/TEMPLATE-ENTRY.md`: 記録テンプレート

作業開始前と終了前に `CURRENT_TASK.md` を更新しておくと、途中で落ちても再開が速くなります。
