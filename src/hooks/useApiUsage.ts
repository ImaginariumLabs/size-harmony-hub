;
import { useOpenAIUsage } from './useOpenAIUsage';
import { useGitHubUsage } from './useGitHubUsage';
import { useClaudeUsage } from './useClaudeUsage';
import { useGeminiUsage } from './useGeminiUsage';

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
  rawData: unknown; // Original provider-specific data
}

export function useApiUsage(provider: string) {
  const [usage, setUsage] = useState<ApiUsageData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Provider-specific hooks
  const openai = useOpenAIUsage();
  const github = useGitHubUsage();
  const claude = useClaudeUsage();
  const gemini = useGeminiUsage();

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
    } else if (provider === 'claude') {
      if (claude.loading) {
        setLoading(true);
        return;
      }

      if (claude.error) {
        setError(claude.error);
        setLoading(false);
        return;
      }

      if (claude.usage) {
        setUsage({
          provider: 'claude',
          cost: claude.usage.total_cost,
          requests: {
            total: Math.round(claude.usage.total_tokens / 1000), // Approximate request count
            remaining: Infinity, // Claude doesn't have a hard limit
            limit: Infinity
          },
          quota: {
            used: claude.usage.total_cost,
            total: claude.usage.monthly_budget,
            resetDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString()
          },
          lastUpdated: claude.usage.last_updated,
          rawData: claude.usage
        });
        setLoading(false);
      }
    } else if (provider === 'google') {
      if (gemini.loading) {
        setLoading(true);
        return;
      }

      if (gemini.error) {
        setError(gemini.error);
        setLoading(false);
        return;
      }

      if (gemini.usage) {
        setUsage({
          provider: 'google',
          cost: gemini.usage.total_cost,
          requests: {
            total: gemini.usage.requests,
            remaining: Infinity, // Gemini doesn't have a hard limit
            limit: Infinity
          },
          quota: {
            used: gemini.usage.free_tier_used_percentage,
            total: 100, // Percentage
            resetDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString()
          },
          lastUpdated: gemini.usage.last_updated,
          rawData: gemini.usage
        });
        setLoading(false);
      }
    } else {
      setError(`Unsupported provider: ${provider}`);
      setLoading(false);
    }
  }, [
    provider,
    openai.usage, openai.loading, openai.error,
    github.usage, github.loading, github.error,
    claude.usage, claude.loading, claude.error,
    gemini.usage, gemini.loading, gemini.error
  ]);

  // Refetch function that calls the appropriate provider's refetch
  const refetch = async () => {
    setLoading(true);
    if (provider === 'openai') {
      await openai.refetch();
    } else if (provider === 'github') {
      await github.refetch();
    } else if (provider === 'claude') {
      await claude.refetch();
    } else if (provider === 'google') {
      await gemini.refetch();
    }
  };

  return { usage, loading, error, refetch };
}
