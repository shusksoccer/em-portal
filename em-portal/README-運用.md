# EM Portal 運用（ここだけで完結）

## 置き場所の考え方
- `em-portal/` : 運用の入口（押すファイル、設定ファイル）
- `em-portal/ops/` : 自動処理の中身（PowerShell）
- `em-portal/tmp-app/` : サイト本体（Next.js）

## まず使うファイル
- `更新して公開する.bat` : 確認 → 保存 → GitHub送信（Vercelは自動更新）
- `確認だけする.bat` : 確認だけ（送信しない）
- `portal.config.json` : 設定（Obsidian取り込み元など）

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
