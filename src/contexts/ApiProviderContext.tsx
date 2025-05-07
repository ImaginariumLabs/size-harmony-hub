import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { listApiKeys } from '../services/keyManager';
import {
  fetchApiProviders,
  createCustomProvider as createProvider,
  updateApiProvider,
  deleteApiProvider,
} from '../services/apiProviderService';
import { ApiProvider as ApiProviderType } from '../types/api';

// Re-export the ApiProvider type from types/api.ts
export type ApiProvider = ApiProviderType;

interface ApiProviderContextType {
  providers: ApiProvider[];
  loading: boolean;
  error: string | null;
  refreshProviders: () => Promise<void>;
  addCustomProvider: (provider: Partial<ApiProvider>) => Promise<ApiProvider | null>;
  updateCustomProvider: (
    providerId: string,
    updates: Partial<ApiProvider>
  ) => Promise<ApiProvider | null>;
  deleteCustomProvider: (providerId: string) => Promise<boolean>;
  getProviderById: (providerId: string) => ApiProvider | undefined;
}

// Default providers
const defaultProviders: ApiProvider[] = [
  {
    id: 'openai',
    slug: 'openai',
    name: 'OpenAI',
    description: 'GPT-4o, GPT-4 Turbo, and GPT-3.5 Turbo models',
    icon: 'openai-logo.svg',
    color: '#10a37f',
    isConfigured: true, // Set to true for development
    usagePercentage: 65,
  },
  {
    id: 'claude',
    slug: 'claude',
    name: 'Claude',
    description: 'Claude 3.5 Sonnet, Claude 3 Opus, and other Anthropic models',
    icon: 'claude-logo.svg',
    color: '#7963d2',
    isConfigured: true, // Set to true for development
    usagePercentage: 45,
  },
  {
    id: 'google',
    slug: 'google',
    name: 'Gemini',
    description: 'Gemini 1.5 Pro, Gemini 1.5 Flash, and other Google AI models',
    icon: 'gemini-logo.svg',
    color: '#4285f4',
    isConfigured: true, // Set to true for development
    usagePercentage: 30,
  },
];

const ApiProviderContext = createContext<ApiProviderContextType | undefined>(undefined);

export function ApiProviderProvider({ children }: { readonly children: React.ReactNode }) {
  const [providers, setProviders] = useState<ApiProvider[]>(defaultProviders);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshProviders = async () => {
    setLoading(true);
    setError(null);

    // Set a safety timeout to prevent perpetual loading
    const safetyTimeout = setTimeout(() => {
      if (loading) {
        console.warn('Safety timeout triggered in ApiProviderContext to prevent perpetual loading');
        setLoading(false);
        setProviders(defaultProviders);
      }
    }, 5000); // 5 second safety timeout

    try {
      // Get configured API keys
      let apiKeys = [];
      try {
        apiKeys = await listApiKeys();
      } catch (keyError) {
        if (process.env.NODE_ENV !== 'production' || process.env.DEBUG === 'true') {
          console.error('Error listing API keys:', keyError);
        }
        // Continue with empty keys rather than failing completely
        apiKeys = [];
      }

      // Fetch all providers from the database
      let allProviders: ApiProvider[] = [];
      try {
        allProviders = await fetchApiProviders();
      } catch (providerError) {
        if (process.env.NODE_ENV !== 'production' || process.env.DEBUG === 'true') {
          console.error('Error fetching API providers:', providerError);
        }
        // Continue with default providers rather than failing completely
        allProviders = defaultProviders;
      }

      // Update providers with configuration status
      const updatedProviders = allProviders.map(provider => {
        const keyEntry = apiKeys.find(key => key.provider === provider.slug);
        return {
          ...provider,
          isConfigured: !!keyEntry,
          lastUsed: keyEntry?.last_used,
        };
      });

      // Set providers
      setProviders(updatedProviders);
      clearTimeout(safetyTimeout);
    } catch (err) {
      if (process.env.NODE_ENV !== 'production' || process.env.DEBUG === 'true') {
        console.error('Error refreshing providers:', err);
      }
      setError(err instanceof Error ? err.message : 'Failed to refresh providers');
      // Set default providers even on error to prevent endless loading
      setProviders(defaultProviders);
      clearTimeout(safetyTimeout);
    } finally {
      setLoading(false);
    }
  };

  // Get a provider by slug
  const getProviderById = (providerId: string): ApiProvider | undefined => {
    return providers.find(provider => provider.slug === providerId);
  };

  // Add a new custom provider
  const addCustomProvider = async (provider: Partial<ApiProvider>): Promise<ApiProvider | null> => {
    setLoading(true);
    setError(null);

    try {
      // Call the service to create the provider
      const newProvider = await createProvider(provider);

      if (newProvider) {
        // Refresh the providers list to include the new one
        await refreshProviders();
        return newProvider;
      }

      return null;
    } catch (err) {
      if (process.env.NODE_ENV !== 'production' || process.env.DEBUG === 'true') {
        console.error('Error adding custom provider:', err);
      }
      setError(err instanceof Error ? err.message : 'Failed to add custom provider');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update an existing custom provider
  const updateCustomProvider = async (
    providerId: string,
    updates: Partial<ApiProvider>
  ): Promise<ApiProvider | null> => {
    setLoading(true);
    setError(null);

    try {
      // Call the service to update the provider
      const updatedProvider = await updateApiProvider(providerId, updates);

      if (updatedProvider) {
        // Refresh the providers list to include the updated one
        await refreshProviders();
        return updatedProvider;
      }

      return null;
    } catch (err) {
      if (process.env.NODE_ENV !== 'production' || process.env.DEBUG === 'true') {
        console.error('Error updating custom provider:', err);
      }
      setError(err instanceof Error ? err.message : 'Failed to update custom provider');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Delete a custom provider
  const deleteCustomProvider = async (providerId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      // Call the service to delete the provider
      const success = await deleteApiProvider(providerId);

      if (success) {
        // Refresh the providers list to remove the deleted one
        await refreshProviders();
        return true;
      }

      return false;
    } catch (err) {
      if (process.env.NODE_ENV !== 'production' || process.env.DEBUG === 'true') {
        console.error('Error deleting custom provider:', err);
      }
      setError(err instanceof Error ? err.message : 'Failed to delete custom provider');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Initial load

  useEffect(() => {
    refreshProviders();
  }, []);

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(
    () => ({
      providers,
      loading,
      error,
      refreshProviders,
      addCustomProvider,
      updateCustomProvider,
      deleteCustomProvider,
      getProviderById,
    }),
    [providers, loading, error]
  );

  return <ApiProviderContext.Provider value={value}>{children}</ApiProviderContext.Provider>;
}

export function useApiProviders() {
  const context = useContext(ApiProviderContext);
  if (context === undefined) {
    throw new Error('useApiProviders must be used within an ApiProviderProvider');
  }
  return context;
}
