param(
  [switch]$Force
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$portalRoot = Split-Path -Parent $scriptDir
. (Join-Path $scriptDir "Portal-Common.ps1")

$paths = Get-PortalPaths -PortalRoot $portalRoot
$contentDir = $paths.ObsidianContentDir
$projectRoot = $paths.ObsidianProjectRoot

Write-Host "Obsidian project root: $projectRoot"
Write-Host "Obsidian content dir : $contentDir"

$contentFolders = @(
  "lessons",
  "worksheets",
  "glossary",
  "figures",
  "library",
  "people",
  "faq",
  "_sources"
)

foreach ($folder in $contentFolders) {
  $target = Join-Path $contentDir $folder
  if (-not (Test-Path -LiteralPath $target)) {
    New-Item -ItemType Directory -Path $target -Force | Out-Null
    Write-Host "[Create] $target"
  }
}

$aiDirs = @(
  "_ai",
  "_ai\prompts",
  "_ai\prompts\in",
  "_ai\prompts\out",
  "_ai\scratch",
  "_templates"
)

foreach ($dir in $aiDirs) {
  $target = Join-Path $projectRoot $dir
  if (-not (Test-Path -LiteralPath $target)) {
    New-Item -ItemType Directory -Path $target -Force | Out-Null
    Write-Host "[Create] $target"
  }
}

$sourcesPath = Join-Path $contentDir "_sources\sources.yml"
if (-not (Test-Path -LiteralPath $sourcesPath)) {
  Set-Content -LiteralPath $sourcesPath -Value "[]" -Encoding UTF8
  Write-Host "[Init] $sourcesPath"
}

$files = @(
  @{
    Path = Join-Path $projectRoot "_templates\library-ai-collection.md"
    Body = @'
---
slug: "source-slug"
title: "Source title"
tags: ["ai-collect","inbox"]
sources: []
status: "inbox"
source_url: ""
source_type: "secondary"
primary_source_url: ""
published_at: ""
checked_at: "YYYY-MM-DD"
verification_status: "needs_review"
refresh_after_days: 30
refresh_due: "YYYY-MM-DD"
updated_at: "YYYY-MM-DD"
ai_summary: ""
ai_confidence: "medium"
---

# Source title

## 0. Goal
- What should this note preserve?
- Where will it be reused? (lesson / worksheet / glossary / faq)

## 1. AI summary (draft)
- 

## 2. Fact notes (traceable to source)
- 

## 3. Accuracy check
- Primary source URL:
- Published/updated date:
- Last checked date:
- Number/name/date consistency check:

## 4. Terms to extract (glossary candidates)
- 

## 5. Reuse ideas (lesson / worksheet / figure)
- 

## 6. Human review
- Misreadings:
- Tone / wording:
- Publish decision:
'@
  },
  @{
    Path = Join-Path $projectRoot "_templates\lesson-ai-draft.md"
    Body = @'
---
slug: "lesson-slug"
title: "Lesson title"
lesson_no: 1
tags: ["lesson-draft"]
sources: []
difficulty: "intro"
---

# Lesson title

## Learning goals
- 

## Intro (AI draft)
- 

## Main flow
1. 
2. 
3. 

## Questions for students
- 

## Human review checklist
- Is any claim too strong?
- Are sources linked?
'@
  },
  @{
    Path = Join-Path $projectRoot "_ai\prompts\in\collect-and-structure.md"
    Body = @'
# Prompt: Collect and Structure

Turn the input material into an Obsidian Markdown note.

Requirements:
- Preserve or complete frontmatter
- Do not break slug/title/tags/sources fields
- Prefer primary or official sources when available
- Separate facts from inferences
- Mark uncertain parts as 要確認
- Add/maintain: source_type, primary_source_url, published_at, checked_at, verification_status
- Fill sections for summary, fact notes, glossary candidates, and reuse ideas

Output:
- Return Markdown only
'@
  },
  @{
    Path = Join-Path $projectRoot "_ai\prompts\in\edit-note-preserve-frontmatter.md"
    Body = @'
# Prompt: Edit Note (Preserve Frontmatter)

Edit the Markdown note and improve readability.

Constraints:
- Keep frontmatter keys unchanged
- Keep tags and sources as arrays
- Prefer primary or official sources if source links are revised
- Do not fabricate URLs, dates, names, or quotes
- Mark unsupported claims as 要確認
- Return Markdown only
'@
  },
  @{
    Path = Join-Path $projectRoot "_ai\prompts\in\knowledge-enrichment.md"
    Body = @'
# Prompt: Knowledge Enrichment

Enrich the note for ethnomethodology understanding and teaching use.

Requirements:
- Preserve frontmatter keys and existing slug/title/tags/sources arrays
- Do not fabricate URLs, dates, names, figures, or quotes
- Improve conceptual coverage (definitions, contrasts, misconceptions)
- Add classroom-ready examples where helpful
- Keep uncertain points marked as 要確認
- Keep Japanese wording clear for high-school level explanations

Output:
- Return Markdown only
'@
  },
  @{
    Path = Join-Path $projectRoot "_ai\README.md"
    Body = @'
# AI Work Area

- prompts/in: prompt templates to paste into an AI tool
- prompts/out: prompts generated from real notes
- scratch: private scratch notes (not for publishing)
- _templates: note templates for Obsidian

Public content should remain under content/.
'@
  }
)

foreach ($file in $files) {
  $exists = Test-Path -LiteralPath $file.Path
  if ($exists -and -not $Force) {
    Write-Host "[Skip] $($file.Path)"
    continue
  }

  Set-Content -LiteralPath $file.Path -Value $file.Body.TrimStart() -Encoding UTF8
  if ($exists) {
    Write-Host "[Overwrite] $($file.Path)"
  } else {
    Write-Host "[Write] $($file.Path)"
  }
}

Write-Host ""
Write-Host "AI workspace setup complete."
Write-Host "Next:"
Write-Host "  1) Run ops\\New-ObsidianResearchNote.ps1 to create a collection note"
Write-Host "  2) Run ops\\Build-AIEditPrompt.ps1 to generate an edit prompt"
Write-Host "  3) Run ops\\Build-AIKnowledgePrompt.ps1 to enrich EM learning content"
Write-Host "  4) Edit in Obsidian, then publish with the existing bat file"
