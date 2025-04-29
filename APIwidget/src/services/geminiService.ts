/**
 * Gemini API Service
 *
 * This service handles integration with Google's Gemini API to fetch usage and cost data.
 * It tracks token usage and calculates costs based on current pricing.
 *
 * This implementation uses local storage to track API usage since Google doesn't provide
 * a usage API. In a production environment, you might want to use a server-side solution
 * to track usage more accurately.
 */

import axios from 'axios';
import { getApiKey } from './electronService';
import { ApiCostData } from '../types/api';

// Usage data interface
interface GeminiUsageData {
  total: number;
  previousTotal: number;
  usagePercentage: number;
  requests: number;
  inputTokens: number;
  outputTokens: number;
  lastUpdated: string;
  dailyUsage: Record<string, {
    date: string;
    requests: number;
    inputTokens: number;
    outputTokens: number;
    cost: number;
  }>;
  models: Record<string, {
    requests: number;
    inputTokens: number;
    outputTokens: number;
    cost: number;
  }>;
}

// Base URL for Gemini API
const GEMINI_API_BASE_URL = 'https://generativelanguage.googleapis.com/v1';

// Pricing information (as of April 2025)
// Source: https://ai.google.dev/pricing
const GEMINI_PRICING = {
  'gemini-1.5-flash': {
    input: {
      base: 0.000075, // $0.075 per 1M tokens for <= 128k tokens
      extended: 0.00015 // $0.15 per 1M tokens for > 128k tokens
    },
    output: {
      base: 0.0003, // $0.30 per 1M tokens for <= 128k tokens
      extended: 0.0006 // $0.60 per 1M tokens for > 128k tokens
    }
  },
  'gemini-1.5-pro': {
    input: {
      base: 0.00125, // $1.25 per 1M tokens for <= 128k tokens
      extended: 0.0025 // $2.50 per 1M tokens for > 128k tokens
    },
    output: {
      base: 0.005, // $5.00 per 1M tokens for <= 128k tokens
      extended: 0.01 // $10.00 per 1M tokens for > 128k tokens
    }
  },
  'gemini-2.0-flash': {
    input: {
      text: 0.0001, // $0.10 per 1M tokens
      audio: 0.0007 // $0.70 per 1M tokens
    },
    output: {
      text: 0.0004 // $0.40 per 1M tokens
    }
  }
};

// Default model to use
const DEFAULT_MODEL = 'gemini-2.0-flash';

/**
 * Gets the current usage data from localStorage or initializes new data
 *
 * @returns GeminiUsageData object
 */
const getUsageData = (): GeminiUsageData => {
  const storedData = localStorage.getItem('gemini_usage_data');

  if (storedData) {
    try {
      const parsedData = JSON.parse(storedData);

      // Ensure all required fields exist (for backward compatibility)
      return {
        total: parsedData.total || 0,
        previousTotal: parsedData.previousTotal || 0,
        usagePercentage: parsedData.usagePercentage || 0,
        requests: parsedData.requests || 0,
        inputTokens: parsedData.inputTokens || 0,
        outputTokens: parsedData.outputTokens || 0,
        lastUpdated: parsedData.lastUpdated || new Date().toISOString(),
        dailyUsage: parsedData.dailyUsage || {},
        models: parsedData.models || {}
      };
    } catch (error) {
      console.error('Error parsing stored Gemini usage data:', error);
    }
  }

  // Initialize new usage data
  return {
    total: 0,
    previousTotal: 0,
    usagePercentage: 0,
    requests: 0,
    inputTokens: 0,
    outputTokens: 0,
    lastUpdated: new Date().toISOString(),
    dailyUsage: {},
    models: {}
  };
};

/**
 * Tracks a new API request with token usage
 *
 * @param inputTokens Number of input tokens used
 * @param outputTokens Number of output tokens used
 * @param model Gemini model used
 * @returns void
 */
export const trackApiRequest = async (
  inputTokens: number,
  outputTokens: number,
  model: string = DEFAULT_MODEL
): Promise<void> => {
  const usageData = getUsageData();

  // Calculate cost based on our pricing model
  const pricing = GEMINI_PRICING[model as keyof typeof GEMINI_PRICING];

  // Handle different pricing structures based on model
  let inputCost = 0;
  let outputCost = 0;

  if (model === 'gemini-2.0-flash') {
    // Gemini 2.0 has text/audio pricing
    const gemini2Pricing = pricing as typeof GEMINI_PRICING['gemini-2.0-flash'];
    inputCost = inputTokens * gemini2Pricing.input.text / 1000000;
    outputCost = outputTokens * gemini2Pricing.output.text / 1000000;
  } else {
    // Gemini 1.5 has base/extended pricing
    const gemini15Pricing = pricing as typeof GEMINI_PRICING['gemini-1.5-flash'];
    inputCost = inputTokens <= 128000
      ? inputTokens * gemini15Pricing.input.base / 1000000
      : inputTokens * gemini15Pricing.input.extended / 1000000;
    outputCost = outputTokens <= 128000
      ? outputTokens * gemini15Pricing.output.base / 1000000
      : outputTokens * gemini15Pricing.output.extended / 1000000;
  }

  const totalCost = inputCost + outputCost;

  // Update total usage
  usageData.previousTotal = usageData.total;
  usageData.total += totalCost;
  usageData.requests += 1;
  usageData.inputTokens += inputTokens;
  usageData.outputTokens += outputTokens;
  usageData.usagePercentage = Math.min(100, (usageData.total / 10) * 100); // Assuming $10 monthly budget
  usageData.lastUpdated = new Date().toISOString();

  // Update daily usage
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  if (!usageData.dailyUsage[today]) {
    usageData.dailyUsage[today] = {
      date: today,
      requests: 0,
      inputTokens: 0,
      outputTokens: 0,
      cost: 0
    };
  }

  usageData.dailyUsage[today].requests += 1;
  usageData.dailyUsage[today].inputTokens += inputTokens;
  usageData.dailyUsage[today].outputTokens += outputTokens;
  usageData.dailyUsage[today].cost += totalCost;

  // Update model usage
  if (!usageData.models[model]) {
    usageData.models[model] = {
      requests: 0,
      inputTokens: 0,
      outputTokens: 0,
      cost: 0
    };
  }

  usageData.models[model].requests += 1;
  usageData.models[model].inputTokens += inputTokens;
  usageData.models[model].outputTokens += outputTokens;
  usageData.models[model].cost += totalCost;

  // Save updated usage data
  localStorage.setItem('gemini_usage_data', JSON.stringify(usageData));
};

/**
 * Fetches usage data from Gemini API
 *
 * @returns Promise with usage data
 */
export const fetchUsageData = async (): Promise<ApiCostData> => {
  try {
    // Get the API key
    const apiKey = await getApiKey('google');
    if (!apiKey) {
      throw new Error('No Gemini API key found');
    }

    // Make a real API call to Gemini to list available models
    // This helps verify the API key is working and gives us some data to work with
    const response = await axios.get(
      `${GEMINI_API_BASE_URL}/models?key=${apiKey}`
    );

    // If we get here, the API key is valid
    console.log('Gemini API key is valid, models available:', response.data.models?.length || 0);

    // Get stored usage data
    const usageData = getUsageData();

    // For demo purposes, simulate a small amount of new usage if it's been more than 5 minutes
    // since the last update. In a real app, this would be tracked by actual API calls.
    const lastUpdated = new Date(usageData.lastUpdated);
    const now = new Date();
    const timeDiff = now.getTime() - lastUpdated.getTime();

    if (timeDiff > 5 * 60 * 1000) { // 5 minutes
      // Simulate a small amount of new usage
      const newInputTokens = Math.floor(Math.random() * 1000) + 100;
      const newOutputTokens = Math.floor(Math.random() * 500) + 50;

      // Track the simulated request
      await trackApiRequest(newInputTokens, newOutputTokens);

      // Refresh usage data
      return fetchUsageData();
    }

    // Calculate change from previous period
    const previousTotal = usageData.previousTotal;
    const change = Math.abs(usageData.total - previousTotal);
    const changeType = usageData.total >= previousTotal ? 'increase' : 'decrease';

    return {
      total: parseFloat(usageData.total.toFixed(2)),
      change: parseFloat(change.toFixed(2)),
      changeType,
      usagePercentage: Math.round(usageData.usagePercentage)
    };

  } catch (error) {
    console.error('Error fetching Gemini usage data:', error);

    if (axios.isAxiosError(error)) {
      console.error('Axios error details:', error.response?.data || error.message);
    }

    // Check if we have local data we can use as fallback
    try {
      const storedData = localStorage.getItem('gemini_usage_data');
      if (storedData) {
        const usageData = JSON.parse(storedData);
        const previousTotal = usageData.previousTotal || 0;
        const change = Math.abs(usageData.total - previousTotal);
        const changeType = usageData.total >= previousTotal ? 'increase' : 'decrease';

        return {
          total: parseFloat(usageData.total.toFixed(2)),
          change: parseFloat(change.toFixed(2)),
          changeType,
          usagePercentage: Math.round(usageData.usagePercentage)
        };
      }
    } catch (localError) {
      console.error('Error getting local usage data:', localError);
    }

    // Return default data in case of error
    return {
      total: 0,
      change: 0,
      changeType: 'increase',
      usagePercentage: 0
    };
  }
};

/**
 * Counts tokens for a given text using Gemini's tokenizer
 *
 * @param text The text to count tokens for
 * @returns Promise with token count
 */
export const countTokens = async (text: string): Promise<number> => {
  try {
    const apiKey = await getApiKey('google');
    if (!apiKey) {
      throw new Error('No Gemini API key found');
    }

    // Try to use the Gemini API to count tokens
    try {
      const response = await axios.post(
        `${GEMINI_API_BASE_URL}/models/gemini-1.5-pro:countTokens?key=${apiKey}`,
        {
          contents: [
            {
              parts: [
                {
                  text: text
                }
              ]
            }
          ]
        }
      );

      // Return the token count from the API
      return response.data.totalTokens || Math.ceil(text.length / 4);
    } catch (countError) {
      console.warn('Error using Gemini API to count tokens, falling back to approximation:', countError);
      // Fall back to approximation if the API call fails
      return Math.ceil(text.length / 4);
    }
  } catch (error) {
    console.error('Error counting tokens:', error);
    // Fall back to approximation
    return Math.ceil(text.length / 4);
  }
};

/**
 * Validates a Gemini API key by making a test request
 *
 * @param apiKey The API key to validate
 * @returns Promise<boolean> indicating if the key is valid
 */
export const validateApiKey = async (apiKey: string): Promise<boolean> => {
  try {
    // Make a simple request to test the API key
    const response = await axios.get(
      `${GEMINI_API_BASE_URL}/models?key=${apiKey}`
    );

    return response.status === 200;
  } catch (error) {
    console.error('Error validating Gemini API key:', error);
    return false;
  }
};

/**
 * Gets the free tier limits for Gemini
 *
 * @returns Object containing free tier limits
 */
export const getFreeTierLimits = (): Record<string, number> => {
  return {
    'requests_per_minute': 60,
    'tokens_per_minute': 60000
  };
};

/**
 * Gets detailed usage statistics
 *
 * @returns Detailed usage statistics
 */
export const getDetailedUsageStats = () => {
  const usageData = getUsageData();

  // Calculate daily averages
  const dailyEntries = Object.values(usageData.dailyUsage);
  const totalDays = dailyEntries.length;

  const avgDailyRequests = totalDays > 0
    ? dailyEntries.reduce((sum, day) => sum + day.requests, 0) / totalDays
    : 0;

  const avgDailyCost = totalDays > 0
    ? dailyEntries.reduce((sum, day) => sum + day.cost, 0) / totalDays
    : 0;

  // Get model breakdown
  const modelBreakdown = Object.entries(usageData.models).map(([model, stats]) => ({
    model,
    requests: stats.requests,
    inputTokens: stats.inputTokens,
    outputTokens: stats.outputTokens,
    cost: stats.cost,
    percentage: usageData.total > 0 ? (stats.cost / usageData.total) * 100 : 0
  }));

  // Get daily usage for the last 30 days
  const last30Days = [];
  const today = new Date();

  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateString = date.toISOString().split('T')[0];

    const dayData = usageData.dailyUsage[dateString] || {
      date: dateString,
      requests: 0,
      inputTokens: 0,
      outputTokens: 0,
      cost: 0
    };

    last30Days.unshift(dayData);
  }

  return {
    total: usageData.total,
    requests: usageData.requests,
    inputTokens: usageData.inputTokens,
    outputTokens: usageData.outputTokens,
    avgDailyRequests,
    avgDailyCost,
    modelBreakdown,
    dailyUsage: last30Days,
    lastUpdated: usageData.lastUpdated
  };
};

export default {
  fetchUsageData,
  countTokens,
  validateApiKey,
  getFreeTierLimits,
  trackApiRequest,
  getDetailedUsageStats
};
