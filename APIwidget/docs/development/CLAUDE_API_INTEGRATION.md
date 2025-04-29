# Claude API Integration

This document explains the implementation of Anthropic's Claude API integration in APIwidget.

## Overview

APIwidget integrates with Anthropic's Claude API to provide real-time cost tracking and usage analytics. The integration supports multiple Claude models and provides accurate token counting and cost calculation.

## Implementation Details

### API Service

The Claude API integration is implemented in `src/services/claudeService.ts`. This service provides:

- Token usage tracking
- Cost calculation based on current pricing
- Usage analytics
- API key validation
- Token counting

### API Authentication

The Claude API uses API key authentication. The key is stored securely using the application's encrypted storage system and is never transmitted to external servers.

```typescript
// API key format validation in electron/main.js
case 'claude':
  // Claude API keys are typically prefixed with 'sk-ant-' and are long
  if (!key.startsWith('sk-ant-') || key.length < 30) {
    return {
      valid: false,
      message: 'Claude API keys typically start with "sk-ant-" and are at least 30 characters'
    };
  }
  break;
```

### Token Counting

The integration uses the Claude API's tokenize endpoint to get accurate token counts:

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

If the API call fails, the service falls back to an approximation method (1 token ≈ 4 characters).

### Pricing Information

The service includes up-to-date pricing information for Claude models:

```typescript
// src/services/claudeService.ts
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
```

### Usage Tracking

The service tracks usage data in localStorage with the following structure:

```typescript
interface ClaudeUsageData {
  total_cost: number; // In USD
  input_tokens: number;
  output_tokens: number;
  total_tokens: number;
  models_used: Array<{
    model: string;
    input_tokens: number;
    output_tokens: number;
    cost: number;
  }>;
  daily_costs: Array<{
    date: string;
    cost: number;
  }>;
  monthly_budget: number;
  budget_used_percentage: number;
  last_updated: string;
}
```

### API Key Validation

The service validates API keys by making a test request to the Claude API:

```typescript
// src/services/claudeService.ts
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
```

### Rate Limits

The service provides information about Claude API rate limits:

```typescript
// src/services/claudeService.ts
export const getRateLimits = (): Record<string, number> => {
  return {
    'requests_per_minute': 50,
    'tokens_per_minute': 50000
  };
};
```

## Integration with Dashboard

The Claude API integration is displayed in the dashboard through:

1. **API Provider Card**: Shows current usage and cost
2. **Usage Chart**: Shows usage trends over time
3. **Cost Breakdown**: Shows cost distribution by model
4. **Token Distribution**: Shows distribution of input vs. output tokens

## Integration with Widgets

The Claude API integration is displayed in floating widgets through:

1. **Cost Widget**: Shows current cost and change
2. **Usage Widget**: Shows current usage percentage
3. **Requests Widget**: Shows number of requests
4. **Tokens Widget**: Shows number of tokens used

## API Settings Component

The `ClaudeApiSettings` component provides a user interface for managing Claude API keys:

```typescript
// src/components/settings/ClaudeApiSettings.tsx
const ClaudeApiSettings: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [hasSavedKey, setHasSavedKey] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Load existing API key on component mount
  useEffect(() => {
    const loadApiKey = async () => {
      try {
        const key = await getApiKey('claude');
        if (key) {
          setApiKey(key);
          setHasSavedKey(true);
          setIsValid(true);
        }
      } catch (error) {
        console.error('Error loading API key:', error);
      }
    };

    loadApiKey();
  }, []);

  // Handle API key validation
  const handleValidate = async () => {
    if (!apiKey.trim()) return;

    setIsValidating(true);
    setIsValid(null);

    try {
      // First check the format
      const isValidFormat = apiKey.startsWith('sk-ant-') && apiKey.length > 30;

      if (!isValidFormat) {
        setIsValid(false);
        return;
      }

      // Make a real API call to validate the key
      const valid = await validateApiKey(apiKey);
      setIsValid(valid);
    } catch (error) {
      console.error('Error validating API key:', error);
      setIsValid(false);
    } finally {
      setIsValidating(false);
    }
  };

  // Handle API key save
  const handleSave = async () => {
    if (!apiKey.trim() || !isValid) return;

    setIsSaving(true);

    try {
      await saveApiKey('claude', apiKey);
      setHasSavedKey(true);
    } catch (error) {
      console.error('Error saving API key:', error);
    } finally {
      setIsSaving(false);
    }
  };
  
  // Component rendering...
};
```

## Enhanced API Service

The `enhancedApiService.ts` file provides additional functionality for the Claude API integration:

```typescript
// src/services/enhancedApiService.ts
export async function fetchClaudeData(): Promise<ApiUsageData> {
  return cacheService.getOrSet('claude_data', async () => {
    try {
      const apiKey = await getApiKey('claude');

      if (!apiKey) {
        throw new Error('No Claude API key found');
      }

      // Update last used timestamp
      await updateKeyLastUsed('claude');

      // Get stored data or initialize
      const storedData = localStorage.getItem('claude_usage_data');
      let data = storedData ? JSON.parse(storedData) : {
        total_cost: 0,
        input_tokens: 0,
        output_tokens: 0,
        total_tokens: 0,
        models_used: [],
        daily_costs: [],
        monthly_budget: 100,
        budget_used_percentage: 0,
        last_updated: new Date().toISOString()
      };

      // Process and return the data
      // ...
    } catch (error) {
      console.error('Error fetching Claude data:', error);
      throw error;
    }
  });
}
```

## Custom Hook

The `useClaudeUsage` hook provides a convenient way to access Claude usage data:

```typescript
// src/hooks/useClaudeUsage.ts
export function useClaudeUsage() {
  const [usage, setUsage] = useState<ClaudeUsageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsage = async () => {
    setLoading(true);
    setError(null);

    try {
      // Check if we have an API key
      const apiKey = await getApiKey('claude');
      if (!apiKey) {
        throw new Error('No Claude API key found');
      }

      // Get stored data or initialize
      const storedData = localStorage.getItem('claude_usage_data');
      let usageData = storedData ? JSON.parse(storedData) : {
        // Initialize data structure
        // ...
      };

      // Update with new data
      // ...

      // Save updated usage data
      localStorage.setItem('claude_usage_data', JSON.stringify(usageData));
      
      // Set the usage state
      setUsage(usageData);
      
      // Update last used timestamp for the API key
      await updateKeyLastUsed('claude');
    } catch (err) {
      console.error('Error fetching Claude usage:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch Claude usage data');
      
      // Try to use cached data if available
      // ...
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsage();
  }, []);

  return { usage, loading, error, refreshUsage: fetchUsage };
}
```

## Benefits of Claude API

Anthropic's Claude API offers several benefits for APIwidget users:

1. **High-Quality Models**: Claude models provide high-quality results
2. **Competitive Pricing**: Claude API has competitive pricing compared to other providers
3. **Long Context Windows**: Claude models support long context windows
4. **Accurate Token Counting**: Claude API provides accurate token counting

## Future Improvements

1. **Streaming Support**: Add support for streaming responses
2. **Function Calling**: Add support for function calling
3. **Multi-modal Support**: Add support for image inputs
4. **Batch Processing**: Add support for batch processing
5. **Advanced Analytics**: Provide more detailed analytics for Claude API usage

## References

- [Claude API Documentation](https://docs.anthropic.com/claude/reference/getting-started-with-the-api)
- [Claude API Pricing](https://www.anthropic.com/api)
- [Claude Models](https://www.anthropic.com/claude)
