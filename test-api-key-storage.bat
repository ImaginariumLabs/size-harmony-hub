@echo off
echo Testing API Key Storage...
cd APIwidget
set NODE_ENV=development
npx electron electron/tests/test-api-key-storage.js
