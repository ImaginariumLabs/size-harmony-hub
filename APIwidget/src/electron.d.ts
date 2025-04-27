interface ElectronAPI {
  // Window management
  toggleMainWindow: () => Promise<void>;
  closeWidget: () => Promise<void>;
  toggleWidgetVisibility: () => Promise<boolean>;
  
  // API key management
  getApiKey: (provider: string) => Promise<string | null>;
  saveApiKey: (provider: string, key: string) => Promise<boolean>;
  deleteApiKey: (provider: string) => Promise<boolean>;
  
  // API data
  getApiCost: () => Promise<{
    total: number;
    change: number;
    changeType: 'increase' | 'decrease';
  }>;
  
  // Utility
  isElectron: boolean;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

export {};
