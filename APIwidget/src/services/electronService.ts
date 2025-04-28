/**
 * Service for interacting with Electron APIs
 */

// Check if running in Electron
export const isElectron = (): boolean => {
  // Check for electronAPI in window object
  if (window.electronAPI !== undefined) {
    return true;
  }

  // Additional checks to detect Electron environment
  const userAgent = navigator.userAgent.toLowerCase();
  return userAgent.indexOf('electron') !== -1;
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
      // Try to get real data from Electron
      const result = await window.electronAPI.getApiCost(providerId);
      return result;
    } catch (error) {
      console.error('Error getting API cost from Electron:', error);

      // Try to use real API integration
      try {
        const { fetchApiData } = await import('./apiIntegrationService');
        return await fetchApiData(providerId);
      } catch (apiError) {
        console.error('Error fetching API data:', apiError);

        // Fall back to mock data as last resort
        const { getMockProviderData } = await import('./mockDataService');
        return getMockProviderData(providerId);
      }
    }
  }

  // For web environment, try real API integration first
  try {
    const { fetchApiData } = await import('./apiIntegrationService');
    return await fetchApiData(providerId);
  } catch (error) {
    console.error('Error fetching API data in web environment:', error);

    // Fallback to mock data service
    const { getMockProviderData } = await import('./mockDataService');
    return getMockProviderData(providerId);
  }
};

// Get all provider costs
export const getAllApiCosts = async (): Promise<Record<string, ApiCostData>> => {
  if (isElectron()) {
    try {
      // Try to get real data from Electron
      return window.electronAPI.getAllApiCosts();
    } catch (error) {
      console.error('Error getting all API costs from Electron:', error);

      // Try to use real API integration
      try {
        const { fetchAllApiData } = await import('./apiIntegrationService');
        return await fetchAllApiData();
      } catch (apiError) {
        console.error('Error fetching all API data:', apiError);

        // Fall back to mock data as last resort
        const { getAllProviderData } = await import('./mockDataService');
        return getAllProviderData();
      }
    }
  }

  // For web environment, try real API integration first
  try {
    const { fetchAllApiData } = await import('./apiIntegrationService');
    return await fetchAllApiData();
  } catch (error) {
    console.error('Error fetching all API data in web environment:', error);

    // Fallback to mock data service
    const { getAllProviderData } = await import('./mockDataService');
    return getAllProviderData();
  }
};
