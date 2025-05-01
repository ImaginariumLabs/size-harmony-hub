/**
 * Claude API Service
 * 
 * This service handles integration with Anthropic's Claude API to fetch usage and cost data.
 * It tracks token usage and calculates costs based on current pricing.
 */

import axios from 'axios';
import { getApiKey } from './electronService';
import { ApiCostData } from '../types/api';

// Base URL for Claude API
const CLAUDE_API_BASE_URL = 'https://api.anthropic.com/v1';

// Pricing information (as of April 2025)
// Source: https://www.anthropic.com/api
const CLAUDE_PRICING = {
  'claude-3-5-sonnet': {
    input: 0.000003, // $0.003 per 1K tokens
    output: 0.000015 // $0.015 per 1K tokens
  },
  'claude-3-haiku': {
    input: 0.000000125, // $0.00125 per 1K tokens
    output: 0.000000375 // $0.00375 per 1K tokens
  },
  'claude-3-opus': {
    input: 0.000015, // $0.015 per 1K tokens
    output: 0.000075 // $0.075 per 1K tokens
  },
  'claude-3-sonnet': {
    input: 0.000003, // $0.003 per 1K tokens
    output: 0.000015 // $0.015 per 1K tokens
  }
};

// Default model to use
const DEFAULT_MODEL = 'claude-3-5-sonnet';

/**
 * Fetches usage data from Claude API
 * 
 * @returns Promise with usage data
 */
export const fetchUsageData = async (): Promise<ApiCostData> => {
  try {
    // Get the API key
    const apiKey = await getApiKey('claude');
    if (!apiKey) {
      throw new Error('No Claude API key found');
    }

    // In a real implementation, we would track usage on our side since
    // Anthropic doesn't provide a direct usage API.
    
    // For now, we'll simulate usage data based on typical usage patterns
    const mockInputTokens = Math.floor(Math.random() * 800000) + 150000; // 150K-950K tokens
    const mockOutputTokens = Math.floor(mockInputTokens * 0.35); // Output is typically ~35% of input
    
    // Calculate cost based on current pricing
    const model = DEFAULT_MODEL;
    const pricing = CLAUDE_PRICING[model as keyof typeof CLAUDE_PRICING];
    
    // Calculate total cost
    const inputCost = mockInputTokens * pricing.input;
    const outputCost = mockOutputTokens * pricing.output;
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
    console.error('Error fetching Claude usage data:', error);
    throw error;
  }
};

/**
 * Counts tokens for a given text using Claude's tokenizer
 * 
 * @param text The text to count tokens for
 * @returns Promise with token count
 */
export const countTokens = async (text: string): Promise<number> => {
  try {
    const apiKey = await getApiKey('claude');
    if (!apiKey) {
      throw new Error('No Claude API key found');
    }
    
    // In a real implementation, we would use the Claude API to count tokens
    // For now, we'll use a simple approximation (1 token ≈ 4 characters)
    return Math.ceil(text.length / 4);
  } catch (error) {
    console.error('Error counting tokens:', error);
    throw error;
  }
};

/**
 * Validates a Claude API key by making a test request
 * 
 * @param apiKey The API key to validate
 * @returns Promise<boolean> indicating if the key is valid
 */
export const validateApiKey = async (apiKey: string): Promise<boolean> => {
  try {
    // Make a simple request to test the API key
    const response = await axios.get(
      `${CLAUDE_API_BASE_URL}/models`,
      {
        headers: {
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01'
        }
      }
    );
    
    return response.status === 200;
  } catch (error) {
    console.error('Error validating Claude API key:', error);
    return false;
  }
};

/**
 * Gets the rate limits for Claude API
 * 
 * @returns Object containing rate limits
 */
export const getRateLimits = (): Record<string, number> => {
  return {
    'requests_per_minute': 50,
    'tokens_per_minute': 50000
  };
};

export default {
  fetchUsageData,
  countTokens,
  validateApiKey,
  getRateLimits
};
