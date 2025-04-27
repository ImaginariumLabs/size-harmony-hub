/**
 * Service for interacting with Electron APIs
 */

// Check if running in Electron
export const isElectron = (): boolean => {
  return window.electronAPI !== undefined;
};

// API Key Management
export const getApiKey = async (provider: string): Promise<string | null> => {
  if (isElectron()) {
    return window.electronAPI.getApiKey(provider);
  }

  // Fallback for web: use localStorage (less secure)
  return localStorage.getItem(`apiKey_${provider}`);
};

export const saveApiKey = async (provider: string, key: string): Promise<boolean> => {
  if (isElectron()) {
    return window.electronAPI.saveApiKey(provider, key);
  }

  // Fallback for web
  localStorage.setItem(`apiKey_${provider}`, key);
  return true;
};

export const deleteApiKey = async (provider: string): Promise<boolean> => {
  if (isElectron()) {
    return window.electronAPI.deleteApiKey(provider);
  }

  // Fallback for web
  localStorage.removeItem(`apiKey_${provider}`);
  return true;
};

// Widget Management
export const toggleWidgetVisibility = async (): Promise<boolean> => {
  if (isElectron()) {
    return window.electronAPI.toggleWidgetVisibility();
  }

  // Fallback for web - toggle state in localStorage
  const currentState = localStorage.getItem('widgetVisible') === 'true';
  localStorage.setItem('widgetVisible', (!currentState).toString());
  return !currentState;
};

// API Cost Data
export interface ApiCostData {
  total: number;
  change: number;
  changeType: 'increase' | 'decrease';
}

export const getApiCost = async (providerId: string = 'openai'): Promise<ApiCostData> => {
  if (isElectron()) {
    try {
      return window.electronAPI.getApiCost(providerId);
    } catch (error) {
      console.error('Error getting API cost from Electron:', error);
      // Fall back to mock data if Electron call fails
      const { getMockProviderData } = await import('./mockDataService');
      return getMockProviderData(providerId);
    }
  }

  // Fallback for web - use mock data service
  const { getMockProviderData } = await import('./mockDataService');
  return getMockProviderData(providerId);
};

// Get all provider costs
export const getAllApiCosts = async (): Promise<Record<string, ApiCostData>> => {
  if (isElectron()) {
    try {
      return window.electronAPI.getAllApiCosts();
    } catch (error) {
      console.error('Error getting all API costs from Electron:', error);
      // Fall back to mock data if Electron call fails
      const { getAllProviderData } = await import('./mockDataService');
      return getAllProviderData();
    }
  }

  // Fallback for web - use mock data service
  const { getAllProviderData } = await import('./mockDataService');
  return getAllProviderData();
};
