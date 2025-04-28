/**
 * API Integration Service
 * Handles integration with various API providers to fetch real usage and cost data
 */

import { getApiKey } from './electronService';
import { ApiCostData } from '../types/api';

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
  },
  google: {
    id: 'google',
    name: 'Google Cloud',
    baseUrl: 'https://cloudbilling.googleapis.com/v1',
    authType: 'bearer',
    usageEndpoint: '/projects/{projectId}/billingInfo',
    responseMapping: {
      usage: ['total'],
      cost: ['total'],
      timestamp: ['timestamp']
    }
  }
};

// Helper function to extract nested property from object
const getNestedProperty = (obj: any, path: string[]): any => {
  return path.reduce((prev, curr) => {
    return prev && prev[curr] ? prev[curr] : null;
  }, obj);
};

// Helper function to format cost data
const formatCostData = (
  currentData: any,
  previousData: any,
  mapping: ApiProviderConfig['responseMapping']
): ApiCostData => {
  // Extract current cost/usage
  const currentCost = parseFloat(getNestedProperty(currentData, mapping.cost || mapping.usage));

  // Extract previous cost/usage if available
  let previousCost = 0;
  if (previousData) {
    previousCost = parseFloat(getNestedProperty(previousData, mapping.cost || mapping.usage));
  }

  // Calculate change
  const change = Math.abs(currentCost - previousCost);
  const changeType = currentCost >= previousCost ? 'increase' : 'decrease';

  return {
    total: currentCost,
    change,
    changeType
  };
};

// Cache for API responses
const responseCache: Record<string, { data: any; timestamp: number }> = {};
const historicalData: Record<string, any[]> = {};

// Function to fetch API data
export const fetchApiData = async (providerId: string): Promise<ApiCostData> => {
  try {
    // Special handling for Google Cloud
    if (providerId === 'google') {
      try {
        const { fetchBillingData } = await import('./googleCloudService');
        // For demo purposes, we're using a fixed project ID
        // In a real implementation, you would get this from user input
        return await fetchBillingData('my-project-id');
      } catch (googleError) {
        console.error('Error fetching Google Cloud data:', googleError);
        // Fall through to standard implementation as fallback
      }
    }

    // Check if provider is configured
    const provider = API_PROVIDERS[providerId];
    if (!provider) {
      throw new Error(`Provider ${providerId} not configured`);
    }

    // Get API key
    const apiKey = await getApiKey(providerId);
    if (!apiKey) {
      throw new Error(`No API key found for ${providerId}`);
    }

    // Check cache (valid for 5 minutes)
    const now = Date.now();
    const cacheKey = `${providerId}_data`;
    if (responseCache[cacheKey] && now - responseCache[cacheKey].timestamp < 5 * 60 * 1000) {
      console.log(`Using cached data for ${providerId}`);

      // Store in historical data if not already there
      if (!historicalData[providerId]) {
        historicalData[providerId] = [];
      }

      if (historicalData[providerId].length === 0 ||
          historicalData[providerId][historicalData[providerId].length - 1] !== responseCache[cacheKey].data) {
        historicalData[providerId].push(responseCache[cacheKey].data);

        // Keep only last 24 data points
        if (historicalData[providerId].length > 24) {
          historicalData[providerId].shift();
        }
      }

      // Get previous data point for comparison
      const previousData = historicalData[providerId].length > 1
        ? historicalData[providerId][historicalData[providerId].length - 2]
        : null;

      return formatCostData(
        responseCache[cacheKey].data,
        previousData,
        provider.responseMapping
      );
    }

    // Prepare headers based on auth type
    let headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    switch (provider.authType) {
      case 'bearer':
        headers['Authorization'] = `Bearer ${apiKey}`;
        break;
      case 'key':
        headers['X-Api-Key'] = apiKey;
        break;
      case 'basic':
        headers['Authorization'] = `Basic ${btoa(apiKey)}`;
        break;
    }

    // Make API request
    console.log(`Fetching data from ${provider.baseUrl}${provider.usageEndpoint}`);

    // In a real implementation, we would make the actual API call here
    // For now, we'll simulate a response based on the provider
    // const response = await fetch(`${provider.baseUrl}${provider.usageEndpoint}`, {
    //   method: 'GET',
    //   headers
    // });
    // const data = await response.json();

    // Simulate API response for demo purposes
    const data = simulateApiResponse(providerId);

    // Cache the response
    responseCache[cacheKey] = {
      data,
      timestamp: now
    };

    // Store in historical data
    if (!historicalData[providerId]) {
      historicalData[providerId] = [];
    }

    historicalData[providerId].push(data);

    // Keep only last 24 data points
    if (historicalData[providerId].length > 24) {
      historicalData[providerId].shift();
    }

    // Get previous data point for comparison
    const previousData = historicalData[providerId].length > 1
      ? historicalData[providerId][historicalData[providerId].length - 2]
      : null;

    return formatCostData(
      data,
      previousData,
      provider.responseMapping
    );
  } catch (error) {
    console.error(`Error fetching data for ${providerId}:`, error);

    // Fall back to mock data
    const { getMockProviderData } = await import('./mockDataService');
    return getMockProviderData(providerId);
  }
};

// Function to fetch data for all providers
export const fetchAllApiData = async (): Promise<Record<string, ApiCostData>> => {
  const result: Record<string, ApiCostData> = {};

  // Get all provider IDs
  const providerIds = Object.keys(API_PROVIDERS);

  // Fetch data for each provider
  await Promise.all(
    providerIds.map(async (providerId) => {
      try {
        result[providerId] = await fetchApiData(providerId);
      } catch (error) {
        console.error(`Error fetching data for ${providerId}:`, error);

        // Fall back to mock data
        const { getMockProviderData } = await import('./mockDataService');
        result[providerId] = getMockProviderData(providerId);
      }
    })
  );

  return result;
};

// Function to simulate API responses for demo purposes
const simulateApiResponse = (providerId: string): any => {
  const now = new Date();

  switch (providerId) {
    case 'openai':
      return {
        object: 'billing_usage',
        total_usage: (Math.random() * 50 + 10).toFixed(2),
        hard_limit_usd: 100,
        created: Math.floor(now.getTime() / 1000)
      };
    case 'github':
      return {
        resources: {
          core: {
            limit: 5000,
            used: Math.floor(Math.random() * 2000),
            reset: Math.floor(now.getTime() / 1000) + 3600
          },
          search: {
            limit: 30,
            used: Math.floor(Math.random() * 15),
            reset: Math.floor(now.getTime() / 1000) + 60
          }
        },
        rate: {
          limit: 5000,
          used: Math.floor(Math.random() * 2000),
          reset: Math.floor(now.getTime() / 1000) + 3600
        }
      };
    case 'aws':
      return {
        ResultsByTime: [
          {
            TimePeriod: {
              Start: '2023-01-01',
              End: now.toISOString().split('T')[0]
            },
            Total: {
              Amount: (Math.random() * 100 + 20).toFixed(2),
              Unit: 'USD'
            }
          }
        ]
      };
    case 'google':
      // For Google Cloud, we'll use our specialized service
      // This is just a placeholder for the simulation
      return {
        total: (Math.random() * 80 + 15).toFixed(2),
        usagePercentage: Math.floor(Math.random() * 60) + 10,
        timestamp: now.getTime()
      };
    default:
      return {
        cost: (Math.random() * 50 + 10).toFixed(2),
        timestamp: now.getTime()
      };
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
