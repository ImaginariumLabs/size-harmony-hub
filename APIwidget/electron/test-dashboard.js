// Simple test for the dashboard
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

// Log startup information
console.log('Starting APIwidget Dashboard Test');
console.log('Node.js version:', process.version);
console.log('Electron version:', process.versions.electron);
console.log('Current directory:', process.cwd());

let mainWindow;

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // Load the app
  if (process.env.NODE_ENV === 'development') {
    console.log('Loading in development mode from http://localhost:5175');
    mainWindow.loadURL('http://localhost:5175');

    // Open DevTools
    mainWindow.webContents.openDevTools();
  } else {
    const indexPath = path.join(__dirname, '../dist/index.html');
    console.log('Loading in production mode from', indexPath);
    mainWindow.loadFile(indexPath);
  }

  // Log when content is loaded
  mainWindow.webContents.on('did-finish-load', () => {
    console.log('Content loaded successfully');
  });

  // Log console messages from the renderer process
  mainWindow.webContents.on('console-message', (event, level, message, line, sourceId) => {
    console.log(`Renderer (${sourceId}:${line}): ${message}`);
  });

  // Log errors
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('Failed to load:', errorCode, errorDescription);
  });
}

// Register IPC handlers
function registerIpcHandlers() {
  // Debug handler
  ipcMain.handle('debug', (event, message) => {
    console.log('Debug from renderer:', message);
    return { received: true, message };
  });

  // Widget visibility toggle
  ipcMain.handle('toggle-widget-visibility', () => {
    console.log('Toggle widget visibility requested');
    return true; // Return true to indicate widget is visible
  });

  // Window control handlers
  ipcMain.handle('minimize-window', () => {
    if (mainWindow) {
      mainWindow.minimize();
      return true;
    }
    return false;
  });

  ipcMain.handle('maximize-window', () => {
    if (mainWindow) {
      if (mainWindow.isMaximized()) {
        mainWindow.unmaximize();
        return false;
      } else {
        mainWindow.maximize();
        return true;
      }
    }
    return false;
  });

  ipcMain.handle('close-window', () => {
    if (mainWindow) {
      mainWindow.close();
      return true;
    }
    return false;
  });

  ipcMain.handle('is-window-maximized', () => {
    if (mainWindow) {
      return mainWindow.isMaximized();
    }
    return false;
  });
}

// Create window when Electron has finished initialization
app.whenReady().then(() => {
  // Register IPC handlers
  registerIpcHandlers();

  // Create the main window
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
