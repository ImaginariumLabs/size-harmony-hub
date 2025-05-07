import { useState, useEffect } from 'react';
import axios from 'axios';
import { getApiKey, updateKeyLastUsed } from '../services/mockKeyManager';

export interface OpenAIUsageData {
  total_usage: number; // In USD cents
  total_tokens: number;
  prompt_tokens: number;
  completion_tokens: number;
  daily_costs: Array<{
    date: string;
    cost: number;
  }>;
  models_used: Array<{
    model: string;
    tokens: number;
    cost: number;
  }>;
}

export function useOpenAIUsage() {
  const [usage, setUsage] = useState<OpenAIUsageData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsage = async () => {
    setLoading(true);
    setError(null);

    try {
      const apiKey = await getApiKey('openai');
      if (!apiKey) {
        setError('No OpenAI API key found');
        setLoading(false);
        return;
      }

      // Get current date and first day of the month
      const now = new Date();
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);

      // Format dates for API
      const startDate = firstDay.toISOString().split('T')[0];
      const endDate = now.toISOString().split('T')[0];

      // Fetch usage data from OpenAI API
      const response = await axios.get(
        `https://api.openai.com/v1/usage?start_date=${startDate}&end_date=${endDate}`,
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // Process the data
      const usageData = response.data;

      // Calculate total usage in USD cents (simplified calculation)
      const modelCosts: Record<string, number> = {
        'gpt-4': 0.03,
        'gpt-4-32k': 0.06,
        'gpt-3.5-turbo': 0.002,
        'gpt-3.5-turbo-16k': 0.004,
        // Add other models as needed
      };

      let totalUsage = 0;
      let totalTokens = 0;
      let promptTokens = 0;
      let completionTokens = 0;

      const modelsUsed: Record<string, { tokens: number; cost: number }> = {};
      const dailyCosts: Record<string, number> = {};

      // Process daily usage data
      usageData.daily_costs.forEach((day: unknown) => {
        const date = day.timestamp.split('T')[0];
        dailyCosts[date] = day.line_items.reduce((acc: number, item: unknown) => {
          return acc + item.cost;
        }, 0);

        day.line_items.forEach((item: unknown) => {
          const model = item.name;
          totalUsage += item.cost;

          if (!modelsUsed[model]) {
            modelsUsed[model] = { tokens: 0, cost: 0 };
          }

          modelsUsed[model].cost += item.cost;

          // Estimate tokens based on cost and model
          const costPerToken = modelCosts[model] || 0.002; // Default to gpt-3.5-turbo pricing
          const estimatedTokens = Math.round((item.cost / costPerToken) * 1000);

          modelsUsed[model].tokens += estimatedTokens;
          totalTokens += estimatedTokens;

          // Estimate prompt vs completion tokens (simplified)
          if (model.includes('gpt-4')) {
            promptTokens += Math.round(estimatedTokens * 0.7);
            completionTokens += Math.round(estimatedTokens * 0.3);
          } else {
            promptTokens += Math.round(estimatedTokens * 0.6);
            completionTokens += Math.round(estimatedTokens * 0.4);
          }
        });
      });

      // Format the data for our hook
      const formattedUsage: OpenAIUsageData = {
        total_usage: totalUsage,
        total_tokens: totalTokens,
        prompt_tokens: promptTokens,
        completion_tokens: completionTokens,
        daily_costs: Object.entries(dailyCosts).map(([date, cost]) => ({ date, cost })),
        models_used: Object.entries(modelsUsed).map(([model, data]) => ({
          model,
          tokens: data.tokens,
          cost: data.cost,
        })),
      };

      setUsage(formattedUsage);

      // Update last used timestamp for the API key
      await updateKeyLastUsed('openai');
    } catch (err) {
      if (process.env.NODE_ENV !== 'production' || process.env.DEBUG === 'true') {
        console.error('Error fetching OpenAI usage:', err);
      }
      setError(err instanceof Error ? err.message : 'Failed to fetch OpenAI usage data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsage();

    // Refresh every 30 minutes
    const interval = setInterval(fetchUsage, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return { usage, loading, error, refetch: fetchUsage };
}
