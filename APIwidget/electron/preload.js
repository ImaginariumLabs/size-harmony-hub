const { contextBridge, ipcRenderer } = require('electron');

// Log that preload script is running
console.log('Preload script is running');

// Log environment information
console.log('Preload - Environment:', {
  nodeVersion: process.versions.node,
  electronVersion: process.versions.electron,
  chromiumVersion: process.versions.chrome
});

// Expose Electron APIs to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  // Window management
  toggleMainWindow: () => ipcRenderer.invoke('toggle-main-window'),
  closeWidget: () => ipcRenderer.invoke('close-widget'),
  toggleWidgetVisibility: () => ipcRenderer.invoke('toggle-widget-visibility'),
  minimizeWindow: () => ipcRenderer.invoke('minimize-window'),
  maximizeWindow: () => ipcRenderer.invoke('maximize-window'),
  closeWindow: () => ipcRenderer.invoke('close-window'),
  isWindowMaximized: () => ipcRenderer.invoke('is-window-maximized'),

  // API key management
  getApiKey: (provider) => ipcRenderer.invoke('get-api-key', provider),
  saveApiKey: (provider, key) => ipcRenderer.invoke('save-api-key', provider, key),
  deleteApiKey: (provider) => ipcRenderer.invoke('delete-api-key', provider),

  // API data
  getApiCost: (provider) => ipcRenderer.invoke('get-api-cost', provider),
  getAllApiCosts: () => ipcRenderer.invoke('get-all-api-costs'),

  // Settings management
  getSettings: () => ipcRenderer.invoke('get-settings'),
  saveSettings: (settings) => ipcRenderer.invoke('save-settings', settings),
  getSetting: (key) => ipcRenderer.invoke('get-setting', key),
  setSetting: (key, value) => ipcRenderer.invoke('set-setting', key, value),

  // App management
  getAppSettings: () => ipcRenderer.invoke('get-app-settings'),
  saveAppSettings: (settings) => ipcRenderer.invoke('save-app-settings', settings),
  setStartWithSystem: (enabled) => ipcRenderer.invoke('set-start-with-system', enabled),

  // System information
  getDisplays: () => ipcRenderer.invoke('get-displays'),
  getCurrentDisplay: () => ipcRenderer.invoke('get-current-display'),

  // Utility
  isElectron: true, // Flag to detect if running in Electron
  getVersion: () => ipcRenderer.invoke('get-version'),
  openExternal: (url) => ipcRenderer.invoke('open-external', url),

  // Debugging
  debug: (message) => {
    console.log('Debug from renderer:', message);
    return ipcRenderer.invoke('debug', message);
  }
});
