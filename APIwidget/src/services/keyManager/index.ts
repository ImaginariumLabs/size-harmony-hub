/**
 * Unified Key Management Service
 * 
 * This service provides a single interface for API key management across
 * different environments (web, Electron, mock).
 */

import { isElectron } from '../electronService';

export interface KeyManager {
  getApiKey: (provider: string) => Promise<string | null>;
  saveApiKey: (provider: string, key: string) => Promise<boolean>;
  deleteApiKey: (provider: string) => Promise<boolean>;
}

/**
 * Web implementation using localStorage
 */
class WebKeyManager implements KeyManager {
  getApiKey = async (provider: string): Promise<string | null> => {
    return localStorage.getItem(`apiKey_${provider}`);
  };

  saveApiKey = async (provider: string, key: string): Promise<boolean> => {
    localStorage.setItem(`apiKey_${provider}`, key);
    return true;
  };

  deleteApiKey = async (provider: string): Promise<boolean> => {
    localStorage.removeItem(`apiKey_${provider}`);
    return true;
  };
}

/**
 * Electron implementation using IPC
 */
class ElectronKeyManager implements KeyManager {
  getApiKey = async (provider: string): Promise<string | null> => {
    return window.electronAPI.getApiKey(provider);
  };

  saveApiKey = async (provider: string, key: string): Promise<boolean> => {
    return window.electronAPI.saveApiKey(provider, key);
  };

  deleteApiKey = async (provider: string): Promise<boolean> => {
    return window.electronAPI.deleteApiKey(provider);
  };
}

/**
 * Mock implementation for development and testing
 */
class MockKeyManager implements KeyManager {
  private mockKeys: Record<string, string> = {
    openai: 'sk-mock-openai-key',
    github: 'github-mock-key',
    aws: 'aws-mock-key'
  };

  getApiKey = async (provider: string): Promise<string | null> => {
    return this.mockKeys[provider] || null;
  };

  saveApiKey = async (provider: string, key: string): Promise<boolean> => {
    this.mockKeys[provider] = key;
    return true;
  };

  deleteApiKey = async (provider: string): Promise<boolean> => {
    if (provider in this.mockKeys) {
      delete this.mockKeys[provider];
      return true;
    }
    return false;
  };
}

/**
 * Factory function to get the appropriate implementation
 */
export const createKeyManager = (): KeyManager => {
  // Check if running in Electron
  if (isElectron()) {
    return new ElectronKeyManager();
  }
  
  // Check if using mock data (for development)
  const useMockData = import.meta.env?.VITE_USE_MOCK_DATA === 'true';
  if (useMockData) {
    return new MockKeyManager();
  }
  
  // Default to web implementation
  return new WebKeyManager();
};

// Export a singleton instance
const keyManager = createKeyManager();
export default keyManager;
