@echo off
setlocal
title Smart Hospital - Launcher
color 0A

set ROOT=%~dp0

echo.
echo ============================================
echo  Smart Hospital Management System
echo ============================================
echo.
echo [1/4] Starting Backend  (http://localhost:5000)
start "Backend API" cmd /k "cd /d %ROOT%backend && npm run dev"
timeout /t 7 /nobreak >nul

echo [2/4] Starting Patient Portal  (http://localhost:5173)
start "Patient Portal" cmd /k "cd /d %ROOT%frontend && npm run dev:patient"
timeout /t 4 /nobreak >nul

echo [3/4] Starting Doctor Portal  (http://localhost:5151)
start "Doctor Portal" cmd /k "cd /d %ROOT%frontend && npm run dev:doctor"
timeout /t 4 /nobreak >nul

echo [4/4] Starting Admin Portal  (http://localhost:5152)
start "Admin Portal" cmd /k "cd /d %ROOT%frontend && npm run dev:admin"
echo.

echo Waiting 18 seconds for servers to be ready...
timeout /t 18 /nobreak >nul

echo Opening portals in browser...
start http://localhost:5173
timeout /t 1 /nobreak >nul
start http://localhost:5151
timeout /t 1 /nobreak >nul
start http://localhost:5152

echo.
echo ============================================
echo  ALL DONE!
echo.
echo  Patient  -  http://localhost:5173
echo  Doctor   -  http://localhost:5151
echo  Admin    -  http://localhost:5152
echo  Backend  -  http://localhost:5000
echo.
echo  KEEP ALL 4 BLACK WINDOWS OPEN!
echo ============================================
echo.
pause
endlocal
