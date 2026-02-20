param(
  [Parameter(Mandatory = $true)]
  [string]$Title,
  [string]$Slug = "",
  [string]$OutputDir = ".\web\content"
)

$ErrorActionPreference = "Stop"

function To-Slug([string]$text) {
  $slug = $text.ToLowerInvariant()
  $slug = $slug -replace "[^a-z0-9]+", "-"
  $slug = $slug.Trim("-")
  if ([string]::IsNullOrWhiteSpace($slug)) {
    return (Get-Date -Format "yyyyMMdd-HHmmss")
  }
  return $slug
}

if (-not (Test-Path -LiteralPath $OutputDir)) {
  New-Item -ItemType Directory -Path $OutputDir | Out-Null
}

if ([string]::IsNullOrWhiteSpace($Slug)) {
  $Slug = To-Slug $Title
}

$path = Join-Path $OutputDir "$Slug.md"

if (Test-Path -LiteralPath $path) {
  throw "File already exists: $path"
}

$template = @(
  "---"
  "title: ""$Title"""
  "---"
  ""
  "# $Title"
  ""
  "Write your content here."
) -join [Environment]::NewLine

Set-Content -LiteralPath $path -Value $template -Encoding UTF8

Write-Output "Created: $path"
