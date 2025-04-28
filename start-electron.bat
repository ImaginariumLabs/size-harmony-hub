@echo off
echo Starting APIwidget Electron app with debug logging...
cd APIwidget
set NODE_ENV=development
set OPEN_MAIN_WINDOW=true
set DEBUG=electron:*
set ELECTRON_ENABLE_LOGGING=true
npm run electron:dev
