# Obsidian + GitHub + Vercel automation setup

This repository can be used as:
- Obsidian: source material storage
- GitHub: versioned storage and trigger
- Vercel: automatic deployment target

## 1) Local structure

- Markdown source: your Obsidian folder (example: `C:\Users\<you>\ObsidianVault\Publish`)
- Website content folder: `web/content`
- Next.js app: `web/site`

## 2) Configure content directory (optional)

`web/site/lib/content.ts` supports `CONTENT_DIR`.

1. Create `web/site/.env.local`
2. Add:

```env
CONTENT_DIR=../content
```

If you want the app to read Obsidian directly, set an absolute path:

```env
CONTENT_DIR=C:/Users/<you>/ObsidianVault/Publish
```

## 3) Material sync from Obsidian

Run:

```powershell
.\scripts\sync-obsidian.ps1 -SourceDir "C:\Users\<you>\ObsidianVault\Publish" -Clean
```

Create a new material template:

```powershell
.\scripts\new-material.ps1 -Title "My New Note"
```

## 4) Local preview

```powershell
cd web/site
npm install
npm run dev
```

Open `http://localhost:3000`.

## 5) GitHub automation

CI workflow: `.github/workflows/site-ci.yml`

- Trigger: push/PR touching `web/site` or `web/content`
- Action: install and build `web/site`

## 6) Vercel setup

1. Import this GitHub repo in Vercel.
2. Set:
- Framework: `Next.js`
- Root Directory: `web/site`
3. Add environment variable on Vercel:
- `CONTENT_DIR=../content`
4. Deploy.

After this, any push to `main` deploys automatically.

## 7) One-command publish flow

Sync only:

```powershell
.\scripts\publish-site.ps1 -SourceDir "C:\Users\<you>\ObsidianVault\Publish"
```

Sync + commit:

```powershell
.\scripts\publish-site.ps1 -SourceDir "C:\Users\<you>\ObsidianVault\Publish" -Commit -Message "update materials"
```

Sync + commit + push:

```powershell
.\scripts\publish-site.ps1 -SourceDir "C:\Users\<you>\ObsidianVault\Publish" -Commit -Push -Message "update materials"
```

## 8) How to operate with AI in this workspace

You can request concrete actions like:
- "Show only Obsidian notes tagged AI on the top page"
- "Add tags and updated date to the materials list page"
- "Make the top page look like an LP and optimize it for Vercel"
- "Keep current behavior and add SEO + OGP support"

The agent edits code directly in this repository and you review diffs before pushing.
