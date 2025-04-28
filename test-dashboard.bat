@echo off
echo Starting APIwidget Dashboard Test...
cd APIwidget
set NODE_ENV=development
set DEBUG=electron:*
set ELECTRON_ENABLE_LOGGING=true
npm run test:dashboard
