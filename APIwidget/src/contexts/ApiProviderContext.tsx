import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { listApiKeys, ApiKeyEntry } from '../services/mockKeyManager';

export interface ApiProvider {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  isConfigured: boolean;
  lastUsed?: string;
  usagePercentage?: number; // Add usage percentage for UI display
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
    isConfigured: false,
    usagePercentage: 65
  },
  {
    id: 'github',
    name: 'GitHub',
    description: 'GitHub API for repositories and more',
    icon: 'github-logo.svg',
    color: '#24292e',
    isConfigured: false,
    usagePercentage: 45
  },
  {
    id: 'aws',
    name: 'AWS',
    description: 'Amazon Web Services API',
    icon: 'aws-logo.svg',
    color: '#ff9900',
    isConfigured: false,
    usagePercentage: 30
  },
  {
    id: 'google',
    name: 'Google Cloud',
    description: 'Google Cloud Platform services',
    icon: 'gcp-logo.svg',
    color: '#4285f4',
    isConfigured: false,
    usagePercentage: 20
  },
  {
    id: 'azure',
    name: 'Azure',
    description: 'Microsoft Azure cloud services',
    icon: 'azure-logo.svg',
    color: '#0089d6',
    isConfigured: false,
    usagePercentage: 15
  }
];

const ApiProviderContext = createContext<ApiProviderContextType | undefined>(undefined);

export function ApiProviderProvider({ children }: { readonly children: React.ReactNode }) {
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

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    providers,
    loading,
    error,
    refreshProviders
  }), [providers, loading, error]);

  return <ApiProviderContext.Provider value={value}>{children}</ApiProviderContext.Provider>;
}

export function useApiProviders() {
  const context = useContext(ApiProviderContext);
  if (context === undefined) {
    throw new Error('useApiProviders must be used within an ApiProviderProvider');
  }
  return context;
}
