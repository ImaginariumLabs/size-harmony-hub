@echo off
echo Starting APIwidget Electron App...
cd APIwidget
set NODE_ENV=development
set OPEN_MAIN_WINDOW=true
npm run electron:dev
