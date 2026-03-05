param(
  [ValidateSet("library", "glossary", "people", "faq", "figures", "lessons", "worksheets")]
  [string]$Kind = "library",
  [string]$Slug,
  [string]$InputFile,
  [string]$OutputPath = ""
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

if ([string]::IsNullOrWhiteSpace($Slug) -and [string]::IsNullOrWhiteSpace($InputFile)) {
  throw "Specify either -Slug or -InputFile."
}

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$portalRoot = Split-Path -Parent $scriptDir
. (Join-Path $scriptDir "Portal-Common.ps1")

$paths = Get-PortalPaths -PortalRoot $portalRoot
$projectRoot = $paths.ObsidianProjectRoot

if (-not [string]::IsNullOrWhiteSpace($InputFile)) {
  $notePath = Resolve-PathSafe -BaseDir $portalRoot -PathValue $InputFile
} else {
  $notePath = Join-Path (Join-Path $paths.ObsidianContentDir $Kind) "$Slug.md"
}

if (-not (Test-Path -LiteralPath $notePath)) {
  throw "Note not found: $notePath"
}

$raw = Get-Content -LiteralPath $notePath -Raw -Encoding UTF8
$noteName = [System.IO.Path]::GetFileNameWithoutExtension($notePath)

if ([string]::IsNullOrWhiteSpace($OutputPath)) {
  $outDir = Join-Path $projectRoot "_ai\prompts\out"
  if (-not (Test-Path -LiteralPath $outDir)) {
    New-Item -ItemType Directory -Path $outDir -Force | Out-Null
  }
  $timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
  $OutputPath = Join-Path $outDir "$timestamp-$noteName-knowledge-prompt.md"
} else {
  $OutputPath = Resolve-PathSafe -BaseDir $portalRoot -PathValue $OutputPath
  $parent = Split-Path -Parent $OutputPath
  if ($parent -and -not (Test-Path -LiteralPath $parent)) {
    New-Item -ItemType Directory -Path $parent -Force | Out-Null
  }
}

$codeFence = '```'
$parts = @(
  "# AI Knowledge Enrichment Prompt for $noteName",
  "",
  "Enrich this note for ethnomethodology learning depth.",
  "",
  "Goals:",
  "- Strengthen EM concepts and distinctions in plain Japanese",
  "- Add concrete classroom-friendly examples",
  "- Clarify what students often misunderstand",
  "- Keep direct reuse paths to lesson/worksheet/glossary/faq",
  "",
  "Constraints:",
  "- Preserve frontmatter keys and existing slug/title/tags/sources arrays",
  "- Do not invent citations, URLs, dates, names, or quotations",
  "- Separate facts and interpretations; mark uncertain parts as 要確認",
  "- Keep tone suitable for high-school learning support",
  "- Return Markdown only",
  "",
  "Suggested output additions:",
  "- 1) 核となる概念（3-5点）",
  "- 2) まちがえやすい点",
  "- 3) 授業で使える具体例",
  "- 4) どのlesson/worksheetに繋げるか",
  "",
  "Input note:",
  "",
  "${codeFence}markdown",
  $raw.TrimEnd(),
  $codeFence,
  ""
)

$prompt = $parts -join [Environment]::NewLine
Set-Content -LiteralPath $OutputPath -Value $prompt -Encoding UTF8
Write-Host "Knowledge prompt generated: $OutputPath"

