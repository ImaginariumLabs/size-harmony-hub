@echo off
echo Starting APIwidget...
echo.

cd APIwidget

REM Start Vite development server
start cmd /k "npm run dev"

REM Wait for Vite server to start
timeout /t 5

REM Start Electron app
start cmd /k "npm run electron:dev"

echo.
echo APIwidget started successfully!
