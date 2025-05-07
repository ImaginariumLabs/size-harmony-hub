import { useState, useEffect } from 'react';
import { validateApiKey, fetchUsageData } from '../services/claudeService';
import { getApiKey, updateKeyLastUsed } from '../services/mockKeyManager';

// Define types for model and daily cost entries
export interface ModelUsage {
  model: string;
  input_tokens: number;
  output_tokens: number;
  cost: number;
}

export interface DailyCost {
  date: string;
  cost: number;
}

export interface ClaudeUsageData {
  total_cost: number; // In USD
  input_tokens: number;
  output_tokens: number;
  total_tokens: number;
  models_used: Array<ModelUsage>;
  daily_costs: Array<DailyCost>;
  monthly_budget: number;
  budget_used_percentage: number;
  last_updated: string;
}

export function useClaudeUsage() {
  const [usage, setUsage] = useState<ClaudeUsageData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsage = async () => {
    setLoading(true);
    setError(null);

    try {
      const apiKey = await getApiKey('claude');
      if (!apiKey) {
        setError('No Claude API key found');
        setLoading(false);
        return;
      }

      // Validate the API key
      const isValid = await validateApiKey(apiKey);
      if (!isValid) {
        setError('Invalid Claude API key');
        setLoading(false);
        return;
      }

      // Fetch usage data from Claude API
      // We're using mock data for now, but in a real implementation we would use the API data
      await fetchUsageData(); // Just to simulate the API call

      // Get stored usage data from localStorage or initialize new tracking
      const storedData = localStorage.getItem('claude_usage_data');
      const usageData: ClaudeUsageData = storedData
        ? JSON.parse(storedData)
        : {
            total_cost: 0,
            input_tokens: 0,
            output_tokens: 0,
            total_tokens: 0,
            models_used: [
              {
                model: 'claude-3-5-sonnet',
                input_tokens: 0,
                output_tokens: 0,
                cost: 0,
              },
              {
                model: 'claude-3-haiku',
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
              };
            }),
            monthly_budget: 100, // Default $100 monthly budget
            budget_used_percentage: 0,
            last_updated: new Date().toISOString(),
          };

      // Update with new data
      const newInputTokens = Math.floor(Math.random() * 5000) + 1000;
      const newOutputTokens = Math.floor(Math.random() * 2000) + 500;

      // Calculate costs based on Claude pricing
      const sonnetInputCost = newInputTokens * 0.000003; // $0.003 per 1K tokens
      const sonnetOutputCost = newOutputTokens * 0.000015; // $0.015 per 1K tokens
      const newCost = sonnetInputCost + sonnetOutputCost;

      // Using the types defined at the top of the file

      // Update the model usage
      const sonnetModel = usageData.models_used.find(m => m.model === 'claude-3-5-sonnet');
      if (sonnetModel) {
        sonnetModel.input_tokens += newInputTokens;
        sonnetModel.output_tokens += newOutputTokens;
        sonnetModel.cost += newCost;
      }

      // Update daily costs (add to today's cost)
      const today = new Date().toISOString().split('T')[0];
      const todayCost = usageData.daily_costs.find(d => d.date === today);
      if (todayCost) {
        todayCost.cost += newCost;
      } else {
        usageData.daily_costs.push({
          date: today,
          cost: newCost,
        });
      }

      // Sort daily costs by date
      usageData.daily_costs.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      // Keep only the last 30 days
      if (usageData.daily_costs.length > 30) {
        usageData.daily_costs = usageData.daily_costs.slice(-30);
      }

      // Update totals
      usageData.total_cost += newCost;
      usageData.input_tokens += newInputTokens;
      usageData.output_tokens += newOutputTokens;
      usageData.total_tokens = usageData.input_tokens + usageData.output_tokens;

      // Calculate budget percentage
      usageData.budget_used_percentage = Math.min(
        100,
        Math.round((usageData.total_cost / usageData.monthly_budget) * 100)
      );

      usageData.last_updated = new Date().toISOString();

      // Save updated usage data
      localStorage.setItem('claude_usage_data', JSON.stringify(usageData));

      // Set the usage state
      setUsage(usageData);

      // Update last used timestamp for the API key
      await updateKeyLastUsed('claude');
    } catch (err) {
      if (process.env.NODE_ENV !== 'production' || process.env.DEBUG === 'true') {
        console.error('Error fetching Claude usage:', err);
      }
      setError(err instanceof Error ? err.message : 'Failed to fetch Claude usage data');

      // Try to use cached data if available
      const storedData = localStorage.getItem('claude_usage_data');
      if (storedData) {
        try {
          setUsage(JSON.parse(storedData));
        } catch (parseError) {
          if (process.env.NODE_ENV !== 'production' || process.env.DEBUG === 'true') {
            console.error('Error parsing stored Claude data:', parseError);
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
