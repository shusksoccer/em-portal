# Material Note Project

Obsidian/GitHub/Vercel を使って、Markdown 素材から Web サイトを自動運用するためのリポジトリです。

## Directory

- `web/content`: 公開する Markdown 素材
- `web/site`: Next.js サイト本体
- `scripts`: 同期・公開補助スクリプト

## Quick Start

```powershell
cd web/site
npm install
npm run dev
```

Open: `http://localhost:3000`

## Material format

`web/content/*.md`

```markdown
---
title: "Title"
---

# Heading
Body text...
```

## Automation docs

詳細手順は `AUTOMATION_SETUP.md` を参照してください。
