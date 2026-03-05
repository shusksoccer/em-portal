param(
  [Parameter(Mandatory = $true)]
  [string]$Title,
  [ValidateSet("library", "glossary", "people", "faq", "figures", "lessons", "worksheets")]
  [string]$Kind = "library",
  [string]$Slug = "",
  [string]$SourceUrl = "",
  [ValidateSet("primary", "secondary", "reference", "news", "dataset", "official-doc")]
  [string]$SourceType = "secondary",
  [string]$PublishedAt = "",
  [int]$RefreshAfterDays = 30,
  [string[]]$Tags = @("ai-collect", "inbox"),
  [string[]]$Sources = @(),
  [switch]$OpenFolder
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$portalRoot = Split-Path -Parent $scriptDir
. (Join-Path $scriptDir "Portal-Common.ps1")

$paths = Get-PortalPaths -PortalRoot $portalRoot
$targetDir = Join-Path $paths.ObsidianContentDir $Kind
if (-not (Test-Path -LiteralPath $targetDir)) {
  New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
}

if ([string]::IsNullOrWhiteSpace($Slug)) {
  $Slug = Convert-ToSlug -Text $Title
}

$filePath = Join-Path $targetDir "$Slug.md"
if (Test-Path -LiteralPath $filePath) {
  throw "File already exists: $filePath"
}

$nowDate = Get-Date -Format "yyyy-MM-dd"
$refreshDue = (Get-Date).AddDays($RefreshAfterDays).ToString("yyyy-MM-dd")
$tagLiteral = ConvertTo-JsonArrayLiteral -Items $Tags
$sourceLiteral = ConvertTo-JsonArrayLiteral -Items $Sources

$templateLines = @(
  "---"
  "slug: ""$Slug"""
  "title: ""$Title"""
  "tags: $tagLiteral"
  "sources: $sourceLiteral"
  "status: ""inbox"""
  "source_url: ""$SourceUrl"""
  "source_type: ""$SourceType"""
  "primary_source_url: ""$SourceUrl"""
  "published_at: ""$PublishedAt"""
  "checked_at: ""$nowDate"""
  "verification_status: ""needs_review"""
  "refresh_after_days: $RefreshAfterDays"
  "refresh_due: ""$refreshDue"""
  "updated_at: ""$nowDate"""
  "ai_summary: """""
  "ai_confidence: ""medium"""
  "---"
  ""
  "# $Title"
  ""
  "## 0. 収集メモ"
  "- 何を知りたいか:"
  "- どこに使うか (lesson/worksheet/glossary/faq):"
  ""
  "## 1. AI要約（下書き）"
  "- "
  ""
  "## 2. 事実メモ（出典に戻れる形）"
  "- "
  ""
  "## 3. 正確性チェック"
  "- 一次情報URL:"
  "- 公開日 / 最終更新日:"
  "- 最終確認日:"
  "- 数値・固有名詞の照合:"
  ""
  "## 4. 要確認"
  "- "
  ""
  "## 5. 編集後の公開用メモ"
  "- "
)

Set-Content -LiteralPath $filePath -Value ($templateLines -join [Environment]::NewLine) -Encoding UTF8

Write-Host "Created: $filePath"

if ($OpenFolder) {
  Start-Process explorer.exe "/select,""$filePath"""
}
