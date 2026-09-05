@echo off
setlocal
cd /d "%~dp0"
title AquaRescue Command Centre
where node >nul 2>nul
if errorlevel 1 (
  echo.
  echo Node.js is required to run AquaRescue.
  echo Install Node.js and double-click this file again.
  pause
  exit /b 1
)
if not exist node_modules\express (
  echo Installing AquaRescue dependencies for first run...
  call npm install
  if errorlevel 1 (
    echo.
    echo npm install failed. Check your internet connection.
    pause
    exit /b 1
  )
)
echo.
echo Starting AquaRescue Command Centre...
start "AquaRescue Command Centre" http://localhost:3000
node server.js
pause
