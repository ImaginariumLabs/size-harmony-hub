# API Usage Examples

This document provides practical examples of how to use the API services in the APIwidget application.

## Table of Contents

1. [Introduction](#introduction)
2. [Basic API Service Usage](#basic-api-service-usage)
3. [Authentication Examples](#authentication-examples)
4. [Token Counting Examples](#token-counting-examples)
5. [Usage Tracking Examples](#usage-tracking-examples)
6. [Cost Calculation Examples](#cost-calculation-examples)
7. [Error Handling Examples](#error-handling-examples)
8. [Advanced Usage Patterns](#advanced-usage-patterns)

## Introduction

The APIwidget application integrates with multiple API providers to track usage, costs, and provide analytics. This document provides practical examples of how to use these API services in your code.

## Basic API Service Usage

### Fetching API Data

The most common operation is fetching API usage data:

```typescript
import { fetchApiData } from '../services/apiIntegrationService';

// Fetch data for a specific provider
const apiData = await fetchApiData('openai');
console.log(`Total cost: $${apiData.total.toFixed(2)}`);
```

### Using the Enhanced API Service

The enhanced API service provides a more robust interface with caching:

```typescript
import * as enhancedApi from '../services/enhancedApiService';

// Fetch data for a specific provider
const openaiData = await enhancedApi.fetchApiData('openai');
console.log(`Total cost: $${openaiData.total_cost.toFixed(2)}`);

// Fetch data for all providers
const allData = await enhancedApi.fetchAllApiData();
console.log(`OpenAI cost: $${allData.openai.total_cost.toFixed(2)}`);
console.log(`Claude cost: $${allData.claude.total_cost.toFixed(2)}`);
console.log(`Gemini cost: $${allData.google.total_cost.toFixed(2)}`);
```

### Using Provider-Specific Services

Each provider has a dedicated service with provider-specific functionality:

```typescript
import * as openaiService from '../services/openaiService';
import * as claudeService from '../services/claudeService';
import * as geminiService from '../services/geminiService';

// Fetch OpenAI usage data
const openaiData = await openaiService.fetchUsageData();

// Fetch Claude usage data
const claudeData = await claudeService.fetchUsageData();

// Fetch Gemini usage data
const geminiData = await geminiService.fetchUsageData();
```

## Authentication Examples

### Getting API Keys

API keys are stored securely and can be retrieved using the `getApiKey` function:

```typescript
import { getApiKey } from '../services/electronService';

// Get API key for a specific provider
const openaiApiKey = await getApiKey('openai');
const claudeApiKey = await getApiKey('claude');
const geminiApiKey = await getApiKey('google');
```

### Validating API Keys

Each provider service includes a function to validate API keys:

```typescript
import * as openaiService from '../services/openaiService';
import * as claudeService from '../services/claudeService';
import * as geminiService from '../services/geminiService';

// Validate OpenAI API key
const isOpenAIKeyValid = await openaiService.validateApiKey(openaiApiKey);

// Validate Claude API key
const isClaudeKeyValid = await claudeService.validateApiKey(claudeApiKey);

// Validate Gemini API key
const isGeminiKeyValid = await geminiService.validateApiKey(geminiApiKey);
```

### Setting API Keys

API keys can be set using the `setApiKey` function:

```typescript
import { setApiKey } from '../services/electronService';

// Set API key for a specific provider
await setApiKey('openai', 'sk-...');
await setApiKey('claude', 'sk-ant-...');
await setApiKey('google', 'AIza...');
```

## Token Counting Examples

### Counting Tokens with OpenAI

```typescript
import * as openaiService from '../services/openaiService';

// Count tokens in a text string
const text = 'This is a sample text to count tokens.';
const tokenCount = await openaiService.countTokens(text);
console.log(`Token count: ${tokenCount}`);
```

### Counting Tokens with Claude

```typescript
import * as claudeService from '../services/claudeService';

// Count tokens in a text string
const text = 'This is a sample text to count tokens.';
const tokenCount = await claudeService.countTokens(text);
console.log(`Token count: ${tokenCount}`);
```

### Counting Tokens with Gemini

```typescript
import * as geminiService from '../services/geminiService';

// Count tokens in a text string
const text = 'This is a sample text to count tokens.';
const tokenCount = await geminiService.countTokens(text);
console.log(`Token count: ${tokenCount}`);
```

## Usage Tracking Examples

### Tracking OpenAI Usage

```typescript
import * as openaiService from '../services/openaiService';

// Fetch detailed usage data
const usageData = await openaiService.fetchDetailedUsageData();

// Process usage data
const totalTokens = usageData.total_tokens || 0;
const totalCost = usageData.total_usage || 0;

console.log(`Total tokens used: ${totalTokens}`);
console.log(`Total cost: $${totalCost.toFixed(2)}`);
```

### Tracking Usage Across All Providers

```typescript
import * as enhancedApi from '../services/enhancedApiService';

// Fetch data for all providers
const allData = await enhancedApi.fetchAllApiData();

// Calculate total cost across all providers
const totalCost = Object.values(allData).reduce((sum, data) => sum + (data.total_cost || 0), 0);

console.log(`Total cost across all providers: $${totalCost.toFixed(2)}`);
```

## Cost Calculation Examples

### Calculating OpenAI Costs

```typescript
import * as openaiService from '../services/openaiService';

// Calculate cost for a specific model and token count
const model = 'gpt-4o';
const inputTokens = 1000;
const outputTokens = 500;

// Get pricing for the model
const pricing = openaiService.OPENAI_PRICING[model];

// Calculate cost
const inputCost = inputTokens * pricing.input;
const outputCost = outputTokens * pricing.output;
const totalCost = inputCost + outputCost;

console.log(`Input cost: $${inputCost.toFixed(4)}`);
console.log(`Output cost: $${outputCost.toFixed(4)}`);
console.log(`Total cost: $${totalCost.toFixed(4)}`);
```

### Calculating Claude Costs

```typescript
import * as claudeService from '../services/claudeService';

// Calculate cost for a specific model and token count
const model = 'claude-3-5-sonnet';
const inputTokens = 1000;
const outputTokens = 500;

// Get pricing for the model
const pricing = claudeService.CLAUDE_PRICING[model];

// Calculate cost
const inputCost = inputTokens * pricing.input;
const outputCost = outputTokens * pricing.output;
const totalCost = inputCost + outputCost;

console.log(`Input cost: $${inputCost.toFixed(4)}`);
console.log(`Output cost: $${outputCost.toFixed(4)}`);
console.log(`Total cost: $${totalCost.toFixed(4)}`);
```

## Error Handling Examples

### Basic Error Handling

```typescript
import { fetchApiData } from '../services/apiIntegrationService';

try {
  const apiData = await fetchApiData('openai');
  console.log(`Total cost: $${apiData.total.toFixed(2)}`);
} catch (error) {
  console.error('Error fetching API data:', error);
  // Handle error (e.g., show error message to user)
}
```

### Fallback to Mock Data

```typescript
import { fetchApiData } from '../services/apiIntegrationService';
import { getMockProviderData } from '../services/mockDataService';

try {
  const apiData = await fetchApiData('openai');
  console.log(`Total cost: $${apiData.total.toFixed(2)}`);
} catch (error) {
  console.error('Error fetching API data:', error);
  
  // Fall back to mock data
  const mockData = getMockProviderData('openai');
  console.log(`Using mock data. Total cost: $${mockData.total.toFixed(2)}`);
}
```

### Handling Missing API Keys

```typescript
import { getApiKey } from '../services/electronService';
import * as openaiService from '../services/openaiService';

try {
  const apiKey = await getApiKey('openai');
  
  if (!apiKey) {
    console.warn('No OpenAI API key found. Prompting user to add key.');
    // Show dialog to add API key
    return;
  }
  
  const usageData = await openaiService.fetchUsageData();
  console.log(`Total cost: $${usageData.total.toFixed(2)}`);
} catch (error) {
  console.error('Error fetching API data:', error);
  // Handle error
}
```

## Advanced Usage Patterns

### Caching API Responses

The enhanced API service includes built-in caching:

```typescript
import * as enhancedApi from '../services/enhancedApiService';

// Fetch data (cached for 60 seconds)
const data1 = await enhancedApi.fetchApiData('openai');

// This will use the cached data if called within 60 seconds
const data2 = await enhancedApi.fetchApiData('openai');

// Force a refresh by clearing the cache
enhancedApi.clearCachedApiData();
const freshData = await enhancedApi.fetchApiData('openai');
```

### Polling for Real-Time Updates

```typescript
import * as enhancedApi from '../services/enhancedApiService';

// Set up polling interval (e.g., every 60 seconds)
const POLLING_INTERVAL = 60 * 1000;

// Start polling
const pollingInterval = setInterval(async () => {
  try {
    // Clear cache to ensure fresh data
    enhancedApi.clearCachedApiData();
    
    // Fetch fresh data
    const data = await enhancedApi.fetchAllApiData();
    
    // Update UI with fresh data
    updateUI(data);
  } catch (error) {
    console.error('Error polling API data:', error);
  }
}, POLLING_INTERVAL);

// Clean up when component unmounts
function cleanup() {
  clearInterval(pollingInterval);
}
```

### Using with React Hooks

```typescript
import { useState, useEffect } from 'react';
import * as enhancedApi from '../services/enhancedApiService';

function useApiData(provider, refreshInterval = 60) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    let intervalId = null;

    const fetchData = async () => {
      try {
        setLoading(true);
        const apiData = await enhancedApi.fetchApiData(provider);
        
        if (mounted) {
          setData(apiData);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError(err);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    // Fetch initial data
    fetchData();

    // Set up polling if refreshInterval is provided
    if (refreshInterval > 0) {
      intervalId = setInterval(fetchData, refreshInterval * 1000);
    }

    // Clean up
    return () => {
      mounted = false;
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [provider, refreshInterval]);

  return { data, loading, error, refetch: async () => {
    enhancedApi.clearCachedApiData();
    setLoading(true);
    try {
      const apiData = await enhancedApi.fetchApiData(provider);
      setData(apiData);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }};
}

// Usage in a component
function ApiUsageDisplay({ provider }) {
  const { data, loading, error, refetch } = useApiData(provider, 60);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h2>{provider} Usage</h2>
      <p>Total cost: ${data.total_cost.toFixed(2)}</p>
      <button onClick={refetch}>Refresh</button>
    </div>
  );
}
```
