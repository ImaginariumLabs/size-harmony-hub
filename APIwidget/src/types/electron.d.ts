interface ElectronAPI {
  // Window management
  toggleMainWindow: () => Promise<void>;
  closeWidget: () => Promise<void>;
  toggleWidgetVisibility: () => Promise<boolean>;

  // API key management
  getApiKey: (provider: string) => Promise<string>;
  saveApiKey: (provider: string, key: string) => Promise<boolean>;
  deleteApiKey: (provider: string) => Promise<boolean>;

  // API data
  getApiCost: (provider?: string) => Promise<{ total: number; change: number; changeType: string }>;
  getAllApiCosts: () => Promise<Record<string, { total: number; change: number; changeType: string }>>;

  // Settings management
  getSettings: () => Promise<any>;
  saveSettings: (settings: any) => Promise<boolean>;
  getSetting: (key: string) => Promise<any>;
  setSetting: (key: string, value: any) => Promise<boolean>;

  // App management
  getAppSettings: () => Promise<any>;
  saveAppSettings: (settings: any) => Promise<boolean>;
  setStartWithSystem: (enabled: boolean) => Promise<boolean>;

  // System information
  getDisplays: () => Promise<any[]>;
  getCurrentDisplay: () => Promise<any>;

  // Utility
  isElectron: boolean;
  getVersion: () => Promise<string>;
  openExternal: (url: string) => Promise<boolean>;
  
  // Debugging
  debug: (message: any) => Promise<{ received: boolean; message: any }>;
}

interface Window {
  electronAPI?: ElectronAPI;
}
