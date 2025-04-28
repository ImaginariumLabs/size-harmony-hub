/**
 * OpenAI API Service
 * 
 * This service handles integration with OpenAI's API to fetch usage and cost data.
 * It tracks token usage and calculates costs based on current pricing.
 */

import axios from 'axios';
import { getApiKey } from './electronService';
import { ApiCostData } from '../types/api';

// Base URL for OpenAI API
const OPENAI_API_BASE_URL = 'https://api.openai.com/v1';

// Pricing information (as of April 2025)
// Source: https://openai.com/pricing
const OPENAI_PRICING = {
  'gpt-4o': {
    input: 0.000005, // $0.005 per 1K tokens
    output: 0.000015 // $0.015 per 1K tokens
  },
  'gpt-4-turbo': {
    input: 0.00001, // $0.01 per 1K tokens
    output: 0.00003 // $0.03 per 1K tokens
  },
  'gpt-4': {
    input: 0.00003, // $0.03 per 1K tokens
    output: 0.00006 // $0.06 per 1K tokens
  },
  'gpt-3.5-turbo': {
    input: 0.0000005, // $0.0005 per 1K tokens
    output: 0.0000015 // $0.0015 per 1K tokens
  }
};

// Default model to use
const DEFAULT_MODEL = 'gpt-4o';

/**
 * Fetches usage data from OpenAI API
 * 
 * @returns Promise with usage data
 */
export const fetchUsageData = async (): Promise<ApiCostData> => {
  try {
    // Get the API key
    const apiKey = await getApiKey('openai');
    if (!apiKey) {
      throw new Error('No OpenAI API key found');
    }

    // In a real implementation, we would make a request to the OpenAI API
    // to get usage data. OpenAI provides a usage endpoint, but it requires
    // organization ID and has some limitations.
    
    // For now, we'll simulate usage data based on typical usage patterns
    const mockInputTokens = Math.floor(Math.random() * 1000000) + 200000; // 200K-1.2M tokens
    const mockOutputTokens = Math.floor(mockInputTokens * 0.4); // Output is typically ~40% of input
    
    // Calculate cost based on current pricing
    const model = DEFAULT_MODEL;
    const pricing = OPENAI_PRICING[model as keyof typeof OPENAI_PRICING];
    
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
    console.error('Error fetching OpenAI usage data:', error);
    throw error;
  }
};

/**
 * Fetches detailed usage data from OpenAI API
 * This would be used in a real implementation to get actual usage data
 * 
 * @returns Promise with detailed usage data
 */
export const fetchDetailedUsageData = async (): Promise<any> => {
  try {
    const apiKey = await getApiKey('openai');
    if (!apiKey) {
      throw new Error('No OpenAI API key found');
    }
    
    // Get the current date and the date 100 days ago
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - 100 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    // Make a request to the OpenAI usage endpoint
    const response = await axios.get(
      `${OPENAI_API_BASE_URL}/usage?start_date=${startDate}&end_date=${endDate}`,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Error fetching detailed OpenAI usage data:', error);
    throw error;
  }
};

/**
 * Counts tokens for a given text using OpenAI's tokenizer
 * 
 * @param text The text to count tokens for
 * @returns Promise with token count
 */
export const countTokens = async (text: string): Promise<number> => {
  try {
    // In a real implementation, we would use a tokenizer like tiktoken
    // For now, we'll use a simple approximation (1 token ≈ 4 characters)
    return Math.ceil(text.length / 4);
  } catch (error) {
    console.error('Error counting tokens:', error);
    throw error;
  }
};

/**
 * Validates an OpenAI API key by making a test request
 * 
 * @param apiKey The API key to validate
 * @returns Promise<boolean> indicating if the key is valid
 */
export const validateApiKey = async (apiKey: string): Promise<boolean> => {
  try {
    // Make a simple request to test the API key
    const response = await axios.get(
      `${OPENAI_API_BASE_URL}/models`,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      }
    );
    
    return response.status === 200;
  } catch (error) {
    console.error('Error validating OpenAI API key:', error);
    return false;
  }
};

export default {
  fetchUsageData,
  fetchDetailedUsageData,
  countTokens,
  validateApiKey
};
