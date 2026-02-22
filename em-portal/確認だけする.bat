@echo off
setlocal
chcp 65001 >nul
cd /d "%~dp0"

echo EM Portal 確認のみ（送信なし）を開始します...
powershell.exe -ExecutionPolicy Bypass -File "%~dp0ops\Publish-Portal.ps1" -SkipPush
set EXIT_CODE=%ERRORLEVEL%

echo.
if %EXIT_CODE% EQU 0 (
  echo 完了しました（GitHub送信はしていません）。
) else (
  echo 停止しました。上の表示を確認してください。
)
pause
exit /b %EXIT_CODE%
