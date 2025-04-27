import React, { createContext, useContext, useState, useEffect } from 'react';
import { listApiKeys, ApiKeyEntry } from '../services/mockKeyManager';

export interface ApiProvider {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  isConfigured: boolean;
  lastUsed?: string;
}

interface ApiProviderContextType {
  providers: ApiProvider[];
  loading: boolean;
  error: string | null;
  refreshProviders: () => Promise<void>;
}

// Default providers
const defaultProviders: ApiProvider[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    description: 'GPT models and other AI services',
    icon: 'openai-logo.svg',
    color: '#10a37f',
    isConfigured: false
  },
  {
    id: 'github',
    name: 'GitHub',
    description: 'GitHub API for repositories and more',
    icon: 'github-logo.svg',
    color: '#24292e',
    isConfigured: false
  },
  {
    id: 'aws',
    name: 'AWS',
    description: 'Amazon Web Services API',
    icon: 'aws-logo.svg',
    color: '#ff9900',
    isConfigured: false
  },
  {
    id: 'google',
    name: 'Google Cloud',
    description: 'Google Cloud Platform services',
    icon: 'gcp-logo.svg',
    color: '#4285f4',
    isConfigured: false
  },
  {
    id: 'azure',
    name: 'Azure',
    description: 'Microsoft Azure cloud services',
    icon: 'azure-logo.svg',
    color: '#0089d6',
    isConfigured: false
  }
];

const ApiProviderContext = createContext<ApiProviderContextType | undefined>(undefined);

export function ApiProviderProvider({ children }: { children: React.ReactNode }) {
  const [providers, setProviders] = useState<ApiProvider[]>(defaultProviders);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshProviders = async () => {
    setLoading(true);
    setError(null);

    try {
      // Get configured API keys
      const apiKeys = await listApiKeys();

      // Update providers with configuration status
      const updatedProviders = defaultProviders.map(provider => {
        const keyEntry = apiKeys.find(key => key.provider === provider.id);
        return {
          ...provider,
          isConfigured: !!keyEntry,
          lastUsed: keyEntry?.last_used
        };
      });

      setProviders(updatedProviders);
    } catch (err) {
      console.error('Error refreshing providers:', err);
      setError(err instanceof Error ? err.message : 'Failed to refresh providers');
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    refreshProviders();
  }, []);

  const value = {
    providers,
    loading,
    error,
    refreshProviders
  };

  return <ApiProviderContext.Provider value={value}>{children}</ApiProviderContext.Provider>;
}

export function useApiProviders() {
  const context = useContext(ApiProviderContext);
  if (context === undefined) {
    throw new Error('useApiProviders must be used within an ApiProviderProvider');
  }
  return context;
}
