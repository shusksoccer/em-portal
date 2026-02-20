param(
  [Parameter(Mandatory = $true)]
  [string]$SourceDir,
  [string]$TargetDir = ".\web\content",
  [string]$Pattern = "*.md",
  [switch]$Clean
)

$ErrorActionPreference = "Stop"

$source = Resolve-Path -LiteralPath $SourceDir

if (-not (Test-Path -LiteralPath $TargetDir)) {
  New-Item -ItemType Directory -Path $TargetDir | Out-Null
}

$target = Resolve-Path -LiteralPath $TargetDir

if ($Clean -and ($source.Path -eq $target.Path)) {
  throw "SourceDir and TargetDir are the same path. Refusing to run with -Clean."
}

if ($Clean) {
  Get-ChildItem -Path $target -File -Filter "*.md" | Remove-Item -Force
}

$files = Get-ChildItem -Path $source -File -Filter $Pattern

if ($files.Count -eq 0) {
  Write-Output "No markdown files found in $source with pattern: $Pattern"
  exit 0
}

$copied = 0
foreach ($file in $files) {
  $dest = Join-Path $target $file.Name
  if ($file.FullName -eq $dest) {
    continue
  }
  Copy-Item -LiteralPath $file.FullName -Destination $dest -Force
  $copied++
}

Write-Output "Synced $copied file(s) from '$source' to '$target'."
