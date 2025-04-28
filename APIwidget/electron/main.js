// Use CommonJS require
const { app, BrowserWindow, Tray, Menu, ipcMain, screen } = require('electron');
const path = require('path');
const fs = require('fs');

// Log startup information for debugging
console.log('Starting APIwidget Electron app');
console.log('Node.js version:', process.version);
console.log('Electron version:', process.versions.electron);
console.log('Current directory:', process.cwd());

// Create a simple store implementation that doesn't depend on electron-store
// This is a temporary solution until we can properly integrate electron-store
const store = {
  data: {},
  get: function(key, defaultValue) {
    // Handle nested keys like 'widget.size'
    if (key.includes('.')) {
      const parts = key.split('.');
      let current = this.data;
      for (let i = 0; i < parts.length - 1; i++) {
        if (!current[parts[i]]) {
          return defaultValue;
        }
        current = current[parts[i]];
      }
      return current[parts[parts.length - 1]] || defaultValue;
    }
    return this.data[key] || defaultValue;
  },
  set: function(key, value) {
    // Handle nested keys like 'widget.size'
    if (key.includes('.')) {
      const parts = key.split('.');
      let current = this.data;
      for (let i = 0; i < parts.length - 1; i++) {
        if (!current[parts[i]]) {
          current[parts[i]] = {};
        }
        current = current[parts[i]];
      }
      current[parts[parts.length - 1]] = value;
    } else {
      this.data[key] = value;
    }
  },
  delete: function(key) {
    // Handle nested keys like 'widget.size'
    if (key.includes('.')) {
      const parts = key.split('.');
      let current = this.data;
      for (let i = 0; i < parts.length - 1; i++) {
        if (!current[parts[i]]) {
          return;
        }
        current = current[parts[i]];
      }
      delete current[parts[parts.length - 1]];
    } else {
      delete this.data[key];
    }
  }
};

// Initialize default values for the store
// Set up some default values
store.data = {
  apiKeys: {
    openai: '',
    github: '',
    aws: ''
  },
  widget: {
    position: [800, 100],
    visible: true,
    size: 'medium',
    theme: 'dark',
    customSize: [240, 140],
    refreshInterval: 30,
    activeProvider: 'openai',
    alertThresholds: {
      openai: 50,
      github: 10,
      aws: 30
    }
  },
  app: {
    startWithSystem: false,
    minimizeToTray: true,
    showNotifications: true,
    theme: 'dark'
  }
};

let mainWindow;
let widgetWindow;
let tray;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, '../public/images/256x256logo.png')
  });

  // Load the app
  try {
    console.log('Loading main window...');
    if (process.env.NODE_ENV === 'development') {
      console.log('Loading main window in development mode from http://localhost:5175');
      mainWindow.loadURL('http://localhost:5175');
    } else {
      const indexPath = path.join(__dirname, '../index.html');
      console.log('Loading main window in production mode from', indexPath);
      mainWindow.loadFile(indexPath);
    }
    console.log('Main window loaded successfully');
  } catch (error) {
    console.error('Error loading main window:', error);
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function createWidgetWindow() {
  // Get display dimensions
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width } = primaryDisplay.workAreaSize;

  // Default position (centered on the right side of the screen)
  const defaultPosition = [width - 280, 100];

  // Get saved position or use default
  const savedPosition = store.get('widget.position', defaultPosition);

  // Get saved size or use default
  const savedSize = store.get('widget.size', 'medium');

  // Determine dimensions based on size
  let widgetWidth, widgetHeight;

  switch (savedSize) {
    case 'compact':
      widgetWidth = 120;
      widgetHeight = 60;
      break;
    case 'small':
      widgetWidth = 180;
      widgetHeight = 100;
      break;
    case 'large':
      widgetWidth = 300;
      widgetHeight = 180;
      break;
    default: // medium
      widgetWidth = 240;
      widgetHeight = 140;
      break;
  }

  // Create widget window with improved configuration
  widgetWindow = new BrowserWindow({
    width: widgetWidth,
    height: widgetHeight,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: true, // Allow resizing
    hasShadow: true, // Add shadow for better visibility
    x: savedPosition[0],
    y: savedPosition[1],
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      // Enable DevTools in development mode
      devTools: process.env.NODE_ENV === 'development'
    },
    // Modern window styling
    roundedCorners: true,
    thickFrame: false,
    // Make the widget focusable to allow for better interaction
    focusable: true
  });

  // Log widget creation
  console.log(`Creating widget window with size ${widgetWidth}x${widgetHeight} at position ${savedPosition[0]},${savedPosition[1]}`);

  // Enable dragging for frameless window
  widgetWindow.setMovable(true);

  // Log widget window creation
  console.log('Widget window created with dimensions:', widgetWidth, 'x', widgetHeight);
  console.log('Widget position:', savedPosition);

  // Load the widget page
  try {
    console.log('Loading widget window...');
    if (process.env.NODE_ENV === 'development') {
      console.log('Loading widget in development mode from http://localhost:5175/widget.html');
      widgetWindow.loadURL('http://localhost:5175/widget.html');

      // Open DevTools for debugging in development mode
      widgetWindow.webContents.openDevTools({ mode: 'detach' });
    } else {
      const widgetPath = path.join(__dirname, '../dist/widget.html');
      console.log('Loading widget in production mode from', widgetPath);
      widgetWindow.loadFile(widgetPath);
    }
    console.log('Widget window loaded successfully');
  } catch (error) {
    console.error('Error loading widget window:', error);

    // Fallback to a simple widget if loading fails
    try {
      const fallbackPath = path.join(__dirname, '../public/widget.html');
      console.log('Attempting to load fallback widget from', fallbackPath);
      widgetWindow.loadFile(fallbackPath);
    } catch (fallbackError) {
      console.error('Error loading fallback widget:', fallbackError);
    }
  }

  // Make the window draggable (frameless windows aren't draggable by default)
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

  // Check if widget should be visible
  const isVisible = store.get('widget.visible', true);
  if (!isVisible) {
    widgetWindow.hide();
  }

  // Prevent the widget from stealing focus when shown
  widgetWindow.setAlwaysOnTop(true, 'floating', 1);

  // Handle window blur to ensure it stays on top
  widgetWindow.on('blur', () => {
    widgetWindow.setAlwaysOnTop(true);
  });

  widgetWindow.on('closed', () => {
    widgetWindow = null;
  });

  // Prevent the widget from being closed when the X button is clicked
  // Instead, hide it to the system tray
  widgetWindow.on('close', (event) => {
    if (!app.isQuitting) {
      event.preventDefault();
      widgetWindow.hide();
      return false;
    }
    return true;
  });
}

function createTray() {
  // Use the logo as the tray icon
  tray = new Tray(path.join(__dirname, '../public/images/32x32logo.png'));

  // Function to update the context menu
  const updateContextMenu = () => {
    const isWidgetVisible = widgetWindow && widgetWindow.isVisible();
    const widgetSettings = store.get('widget', {});
    const appSettings = store.get('app', {});

    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'APIwidget',
        enabled: false,
        icon: path.join(__dirname, '../public/images/32x32logo.png')
      },
      { type: 'separator' },
      {
        label: 'Open Dashboard',
        click: () => {
          if (mainWindow === null) {
            createMainWindow();
          } else {
            mainWindow.show();
            mainWindow.focus();
          }
        }
      },
      {
        label: isWidgetVisible ? 'Hide Widget' : 'Show Widget',
        click: () => {
          if (widgetWindow === null) {
            createWidgetWindow();
          } else {
            if (isWidgetVisible) {
              widgetWindow.hide();
            } else {
              widgetWindow.show();
            }
            store.set('widget.visible', !isWidgetVisible);
          }
        }
      },
      { type: 'separator' },
      {
        label: 'Widget Settings',
        submenu: [
          {
            label: 'Size',
            submenu: [
              {
                label: 'Compact',
                type: 'radio',
                checked: widgetSettings.size === 'compact',
                click: () => {
                  store.set('widget.size', 'compact');
                  if (widgetWindow) {
                    widgetWindow.setSize(120, 60);
                  }
                }
              },
              {
                label: 'Small',
                type: 'radio',
                checked: widgetSettings.size === 'small',
                click: () => {
                  store.set('widget.size', 'small');
                  if (widgetWindow) {
                    widgetWindow.setSize(180, 100);
                  }
                }
              },
              {
                label: 'Medium',
                type: 'radio',
                checked: widgetSettings.size === 'medium' || !widgetSettings.size,
                click: () => {
                  store.set('widget.size', 'medium');
                  if (widgetWindow) {
                    widgetWindow.setSize(240, 140);
                  }
                }
              },
              {
                label: 'Large',
                type: 'radio',
                checked: widgetSettings.size === 'large',
                click: () => {
                  store.set('widget.size', 'large');
                  if (widgetWindow) {
                    widgetWindow.setSize(300, 180);
                  }
                }
              }
            ]
          },
          {
            label: 'Theme',
            submenu: [
              {
                label: 'Dark',
                type: 'radio',
                checked: widgetSettings.theme === 'dark' || !widgetSettings.theme,
                click: () => {
                  store.set('widget.theme', 'dark');
                }
              },
              {
                label: 'Light',
                type: 'radio',
                checked: widgetSettings.theme === 'light',
                click: () => {
                  store.set('widget.theme', 'light');
                }
              }
            ]
          },
          {
            label: 'Reset Position',
            click: () => {
              const primaryDisplay = screen.getPrimaryDisplay();
              const { width } = primaryDisplay.workAreaSize;
              const defaultPosition = [width - 280, 100];
              store.set('widget.position', defaultPosition);

              if (widgetWindow) {
                widgetWindow.setPosition(defaultPosition[0], defaultPosition[1]);
              }
            }
          }
        ]
      },
      {
        label: 'Application Settings',
        submenu: [
          {
            label: 'Start with System',
            type: 'checkbox',
            checked: appSettings.startWithSystem || false,
            click: (menuItem) => {
              app.setLoginItemSettings({
                openAtLogin: menuItem.checked,
                path: app.getPath('exe')
              });
              store.set('app.startWithSystem', menuItem.checked);
            }
          },
          {
            label: 'Minimize to Tray',
            type: 'checkbox',
            checked: appSettings.minimizeToTray !== false, // Default to true
            click: (menuItem) => {
              store.set('app.minimizeToTray', menuItem.checked);
            }
          },
          {
            label: 'Show Notifications',
            type: 'checkbox',
            checked: appSettings.showNotifications !== false, // Default to true
            click: (menuItem) => {
              store.set('app.showNotifications', menuItem.checked);
            }
          }
        ]
      },
      { type: 'separator' },
      {
        label: 'Check for Updates',
        click: () => {
          // In a real app, this would check for updates
          if (mainWindow) {
            mainWindow.webContents.send('checking-for-update');
          }
        }
      },
      {
        label: 'About APIwidget',
        click: () => {
          // Show about dialog
          const aboutWindow = new BrowserWindow({
            width: 400,
            height: 300,
            resizable: false,
            minimizable: false,
            maximizable: false,
            parent: mainWindow || null,
            modal: true,
            show: false,
            webPreferences: {
              nodeIntegration: false,
              contextIsolation: true,
              preload: path.join(__dirname, 'preload.js')
            }
          });

          aboutWindow.once('ready-to-show', () => {
            aboutWindow.show();
          });

          // Load about page
          try {
            console.log('Loading about window...');
            if (process.env.NODE_ENV === 'development') {
              console.log('Loading about window in development mode from http://localhost:5175/about.html');
              aboutWindow.loadURL('http://localhost:5175/about.html');
            } else {
              const aboutPath = path.join(__dirname, '../public/about.html');
              console.log('Loading about window in production mode from', aboutPath);
              aboutWindow.loadFile(aboutPath);
            }
            console.log('About window loaded successfully');
          } catch (error) {
            console.error('Error loading about window:', error);
          }
        }
      },
      { type: 'separator' },
      {
        label: 'Quit',
        click: () => {
          app.isQuitting = true;
          app.quit();
        }
      }
    ]);

    tray.setContextMenu(contextMenu);
  };

  // Set initial tooltip
  tray.setToolTip('APIwidget - API Cost Tracker');

  // Update context menu initially
  updateContextMenu();

  // Update context menu when clicked (to refresh state)
  tray.on('click', updateContextMenu);

  // Double click to show main window
  tray.on('double-click', () => {
    if (mainWindow === null) {
      createMainWindow();
    } else {
      mainWindow.show();
      mainWindow.focus();
    }
  });
}

// Add a flag to track if the app is quitting
app.isQuitting = false;

app.whenReady().then(() => {
  // We already have properly sized icons in the public/images directory

  // Create tray and widget
  createTray();
  createWidgetWindow(); // Start with just the widget

  // Check if we should start with the main window open
  const appSettings = store.get('app', {});
  // Check for environment variable to force open main window
  const forceOpenMainWindow = process.env.OPEN_MAIN_WINDOW === 'true';
  if (appSettings.openMainWindowOnStartup || forceOpenMainWindow) {
    createMainWindow();
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWidgetWindow();
    }
  });

  // Handle before-quit event
  app.on('before-quit', () => {
    app.isQuitting = true;
  });
});

// Handle window-all-closed event
app.on('window-all-closed', () => {
  // On macOS, applications typically stay active until the user quits explicitly
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Handle second-instance event (prevent multiple instances)
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    // Someone tried to run a second instance, focus our window instead
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    } else if (widgetWindow) {
      widgetWindow.show();
    } else {
      createMainWindow();
    }
  });
}

// IPC handlers for communication between renderer and main process
ipcMain.handle('toggle-main-window', () => {
  if (mainWindow === null) {
    createMainWindow();
  } else {
    mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
  }
});

ipcMain.handle('close-widget', () => {
  if (widgetWindow) {
    widgetWindow.close();
  }
});

// API key management
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

// Widget visibility toggle
ipcMain.handle('toggle-widget-visibility', () => {
  if (widgetWindow) {
    const isVisible = widgetWindow.isVisible();
    if (isVisible) {
      widgetWindow.hide();
    } else {
      widgetWindow.show();
    }
    store.set('widget.visible', !isVisible);
    return !isVisible;
  }
  return false;
});

// Mock data update (in a real app, this would fetch from APIs)
ipcMain.handle('get-api-cost', (event, provider = 'openai') => {
  // In a real implementation, this would use the API keys to fetch actual data
  // For now, we'll return mock data based on the provider
  const mockData = {
    openai: {
      total: 24.56,
      change: 1.2,
      changeType: 'increase'
    },
    github: {
      total: 0.00,
      change: 0.0,
      changeType: 'decrease'
    },
    aws: {
      total: 12.34,
      change: 0.8,
      changeType: 'decrease'
    }
  };

  return mockData[provider] || mockData.openai;
});

// Debug handler
ipcMain.handle('debug', (event, message) => {
  console.log('Debug from renderer:', message);
  return { received: true, message };
});

// Get all API costs
ipcMain.handle('get-all-api-costs', () => {
  // In a real implementation, this would fetch data for all providers
  return {
    openai: {
      total: 24.56,
      change: 1.2,
      changeType: 'increase'
    },
    github: {
      total: 0.00,
      change: 0.0,
      changeType: 'decrease'
    },
    aws: {
      total: 12.34,
      change: 0.8,
      changeType: 'decrease'
    }
  };
});

// Settings management
ipcMain.handle('get-settings', () => {
  return store.get('widget');
});

ipcMain.handle('save-settings', (event, settings) => {
  store.set('widget', { ...store.get('widget'), ...settings });
  return true;
});

ipcMain.handle('get-setting', (event, key) => {
  return store.get(`widget.${key}`);
});

ipcMain.handle('set-setting', (event, key, value) => {
  store.set(`widget.${key}`, value);
  return true;
});

// App settings
ipcMain.handle('get-app-settings', () => {
  return store.get('app');
});

ipcMain.handle('save-app-settings', (event, settings) => {
  store.set('app', { ...store.get('app'), ...settings });
  return true;
});

// System startup
ipcMain.handle('set-start-with-system', (event, enabled) => {
  app.setLoginItemSettings({
    openAtLogin: enabled,
    path: app.getPath('exe')
  });
  store.set('app.startWithSystem', enabled);
  return true;
});

// System information
ipcMain.handle('get-displays', () => {
  return screen.getAllDisplays();
});

ipcMain.handle('get-current-display', () => {
  const point = screen.getCursorScreenPoint();
  return screen.getDisplayNearestPoint(point);
});

// Utility
ipcMain.handle('get-version', () => {
  return app.getVersion();
});

ipcMain.handle('open-external', (event, url) => {
  require('electron').shell.openExternal(url);
  return true;
});
