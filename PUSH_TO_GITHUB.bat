@echo off
setlocal
cd /d "%~dp0"
title Push AquaRescue to GitHub

set "GIT_PATH=C:\Users\joshi\AppData\Local\Microsoft\WinGet\Packages\Git.MinGit_Microsoft.Winget.Source_8wekyb3d8bbwe\cmd"
if exist "%GIT_PATH%\git.exe" (
  set "PATH=%GIT_PATH%;%PATH%"
)

echo ===================================================
echo   Pushing AquaRescue Command Centre to GitHub
echo   Repository: https://github.com/joshithaverma/hydra.git
echo ===================================================
echo.
git --version
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
