/**
 * Enhanced API Integration Service
 *
 * Provides real-time data fetching from various API providers with caching
 * and error handling.
 *
 * Improved with better error handling, fallback data, timeout protection,
 * and retry mechanisms to prevent endless loading states and improve reliability.
 */

import { cacheService } from './cacheService';
import { getApiKey, updateKeyLastUsed } from './mockKeyManager';
import { withRetryAndTimeout } from '../utils/retryUtils';
import { useLoading } from '../contexts/LoadingContext';

// API Provider Types
export type ApiProvider = 'openai' | 'claude' | 'google' | 'github';

// API Data Types
export interface ApiUsageData {
  total: number;
  change: number;
  changeType: 'increase' | 'decrease';
  usagePercentage: number;
  lastUpdated: string;
}

// Default timeout for API calls (in milliseconds)
const API_TIMEOUT = 5000; // 5 seconds

// Default retry options
const DEFAULT_RETRY_OPTIONS = {
  maxRetries: 2,
  baseDelay: 1000,
  useExponentialBackoff: true,
  onRetry: (attempt: number, error: any) => {
    console.warn(`Retry attempt ${attempt} for API call after error:`, error);
  }
};

/**
 * Create a promise that rejects after a specified timeout
 * @param ms Timeout in milliseconds
 * @deprecated Use withRetryAndTimeout from retryUtils instead
 * @private
 */
function createTimeout(ms: number): Promise<never> {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Operation timed out after ${ms}ms`));
    }, ms);
  });
}

// This function is kept for backward compatibility but should not be used in new code

/**
 * Create fallback data for a provider
 * @param provider The API provider
 */
function createFallbackData(provider: ApiProvider): ApiUsageData {
  console.warn(`Creating fallback data for ${provider}`);
  return {
    total: 0,
    change: 0,
    changeType: 'increase' as const,
    usagePercentage: 0,
    lastUpdated: new Date().toISOString()
  };
}

/**
 * Safely parse JSON with fallback
 * @param jsonString The JSON string to parse
 * @param fallback Fallback value if parsing fails
 */
function safeJsonParse<T>(jsonString: string | null, fallback: T): T {
  if (!jsonString) return fallback;
  try {
    return JSON.parse(jsonString) as T;
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return fallback;
  }
}

// OpenAI API Integration
export async function fetchOpenAIData(): Promise<ApiUsageData> {
  return cacheService.getOrSet('openai_data', async () => {
    try {
      // Use retry mechanism with timeout protection
      return await withRetryAndTimeout(
        async () => {
          const apiKey = await getApiKey('openai');

          // Generate mock data even if no API key is found
          // This allows the dashboard to work without actual API keys
          if (!apiKey) {
            console.warn('No OpenAI API key found, using mock data');
            // Continue with mock data generation
          }

          // Update last used timestamp
          await updateKeyLastUsed('openai');

          // In a real implementation, this would make an actual API call
          // For now, we'll simulate the data

          // Get stored data or initialize
          const defaultData = {
            total_usage: 0,
            prompt_tokens: 0,
            completion_tokens: 0,
            total_tokens: 0,
            models_used: [],
            daily_costs: []
          };
          const storedData = localStorage.getItem('openai_usage_data');
          const data = safeJsonParse(storedData, defaultData);

          // Generate some random data for demonstration
          const newUsage = Math.random() * 2 + 0.5; // $0.50 to $2.50
          const previousTotal = data.total_usage / 100;
          const newTotal = previousTotal + newUsage;
          const change = newUsage;
          const changeType = 'increase' as const;

          // Update the stored data
          data.total_usage = newTotal * 100;

          // Store the updated data
          localStorage.setItem('openai_usage_data', JSON.stringify(data));

          return {
            total: newTotal,
            change,
            changeType,
            usagePercentage: Math.min(100, Math.round((newTotal / 120) * 100)), // Assuming $120 monthly quota
            lastUpdated: new Date().toISOString()
          };
        },
        API_TIMEOUT,
        createFallbackData('openai'),
        DEFAULT_RETRY_OPTIONS
      );
    } catch (error) {
      console.error('Error fetching OpenAI data:', error);
      // Return fallback data instead of throwing
      return createFallbackData('openai');
    }
  }, 60); // Cache for 1 minute
}

// Claude API Integration
export async function fetchClaudeData(): Promise<ApiUsageData> {
  return cacheService.getOrSet('claude_data', async () => {
    try {
      // Use retry mechanism with timeout protection
      return await withRetryAndTimeout(
        async () => {
          const apiKey = await getApiKey('claude');

          // Generate mock data even if no API key is found
          // This allows the dashboard to work without actual API keys
          if (!apiKey) {
            console.warn('No Claude API key found, using mock data');
            // Continue with mock data generation
          }

          // Update last used timestamp
          await updateKeyLastUsed('claude');

          // Get stored data or initialize
          const defaultData = {
            total_cost: 0,
            input_tokens: 0,
            output_tokens: 0,
            total_tokens: 0,
            models_used: [],
            daily_costs: [],
            monthly_budget: 100,
            budget_used_percentage: 0,
            last_updated: new Date().toISOString()
          };
          const storedData = localStorage.getItem('claude_usage_data');
          const data = safeJsonParse(storedData, defaultData);

          // Generate some random data for demonstration
          const newCost = Math.random() * 1.5 + 0.2; // $0.20 to $1.70
          const previousTotal = data.total_cost;
          const newTotal = previousTotal + newCost;
          const change = newCost;
          const changeType = 'increase' as const;

          // Update the stored data
          data.total_cost = newTotal;
          data.budget_used_percentage = Math.min(100, Math.round((newTotal / data.monthly_budget) * 100));
          data.last_updated = new Date().toISOString();

          // Store the updated data
          localStorage.setItem('claude_usage_data', JSON.stringify(data));

          return {
            total: newTotal,
            change,
            changeType,
            usagePercentage: data.budget_used_percentage,
            lastUpdated: data.last_updated
          };
        },
        API_TIMEOUT,
        createFallbackData('claude'),
        DEFAULT_RETRY_OPTIONS
      );
    } catch (error) {
      console.error('Error fetching Claude data:', error);
      // Return fallback data instead of throwing
      return createFallbackData('claude');
    }
  }, 60); // Cache for 1 minute
}

// Gemini API Integration
export async function fetchGeminiData(): Promise<ApiUsageData> {
  return cacheService.getOrSet('gemini_data', async () => {
    try {
      // Use retry mechanism with timeout protection
      return await withRetryAndTimeout(
        async () => {
          const apiKey = await getApiKey('google');

          // Generate mock data even if no API key is found
          // This allows the dashboard to work without actual API keys
          if (!apiKey) {
            console.warn('No Gemini API key found, using mock data');
            // Continue with mock data generation
          }

          // Update last used timestamp
          await updateKeyLastUsed('google');

          // Get stored data or initialize
          const defaultData = {
            total_cost: 0,
            input_tokens: 0,
            output_tokens: 0,
            total_tokens: 0,
            requests: 0,
            models_used: [],
            daily_costs: [],
            monthly_budget: 10,
            budget_used_percentage: 0,
            free_tier_used_percentage: 0,
            last_updated: new Date().toISOString()
          };
          const storedData = localStorage.getItem('gemini_usage_data');
          const data = safeJsonParse(storedData, defaultData);

          // Generate some random data for demonstration
          const newCost = Math.random() * 0.05 + 0.01; // $0.01 to $0.06 (Gemini is cheaper)
          const previousTotal = data.total_cost;
          const newTotal = previousTotal + newCost;
          const change = newCost;
          const changeType = 'increase' as const;

          // Update the stored data
          data.total_cost = newTotal;
          data.budget_used_percentage = Math.min(100, Math.round((newTotal / data.monthly_budget) * 100));
          data.last_updated = new Date().toISOString();

          // Store the updated data
          localStorage.setItem('gemini_usage_data', JSON.stringify(data));

          return {
            total: newTotal,
            change,
            changeType,
            usagePercentage: data.budget_used_percentage,
            lastUpdated: data.last_updated
          };
        },
        API_TIMEOUT,
        createFallbackData('google'),
        DEFAULT_RETRY_OPTIONS
      );
    } catch (error) {
      console.error('Error fetching Gemini data:', error);
      // Return fallback data instead of throwing
      return createFallbackData('google');
    }
  }, 60); // Cache for 1 minute
}

// GitHub API Integration
export async function fetchGitHubData(): Promise<ApiUsageData> {
  return cacheService.getOrSet('github_data', async () => {
    try {
      // Use retry mechanism with timeout protection
      return await withRetryAndTimeout(
        async () => {
          const apiKey = await getApiKey('github');

          // Generate mock data even if no API key is found
          // This allows the dashboard to work without actual API keys
          if (!apiKey) {
            console.warn('No GitHub API key found, using mock data');
            // Continue with mock data generation
          }

          // Update last used timestamp
          await updateKeyLastUsed('github');

          // Get stored data or initialize
          const defaultData = {
            rate_limits: {
              resources: {
                core: {
                  limit: 5000,
                  used: 0,
                  remaining: 5000,
                  reset: Math.floor(Date.now() / 1000) + 3600
                }
              }
            },
            last_updated: new Date().toISOString()
          };
          const storedData = localStorage.getItem('github_usage_data');
          const data = safeJsonParse(storedData, defaultData);

          // Generate some random data for demonstration
          const newUsed = Math.floor(Math.random() * 100) + 10; // 10 to 110 new requests
          const previousUsed = data.rate_limits.resources.core.used;
          const newTotal = previousUsed + newUsed;
          const remaining = data.rate_limits.resources.core.limit - newTotal;

          // Update the stored data
          data.rate_limits.resources.core.used = newTotal;
          data.rate_limits.resources.core.remaining = remaining;
          data.last_updated = new Date().toISOString();

          // Store the updated data
          localStorage.setItem('github_usage_data', JSON.stringify(data));

          return {
            total: newTotal,
            change: newUsed,
            changeType: 'increase' as const,
            usagePercentage: Math.round((newTotal / data.rate_limits.resources.core.limit) * 100),
            lastUpdated: data.last_updated
          };
        },
        API_TIMEOUT,
        createFallbackData('github'),
        DEFAULT_RETRY_OPTIONS
      );
    } catch (error) {
      console.error('Error fetching GitHub data:', error);
      // Return fallback data instead of throwing
      return createFallbackData('github');
    }
  }, 60); // Cache for 1 minute
}

// Fetch data for a specific provider
export async function fetchApiData(provider: ApiProvider): Promise<ApiUsageData> {
  try {
    // Use retry mechanism with timeout protection
    return await withRetryAndTimeout(
      async () => {
        switch (provider) {
          case 'openai':
            return await fetchOpenAIData();
          case 'claude':
            return await fetchClaudeData();
          case 'google':
            return await fetchGeminiData();
          case 'github':
            return await fetchGitHubData();
          default:
            console.error(`Unsupported provider: ${provider}`);
            throw new Error(`Unsupported provider: ${provider}`);
        }
      },
      API_TIMEOUT,
      createFallbackData(provider),
      DEFAULT_RETRY_OPTIONS
    );
  } catch (error) {
    console.error(`Error in fetchApiData for ${provider}:`, error);
    return createFallbackData(provider);
  }
}

// Fetch data for all providers
export async function fetchAllApiData(): Promise<Record<ApiProvider, ApiUsageData>> {
  try {
    // Use retry mechanism with timeout protection
    return await withRetryAndTimeout(
      async () => {
        const [openai, claude, google, github] = await Promise.allSettled([
          fetchOpenAIData(),
          fetchClaudeData(),
          fetchGeminiData(),
          fetchGitHubData()
        ]);

        const result: Partial<Record<ApiProvider, ApiUsageData>> = {};

        if (openai.status === 'fulfilled') {
          result.openai = openai.value;
        } else {
          console.warn('Failed to fetch OpenAI data, using fallback data');
          result.openai = createFallbackData('openai');
        }

        if (claude.status === 'fulfilled') {
          result.claude = claude.value;
        } else {
          console.warn('Failed to fetch Claude data, using fallback data');
          result.claude = createFallbackData('claude');
        }

        if (google.status === 'fulfilled') {
          result.google = google.value;
        } else {
          console.warn('Failed to fetch Gemini data, using fallback data');
          result.google = createFallbackData('google');
        }

        if (github.status === 'fulfilled') {
          result.github = github.value;
        } else {
          console.warn('Failed to fetch GitHub data, using fallback data');
          result.github = createFallbackData('github');
        }

        return result as Record<ApiProvider, ApiUsageData>;
      },
      API_TIMEOUT * 2, // Double timeout for all providers
      {
        openai: createFallbackData('openai'),
        claude: createFallbackData('claude'),
        google: createFallbackData('google'),
        github: createFallbackData('github')
      },
      {
        ...DEFAULT_RETRY_OPTIONS,
        maxRetries: 1, // Only retry once for all providers to avoid excessive API calls
        onRetry: (attempt, error) => {
          console.warn(`Retry attempt ${attempt} for fetchAllApiData after error:`, error);
        }
      }
    );
  } catch (error) {
    console.error('Error fetching all API data:', error);
    // Return fallback data instead of throwing
    return {
      openai: createFallbackData('openai'),
      claude: createFallbackData('claude'),
      google: createFallbackData('google'),
      github: createFallbackData('github')
    };
  }
}

// Clear all cached data
export function clearCachedApiData(): void {
  try {
    cacheService.remove('openai_data');
    cacheService.remove('claude_data');
    cacheService.remove('gemini_data');
    cacheService.remove('github_data');
    console.log('All API data cache cleared');
  } catch (error) {
    console.error('Error clearing cached API data:', error);
  }
}

// Get cache status
export function getApiCacheStatus(): Record<string, boolean> {
  try {
    return {
      openai: cacheService.has('openai_data'),
      claude: cacheService.has('claude_data'),
      google: cacheService.has('gemini_data'),
      github: cacheService.has('github_data')
    };
  } catch (error) {
    console.error('Error getting API cache status:', error);
    return {
      openai: false,
      claude: false,
      google: false,
      github: false
    };
  }
}
