import { useState, useEffect } from 'react';
import { useOpenAIUsage } from './useOpenAIUsage';
import { useGitHubUsage } from './useGitHubUsage';

// Generic interface for all API usage data
export interface ApiUsageData {
  provider: string;
  cost?: number;
  requests?: {
    total: number;
    remaining: number;
    limit: number;
  };
  quota?: {
    used: number;
    total: number;
    resetDate?: string;
  };
  lastUpdated: string;
  rawData: any; // Original provider-specific data
}

export function useApiUsage(provider: string) {
  const [usage, setUsage] = useState<ApiUsageData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Provider-specific hooks
  const openai = useOpenAIUsage();
  const github = useGitHubUsage();

  // Map provider-specific data to generic format
  useEffect(() => {
    if (provider === 'openai') {
      if (openai.loading) {
        setLoading(true);
        return;
      }
      
      if (openai.error) {
        setError(openai.error);
        setLoading(false);
        return;
      }
      
      if (openai.usage) {
        setUsage({
          provider: 'openai',
          cost: openai.usage.total_usage / 100, // Convert cents to dollars
          requests: {
            total: Math.round(openai.usage.total_tokens / 1000), // Approximate request count
            remaining: Infinity, // OpenAI doesn't have a hard limit
            limit: Infinity
          },
          quota: {
            used: openai.usage.total_usage / 100, // Convert cents to dollars
            total: 120, // Assuming $120 monthly quota, adjust as needed
            resetDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString()
          },
          lastUpdated: new Date().toISOString(),
          rawData: openai.usage
        });
        setLoading(false);
      }
    } else if (provider === 'github') {
      if (github.loading) {
        setLoading(true);
        return;
      }
      
      if (github.error) {
        setError(github.error);
        setLoading(false);
        return;
      }
      
      if (github.usage) {
        const resetDate = new Date(github.usage.rate_limits.resources.core.reset * 1000);
        setUsage({
          provider: 'github',
          requests: {
            total: github.usage.rate_limits.resources.core.used,
            remaining: github.usage.rate_limits.resources.core.remaining,
            limit: github.usage.rate_limits.resources.core.limit
          },
          quota: {
            used: github.usage.rate_limits.resources.core.used,
            total: github.usage.rate_limits.resources.core.limit,
            resetDate: resetDate.toISOString()
          },
          lastUpdated: github.usage.last_updated,
          rawData: github.usage
        });
        setLoading(false);
      }
    } else {
      setError(`Unsupported provider: ${provider}`);
      setLoading(false);
    }
  }, [provider, openai.usage, openai.loading, openai.error, github.usage, github.loading, github.error]);

  // Refetch function that calls the appropriate provider's refetch
  const refetch = async () => {
    setLoading(true);
    if (provider === 'openai') {
      await openai.refetch();
    } else if (provider === 'github') {
      await github.refetch();
    }
  };

  return { usage, loading, error, refetch };
}
