@echo off
echo ===================================
echo       APIwidget Launcher
echo ===================================
echo.

echo Current directory: %CD%

REM Check if we're in the correct directory
if exist package.json (
    echo Found package.json in current directory.
) else if exist APIwidget\package.json (
    echo Found package.json in APIwidget subdirectory.
    cd APIwidget
) else (
    echo Error: Could not find package.json in current directory or APIwidget subdirectory.
    echo Please run this script from the project root directory.
    pause
    exit /b 1
)

echo.
echo Starting Vite development server...
start "APIwidget - Vite Server" cmd /k "npm run dev"

echo Waiting for Vite server to start...
timeout /t 8 >nul

echo Starting Electron app...
start "APIwidget - Electron" cmd /k "npm run electron:dev"

echo.
echo ===================================
echo APIwidget started successfully!
echo.
echo Vite server running on port 5175
echo Electron app connected to Vite server
echo.
echo Close this window to stop all processes
echo ===================================
echo.

REM Wait for user to close the window
pause

REM Kill all related processes when the user closes the window
echo Shutting down APIwidget...
taskkill /F /FI "WINDOWTITLE eq APIwidget - Vite Server*" >nul 2>nul
taskkill /F /FI "WINDOWTITLE eq APIwidget - Electron*" >nul 2>nul
echo Done!
