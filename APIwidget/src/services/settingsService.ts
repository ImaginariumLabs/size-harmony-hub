/**
 * Settings Service
 * Manages widget settings and preferences
 */

import { isElectron } from './electronService';

// Widget settings interface
export interface WidgetSettings {
  position: { x: number; y: number };
  size: 'compact' | 'small' | 'medium' | 'large';
  theme: 'dark' | 'light';
  activeProvider: string;
  showWidget: boolean;
  refreshInterval: number; // in seconds
  alertThresholds: Record<string, number>; // provider ID -> threshold
}

// Default settings
const DEFAULT_SETTINGS: WidgetSettings = {
  position: { x: 20, y: 20 },
  size: 'medium',
  theme: 'dark',
  activeProvider: 'openai',
  showWidget: true,
  refreshInterval: 30,
  alertThresholds: {
    openai: 50,
    github: 10,
    aws: 30
  }
};

// Storage key
const SETTINGS_KEY = 'apiwidget_settings';

// Load settings from storage
export const loadSettings = (): WidgetSettings => {
  try {
    if (isElectron() && window.electronAPI.getSettings) {
      // If in Electron and the getSettings method exists, use it
      const settings = window.electronAPI.getSettings();
      return settings ? { ...DEFAULT_SETTINGS, ...settings } : DEFAULT_SETTINGS;
    } else {
      // Otherwise, use localStorage
      const storedSettings = localStorage.getItem(SETTINGS_KEY);
      return storedSettings 
        ? { ...DEFAULT_SETTINGS, ...JSON.parse(storedSettings) } 
        : DEFAULT_SETTINGS;
    }
  } catch (error) {
    console.error('Error loading settings:', error);
    return DEFAULT_SETTINGS;
  }
};

// Save settings to storage
export const saveSettings = (settings: Partial<WidgetSettings>): void => {
  try {
    // Get current settings and merge with new settings
    const currentSettings = loadSettings();
    const updatedSettings = { ...currentSettings, ...settings };
    
    if (isElectron() && window.electronAPI.saveSettings) {
      // If in Electron and the saveSettings method exists, use it
      window.electronAPI.saveSettings(updatedSettings);
    } else {
      // Otherwise, use localStorage
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(updatedSettings));
    }
    
    // Dispatch an event to notify components of settings changes
    window.dispatchEvent(new CustomEvent('settings-changed', { 
      detail: updatedSettings 
    }));
  } catch (error) {
    console.error('Error saving settings:', error);
  }
};

// Update a single setting
export const updateSetting = <K extends keyof WidgetSettings>(
  key: K, 
  value: WidgetSettings[K]
): void => {
  const settings = loadSettings();
  settings[key] = value;
  saveSettings(settings);
};

// Reset settings to defaults
export const resetSettings = (): void => {
  saveSettings(DEFAULT_SETTINGS);
};

// Get a specific setting
export const getSetting = <K extends keyof WidgetSettings>(
  key: K
): WidgetSettings[K] => {
  const settings = loadSettings();
  return settings[key];
};

// Check if a cost exceeds the alert threshold
export const isAboveThreshold = (providerId: string, cost: number): boolean => {
  const settings = loadSettings();
  const threshold = settings.alertThresholds[providerId];
  return threshold !== undefined && cost > threshold;
};

// Update alert threshold for a provider
export const updateAlertThreshold = (providerId: string, threshold: number): void => {
  const settings = loadSettings();
  settings.alertThresholds = {
    ...settings.alertThresholds,
    [providerId]: threshold
  };
  saveSettings(settings);
};
