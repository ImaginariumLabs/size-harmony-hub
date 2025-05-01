import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { listApiKeys } from '../services/mockKeyManager';
import { fetchCustomProviders } from '../services/customProviderService';
import { ApiProvider as ApiProviderType, ApiProviderConfig } from '../types/api';

// Re-export the ApiProvider type from types/api.ts
export type ApiProvider = ApiProviderType;

interface ApiProviderContextType {
  providers: ApiProvider[];
  loading: boolean;
  error: string | null;
  refreshProviders: () => Promise<void>;
  addCustomProvider: (provider: Partial<ApiProvider>) => Promise<ApiProvider | null>;
  updateCustomProvider: (providerId: string, updates: Partial<ApiProvider>) => Promise<ApiProvider | null>;
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
    isConfigured: false,
    usagePercentage: 65
  },
  {
    id: 'claude',
    slug: 'claude',
    name: 'Claude',
    description: 'Claude 3.5 Sonnet, Claude 3 Opus, and other Anthropic models',
    icon: 'claude-logo.svg',
    color: '#7963d2',
    isConfigured: false,
    usagePercentage: 45
  },
  {
    id: 'google',
    slug: 'google',
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

      // Fetch custom providers from the database
      let customProviders: ApiProvider[] = [];
      try {
        customProviders = await fetchCustomProviders();
      } catch (customProviderError) {
        console.error('Error fetching custom providers:', customProviderError);
        // Continue with empty custom providers rather than failing completely
      }

      // Update built-in providers with configuration status
      const updatedBuiltInProviders = defaultProviders.map(provider => {
        const keyEntry = apiKeys.find(key => key.provider === provider.slug);
        return {
          ...provider,
          isConfigured: !!keyEntry,
          lastUsed: keyEntry?.last_used
        };
      });

      // Update custom providers with configuration status
      const updatedCustomProviders = customProviders.map(provider => {
        const keyEntry = apiKeys.find(key => key.provider === provider.slug);
        return {
          ...provider,
          isConfigured: !!keyEntry,
          lastUsed: keyEntry?.last_used
        };
      });

      // Combine built-in and custom providers
      setProviders([...updatedBuiltInProviders, ...updatedCustomProviders]);
    } catch (err) {
      console.error('Error refreshing providers:', err);
      setError(err instanceof Error ? err.message : 'Failed to refresh providers');
      // Set default providers even on error to prevent endless loading
      setProviders(defaultProviders);
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
      // Convert from ApiProvider to ApiProviderConfig format
      const providerConfig = {
        id: provider.id || provider.slug || '',
        slug: provider.slug || '',
        name: provider.name || '',
        description: provider.description || '',
        baseUrl: provider.baseUrl || '',
        authType: provider.authType || 'bearer',
        usageEndpoint: '/usage', // Default endpoint
        responseMapping: {
          usage: ['data.usage']
        }
      };

      // Call the service to create the provider
      const { createCustomProvider } = await import('../services/customProviderService');
      const newProvider = await createCustomProvider(providerConfig);

      if (newProvider) {
        // Refresh the providers list to include the new one
        await refreshProviders();
        return newProvider;
      }

      return null;
    } catch (err) {
      console.error('Error adding custom provider:', err);
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
      // Convert from ApiProvider to ApiProviderConfig format
      const providerConfig: Partial<ApiProviderConfig> = {};
      if (updates.name) providerConfig.name = updates.name;
      if (updates.description) providerConfig.description = updates.description;
      if (updates.baseUrl) providerConfig.baseUrl = updates.baseUrl;
      if (updates.authType) providerConfig.authType = updates.authType;

      // Call the service to update the provider
      const { updateCustomProvider: updateProviderService } = await import('../services/customProviderService');
      const updatedProvider = await updateProviderService(providerId, providerConfig);

      if (updatedProvider) {
        // Refresh the providers list to include the updated one
        await refreshProviders();
        return updatedProvider;
      }

      return null;
    } catch (err) {
      console.error('Error updating custom provider:', err);
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
      const { deleteCustomProvider } = await import('../services/customProviderService');
      const success = await deleteCustomProvider(providerId);

      if (success) {
        // Refresh the providers list to remove the deleted one
        await refreshProviders();
        return true;
      }

      return false;
    } catch (err) {
      console.error('Error deleting custom provider:', err);
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
  const value = useMemo(() => ({
    providers,
    loading,
    error,
    refreshProviders,
    addCustomProvider,
    updateCustomProvider,
    deleteCustomProvider,
    getProviderById
// eslint-disable-next-line react-hooks/exhaustive-deps
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
