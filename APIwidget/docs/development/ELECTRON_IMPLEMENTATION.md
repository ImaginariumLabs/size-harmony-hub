# Electron Implementation Guide

## Overview

This comprehensive guide outlines the implementation of the APIwidget Electron application, focusing on the floating widget functionality, desktop integration, and modern UI/UX design principles.

## Table of Contents

1. [Core Components](#core-components)
2. [Implementation Details](#implementation-details)
3. [Windows-Specific Features](#windows-specific-features)
4. [Security Considerations](#security-considerations)
5. [Distribution](#distribution)
6. [Development Approach](#development-approach)
7. [Testing](#testing)
8. [Next Steps](#next-steps)

## Core Components

### 1. Main Process (main.js)

The main process is responsible for:

- Creating and managing windows (main window and widget window)
- Handling IPC communication between renderer and main processes
- Managing system tray integration
- Storing and retrieving settings
- Handling application lifecycle events

### 2. Widget Window

The widget window is a frameless, transparent window that:

- Floats on top of other applications
- Can be dragged anywhere on the screen
- Persists position and appearance settings
- Displays real-time API cost data
- Provides quick access to settings and controls

### 3. Settings Management

Settings are stored securely using electron-store and include:

- Widget position, size, and theme
- API keys (encrypted)
- Application preferences
- Alert thresholds
- Refresh intervals

### 4. System Tray Integration

The system tray provides:

- Quick access to show/hide the widget
- Widget size and theme controls
- Application settings
- About information
- Quit functionality

## Implementation Details

### Floating Widget

The widget is implemented as a frameless, transparent BrowserWindow with the following configuration:

```javascript
widgetWindow = new BrowserWindow({
  width: widgetWidth,
  height: widgetHeight,
  frame: false,
  transparent: true,
  alwaysOnTop: true,
  skipTaskbar: true,
  resizable: true,
  hasShadow: true,
  x: savedPosition[0],
  y: savedPosition[1],
  webPreferences: {
    nodeIntegration: false,
    contextIsolation: true,
    preload: path.join(__dirname, 'preload.js')
  },
  roundedCorners: true,
  thickFrame: false,
  focusable: false
});
```

Key features:
- `transparent: true` - Allows for glass morphism effect
- `alwaysOnTop: true` - Ensures widget stays visible
- `frame: false` - Removes window chrome for custom styling
- `skipTaskbar: true` - Prevents widget from appearing in taskbar
- `focusable: false` - Prevents the widget from stealing focus

### IPC Communication

The preload script exposes a secure API for the renderer process:

```javascript
contextBridge.exposeInMainWorld('electronAPI', {
  // Window management
  toggleMainWindow: () => ipcRenderer.invoke('toggle-main-window'),
  closeWidget: () => ipcRenderer.invoke('close-widget'),
  toggleWidgetVisibility: () => ipcRenderer.invoke('toggle-widget-visibility'),
  
  // Settings management
  getSettings: () => ipcRenderer.invoke('get-settings'),
  saveSettings: (settings) => ipcRenderer.invoke('save-settings', settings),
  
  // API data
  getApiCost: (provider) => ipcRenderer.invoke('get-api-cost', provider),
  getAllApiCosts: () => ipcRenderer.invoke('get-all-api-costs'),
  
  // Utility
  isElectron: true
});
```

### Settings Storage

Settings are stored securely using electron-store with the following schema:

```javascript
const store = new Store({
  encryptionKey: 'apiwidget-secure-key',
  schema: {
    apiKeys: {
      type: 'object',
      properties: {
        openai: { type: 'string' },
        github: { type: 'string' },
        aws: { type: 'string' }
      }
    },
    widget: {
      type: 'object',
      properties: {
        position: { type: 'array' },
        visible: { type: 'boolean', default: true },
        size: { type: 'string', default: 'medium' },
        theme: { type: 'string', default: 'dark' },
        refreshInterval: { type: 'number', default: 30 },
        activeProvider: { type: 'string', default: 'openai' },
        alertThresholds: { type: 'object' }
      }
    },
    app: {
      type: 'object',
      properties: {
        startWithSystem: { type: 'boolean', default: false },
        minimizeToTray: { type: 'boolean', default: true },
        showNotifications: { type: 'boolean', default: true },
        theme: { type: 'string', default: 'dark' }
      }
    }
  }
});
```

### Desktop Integration Service

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

### TypeScript Definitions

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

## Development Approach

The implementation follows a phased approach:

1. **Foundation** (Sprints 1-2): Set up Electron infrastructure and basic desktop integration
2. **Floating Widget** (Sprints 3-4): Implement core widget functionality and features
3. **Integration & Polish** (Sprints 5-6): Connect all components and prepare for distribution

## Testing

Testing the Electron application requires a multi-layered approach:

1. **Unit Testing**: Individual components and functions
2. **Integration Testing**: Communication between processes and components
3. **End-to-End Testing**: Complete user flows and system behavior
4. **Platform Testing**: Verification across Windows, macOS, and Linux

## Next Steps

1. **Complete Environment Setup**: Install required dependencies and configure development tools
2. **Implement Core Electron Structure**: Create main process and preload scripts
3. **Set Up Build Pipeline**: Configure development and production builds
4. **Begin Widget Implementation**: Start with the basic floating window functionality
5. **Implement Main Dashboard**: Create a modern dashboard UI
6. **Enhance Widget Functionality**: Add more customization options
7. **Improve System Integration**: Add more robust error handling
