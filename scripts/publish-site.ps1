param(
  [Parameter(Mandatory = $true)]
  [string]$SourceDir,
  [string]$Message = "",
  [switch]$Commit,
  [switch]$Push
)

$ErrorActionPreference = "Stop"

& "$PSScriptRoot\sync-obsidian.ps1" -SourceDir $SourceDir -TargetDir ".\web\content" -Clean

if (-not $Commit) {
  Write-Output "Sync complete. Commit skipped."
  exit 0
}

git add web/content
git add web/site
git add scripts
git add .github/workflows/site-ci.yml

if ([string]::IsNullOrWhiteSpace($Message)) {
  $Message = "content: sync from obsidian $(Get-Date -Format "yyyy-MM-dd HH:mm")"
}

git commit -m $Message

if ($Push) {
  git push
  Write-Output "Pushed to remote."
} else {
  Write-Output "Committed locally. Push skipped."
}
