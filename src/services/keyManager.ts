/**
 * This file is a compatibility layer for the keyManager module.
 * It re-exports the functions from the keyManager/index.ts module
 * to maintain backward compatibility with existing code.
 *
 * IMPORTANT: API keys are stored locally and encrypted, not in the database.
 * - For Electron: Keys are stored in the secure electron-store
 * - For Web: Keys are stored in localStorage with client-side encryption
 */

import keyManager from './keyManager/index';

export interface ApiKeyEntry {
  id?: string;
  provider: string;
  key?: string; // Key is optional in the return value for security
  label?: string;
  created_at?: string;
  last_used?: string;
}

// Map of provider IDs to display names
const providerLabels: Record<string, string> = {
  openai: 'OpenAI',
  github: 'GitHub',
  aws: 'AWS',
  azure: 'Azure',
  google: 'Google',
  claude: 'Claude (Anthropic)',
  gemini: 'Gemini (Google)'
};

/**
 * Save an API key locally (encrypted)
 */
export const saveApiKey = async (
  provider: string,
  key: string,
  label?: string
): Promise<void> => {
  try {
    // Save the key using the keyManager
    const success = await keyManager.saveApiKey(provider, key);

    if (!success) {
      throw new Error('Failed to save API key');
    }

    // Save metadata about the key (without the actual key) to localStorage
    // This is just for UI display purposes
    const metadata = {
      provider,
      label: label || providerLabels[provider] || provider,
      created_at: new Date().toISOString(),
      last_used: new Date().toISOString()
    };

    // Store metadata in localStorage
    const metadataKey = `apiKeyMeta_${provider}`;
    localStorage.setItem(metadataKey, JSON.stringify(metadata));

  } catch (error) {
    console.error('Error saving API key:', error);
    throw error;
  }
};

/**
 * Get an API key by provider
 */
export const getApiKey = async (provider: string): Promise<string | null> => {
  try {
    // Get the key using the keyManager
    return await keyManager.getApiKey(provider);
  } catch (error) {
    console.error('Error getting API key:', error);
    return null;
  }
};

/**
 * List all API keys for the current user (metadata only, no actual keys)
 */
export const listApiKeys = async (): Promise<ApiKeyEntry[]> => {
  try {
    const keys: ApiKeyEntry[] = [];

    // Scan localStorage for API key metadata
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('apiKeyMeta_')) {
        const provider = key.replace('apiKeyMeta_', '');
        const metadataStr = localStorage.getItem(key);

        if (metadataStr) {
          try {
            const metadata = JSON.parse(metadataStr);
            // Add a unique ID
            metadata.id = `${provider}_${Date.now()}`;
            keys.push(metadata);
          } catch (e) {
            console.error('Error parsing API key metadata:', e);
          }
        }
      }
    }

    return keys;
  } catch (error) {
    console.error('Error listing API keys:', error);
    return [];
  }
};

/**
 * Delete an API key
 */
export const deleteApiKey = async (provider: string): Promise<void> => {
  try {
    // Delete the key using the keyManager
    const success = await keyManager.deleteApiKey(provider);

    if (!success) {
      throw new Error('Failed to delete API key');
    }

    // Remove metadata from localStorage
    localStorage.removeItem(`apiKeyMeta_${provider}`);
  } catch (error) {
    console.error('Error deleting API key:', error);
    throw error;
  }
};

/**
 * Update last used timestamp for an API key
 */
export const updateKeyLastUsed = async (provider: string): Promise<void> => {
  try {
    // Update metadata in localStorage
    const metadataKey = `apiKeyMeta_${provider}`;
    const metadataStr = localStorage.getItem(metadataKey);

    if (metadataStr) {
      try {
        const metadata = JSON.parse(metadataStr);
        metadata.last_used = new Date().toISOString();
        localStorage.setItem(metadataKey, JSON.stringify(metadata));
      } catch (e) {
        console.error('Error updating API key last used:', e);
      }
    }
  } catch (error) {
    console.error('Error updating API key last used:', error);
  }
};
