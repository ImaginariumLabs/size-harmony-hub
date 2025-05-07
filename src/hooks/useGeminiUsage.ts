import { useState, useEffect } from 'react';
import { validateApiKey, fetchUsageData } from '../services/geminiService';
import { getApiKey, updateKeyLastUsed } from '../services/mockKeyManager';

// Define the GeminiUsageData interface
export interface GeminiUsageData {
  total_cost: number; // In USD
  input_tokens: number;
  output_tokens: number;
  total_tokens: number;
  requests: number;
  models_used: Array<{
    model: string;
    input_tokens: number;
    output_tokens: number;
    cost: number;
  }>;
  daily_costs: Array<{
    date: string;
    cost: number;
    requests: number;
  }>;
  monthly_budget: number;
  budget_used_percentage: number;
  free_tier_used_percentage: number;
  last_updated: string;
}

export function useGeminiUsage() {
  const [usage, setUsage] = useState<GeminiUsageData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsage = async () => {
    setLoading(true);
    setError(null);

    try {
      const apiKey = await getApiKey('google');
      if (!apiKey) {
        setError('No Gemini API key found');
        setLoading(false);
        return;
      }

      // Validate the API key
      const isValid = await validateApiKey(apiKey);
      if (!isValid) {
        setError('Invalid Gemini API key');
        setLoading(false);
        return;
      }

      // Fetch usage data from Gemini API
      await fetchUsageData(); // Just to simulate the API call

      // Get stored usage data from localStorage or initialize new tracking
      const storedData = localStorage.getItem('gemini_usage_data');
      const usageData = storedData
        ? JSON.parse(storedData)
        : {
            total_cost: 0,
            input_tokens: 0,
            output_tokens: 0,
            total_tokens: 0,
            requests: 0,
            models_used: [
              {
                model: 'gemini-2.0-flash',
                input_tokens: 0,
                output_tokens: 0,
                cost: 0,
              },
              {
                model: 'gemini-1.5-pro',
                input_tokens: 0,
                output_tokens: 0,
                cost: 0,
              },
            ],
            daily_costs: Array.from({ length: 30 }, (_, i) => {
              const date = new Date();
              date.setDate(date.getDate() - 29 + i);
              return {
                date: date.toISOString().split('T')[0],
                cost: 0,
                requests: 0,
              };
            }),
            monthly_budget: 10, // Default $10 monthly budget
            budget_used_percentage: 0,
            free_tier_used_percentage: 0,
            last_updated: new Date().toISOString(),
          };

      // Update with new data
      const newRequests = Math.floor(Math.random() * 5) + 1;
      const newInputTokens = Math.floor(Math.random() * 1000) + 100;
      const newOutputTokens = Math.floor(Math.random() * 500) + 50;

      // Calculate costs based on Gemini pricing
      const flashInputCost = (newInputTokens * 0.0001) / 1000000; // $0.10 per 1M tokens
      const flashOutputCost = (newOutputTokens * 0.0004) / 1000000; // $0.40 per 1M tokens
      const newCost = flashInputCost + flashOutputCost;

      // Update the model usage
      const flashModel = usageData.models_used.find(
        (m: { model: string }) => m.model === 'gemini-2.0-flash'
      );
      if (flashModel) {
        flashModel.input_tokens += newInputTokens;
        flashModel.output_tokens += newOutputTokens;
        flashModel.cost += newCost;
      }

      // Update daily costs (add to today's cost)
      const today = new Date().toISOString().split('T')[0];
      const todayCost = usageData.daily_costs.find((d: { date: string }) => d.date === today);
      if (todayCost) {
        todayCost.cost += newCost;
        todayCost.requests += newRequests;
      } else {
        usageData.daily_costs.push({
          date: today,
          cost: newCost,
          requests: newRequests,
        });
      }

      // Sort daily costs by date
      usageData.daily_costs.sort(
        (a: { date: string }, b: { date: string }) =>
          new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      // Keep only the last 30 days
      if (usageData.daily_costs.length > 30) {
        usageData.daily_costs = usageData.daily_costs.slice(-30);
      }

      // Update totals
      usageData.total_cost += newCost;
      usageData.input_tokens += newInputTokens;
      usageData.output_tokens += newOutputTokens;
      usageData.total_tokens = usageData.input_tokens + usageData.output_tokens;
      usageData.requests += newRequests;

      // Calculate budget percentage
      usageData.budget_used_percentage = Math.min(
        100,
        Math.round((usageData.total_cost / usageData.monthly_budget) * 100)
      );

      // Calculate free tier usage (assuming 1M tokens free per month)
      const freeTierTokens = 1000000;
      usageData.free_tier_used_percentage = Math.min(
        100,
        Math.round((usageData.total_tokens / freeTierTokens) * 100)
      );

      usageData.last_updated = new Date().toISOString();

      // Save updated usage data
      localStorage.setItem('gemini_usage_data', JSON.stringify(usageData));

      // Set the usage state
      setUsage(usageData);

      // Update last used timestamp for the API key
      await updateKeyLastUsed('google');
    } catch (err) {
      if (process.env.NODE_ENV !== 'production' || process.env.DEBUG === 'true') {
        console.error('Error fetching Gemini usage:', err);
      }
      setError(err instanceof Error ? err.message : 'Failed to fetch Gemini usage data');

      // Try to use cached data if available
      const storedData = localStorage.getItem('gemini_usage_data');
      if (storedData) {
        try {
          setUsage(JSON.parse(storedData));
        } catch (parseError) {
          if (process.env.NODE_ENV !== 'production' || process.env.DEBUG === 'true') {
            console.error('Error parsing stored Gemini data:', parseError);
          }
        }
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsage();

    // Refresh every 15 minutes
    const interval = setInterval(fetchUsage, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return { usage, loading, error, refetch: fetchUsage };
}
