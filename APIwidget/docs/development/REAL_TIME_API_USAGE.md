# Real-Time API Usage Tracking

This document explains the implementation of real-time API usage tracking in APIwidget.

## Overview

APIwidget provides real-time tracking of API usage and costs for multiple AI API providers. This feature allows users to monitor their API usage in real-time, track costs, and analyze usage patterns.

## Implementation Details

### API Services

Each API provider has a dedicated service that handles integration with the provider's API:

- `openaiService.ts`: OpenAI API integration
- `claudeService.ts`: Claude API integration
- `geminiService.ts`: Gemini API integration

These services provide a consistent interface for fetching usage data, counting tokens, validating API keys, and tracking API requests.

### Token Counting

Accurate token counting is essential for cost calculation. Each provider has a specific method for counting tokens:

#### OpenAI Token Counting

```typescript
// src/services/openaiService.ts
export const countTokens = async (text: string): Promise<number> => {
  try {
    // Use the tiktoken library for accurate token counting
    const encoding = await getTiktokenEncoding('cl100k_base');
    const tokens = encoding.encode(text);
    return tokens.length;
  } catch (error) {
    console.error('Error counting tokens:', error);
    // Fall back to approximation
    return Math.ceil(text.length / 4);
  }
};
```

#### Claude Token Counting

```typescript
// src/services/claudeService.ts
export const countTokens = async (text: string): Promise<number> => {
  try {
    const apiKey = await getApiKey('claude');
    if (!apiKey) {
      throw new Error('No Claude API key found');
    }

    // Use the Claude API for token counting
    const response = await axios.post(
      `${CLAUDE_API_BASE_URL}/tokenize`,
      { text },
      {
        headers: {
          'x-api-key': apiKey,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.token_count;
  } catch (error) {
    console.error('Error counting tokens:', error);
    // Fall back to approximation
    return Math.ceil(text.length / 4);
  }
};
```

#### Gemini Token Counting

```typescript
// src/services/geminiService.ts
export const countTokens = async (text: string): Promise<number> => {
  try {
    const apiKey = await getApiKey('google');
    if (!apiKey) {
      throw new Error('No Gemini API key found');
    }

    // Use the Gemini API for token counting
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

    return response.data.totalTokens;
  } catch (error) {
    console.error('Error counting tokens:', error);
    // Fall back to approximation
    return Math.ceil(text.length / 4);
  }
};
```

### Usage Tracking

Each API service tracks usage data in localStorage with a structured format:

```typescript
// Example for Gemini API
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
```

### API Request Tracking

The `trackApiRequest` function records API requests and updates usage statistics:

```typescript
// src/services/geminiService.ts
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
```

### Detailed Usage Statistics

The `getDetailedUsageStats` function provides comprehensive usage statistics:

```typescript
// src/services/geminiService.ts
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
```

### API Cost Data

The API cost data is standardized across providers:

```typescript
// src/types/api.ts
export interface ApiCostData {
  total: number;
  change: number;
  changeType: 'increase' | 'decrease';
  usagePercentage: number;
}
```

### Pricing Information

Each API service includes up-to-date pricing information:

```typescript
// src/services/geminiService.ts
export const GEMINI_PRICING = {
  'gemini-1.5-flash': {
    input: {
      base: 350, // $0.35 per 1M tokens (≤128K)
      extended: 700 // $0.70 per 1M tokens (>128K)
    },
    output: {
      base: 1050, // $1.05 per 1M tokens (≤128K)
      extended: 2100 // $2.10 per 1M tokens (>128K)
    }
  },
  'gemini-1.5-pro': {
    input: {
      base: 7000, // $7.00 per 1M tokens (≤128K)
      extended: 14000 // $14.00 per 1M tokens (>128K)
    },
    output: {
      base: 21000, // $21.00 per 1M tokens (≤128K)
      extended: 42000 // $42.00 per 1M tokens (>128K)
    }
  },
  'gemini-2.0-flash': {
    input: {
      text: 350, // $0.35 per 1M tokens
      audio: 350 // $0.35 per 1M tokens
    },
    output: {
      text: 1050, // $1.05 per 1M tokens
      audio: 1050 // $1.05 per 1M tokens
    }
  }
};
```

## Integration with Dashboard

The real-time API usage tracking is integrated with the dashboard through:

1. **API Provider Cards**: Show current usage and cost
2. **Usage Charts**: Show usage trends over time
3. **Cost Breakdown**: Show cost distribution by model
4. **Token Distribution**: Show distribution of input vs. output tokens

## Integration with Widgets

The real-time API usage tracking is integrated with floating widgets through:

1. **Cost Widget**: Shows current cost and change
2. **Usage Widget**: Shows current usage percentage
3. **Requests Widget**: Shows number of requests
4. **Tokens Widget**: Shows number of tokens used

## Benefits

Real-time API usage tracking provides several benefits:

1. **Cost Awareness**: Users can monitor their API costs in real-time
2. **Usage Optimization**: Users can identify opportunities to optimize API usage
3. **Budget Management**: Users can track usage against budget
4. **Trend Analysis**: Users can analyze usage patterns over time

## Future Improvements

1. **Budget Alerts**: Add support for budget alerts and notifications
2. **Export Data**: Add functionality to export usage data for analysis
3. **Historical Analysis**: Provide more detailed historical analysis tools
4. **Usage Optimization**: Provide recommendations for optimizing API usage
5. **API Rate Limiting**: Add support for API rate limiting to prevent excessive costs
