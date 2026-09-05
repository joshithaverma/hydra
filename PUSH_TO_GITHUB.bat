@echo off
setlocal
cd /d "%~dp0"
title Push AquaRescue to GitHub
echo ===================================================
echo   Pushing AquaRescue Command Centre to GitHub
echo   Repository: https://github.com/joshithaverma/hydra.git
echo ===================================================
echo.
git branch -M main
git push -u origin main
echo.
echo ===================================================
if %ERRORLEVEL% equ 0 (
  echo Successfully pushed to GitHub!
) else (
  echo Push encountered an error or was cancelled.
)
echo ===================================================
pause
