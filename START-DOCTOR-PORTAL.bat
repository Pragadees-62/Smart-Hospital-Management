@echo off
title Smart Hospital - Doctor Portal (Port 5151)
echo.
echo  ==========================================
echo   Doctor Portal Starting...
echo   URL: http://localhost:5151
echo   Login: doctor@demo.com / demo123
echo  ==========================================
echo.
cd /d "%~dp0frontend"
npm run dev:doctor
pause
