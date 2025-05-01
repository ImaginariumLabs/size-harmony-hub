/**
 * API Integration Service
 * Handles integration with various API providers to fetch real usage and cost data
 *
 * This service has been enhanced with better caching and real-time data fetching
 */

import { getApiKey } from './electronService';
import { ApiCostData } from '../types/api';
import * as enhancedApi from './enhancedApiService';

// Interface for API provider configuration
export interface ApiProviderConfig {
  id: string;
  name: string;
  baseUrl: string;
  authType: 'bearer' | 'key' | 'basic';
  usageEndpoint: string;
  costEndpoint?: string;
  responseMapping: {
    usage: string[];
    cost?: string[];
    timestamp?: string[];
  };
}

// Provider configurations
const API_PROVIDERS: Record<string, ApiProviderConfig> = {
  openai: {
    id: 'openai',
    name: 'OpenAI',
    baseUrl: 'https://api.openai.com/v1',
    authType: 'bearer',
    usageEndpoint: '/dashboard/billing/usage',
    costEndpoint: '/dashboard/billing/subscription',
    responseMapping: {
      usage: ['total_usage'],
      cost: ['hard_limit_usd'],
      timestamp: ['object', 'created']
    }
  },
  claude: {
    id: 'claude',
    name: 'Claude',
    baseUrl: 'https://api.anthropic.com/v1',
    authType: 'key',
    usageEndpoint: '/models',
    responseMapping: {
      usage: ['total_usage'],
      cost: ['total_cost'],
      timestamp: ['timestamp']
    }
  },
  google: {
    id: 'google',
    name: 'Gemini',
    baseUrl: 'https://generativelanguage.googleapis.com/v1',
    authType: 'key',
    usageEndpoint: '/models',
    responseMapping: {
      usage: ['total_usage'],
      cost: ['total_cost'],
      timestamp: ['timestamp']
    }
  },
  github: {
    id: 'github',
    name: 'GitHub',
    baseUrl: 'https://api.github.com',
    authType: 'bearer',
    usageEndpoint: '/rate_limit',
    responseMapping: {
      usage: ['resources', 'core', 'used'],
      cost: ['resources', 'core', 'limit'],
      timestamp: ['resources', 'core', 'reset']
    }
  },
  aws: {
    id: 'aws',
    name: 'AWS',
    baseUrl: 'https://api.amazonaws.com',
    authType: 'key',
    usageEndpoint: '/cost-explorer',
    responseMapping: {
      usage: ['ResultsByTime', '0', 'Total', 'Amount'],
      timestamp: ['ResultsByTime', '0', 'TimePeriod', 'End']
    }
  }
};

// Function to fetch API data
export const fetchApiData = async (providerId: string): Promise<ApiCostData> => {
  try {
    // Use enhanced API service for real-time data with caching
    // Check if providerId is a valid ApiProvider
    if (!['openai', 'claude', 'google', 'github'].includes(providerId)) {
      throw new Error(`Unsupported provider: ${providerId}`);
    }
    const apiData = await enhancedApi.fetchApiData(providerId as enhancedApi.ApiProvider);

    // Convert to ApiCostData format
    return {
      total: apiData.total,
      change: apiData.change,
      changeType: apiData.changeType,
      usagePercentage: apiData.usagePercentage
    };
  } catch (error) {
    console.error(`Error fetching data for ${providerId}:`, error);

    // Fall back to mock data
    const { getMockProviderData } = await import('./mockDataService');
    return getMockProviderData(providerId);
  }
};

// Function to fetch data for all providers
export const fetchAllApiData = async (): Promise<Record<string, ApiCostData>> => {
  try {
    // Use enhanced API service for real-time data with caching
    const apiData = await enhancedApi.fetchAllApiData();

    // Convert to ApiCostData format
    const result: Record<string, ApiCostData> = {};

    Object.entries(apiData).forEach(([providerId, data]) => {
      result[providerId] = {
        total: data.total,
        change: data.change,
        changeType: data.changeType,
        usagePercentage: data.usagePercentage
      };
    });

    return result;
  } catch (error) {
    console.error('Error fetching all API data:', error);

    // Fall back to original implementation
    const result: Record<string, ApiCostData> = {};
    const providerIds = Object.keys(API_PROVIDERS);

    await Promise.all(
      providerIds.map(async (providerId) => {
        try {
          result[providerId] = await fetchApiData(providerId);
        } catch (providerError) {
          console.error(`Error fetching data for ${providerId}:`, providerError);

          // Fall back to mock data
          const { getMockProviderData } = await import('./mockDataService');
          result[providerId] = getMockProviderData(providerId);
        }
      })
    );

    return result;
  }
};

// Function to check if a provider is configured
export const isProviderConfigured = async (providerId: string): Promise<boolean> => {
  try {
    const apiKey = await getApiKey(providerId);
    return !!apiKey;
  } catch (error) {
    console.error(`Error checking if provider ${providerId} is configured:`, error);
    return false;
  }
};

// Function to get all configured providers
export const getConfiguredProviders = async (): Promise<string[]> => {
  const providerIds = Object.keys(API_PROVIDERS);
  const configuredProviders: string[] = [];

  for (const providerId of providerIds) {
    if (await isProviderConfigured(providerId)) {
      configuredProviders.push(providerId);
    }
  }

  return configuredProviders;
};

// Export provider configurations
export const getProviderConfigs = (): Record<string, ApiProviderConfig> => {
  return { ...API_PROVIDERS };
};
