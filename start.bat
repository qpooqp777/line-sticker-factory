@echo off
chcp 65001 >nul
echo.
echo  啟動 LINE 貼圖工廠 開發伺服器...
echo.
cd /d "%~dp0"
npm run dev