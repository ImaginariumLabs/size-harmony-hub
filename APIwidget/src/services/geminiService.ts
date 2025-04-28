/**
 * Gemini API Service
 * 
 * This service handles integration with Google's Gemini API to fetch usage and cost data.
 * It tracks token usage and calculates costs based on current pricing.
 */

import axios from 'axios';
import { getApiKey } from './electronService';
import { ApiCostData } from '../types/api';

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

    // In a real implementation, we would make a request to the Gemini API
    // to get usage data. However, Google doesn't provide a direct usage API,
    // so we would need to track usage on our side.
    
    // For now, we'll simulate usage data based on typical usage patterns
    const mockInputTokens = Math.floor(Math.random() * 500000) + 100000; // 100K-600K tokens
    const mockOutputTokens = Math.floor(mockInputTokens * 0.3); // Output is typically ~30% of input
    
    // Calculate cost based on current pricing
    const model = DEFAULT_MODEL;
    const pricing = GEMINI_PRICING[model as keyof typeof GEMINI_PRICING];
    
    // Calculate input cost
    const inputCost = mockInputTokens <= 128000 
      ? mockInputTokens * pricing.input.base 
      : mockInputTokens * pricing.input.extended;
    
    // Calculate output cost
    const outputCost = mockInputTokens <= 128000 
      ? mockOutputTokens * pricing.output.base 
      : mockOutputTokens * pricing.output.extended;
    
    // Total cost
    const totalCost = inputCost + outputCost;
    
    // Calculate usage percentage (based on a hypothetical monthly budget of $100)
    const monthlyBudget = 100;
    const usagePercentage = Math.min(Math.round((totalCost / monthlyBudget) * 100), 100);
    
    // Generate a random change value between -20% and +20% of the total
    const changePercent = (Math.random() * 0.4) - 0.2; // -0.2 to 0.2
    const change = totalCost * changePercent;
    const changeType = change >= 0 ? 'increase' : 'decrease';
    
    return {
      total: parseFloat(totalCost.toFixed(2)),
      change: parseFloat(Math.abs(change).toFixed(2)),
      changeType,
      usagePercentage
    };
  } catch (error) {
    console.error('Error fetching Gemini usage data:', error);
    throw error;
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
    
    // In a real implementation, we would use the Gemini API to count tokens
    // For now, we'll use a simple approximation (1 token ≈ 4 characters)
    return Math.ceil(text.length / 4);
  } catch (error) {
    console.error('Error counting tokens:', error);
    throw error;
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

export default {
  fetchUsageData,
  countTokens,
  validateApiKey,
  getFreeTierLimits
};
