/**
 * Global type definitions for the APIwidget application
 */

import { ApiCostData } from './services/electronService';
import { WidgetSettings } from './services/settingsService';

declare global {
  interface Window {
    electronAPI?: {
      // Window management
      toggleMainWindow: () => Promise<void>;
      closeWidget: () => Promise<void>;
      toggleWidgetVisibility: () => Promise<boolean>;
      
      // API key management
      getApiKey: (provider: string) => Promise<string | null>;
      saveApiKey: (provider: string, key: string) => Promise<boolean>;
      deleteApiKey: (provider: string) => Promise<boolean>;
      
      // API data
      getApiCost: (provider?: string) => Promise<ApiCostData>;
      getAllApiCosts: () => Promise<Record<string, ApiCostData>>;
      
      // Settings management
      getSettings: () => Promise<WidgetSettings | null>;
      saveSettings: (settings: Partial<WidgetSettings>) => Promise<boolean>;
      getSetting: <K extends keyof WidgetSettings>(key: K) => Promise<WidgetSettings[K] | null>;
      setSetting: <K extends keyof WidgetSettings>(key: K, value: WidgetSettings[K]) => Promise<boolean>;
      
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
    };
  }
}

export {};
