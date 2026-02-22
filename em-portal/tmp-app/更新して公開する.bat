@echo off
setlocal
chcp 65001 >nul

cd /d "%~dp0"

echo ==============================
echo EM Portal かんたん公開
echo ==============================
echo.
echo 1) 内容チェック（lint）
echo 2) サイト作成テスト（build）
echo 3) 変更を保存（commit）
echo 4) GitHubに送る（push）
echo.
echo ※ Vercelを一度連携していれば、このあと自動で公開更新されます
echo.

where npx >nul 2>nul
if errorlevel 1 (
  echo [エラー] Node.js / npm が見つかりません。
  pause
  exit /b 1
)

echo [1/4] 内容チェック中...
call npx pnpm run lint
if errorlevel 1 (
  echo.
  echo [停止] チェックで止まりました。修正してからもう一度実行してください。
  pause
  exit /b 1
)

echo.
echo [2/4] サイト作成テスト中...
set "NODE_OPTIONS=--max-old-space-size=4096"
call npx pnpm run build
if errorlevel 1 (
  echo.
  echo [停止] サイト作成テストで止まりました。修正してからもう一度実行してください。
  pause
  exit /b 1
)

echo.
set /p COMMIT_MSG=保存メッセージを入力してください（空なら自動）: 
if "%COMMIT_MSG%"=="" set "COMMIT_MSG=Update em-portal tmp-app"

echo.
echo [3/4] 変更を保存します...
git -C "%~dp0..\.." add em-portal/tmp-app
if errorlevel 1 (
  echo [停止] 変更の準備でエラーになりました。
  pause
  exit /b 1
)

git -C "%~dp0..\.." diff --cached --quiet
if not errorlevel 1 (
  echo 保存する変更がありません。終了します。
  pause
  exit /b 0
)

git -C "%~dp0..\.." commit -m "%COMMIT_MSG%"
if errorlevel 1 (
  echo [停止] 保存（commit）で止まりました。
  pause
  exit /b 1
)

echo.
echo [4/4] GitHub に送ります...
git -C "%~dp0..\.." push origin main
if errorlevel 1 (
  echo.
  echo [停止] GitHub への送信で止まりました。
  echo ネット接続やログイン状態を確認してください。
  pause
  exit /b 1
)

echo.
echo 完了しました。
echo GitHubに送信しました。Vercel連携済みなら自動で公開更新されます。
pause
exit /b 0
