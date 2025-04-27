# APIwidget Electron Development Guide

## Overview

This guide provides detailed instructions for developing the APIwidget Electron application, with a focus on the floating widget feature. It covers development setup, architecture, best practices, and testing procedures.

## Development Environment Setup

### Prerequisites

- Node.js 16.x or higher
- npm 7.x or higher
- Git
- Visual Studio Code (recommended)

### Initial Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/your-org/apiwidget.git
   cd apiwidget
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Install Electron-specific dependencies:
   ```bash
   npm install electron electron-builder electron-store electron-updater --save-dev
   npm install concurrently cross-env --save-dev
   ```

### Development Workflow

1. Start the development server:
   ```bash
   npm run electron:dev
   ```
   This will:
   - Start the Vite development server
   - Launch Electron pointing to the development server
   - Enable hot reloading for renderer process

2. Build for production:
   ```bash
   npm run electron:build
   ```
   This will:
   - Build the React application
   - Package it with Electron
   - Create installers based on your platform

3. Build for a specific platform:
   ```bash
   # Windows
   npm run electron:build:win

   # macOS
   npm run electron:build:mac

   # Linux
   npm run electron:build:linux
   ```

## Project Structure

```
apiwidget/
├── electron/               # Electron-specific code
│   ├── main.js             # Main process entry point
│   ├── preload.js          # Preload script for secure IPC
│   └── widget.js           # Widget window management
├── src/
│   ├── components/         # React components
│   │   └── widgets/        # Widget-related components
│   ├── contexts/           # React contexts
│   ├── hooks/              # Custom React hooks
│   ├── pages/              # Page components
│   ├── services/           # Service modules
│   │   └── electron/       # Electron integration services
│   ├── App.tsx             # Main App component
│   └── main.tsx            # Entry point
├── public/                 # Static assets
│   └── widget.html         # Widget HTML template
├── build/                  # Build resources
│   ├── icon.ico            # Windows icon
│   ├── icon.icns           # macOS icon
│   └── icon.png            # Linux icon
└── package.json            # Project configuration
```

## Architecture

### Process Architecture

Electron applications have two types of processes:

1. **Main Process**:
   - Runs the main application logic
   - Controls application lifecycle
   - Creates and manages windows
   - Accesses Node.js APIs

2. **Renderer Process**:
   - Runs the web UI (React application)
   - Displays the user interface
   - Handles user interactions
   - Limited to web APIs by default

### Communication Architecture

Communication between processes follows these principles:

1. **Context Isolation**:
   - Renderer process cannot directly access Node.js APIs
   - Preload script exposes a limited API via contextBridge
   - Main process handles sensitive operations

2. **IPC Communication**:
   - Renderer to Main: `ipcRenderer.invoke()` → `ipcMain.handle()`
   - Main to Renderer: `webContents.send()` → `ipcRenderer.on()`
   - Always validate and sanitize data crossing process boundaries

### Window Architecture

The application has two main windows:

1. **Main Window**:
   - Full application interface
   - Created on application start
   - Can be minimized to tray

2. **Widget Window**:
   - Floating cost display
   - Frameless and always-on-top
   - Draggable and persistent
   - Can exist independently of main window

## Glass Morphism Widget Implementation

The glass morphism widget is a floating, always-on-top window that displays API usage costs in real-time. It features a modern glass-like design with blur effects, transparency, and subtle shadows.

### Design Principles

1. **Minimalist Design**: Clean, simple interface with only essential information
2. **Glass Morphism**: Translucent, blurred background with subtle borders
3. **Non-Intrusive**: Small footprint, stays out of the way
4. **Informative**: Clearly displays key metrics at a glance
5. **Interactive**: Draggable, resizable, and customizable

### Widget Window Creation

```javascript
function createWidgetWindow() {
  widgetWindow = new BrowserWindow({
    width: 240,
    height: 140,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: true,
    hasShadow: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    roundedCorners: true,
    thickFrame: false,
    focusable: false
  });

  // Load the widget content
  if (process.env.NODE_ENV === 'development') {
    widgetWindow.loadURL('http://localhost:5173/widget.html');
  } else {
    widgetWindow.loadFile(path.join(__dirname, '../public/widget.html'));
  }

  // Make the window draggable
  widgetWindow.setMovable(true);

  // Save position when moved
  widgetWindow.on('moved', () => {
    const position = widgetWindow.getPosition();
    store.set('widget.position', position);
  });

  // Save size when resized
  widgetWindow.on('resize', () => {
    const size = widgetWindow.getSize();
    store.set('widget.customSize', size);
  });
}
```

### Widget Persistence

```javascript
// Load saved position
const defaultPosition = [20, 20];
const savedPosition = store.get('widget.position', defaultPosition);

// Ensure position is on screen
const displays = screen.getAllDisplays();
const primaryDisplay = displays.find(d => d.bounds.x === 0 && d.bounds.y === 0);

if (savedPosition[0] > primaryDisplay.bounds.width ||
    savedPosition[1] > primaryDisplay.bounds.height) {
  // Reset to default if off-screen
  widgetWindow.setPosition(defaultPosition[0], defaultPosition[1]);
} else {
  widgetWindow.setPosition(savedPosition[0], savedPosition[1]);
}
```

### Widget Toggle

```javascript
// Toggle widget visibility
ipcMain.handle('toggle-widget', () => {
  if (widgetWindow) {
    if (widgetWindow.isVisible()) {
      widgetWindow.hide();
      store.set('widget.visible', false);
    } else {
      widgetWindow.show();
      store.set('widget.visible', true);
    }
    return widgetWindow.isVisible();
  }
  return false;
});

// Register global shortcut
app.whenReady().then(() => {
  globalShortcut.register('CommandOrControl+Shift+W', () => {
    if (widgetWindow) {
      if (widgetWindow.isVisible()) {
        widgetWindow.hide();
      } else {
        widgetWindow.show();
      }
    }
  });
});
```

### HTML Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>APIwidget</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      overflow: hidden;
      background-color: transparent;
      font-family: 'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif;
    }

    #widget-root {
      width: 100%;
      height: 100%;
    }
  </style>
</head>
<body>
  <div id="widget-root"></div>
  <script type="module" src="./widget-bundle.js"></script>
  <script type="module" src="/src/electron/widget.js"></script>
</body>
</html>
```

### React Component Implementation

```tsx
import React from 'react';
import './GlassMorphismWidget.css';

interface GlassMorphismWidgetProps {
  onToggleMainWindow: () => void;
  onClose: () => void;
}

const GlassMorphismWidget: React.FC<GlassMorphismWidgetProps> = ({
  onToggleMainWindow,
  onClose
}) => {
  return (
    <div className="glass-widget">
      <div className="widget-header">
        <h3 className="widget-title">OpenAI API USAGE</h3>
        <div className="widget-controls">
          <button
            className="widget-control-button"
            onClick={onToggleMainWindow}
          ></button>
        </div>
      </div>

      <div className="widget-content">
        <p className="widget-cost">$45.28</p>
        <p className="widget-change positive">
          <span>↑</span> $2.15 (4.9%)
        </p>
      </div>

      <div className="widget-footer">
        <div className="widget-update-time">Updated: just now</div>
        <div className="widget-resize-handle"></div>
      </div>
    </div>
  );
};

export default GlassMorphismWidget;
```

### CSS for Glass Morphism Effect

```css
.glass-widget {
  background: rgba(30, 30, 30, 0.7);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 15px;
  color: white;
  font-family: Arial, sans-serif;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

/* Light theme variant */
.glass-widget.light {
  background: rgba(255, 255, 255, 0.7);
  color: #333;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}
```

### Widget Entry Point

```tsx
// src/widget.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import GlassMorphismWidget from './components/widgets/GlassMorphismWidget';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('widget-root')!).render(
  <React.StrictMode>
    <GlassMorphismWidget
      onToggleMainWindow={() => window.electronAPI?.toggleMainWindow()}
      onClose={() => window.electronAPI?.closeWidget()}
    />
  </React.StrictMode>
);
```

## Secure API Key Storage

```javascript
const Store = require('electron-store');

// Generate a secure encryption key
const crypto = require('crypto');
const encryptionKey = app.isPackaged
  ? app.getPath('userData') // Use a value derived from the user's data path
  : 'dev-encryption-key';   // Use a fixed key for development

// Create encrypted store
const store = new Store({
  encryptionKey,
  schema: {
    apiKeys: {
      type: 'object',
      properties: {
        openai: { type: 'string' },
        github: { type: 'string' },
        // Add other providers as needed
      }
    },
    widget: {
      type: 'object',
      properties: {
        position: {
          type: 'array',
          items: { type: 'number' },
          minItems: 2,
          maxItems: 2
        },
        visible: { type: 'boolean' }
      }
    }
  }
});

// Expose API key methods to renderer
ipcMain.handle('get-api-key', (event, provider) => {
  return store.get(`apiKeys.${provider}`);
});

ipcMain.handle('save-api-key', (event, provider, key) => {
  store.set(`apiKeys.${provider}`, key);
  return true;
});

ipcMain.handle('delete-api-key', (event, provider) => {
  store.delete(`apiKeys.${provider}`);
  return true;
});
```

## Testing

### Unit Testing

Use Jest for unit testing:

```javascript
// __tests__/electron/store.test.js
const { ipcMain } = require('electron');
const Store = require('electron-store');

// Mock electron and electron-store
jest.mock('electron', () => ({
  ipcMain: {
    handle: jest.fn()
  },
  app: {
    getPath: jest.fn().mockReturnValue('test-path')
  }
}));

jest.mock('electron-store');

describe('API Key Storage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Store.mockClear();
  });

  test('should register IPC handlers', () => {
    require('../../electron/store');
    expect(ipcMain.handle).toHaveBeenCalledWith('get-api-key', expect.any(Function));
    expect(ipcMain.handle).toHaveBeenCalledWith('save-api-key', expect.any(Function));
    expect(ipcMain.handle).toHaveBeenCalledWith('delete-api-key', expect.any(Function));
  });

  // Add more tests...
});
```

### Integration Testing

Use Spectron for integration testing:

```javascript
// __tests__/integration/widget.test.js
const { Application } = require('spectron');
const path = require('path');

describe('Widget Window', function () {
  let app;

  beforeEach(function () {
    app = new Application({
      path: electron,
      args: [path.join(__dirname, '../../')],
      env: { NODE_ENV: 'test' }
    });
    return app.start();
  });

  afterEach(function () {
    if (app && app.isRunning()) {
      return app.stop();
    }
  });

  test('should create widget window', async () => {
    const count = await app.client.getWindowCount();
    expect(count).toBe(2); // Main window and widget window

    // Toggle widget
    await app.client.execute(() => {
      window.electronAPI.toggleWidget();
    });

    // Check if widget is hidden
    const isVisible = await app.client.execute(() => {
      return window.electronAPI.isWidgetVisible();
    });
    expect(isVisible).toBe(false);
  });

  // Add more tests...
});
```

## Packaging and Distribution

### Building Installers

Electron Builder is used to create installers:

```javascript
// package.json
{
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
      "target": ["nsis", "portable"],
      "icon": "build/icon.ico"
    },
    "mac": {
      "target": ["dmg"],
      "icon": "build/icon.icns",
      "category": "public.app-category.developer-tools"
    },
    "linux": {
      "target": ["AppImage", "deb"],
      "icon": "build/icon.png",
      "category": "Development"
    },
    "nsis": {
      "oneClick": false,
      "allowToChangeInstallationDirectory": true,
      "createDesktopShortcut": true,
      "createStartMenuShortcut": true
    }
  }
}
```

### Auto-Updates

Electron Updater is used for auto-updates:

```javascript
// electron/updater.js
const { autoUpdater } = require('electron-updater');
const { app, dialog } = require('electron');

// Configure logger
autoUpdater.logger = require('electron-log');
autoUpdater.logger.transports.file.level = 'info';

// Check for updates
function checkForUpdates() {
  autoUpdater.checkForUpdatesAndNotify();
}

// Listen for update events
autoUpdater.on('update-available', () => {
  dialog.showMessageBox({
    type: 'info',
    title: 'Update Available',
    message: 'A new version of APIwidget is available. It will be downloaded in the background.',
    buttons: ['OK']
  });
});

autoUpdater.on('update-downloaded', () => {
  dialog.showMessageBox({
    type: 'info',
    title: 'Update Ready',
    message: 'A new version of APIwidget has been downloaded. Restart the application to apply the updates.',
    buttons: ['Restart', 'Later']
  }).then((returnValue) => {
    if (returnValue.response === 0) {
      autoUpdater.quitAndInstall();
    }
  });
});

// Export functions
module.exports = {
  checkForUpdates
};
```

## Best Practices

### Security

1. **Never** use `nodeIntegration: true` in renderer processes
2. Always use context isolation and preload scripts
3. Validate all IPC messages
4. Use content security policy
5. Keep dependencies updated

### Performance

1. Minimize IPC communication
2. Use debouncing for frequent events
3. Optimize startup time
4. Reduce memory usage
5. Avoid blocking the main process

### User Experience

1. Provide visual feedback for all actions
2. Handle errors gracefully
3. Support keyboard shortcuts
4. Respect system preferences
5. Ensure accessibility

## Troubleshooting

### Common Issues

1. **White screen on startup**
   - Check for errors in the main process
   - Verify the correct content URL is being loaded
   - Check for CSP issues

2. **IPC communication not working**
   - Verify preload script is correctly configured
   - Check for typos in channel names
   - Ensure contextBridge is properly set up

3. **Widget not appearing**
   - Check if the window is off-screen
   - Verify z-order and always-on-top setting
   - Check for transparency issues

4. **Packaging errors**
   - Verify all required assets are included
   - Check electron-builder configuration
   - Ensure all dependencies are correctly specified

### Debugging

1. **Main Process**
   ```bash
   # Enable main process debugging
   NODE_ENV=development DEBUG=electron:* npm run electron:dev
   ```

2. **Renderer Process**
   - Use Chrome DevTools (View > Toggle Developer Tools)
   - Use React DevTools extension

3. **IPC Communication**
   ```javascript
   // Log all IPC messages
   ipcMain.on('*', (event, channel, ...args) => {
     console.log(`IPC: ${channel}`, ...args);
   });
   ```

## Resources

- [Electron Documentation](https://www.electronjs.org/docs)
- [Electron Builder Documentation](https://www.electron.build/)
- [Electron Store Documentation](https://github.com/sindresorhus/electron-store)
- [Electron Updater Documentation](https://www.electron.build/auto-update)
- [React with Electron Guide](https://www.electronjs.org/docs/latest/tutorial/tutorial-prerequisites)
