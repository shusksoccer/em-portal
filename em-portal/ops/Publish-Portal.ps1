param(
  [switch]$SkipObsidianSync,
  [switch]$SkipBuild,
  [switch]$SkipPush
)

$ErrorActionPreference = "Stop"

function Resolve-PathSafe {
  param(
    [string]$BaseDir,
    [string]$PathValue
  )
  if ([string]::IsNullOrWhiteSpace($PathValue)) { return $null }
  if ([System.IO.Path]::IsPathRooted($PathValue)) {
    return [System.IO.Path]::GetFullPath($PathValue)
  }
  return [System.IO.Path]::GetFullPath((Join-Path $BaseDir $PathValue))
}

function Load-Config {
  param(
    [string]$OpsDir,
    [string]$PortalRoot
  )

  $configPath = Join-Path $PortalRoot "portal.config.json"
  $examplePath = Join-Path $PortalRoot "portal.config.example.json"
  if (-not (Test-Path $examplePath)) {
    $examplePath = Join-Path $OpsDir "portal.config.example.json"
  }

  if (-not (Test-Path $configPath)) {
    Write-Host ""
    Write-Host "[Config] portal.config.json is missing." -ForegroundColor Yellow
    Write-Host "Create it from the example file before running this script."
    if (Test-Path $examplePath) { Write-Host "Example: $examplePath" }
    throw "Missing config file"
  }

  return (Get-Content -Raw -Encoding UTF8 $configPath | ConvertFrom-Json)
}

function Sync-ObsidianContent {
  param(
    [string]$SourceDir,
    [string]$TargetDir
  )

  if ([string]::IsNullOrWhiteSpace($SourceDir)) {
    Write-Host "[Obsidian] Skipped (contentSourceDir is empty)"
    return
  }
  if (-not (Test-Path $SourceDir)) { throw "Obsidian source not found: $SourceDir" }
  if (-not (Test-Path $TargetDir)) { throw "Portal content folder not found: $TargetDir" }

  Write-Host "[Obsidian] Syncing content..."
  $dirs = @("lessons", "worksheets", "glossary", "figures", "library", "people", "faq", "_sources")
  foreach ($name in $dirs) {
    $src = Join-Path $SourceDir $name
    $dst = Join-Path $TargetDir $name
    if (-not (Test-Path $src)) { continue }
    if (-not (Test-Path $dst)) { New-Item -ItemType Directory -Force -Path $dst | Out-Null }
    $null = robocopy $src $dst /MIR /R:1 /W:1 /NFL /NDL /NJH /NJS /NP
    if ($LASTEXITCODE -ge 8) {
      throw "Obsidian sync failed for '$name' (robocopy code=$LASTEXITCODE)"
    }
  }
}

function Run-Step {
  param(
    [string]$Title,
    [scriptblock]$Script
  )
  Write-Host ""
  Write-Host "== $Title =="
  & $Script
}

$opsDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$portalRoot = Split-Path -Parent $opsDir
$config = Load-Config -OpsDir $opsDir -PortalRoot $portalRoot

$appDir = Resolve-PathSafe -BaseDir $portalRoot -PathValue $config.portal.appDir
$contentDir = Resolve-PathSafe -BaseDir $portalRoot -PathValue $config.portal.contentDir
$repoRootDir = Resolve-PathSafe -BaseDir $portalRoot -PathValue $config.git.repoRootDir
$branch = if ($config.git.branch) { [string]$config.git.branch } else { "main" }
$obsidianSourceDir = Resolve-PathSafe -BaseDir $portalRoot -PathValue $config.obsidian.contentSourceDir

if (-not (Test-Path $appDir)) { throw "appDir not found: $appDir" }
if (-not (Test-Path $repoRootDir)) { throw "repoRootDir not found: $repoRootDir" }

Write-Host "========================================="
Write-Host "EM Portal publish flow"
Write-Host "========================================="
Write-Host "Portal : $portalRoot"
Write-Host "App    : $appDir"
Write-Host "Repo   : $repoRootDir"
Write-Host "Branch : $branch"

$env:npm_config_cache = Join-Path $appDir ".npm-cache"

if (-not $SkipObsidianSync) {
  Run-Step "Obsidian sync" {
    Sync-ObsidianContent -SourceDir $obsidianSourceDir -TargetDir $contentDir
  }
}

Run-Step "Generate search index" {
  Push-Location $appDir
  try { & npx.cmd pnpm run gen:search } finally { Pop-Location }
}

Run-Step "Lint" {
  Push-Location $appDir
  try { & npx.cmd pnpm run lint } finally { Pop-Location }
}

if (-not $SkipBuild) {
  Run-Step "Build" {
    Push-Location $appDir
    try {
      $env:NODE_OPTIONS = "--max-old-space-size=4096"
      & npx.cmd pnpm run build
    } finally {
      Remove-Item Env:NODE_OPTIONS -ErrorAction SilentlyContinue
      Pop-Location
    }
  }
}

Run-Step "Prepare git changes" {
  & git -C $repoRootDir add em-portal/tmp-app
  if ($LASTEXITCODE -ne 0) { throw "git add failed" }
  & git -C $repoRootDir diff --cached --quiet
  if ($LASTEXITCODE -ne 0 -and $LASTEXITCODE -ne 1) { throw "git diff --cached failed" }
  if ($LASTEXITCODE -eq 0) {
    Write-Host "No changes to commit."
    $script:HasChanges = $false
    return
  }
  $script:HasChanges = $true
}

if (-not $HasChanges) {
  Write-Host ""
  Write-Host "Done (no changes)."
  exit 0
}

$defaultMessage = "Update em-portal content/site"
$commitMessage = Read-Host "Commit message (blank = auto)"
if ([string]::IsNullOrWhiteSpace($commitMessage)) {
  $commitMessage = $defaultMessage
}

Run-Step "Commit" {
  & git -C $repoRootDir commit -m $commitMessage
  if ($LASTEXITCODE -ne 0) { throw "git commit failed" }
}

if ($SkipPush) {
  Write-Host ""
  Write-Host "Done (push skipped)."
  exit 0
}

Run-Step "Push" {
  & git -C $repoRootDir push origin $branch
  if ($LASTEXITCODE -ne 0) { throw "git push failed" }
}

Write-Host ""
Write-Host "Done. GitHub push completed. Vercel will auto-deploy if linked."
