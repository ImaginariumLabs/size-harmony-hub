# Electron Implementation

## Overview

This document outlines the implementation of the APIwidget Electron application, focusing on the floating widget functionality and modern UI/UX design principles.

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

## Modern UI/UX Features

### Glass Morphism

The widget uses glass morphism design principles:
- Semi-transparent background
- Subtle blur effect
- Light border for definition
- Soft shadows for depth

### Responsive Design

The widget adapts to different sizes:
- Compact: Minimal information display
- Small: Basic information
- Medium: Standard view with all information
- Large: Expanded view with additional details

### Keyboard Shortcuts

The widget supports keyboard shortcuts:
- 's' - Open settings panel
- 'Escape' - Close settings panel
- 't' - Toggle theme
- 'c' - Cycle through sizes
- Arrow keys - Navigate between providers

### System Integration

The application integrates with the operating system:
- System tray with context menu
- Start with system option
- Notifications for important events
- Always-on-top functionality

## Next Steps

1. **Implement Main Dashboard**
   - Create a modern dashboard UI
   - Implement navigation and layout
   - Add data visualization components

2. **Enhance Widget Functionality**
   - Add more customization options
   - Implement additional providers
   - Create advanced visualization options

3. **Improve System Integration**
   - Add more robust error handling
   - Implement auto-update functionality
   - Enhance cross-platform compatibility
