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
    description: 'GPT-4o, GPT-4 Turbo, and GPT-3.5 Turbo models',
    icon: 'openai-logo.svg',
    color: '#10a37f',
    isConfigured: false,
    usagePercentage: 65
  },
  {
    id: 'claude',
    name: 'Claude',
    description: 'Claude 3.5 Sonnet, Claude 3 Opus, and other Anthropic models',
    icon: 'claude-logo.svg',
    color: '#7963d2',
    isConfigured: false,
    usagePercentage: 45
  },
  {
    id: 'google',
    name: 'Gemini',
    description: 'Gemini 1.5 Pro, Gemini 1.5 Flash, and other Google AI models',
    icon: 'gemini-logo.svg',
    color: '#4285f4',
    isConfigured: false,
    usagePercentage: 30
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
