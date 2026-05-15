@echo off
title Smart Hospital - Patient Portal (Port 5173)
echo.
echo  ==========================================
echo   Patient Portal Starting...
echo   URL: http://localhost:5173
echo   Login: patient@demo.com / demo123
echo  ==========================================
echo.
cd /d "%~dp0frontend"
npm run dev:patient
pause
