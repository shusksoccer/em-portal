# エスノメソドロジー探究授業ポータル

高校生向けの授業支援サイトです。`content/` 配下の Markdown(frontmatter付き) からページを生成します。

## 技術構成
- Next.js (App Router / TypeScript)
- Markdownベースの教材管理
- ビルド時検索インデックス生成 (`scripts/generate-search-index.mjs`)

## 開発
```bash
npx pnpm install
npx pnpm gen:search
npx pnpm dev
```

`3000` が詰まる場合は `npx pnpm dev:3001` を使う。
ローカルでURLを合わせたい場合は `.env.example` を参考に `.env.local` を作成する。

## 主要コマンド
- `npx pnpm gen:search`: `content/` から `public/search-index.json` を生成
- `npx pnpm lint`: ESLint実行
- `npx pnpm build`: 検索インデックス生成後に本番ビルド

## かんたん公開（ダブルクリック）
- `更新して公開する.bat` をダブルクリックする
- 自動で `lint` → `build` → 保存（commit）→ GitHubへ送信（push）を実行する
- Vercel を一度連携していれば、その後は自動で公開更新される

## コンテンツ運用（Obsidian → GitHub → Vercel）
1. Obsidianで `content/` 配下の Markdown を編集する
2. frontmatter を維持して保存する（`slug`, `tags`, `sources` など）
3. GitHubへ push する
4. Vercelで自動ビルド・デプロイする

## 公開前チェック（Vercel）
1. Vercel の環境変数 `NEXT_PUBLIC_SITE_URL` に本番URLを設定する（例: `https://your-site.vercel.app`）
2. `npx pnpm lint`
3. `npx pnpm build`
4. `sitemap.xml` と OGP のURLが本番URLになっていることを確認する

## Vercel設定メモ
1. GitHub リポジトリを Vercel に Import
2. Root Directory を `em-portal/tmp-app` に設定
3. Environment Variables に `NEXT_PUBLIC_SITE_URL` を追加
4. Build Command は既定のままで可（`pnpm build`）
5. 初回デプロイ後、`/sitemap.xml` と主要ページを確認

## ディレクトリ
- `content/lessons`: 授業コマ
- `content/worksheets`: ワークシート
- `content/glossary`: 用語集
- `content/figures`: 図解
- `content/library`: 文献リスト
- `content/people`: 研究者紹介
- `content/faq`: FAQ
- `content/_sources/sources.yml`: 参考ソース目録（MVPは仮URL可）
