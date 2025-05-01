/**
 * Mock Data Service
 * Generates realistic mock data for API costs
 */

import { ApiCostData } from '../types/api';

// Interface for provider data
export interface ProviderData {
  id: string;
  name: string;
  baseRate: number;  // Base cost per 1000 tokens
  usagePattern: 'steady' | 'fluctuating' | 'growing';
  volatility: number; // 0-1, how much the usage fluctuates
}

// Provider configurations
const PROVIDERS: ProviderData[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    baseRate: 0.002, // $0.002 per 1K tokens
    usagePattern: 'growing',
    volatility: 0.3
  },
  {
    id: 'claude',
    name: 'Claude',
    baseRate: 0.003, // $0.003 per 1K tokens
    usagePattern: 'growing',
    volatility: 0.25
  },
  {
    id: 'google',
    name: 'Gemini',
    baseRate: 0.0001, // $0.0001 per token
    usagePattern: 'growing',
    volatility: 0.3
  },
  {
    id: 'github',
    name: 'GitHub',
    baseRate: 0.0001, // GitHub API is mostly free with some paid features
    usagePattern: 'steady',
    volatility: 0.1
  },
  {
    id: 'aws',
    name: 'AWS',
    baseRate: 0.0005, // Various AWS services
    usagePattern: 'fluctuating',
    volatility: 0.5
  }
];

// Store the last generated data for each provider
const lastGeneratedData: Record<string, ApiCostData> = {};

// Generate a random number between min and max
const randomBetween = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

// Generate mock usage data for a provider
const generateUsage = (provider: ProviderData): number => {
  // Base usage (tokens per day)
  let baseUsage = 0;

  // Calculate days since start for growing pattern
  const daysSinceStart = Math.floor(Date.now() / 86400000) % 30; // 30-day cycle

  switch (provider.usagePattern) {
    case 'steady':
      baseUsage = 500000; // 500K tokens per day
      break;
    case 'fluctuating':
      baseUsage = 300000 + Math.sin(Date.now() / 86400000 * Math.PI) * 200000; // Fluctuates between 100K and 500K
      break;
    case 'growing':
      // Gradually increases over time
      baseUsage = 300000 + (daysSinceStart * 20000); // Starts at 300K, adds 20K per day
      break;
  }

  // Add randomness based on volatility
  const randomFactor = 1 + (randomBetween(-provider.volatility, provider.volatility));
  return baseUsage * randomFactor;
};

// Calculate cost from usage
const calculateCost = (provider: ProviderData, usage: number): number => {
  return (usage / 1000) * provider.baseRate;
};

// Generate mock data for a specific provider
export const getMockProviderData = (providerId: string): ApiCostData => {
  const provider = PROVIDERS.find(p => p.id === providerId);

  if (!provider) {
    throw new Error(`Provider ${providerId} not found`);
  }

  // Get the current date (to ensure consistent data within the same day)
  const today = new Date().toDateString();
  const cacheKey = `${providerId}_${today}`;

  // If we already generated data for this provider today, return it with small variations
  if (lastGeneratedData[cacheKey]) {
    const lastData = lastGeneratedData[cacheKey];

    // Add small random variations (±2%)
    const variation = randomBetween(-0.02, 0.02);
    const newTotal = lastData.total * (1 + variation);

    // Calculate change from previous value
    const change = Math.abs(newTotal - lastData.total);
    const changeType = newTotal > lastData.total ? 'increase' : 'decrease';

    const newData: ApiCostData = {
      total: newTotal,
      change: change,
      changeType: changeType,
      usagePercentage: Math.floor(Math.random() * 60) + 10 // Random usage percentage between 10-70%
    };

    lastGeneratedData[cacheKey] = newData;
    return newData;
  }

  // Generate new data for this provider
  const usage = generateUsage(provider);
  const cost = calculateCost(provider, usage);

  // Generate a realistic change (±10%)
  const changeFactor = randomBetween(-0.1, 0.1);
  const change = Math.abs(cost * changeFactor);
  const changeType = changeFactor >= 0 ? 'increase' : 'decrease';

  const data: ApiCostData = {
    total: cost,
    change: change,
    changeType: changeType,
    usagePercentage: Math.floor(Math.random() * 60) + 10 // Random usage percentage between 10-70%
  };

  lastGeneratedData[cacheKey] = data;
  return data;
};

// Get mock data for all providers
export const getAllProviderData = (): Record<string, ApiCostData> => {
  const result: Record<string, ApiCostData> = {};

  PROVIDERS.forEach(provider => {
    result[provider.id] = getMockProviderData(provider.id);
  });

  return result;
};

// Get provider information
export const getProviderInfo = (providerId: string): ProviderData | undefined => {
  return PROVIDERS.find(p => p.id === providerId);
};

// Get all providers
export const getAllProviders = (): ProviderData[] => {
  return [...PROVIDERS];
};
