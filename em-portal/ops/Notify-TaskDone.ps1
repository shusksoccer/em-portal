param(
  [string]$Message = "Task completed.",
  [switch]$Silent
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

try {
  if (-not $Silent) {
    [Console]::Beep(880, 120)
    Start-Sleep -Milliseconds 60
    [Console]::Beep(1175, 180)
  }
} catch {
  # Ignore beep errors.
}

try {
  Add-Type -AssemblyName System.Speech -ErrorAction Stop
  $synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
  $synth.Speak($Message)
} catch {
  # Ignore TTS errors.
}

Write-Host "[Notify] $Message"
