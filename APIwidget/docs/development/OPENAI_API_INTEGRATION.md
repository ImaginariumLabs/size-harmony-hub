# OpenAI API Integration

This document explains the implementation of OpenAI API integration in APIwidget.

## Overview

APIwidget integrates with OpenAI's API to provide real-time cost tracking and usage analytics. The integration supports multiple OpenAI models and provides accurate token counting and cost calculation.

## Implementation Details

### API Service

The OpenAI API integration is implemented in `src/services/openaiService.ts`. This service provides:

- Token usage tracking
- Cost calculation based on current pricing
- Usage analytics
- API key validation
- Token counting

### API Authentication

The OpenAI API uses Bearer token authentication. The API key is stored securely using the application's encrypted storage system and is never transmitted to external servers.

```typescript
// API key format validation in electron/main.js
case 'openai':
  // OpenAI keys typically start with 'sk-' and are 51 characters long
  if (!key.startsWith('sk-') || key.length < 30) {
    return {
      valid: false,
      message: 'OpenAI API keys typically start with "sk-" and are longer'
    };
  }
  break;
```

### Token Counting

The integration uses the tiktoken library for accurate token counting:

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

If the tiktoken library fails, the service falls back to an approximation method (1 token ≈ 4 characters).

### Pricing Information

The service includes up-to-date pricing information for OpenAI models:

```typescript
// src/services/openaiService.ts
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
```

### Usage Tracking

The service tracks usage data in localStorage with the following structure:

```typescript
interface OpenAIUsageData {
  total_usage: number; // In USD
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
  models_used: Array<{
    model: string;
    prompt_tokens: number;
    completion_tokens: number;
    cost: number;
  }>;
  daily_costs: Array<{
    date: string;
    cost: number;
  }>;
}
```

### Detailed Usage Data

The service provides a method to fetch detailed usage data from the OpenAI API:

```typescript
// src/services/openaiService.ts
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
```

### API Key Validation

The service validates API keys by making a test request to the OpenAI API:

```typescript
// src/services/openaiService.ts
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
```

## Enhanced API Service

The `enhancedApiService.ts` file provides additional functionality for the OpenAI API integration:

```typescript
// src/services/enhancedApiService.ts
export async function fetchOpenAIData(): Promise<ApiUsageData> {
  return cacheService.getOrSet('openai_data', async () => {
    try {
      const apiKey = await getApiKey('openai');

      if (!apiKey) {
        throw new Error('No OpenAI API key found');
      }

      // Update last used timestamp
      await updateKeyLastUsed('openai');

      // Get stored data or initialize
      const storedData = localStorage.getItem('openai_usage_data');
      let data = storedData ? JSON.parse(storedData) : {
        total_usage: 0,
        prompt_tokens: 0,
        completion_tokens: 0,
        total_tokens: 0,
        models_used: [],
        daily_costs: []
      };

      // Process and return the data
      // ...
    } catch (error) {
      console.error('Error fetching OpenAI data:', error);
      throw error;
    }
  }, 60); // Cache for 1 minute
}
```

## Integration with Dashboard

The OpenAI API integration is displayed in the dashboard through:

1. **API Provider Card**: Shows current usage and cost
2. **Usage Chart**: Shows usage trends over time
3. **Cost Breakdown**: Shows cost distribution by model
4. **Token Distribution**: Shows distribution of prompt vs. completion tokens

## Integration with Widgets

The OpenAI API integration is displayed in floating widgets through:

1. **Cost Widget**: Shows current cost and change
2. **Usage Widget**: Shows current usage percentage
3. **Requests Widget**: Shows number of requests
4. **Tokens Widget**: Shows number of tokens used

## API Provider Configuration

The OpenAI API provider is configured in the `apiIntegrationService.ts` file:

```typescript
// src/services/apiIntegrationService.ts
const API_PROVIDERS: Record<string, ApiProviderConfig> = {
  openai: {
    id: 'openai',
    name: 'OpenAI',
    baseUrl: 'https://api.openai.com/v1',
    authType: 'bearer',
    usageEndpoint: '/dashboard/billing/usage',
    costEndpoint: '/dashboard/billing/subscription',
    responseMapping: {
      usage: ['total_usage'],
      cost: ['hard_limit_usd'],
      timestamp: ['object', 'created']
    }
  },
  // Other providers...
};
```

## Benefits of OpenAI API

OpenAI's API offers several benefits for APIwidget users:

1. **High-Quality Models**: OpenAI models provide high-quality results
2. **Comprehensive API**: OpenAI provides a comprehensive API for various tasks
3. **Usage Endpoint**: OpenAI provides a usage endpoint for tracking usage
4. **Wide Model Selection**: OpenAI offers a wide selection of models for different use cases

## Future Improvements

1. **Streaming Support**: Add support for streaming responses
2. **Function Calling**: Add support for function calling
3. **Vision Support**: Add support for image inputs
4. **Batch Processing**: Add support for batch processing
5. **Advanced Analytics**: Provide more detailed analytics for OpenAI API usage

## References

- [OpenAI API Documentation](https://platform.openai.com/docs/api-reference)
- [OpenAI API Pricing](https://openai.com/pricing)
- [OpenAI Models](https://platform.openai.com/docs/models)
