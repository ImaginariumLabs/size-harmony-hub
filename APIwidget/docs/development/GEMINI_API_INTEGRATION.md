# Gemini API Integration

This document explains the implementation of Google's Gemini API integration in APIwidget.

## Overview

APIwidget integrates with Google's Gemini API to provide real-time cost tracking and usage analytics. The integration supports multiple Gemini models and provides accurate token counting and cost calculation.

## Implementation Details

### API Service

The Gemini API integration is implemented in `src/services/geminiService.ts`. This service provides:

- Token usage tracking
- Cost calculation based on current pricing
- Usage analytics
- API key validation
- Token counting

### API Authentication

The Gemini API uses API key authentication. The key is stored securely using the application's encrypted storage system and is never transmitted to external servers.

### Token Counting

The integration uses the Gemini API's `countTokens` endpoint to get accurate token counts:

```typescript
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
      // Fall back to approximation if the API call fails
      return Math.ceil(text.length / 4);
    }
  } catch (error) {
    // Fall back to approximation
    return Math.ceil(text.length / 4);
  }
};
```

If the API call fails, the service falls back to an approximation method (1 token ≈ 4 characters).

### Usage Tracking

The service tracks usage data in localStorage with the following structure:

```typescript
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

This structure allows for detailed tracking of:

- Total cost
- Number of requests
- Input and output tokens
- Daily usage
- Model-specific usage

### Cost Calculation

The service calculates costs based on the current Gemini pricing:

- Gemini 1.5 Flash: $0.075 per 1M input tokens (≤128K), $0.30 per 1M output tokens (≤128K)
- Gemini 1.5 Pro: $1.25 per 1M input tokens (≤128K), $5.00 per 1M output tokens (≤128K)
- Gemini 2.0 Flash: $0.10 per 1M text input tokens, $0.40 per 1M output tokens

For Gemini 1.5 models, the pricing is tiered with different rates for base tokens (first 128K) and extended tokens (beyond 128K).

### API Key Validation

The service validates API keys by making a test request to the Gemini API:

```typescript
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
```

### Detailed Usage Statistics

The service provides detailed usage statistics through the `getDetailedUsageStats` function:

```typescript
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

This provides comprehensive usage statistics for the dashboard and widgets.

## Integration with Dashboard

The Gemini API integration is displayed in the dashboard through:

1. **API Provider Card**: Shows current usage and cost
2. **Usage Chart**: Shows usage trends over time
3. **Cost Breakdown**: Shows cost distribution by model
4. **Token Distribution**: Shows distribution of input vs. output tokens

## Integration with Widgets

The Gemini API integration is displayed in floating widgets through:

1. **Cost Widget**: Shows current cost and change
2. **Usage Widget**: Shows current usage percentage
3. **Requests Widget**: Shows number of requests
4. **Tokens Widget**: Shows number of tokens used

## Benefits of Gemini API

Google's Gemini API offers several benefits for APIwidget users:

1. **Generous Free Tier**: Google offers a generous free tier for Gemini API
2. **Competitive Pricing**: Gemini API has competitive pricing compared to other providers
3. **High-Quality Models**: Gemini models provide high-quality results
4. **Accurate Token Counting**: Gemini API provides accurate token counting

## Future Improvements

1. **Streaming Support**: Add support for streaming responses
2. **Function Calling**: Add support for function calling
3. **Multi-modal Support**: Add support for image and audio inputs
4. **Batch Processing**: Add support for batch processing
5. **Advanced Analytics**: Provide more detailed analytics for Gemini API usage

## References

- [Gemini API Documentation](https://ai.google.dev/docs)
- [Gemini API Pricing](https://ai.google.dev/pricing)
- [Gemini Models](https://ai.google.dev/models/gemini)
