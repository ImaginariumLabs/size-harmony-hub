import { ApiKeyEntry } from './keyManager';

// Mock storage for API keys
const mockStorage: Record<string, ApiKeyEntry[]> = {
  'demo-user': [
    {
      id: '1',
      provider: 'openai',
      key: 'sk-mock-openai-key',
      label: 'Demo OpenAI Key',
      created_at: new Date().toISOString(),
      last_used: new Date().toISOString(),
      user_id: 'demo-user'
    },
    {
      id: '2',
      provider: 'github',
      key: 'github_pat_mock_key',
      label: 'Demo GitHub Key',
      created_at: new Date().toISOString(),
      last_used: new Date().toISOString(),
      user_id: 'demo-user'
    },
    {
      id: '3',
      provider: 'google',
      key: 'AIzaSyAmfGElxy4h4PXxMnQ6_cj7WmInQKBd1Bk',
      label: 'Gemini API Key',
      created_at: new Date().toISOString(),
      last_used: new Date().toISOString(),
      user_id: 'demo-user'
    }
  ]
};

// Current user ID (in a real app, this would come from authentication)
let currentUserId = 'demo-user';

/**
 * Save an API key to the mock storage
 */
export const saveApiKey = async (
  provider: string,
  key: string,
  label?: string
): Promise<void> => {
  try {
    if (!currentUserId) {
      throw new Error('User not authenticated');
    }

    // Initialize user's keys array if it doesn't exist
    if (!mockStorage[currentUserId]) {
      mockStorage[currentUserId] = [];
    }

    // Check if key already exists
    const existingKeyIndex = mockStorage[currentUserId].findIndex(k => k.provider === provider);

    if (existingKeyIndex >= 0) {
      // Update existing key
      mockStorage[currentUserId][existingKeyIndex] = {
        ...mockStorage[currentUserId][existingKeyIndex],
        key,
        label: label || provider,
        last_used: new Date().toISOString()
      };
    } else {
      // Add new key
      mockStorage[currentUserId].push({
        id: Math.random().toString(36).substring(2, 11),
        provider,
        key,
        label: label || provider,
        created_at: new Date().toISOString(),
        last_used: new Date().toISOString(),
        user_id: currentUserId
      });
    }
  } catch (error) {
    console.error('Error saving API key:', error);
    throw error;
  }
};

/**
 * Get an API key by provider from mock storage
 */
export const getApiKey = async (provider: string): Promise<string | null> => {
  try {
    if (!currentUserId) {
      throw new Error('User not authenticated');
    }

    const keys = mockStorage[currentUserId] || [];
    const keyEntry = keys.find(k => k.provider === provider);

    return keyEntry?.key || null;
  } catch (error) {
    console.error('Error getting API key:', error);
    return null;
  }
};

/**
 * List all API keys for the current user from mock storage
 */
export const listApiKeys = async (): Promise<ApiKeyEntry[]> => {
  try {
    if (!currentUserId) {
      throw new Error('User not authenticated');
    }

    return mockStorage[currentUserId] || [];
  } catch (error) {
    console.error('Error listing API keys:', error);
    return [];
  }
};

/**
 * Delete an API key from mock storage
 */
export const deleteApiKey = async (provider: string): Promise<void> => {
  try {
    if (!currentUserId) {
      throw new Error('User not authenticated');
    }

    if (mockStorage[currentUserId]) {
      mockStorage[currentUserId] = mockStorage[currentUserId].filter(k => k.provider !== provider);
    }
  } catch (error) {
    console.error('Error deleting API key:', error);
    throw error;
  }
};

/**
 * Update last used timestamp for an API key in mock storage
 */
export const updateKeyLastUsed = async (provider: string): Promise<void> => {
  try {
    if (!currentUserId) {
      throw new Error('User not authenticated');
    }

    const keys = mockStorage[currentUserId] || [];
    const keyIndex = keys.findIndex(k => k.provider === provider);

    if (keyIndex >= 0) {
      mockStorage[currentUserId][keyIndex].last_used = new Date().toISOString();
    }
  } catch (error) {
    console.error('Error updating API key last used:', error);
  }
};

// Mock authentication functions
export const mockAuth = {
  user: {
    id: currentUserId,
    email: 'demo@example.com',
  },
  session: {
    access_token: 'mock-token',
    expires_at: Date.now() + 3600000,
  },
  signIn: async (email: string, password: string) => {
    // In a real app, this would validate credentials
    if (email && password) {
      currentUserId = 'demo-user';
      return { error: null };
    }
    return { error: new Error('Invalid credentials') };
  },
  signUp: async (email: string, password: string) => {
    // In a real app, this would create a new user
    if (email && password) {
      currentUserId = 'demo-user';
      return { error: null };
    }
    return { error: new Error('Invalid credentials') };
  },
  signOut: async () => {
    currentUserId = '';
  },
  getSession: async () => {
    return {
      data: {
        session: {
          access_token: 'mock-token',
          expires_at: Date.now() + 3600000,
        }
      }
    };
  },
  getUser: async () => {
    return {
      data: {
        user: currentUserId ? {
          id: currentUserId,
          email: 'demo@example.com',
        } : null
      }
    };
  },
  onAuthStateChange: (callback: any) => {
    // In a real app, this would set up a listener
    return {
      data: {
        subscription: {
          unsubscribe: () => {}
        }
      }
    };
  }
};
