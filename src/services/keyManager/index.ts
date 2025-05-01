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
 * Web implementation using localStorage with client-side encryption
 */
class WebKeyManager implements KeyManager {
  // Simple encryption/decryption for client-side storage
  // This is not highly secure but better than plain text
  private encrypt(text: string): string {
    // In a real implementation, use a proper encryption library
    // This is a simple XOR-based encryption for demonstration
    const salt = 'APIwidget-salt-' + navigator.userAgent.substring(0, 10);
    let result = '';
    for (let i = 0; i < text.length; i++) {
      result += String.fromCharCode(text.charCodeAt(i) ^ salt.charCodeAt(i % salt.length));
    }
    return btoa(result); // Base64 encode
  }

  private decrypt(encryptedText: string): string {
    try {
      const salt = 'APIwidget-salt-' + navigator.userAgent.substring(0, 10);
      const text = atob(encryptedText); // Base64 decode
      let result = '';
      for (let i = 0; i < text.length; i++) {
        result += String.fromCharCode(text.charCodeAt(i) ^ salt.charCodeAt(i % salt.length));
      }
      return result;
    } catch (e) {
      console.error('Error decrypting API key:', e);
      return '';
    }
  }

  getApiKey = async (provider: string): Promise<string | null> => {
    const encryptedKey = localStorage.getItem(`apiKey_${provider}`);
    if (!encryptedKey) return null;

    return this.decrypt(encryptedKey);
  };

  saveApiKey = async (provider: string, key: string): Promise<boolean> => {
    try {
      const encryptedKey = this.encrypt(key);
      localStorage.setItem(`apiKey_${provider}`, encryptedKey);
      return true;
    } catch (e) {
      console.error('Error saving API key:', e);
      return false;
    }
  };

  deleteApiKey = async (provider: string): Promise<boolean> => {
    try {
      localStorage.removeItem(`apiKey_${provider}`);
      return true;
    } catch (e) {
      console.error('Error deleting API key:', e);
      return false;
    }
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
