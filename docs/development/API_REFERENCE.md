# API Reference Guide

This document provides a comprehensive reference for all API services integrated into the APIwidget application.

## Table of Contents

1. [Introduction](#introduction)
2. [Common Interfaces](#common-interfaces)
3. [OpenAI API](#openai-api)
4. [Claude API](#claude-api)
5. [Gemini API](#gemini-api)
6. [GitHub API](#github-api)
7. [AWS API](#aws-api)
8. [API Service Utilities](#api-service-utilities)
9. [Error Handling](#error-handling)
10. [Best Practices](#best-practices)

## Introduction

APIwidget integrates with multiple API providers to track usage, costs, and provide analytics. This reference guide documents the implementation details, endpoints, and usage patterns for each API provider.

The API services are implemented in the following files:

- `src/services/openaiService.ts`: OpenAI API integration
- `src/services/claudeService.ts`: Claude API integration
- `src/services/geminiService.ts`: Gemini API integration
- `src/services/apiIntegrationService.ts`: Generic API integration service
- `src/services/enhancedApiService.ts`: Enhanced API service with caching

## Common Interfaces

### ApiCostData

The `ApiCostData` interface represents cost and usage data for an API provider:

```typescript
export interface ApiCostData {
  /** Total cost or usage value */
  total: number;
  
  /** Change from previous period */
  change: number;
  
  /** Type of change (increase or decrease) */
  changeType: 'increase' | 'decrease';
  
  /** Usage percentage (0-100) relative to quota or limit */
  usagePercentage?: number;
  
  /** Number of API requests made */
  requests?: number;
  
  /** Number of input tokens used (for LLM APIs) */
  inputTokens?: number;
  
  /** Number of output tokens used (for LLM APIs) */
  outputTokens?: number;
  
  /** Timestamp of the last update */
  lastUpdated?: string;
}
```

### ApiProvider

The `ApiProvider` interface represents an API provider with its configuration and status:

```typescript
export interface ApiProvider {
  /** Unique identifier for the provider */
  id: string;
  
  /** Display name of the provider */
  name: string;
  
  /** Description of the provider's services */
  description: string;
  
  /** Path to the provider's icon */
  icon: string;
  
  /** Brand color for the provider */
  color: string;
  
  /** Whether the provider is configured with an API key */
  isConfigured: boolean;
  
  /** When the provider was last used */
  lastUsed?: Date;
  
  /** Usage percentage (0-100) relative to quota or limit */
  usagePercentage?: number;
}
```

### ApiProviderConfig

The `ApiProviderConfig` interface represents the configuration for an API provider:

```typescript
export interface ApiProviderConfig {
  id: string;
  name: string;
  baseUrl: string;
  authType: 'bearer' | 'key' | 'basic';
  usageEndpoint: string;
  costEndpoint?: string;
  responseMapping: {
    usage: string[];
    cost?: string[];
    timestamp?: string[];
  };
}
```

### ApiUsageData

The `ApiUsageData` interface represents usage data for an API provider:

```typescript
export interface ApiUsageData {
  provider: string;
  cost?: number;
  requests?: {
    total: number;
    remaining: number;
    limit: number;
  };
  quota?: {
    used: number;
    total: number;
    resetDate?: string;
  };
  lastUpdated: string;
  rawData: any; // Original provider-specific data
}
```

## OpenAI API

### Authentication

OpenAI API uses bearer token authentication:

```typescript
const headers = {
  'Authorization': `Bearer ${apiKey}`
};
```

### Base URL

```
https://api.openai.com/v1
```

### Endpoints

#### Get Models

Retrieves the list of available models:

```typescript
GET /models
```

#### Get Usage

Retrieves usage data for the account:

```typescript
GET /usage?start_date=${startDate}&end_date=${endDate}
```

Parameters:
- `start_date`: Start date in YYYY-MM-DD format
- `end_date`: End date in YYYY-MM-DD format

#### Count Tokens

Counts tokens in a text string:

```typescript
import { countTokens } from './openaiService';

const tokenCount = await countTokens('Your text here');
```

### Pricing

Current pricing information (as of April 2025):

```typescript
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

## Claude API

### Authentication

Claude API uses API key authentication:

```typescript
const headers = {
  'x-api-key': apiKey,
  'anthropic-version': '2023-06-01'
};
```

### Base URL

```
https://api.anthropic.com/v1
```

### Endpoints

#### Get Models

Retrieves the list of available models:

```typescript
GET /models
```

### Pricing

Current pricing information (as of April 2025):

```typescript
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

## Gemini API

### Authentication

Gemini API uses API key as a query parameter:

```typescript
const url = `${GEMINI_API_BASE_URL}/models?key=${apiKey}`;
```

### Base URL

```
https://generativelanguage.googleapis.com/v1
```

### Endpoints

#### Get Models

Retrieves the list of available models:

```typescript
GET /models?key=${apiKey}
```

#### Count Tokens

Counts tokens in a text string:

```typescript
POST /models/gemini-1.5-pro:countTokens?key=${apiKey}
```

Request body:
```json
{
  "contents": [
    {
      "parts": [
        {
          "text": "Your text here"
        }
      ]
    }
  ]
}
```

### Free Tier Limits

```typescript
const freeTierLimits = {
  'requests_per_minute': 60,
  'tokens_per_minute': 60000
};
```

## GitHub API

### Authentication

GitHub API uses bearer token authentication:

```typescript
const headers = {
  'Authorization': `Bearer ${apiKey}`
};
```

### Base URL

```
https://api.github.com
```

### Endpoints

#### Get Rate Limit

Retrieves the rate limit information:

```typescript
GET /rate_limit
```

## AWS API

### Authentication

AWS API uses API key authentication (simplified in this implementation):

```typescript
// In a real implementation, this would use AWS SDK with proper credentials
```

### Base URL

```
https://api.amazonaws.com
```

### Endpoints

#### Get Cost Explorer Data

Retrieves cost data from AWS Cost Explorer:

```typescript
GET /cost-explorer
```

## API Service Utilities

### Enhanced API Service

The enhanced API service provides a consistent interface for fetching data from all API providers with caching:

```typescript
import * as enhancedApi from './services/enhancedApiService';

// Fetch data for a specific provider
const openaiData = await enhancedApi.fetchApiData('openai');

// Fetch data for all providers
const allData = await enhancedApi.fetchAllApiData();

// Clear cached data
enhancedApi.clearCachedApiData();
```

### API Integration Service

The API integration service provides a generic interface for integrating with API providers:

```typescript
import { fetchApiData } from './services/apiIntegrationService';

// Fetch data for a specific provider
const apiData = await fetchApiData('openai');
```

## Error Handling

All API services include error handling to gracefully handle API failures:

```typescript
try {
  const apiData = await fetchApiData('openai');
  // Process data
} catch (error) {
  console.error('Error fetching API data:', error);
  // Fall back to cached or mock data
  const mockData = getMockProviderData('openai');
  // Process mock data
}
```

## Best Practices

1. **API Key Security**: Always store API keys securely using the application's encrypted storage system.
2. **Error Handling**: Always include proper error handling when making API calls.
3. **Caching**: Use the caching mechanism to reduce unnecessary API calls and improve performance.
4. **Rate Limiting**: Be mindful of API rate limits and implement appropriate throttling.
5. **Fallback Mechanisms**: Implement fallback mechanisms for when API calls fail.
6. **Logging**: Log API errors for debugging purposes, but never log API keys or sensitive data.
7. **Testing**: Test API integrations with mock data before deploying to production.
