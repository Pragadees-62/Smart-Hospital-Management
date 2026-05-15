@echo off
title Smart Hospital - Admin Portal (Port 5152)
echo.
echo  ==========================================
echo   Admin Portal Starting...
echo   URL: http://localhost:5152
echo   Login: admin@demo.com / demo123
echo  ==========================================
echo.
cd /d "%~dp0frontend"
npm run dev:admin
pause
