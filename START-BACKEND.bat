@echo off
title Smart Hospital - Backend (Port 5000)
echo.
echo  ==========================================
echo   Smart Hospital Backend Starting...
echo   API: http://localhost:5000
echo  ==========================================
echo.
cd /d "%~dp0backend"
npm run dev
pause
