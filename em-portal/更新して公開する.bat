@echo off
setlocal
chcp 65001 >nul
cd /d "%~dp0"

echo EM Portal 更新→公開 を開始します...
powershell.exe -ExecutionPolicy Bypass -File "%~dp0ops\Publish-Portal.ps1"
set EXIT_CODE=%ERRORLEVEL%

echo.
if %EXIT_CODE% EQU 0 (
  echo 完了しました。
) else (
  echo 停止しました。上の表示を確認してください。
)
pause
exit /b %EXIT_CODE%
