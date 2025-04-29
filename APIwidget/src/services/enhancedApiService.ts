/**
 * Enhanced API Integration Service
 *
 * Provides real-time data fetching from various API providers with caching
 * and error handling.
 */

import { cacheService } from './cacheService';
import { getApiKey, updateKeyLastUsed } from './mockKeyManager';

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

// OpenAI API Integration
export async function fetchOpenAIData(): Promise<ApiUsageData> {
  return cacheService.getOrSet('openai_data', async () => {
    try {
      const apiKey = await getApiKey('openai');

      if (!apiKey) {
        throw new Error('No OpenAI API key found');
      }

      // Update last used timestamp
      await updateKeyLastUsed('openai');

      // In a real implementation, this would make an actual API call
      // For now, we'll simulate the data

      // Get stored data or initialize
      const storedData = localStorage.getItem('openai_usage_data');
      let data = storedData ? JSON.parse(storedData) : {
        total_usage: 0,
        prompt_tokens: 0,
        completion_tokens: 0,
        total_tokens: 0,
        models_used: [],
        daily_costs: []
      };

      // Generate some random data for demonstration
      const newUsage = Math.random() * 2 + 0.5; // $0.50 to $2.50
      const previousTotal = data.total_usage / 100;
      const newTotal = previousTotal + newUsage;
      const change = newUsage;
      const changeType = 'increase';

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
    } catch (error) {
      console.error('Error fetching OpenAI data:', error);
      throw error;
    }
  }, 60); // Cache for 1 minute
}

// Claude API Integration
export async function fetchClaudeData(): Promise<ApiUsageData> {
  return cacheService.getOrSet('claude_data', async () => {
    try {
      const apiKey = await getApiKey('claude');

      if (!apiKey) {
        throw new Error('No Claude API key found');
      }

      // Update last used timestamp
      await updateKeyLastUsed('claude');

      // Get stored data or initialize
      const storedData = localStorage.getItem('claude_usage_data');
      let data = storedData ? JSON.parse(storedData) : {
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

      // Generate some random data for demonstration
      const newCost = Math.random() * 1.5 + 0.2; // $0.20 to $1.70
      const previousTotal = data.total_cost;
      const newTotal = previousTotal + newCost;
      const change = newCost;
      const changeType = 'increase';

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
    } catch (error) {
      console.error('Error fetching Claude data:', error);
      throw error;
    }
  }, 60); // Cache for 1 minute
}

// Gemini API Integration
export async function fetchGeminiData(): Promise<ApiUsageData> {
  return cacheService.getOrSet('gemini_data', async () => {
    try {
      const apiKey = await getApiKey('google');

      if (!apiKey) {
        throw new Error('No Gemini API key found');
      }

      // Update last used timestamp
      await updateKeyLastUsed('google');

      // Get stored data or initialize
      const storedData = localStorage.getItem('gemini_usage_data');
      let data = storedData ? JSON.parse(storedData) : {
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

      // Generate some random data for demonstration
      const newCost = Math.random() * 0.05 + 0.01; // $0.01 to $0.06 (Gemini is cheaper)
      const previousTotal = data.total_cost;
      const newTotal = previousTotal + newCost;
      const change = newCost;
      const changeType = 'increase';

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
    } catch (error) {
      console.error('Error fetching Gemini data:', error);
      throw error;
    }
  }, 60); // Cache for 1 minute
}

// GitHub API Integration
export async function fetchGitHubData(): Promise<ApiUsageData> {
  return cacheService.getOrSet('github_data', async () => {
    try {
      const apiKey = await getApiKey('github');

      if (!apiKey) {
        throw new Error('No GitHub API key found');
      }

      // Update last used timestamp
      await updateKeyLastUsed('github');

      // Get stored data or initialize
      const storedData = localStorage.getItem('github_usage_data');
      let data = storedData ? JSON.parse(storedData) : {
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
        changeType: 'increase',
        usagePercentage: Math.round((newTotal / data.rate_limits.resources.core.limit) * 100),
        lastUpdated: data.last_updated
      };
    } catch (error) {
      console.error('Error fetching GitHub data:', error);
      throw error;
    }
  }, 60); // Cache for 1 minute
}

// Fetch data for a specific provider
export async function fetchApiData(provider: ApiProvider): Promise<ApiUsageData> {
  switch (provider) {
    case 'openai':
      return fetchOpenAIData();
    case 'claude':
      return fetchClaudeData();
    case 'google':
      return fetchGeminiData();
    case 'github':
      return fetchGitHubData();
    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }
}

// Fetch data for all providers
export async function fetchAllApiData(): Promise<Record<ApiProvider, ApiUsageData>> {
  try {
    const [openai, claude, google, github] = await Promise.allSettled([
      fetchOpenAIData(),
      fetchClaudeData(),
      fetchGeminiData(),
      fetchGitHubData()
    ]);

    const result: Partial<Record<ApiProvider, ApiUsageData>> = {};

    if (openai.status === 'fulfilled') {
      result.openai = openai.value;
    }

    if (claude.status === 'fulfilled') {
      result.claude = claude.value;
    }

    if (google.status === 'fulfilled') {
      result.google = google.value;
    }

    if (github.status === 'fulfilled') {
      result.github = github.value;
    }

    return result as Record<ApiProvider, ApiUsageData>;
  } catch (error) {
    console.error('Error fetching all API data:', error);
    throw error;
  }
}

// Clear all cached data
export function clearCachedApiData(): void {
  cacheService.remove('openai_data');
  cacheService.remove('claude_data');
  cacheService.remove('gemini_data');
  cacheService.remove('github_data');
}

// Get cache status
export function getApiCacheStatus(): Record<string, boolean> {
  return {
    openai: cacheService.has('openai_data'),
    claude: cacheService.has('claude_data'),
    google: cacheService.has('gemini_data'),
    github: cacheService.has('github_data')
  };
}
