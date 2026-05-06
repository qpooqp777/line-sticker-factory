@echo off
chcp 65001 >nul
echo.
echo  停止 LINE 貼圖工廠 開發伺服器...
echo.
taskkill /F /IM node.exe >nul 2>&1
echo  已停止！
pause