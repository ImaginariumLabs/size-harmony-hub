# APIwidget Desktop Implementation Guide

## Overview

This guide outlines how to convert the APIwidget web application into a desktop application using Electron, allowing it to run natively on Windows, macOS, and Linux.

## Prerequisites

- Node.js 16.x or higher
- npm 7.x or higher
- Existing APIwidget web application

## Implementation Steps

### 1. Install Electron Dependencies

```bash
npm install electron electron-builder --save-dev
npm install electron-store electron-updater
```

### 2. Create Electron Main Process Files

#### electron/main.js

```javascript
const { app, BrowserWindow, ipcMain, Menu, Tray } = require('electron');
const path = require('path');
const url = require('url');
const Store = require('electron-store');
const { autoUpdater } = require('electron-updater');

// Initialize store for persistent data
const store = new Store();

let mainWindow;
let tray;

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, '../build/icon.png')
  });

  // Load the app
  if (app.isPackaged) {
    // Production mode
    mainWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, '../dist/index.html'),
        protocol: 'file:',
        slashes: true
      })
    );
  } else {
    // Development mode
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  }

  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Handle minimize to tray
  mainWindow.on('minimize', (event) => {
    event.preventDefault();
    mainWindow.hide();
  });

  // Create tray icon
  createTray();

  // Check for updates
  if (app.isPackaged) {
    autoUpdater.checkForUpdatesAndNotify();
  }
}

function createTray() {
  tray = new Tray(path.join(__dirname, '../build/icon.png'));
  const contextMenu = Menu.buildFromTemplate([
    { 
      label: 'Open APIwidget', 
      click: () => {
        if (mainWindow === null) {
          createWindow();
        } else {
          mainWindow.show();
        }
      } 
    },
    { 
      label: 'Check for Updates', 
      click: () => {
        autoUpdater.checkForUpdatesAndNotify();
      } 
    },
    { type: 'separator' },
    { 
      label: 'Quit', 
      click: () => {
        app.quit();
      } 
    }
  ]);
  
  tray.setToolTip('APIwidget');
  tray.setContextMenu(contextMenu);
  
  tray.on('click', () => {
    if (mainWindow === null) {
      createWindow();
    } else {
      mainWindow.show();
    }
  });
}

// App ready event
app.whenReady().then(() => {
  createWindow();
  
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC handlers for communication between renderer and main process
ipcMain.handle('get-api-key', async (event, provider) => {
  return store.get(`apiKeys.${provider}`);
});

ipcMain.handle('save-api-key', async (event, provider, key) => {
  store.set(`apiKeys.${provider}`, key);
  return true;
});

ipcMain.handle('delete-api-key', async (event, provider) => {
  store.delete(`apiKeys.${provider}`);
  return true;
});

// Auto updater events
autoUpdater.on('update-available', () => {
  if (mainWindow) {
    mainWindow.webContents.send('update-available');
  }
});

autoUpdater.on('update-downloaded', () => {
  if (mainWindow) {
    mainWindow.webContents.send('update-downloaded');
  }
});
```

#### electron/preload.js

```javascript
const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electron', {
  apiKeys: {
    get: (provider) => ipcRenderer.invoke('get-api-key', provider),
    save: (provider, key) => ipcRenderer.invoke('save-api-key', provider, key),
    delete: (provider) => ipcRenderer.invoke('delete-api-key', provider)
  },
  app: {
    onUpdateAvailable: (callback) => {
      ipcRenderer.on('update-available', callback);
    },
    onUpdateDownloaded: (callback) => {
      ipcRenderer.on('update-downloaded', callback);
    },
    installUpdate: () => {
      ipcRenderer.send('install-update');
    }
  }
});
```

### 3. Update package.json

Add the following to your package.json:

```json
{
  "main": "electron/main.js",
  "scripts": {
    "start": "vite",
    "build": "vite build",
    "electron:dev": "concurrently \"vite\" \"electron .\"",
    "electron:build": "vite build && electron-builder",
    "electron:build:win": "vite build && electron-builder --win"
  },
  "build": {
    "appId": "com.apiwidget.app",
    "productName": "APIwidget",
    "directories": {
      "output": "release"
    },
    "files": [
      "dist/**/*",
      "electron/**/*"
    ],
    "win": {
      "target": [
        "nsis"
      ],
      "icon": "build/icon.ico"
    },
    "mac": {
      "target": [
        "dmg"
      ],
      "icon": "build/icon.icns"
    },
    "linux": {
      "target": [
        "AppImage"
      ],
      "icon": "build/icon.png"
    },
    "publish": {
      "provider": "github",
      "owner": "your-github-username",
      "repo": "apiwidget"
    }
  }
}
```

### 4. Create a Service for Desktop Integration

```typescript
// src/services/desktopIntegration.ts
export const isElectron = () => {
  return window.electron !== undefined;
};

export const getApiKey = async (provider: string): Promise<string | null> => {
  if (isElectron()) {
    return window.electron.apiKeys.get(provider);
  }
  
  // Fall back to web storage method
  return null;
};

export const saveApiKey = async (provider: string, key: string): Promise<boolean> => {
  if (isElectron()) {
    return window.electron.apiKeys.save(provider, key);
  }
  
  // Fall back to web storage method
  return false;
};

export const deleteApiKey = async (provider: string): Promise<boolean> => {
  if (isElectron()) {
    return window.electron.apiKeys.delete(provider);
  }
  
  // Fall back to web storage method
  return false;
};
```

### 5. Update TypeScript Definitions

```typescript
// src/electron.d.ts
interface ElectronAPI {
  apiKeys: {
    get: (provider: string) => Promise<string | null>;
    save: (provider: string, key: string) => Promise<boolean>;
    delete: (provider: string) => Promise<boolean>;
  };
  app: {
    onUpdateAvailable: (callback: () => void) => void;
    onUpdateDownloaded: (callback: () => void) => void;
    installUpdate: () => void;
  };
}

declare global {
  interface Window {
    electron: ElectronAPI;
  }
}
```

### 6. Build Icons

Create application icons in the following formats:
- Windows: `build/icon.ico` (256x256)
- macOS: `build/icon.icns` (1024x1024)
- Linux: `build/icon.png` (512x512)

### 7. Build and Package the Application

```bash
# Install additional dependencies
npm install concurrently --save-dev

# Build for Windows
npm run electron:build:win
```

## Windows-Specific Features

### System Tray Integration

The application minimizes to the system tray, allowing it to run in the background while monitoring API usage.

### Auto-start on Boot

Add the following to enable auto-start on Windows:

```javascript
// In electron/main.js
const { app } = require('electron');

// Set app to auto-start on login
app.setLoginItemSettings({
  openAtLogin: true,
  path: app.getPath('exe')
});
```

### Native Notifications

Use Windows native notifications:

```javascript
// In electron/main.js
const { Notification } = require('electron');

function showNotification(title, body) {
  new Notification({
    title,
    body,
    icon: path.join(__dirname, '../build/icon.png')
  }).show();
}

// Example usage
ipcMain.on('api-limit-warning', (event, provider, percentage) => {
  showNotification(
    `${provider} API Limit Warning`,
    `You've used ${percentage}% of your ${provider} API quota.`
  );
});
```

## Security Considerations

### API Key Storage

When running as a desktop application, API keys are stored securely using `electron-store` with encryption:

```javascript
const Store = require('electron-store');

const store = new Store({
  encryptionKey: 'your-encryption-key', // Use a secure, randomly generated key
  schema: {
    apiKeys: {
      type: 'object',
      properties: {
        // Define schema for each provider
      }
    }
  }
});
```

### HTTPS Requests

Ensure all API requests use HTTPS:

```javascript
// In electron/main.js
app.on('web-contents-created', (event, contents) => {
  contents.on('will-navigate', (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl);
    
    // Only allow HTTPS URLs or localhost for development
    if (parsedUrl.protocol !== 'https:' && !parsedUrl.hostname.includes('localhost')) {
      event.preventDefault();
    }
  });
});
```

## Distribution

### Windows Store

To distribute through the Windows Store:
1. Register as a Microsoft Developer
2. Use `electron-windows-store` to package the app
3. Submit to the Windows Store

### Direct Download

Provide a direct download option with an installer:
1. Use `electron-builder` to create an NSIS installer
2. Host the installer on your website
3. Implement auto-updates using `electron-updater`
