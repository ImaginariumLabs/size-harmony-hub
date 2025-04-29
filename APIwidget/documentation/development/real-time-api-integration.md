# Real-Time API Integration

This document describes the real-time API integration system implemented in the APIwidget application.

## Overview

The real-time API integration system provides accurate and up-to-date information about API usage and costs from various providers. It includes:

1. **Enhanced API Service**: A service that fetches real-time data from API providers with caching and error handling.
2. **Caching Mechanism**: A service that caches API responses to reduce unnecessary API calls and improve performance.
3. **Real-Time API Usage Component**: A reusable React component that displays real-time API usage data.

## Components

### Cache Service

The cache service (`cacheService.ts`) provides a simple caching mechanism for API responses. It includes:

- **get/set methods**: Store and retrieve data with TTL (Time To Live)
- **getOrSet method**: Get cached data or fetch new data if not in cache
- **Automatic expiration**: Cached items are automatically expired after their TTL

### Enhanced API Service

The enhanced API service (`enhancedApiService.ts`) provides real-time data fetching from various API providers. It includes:

- **Provider-specific fetching**: Specialized functions for each API provider
- **Caching integration**: Uses the cache service to reduce API calls
- **Error handling**: Graceful fallbacks when API calls fail
- **Unified data format**: Consistent data structure across providers

### Real-Time API Usage Component

The real-time API usage component (`RealTimeApiUsage.tsx`) displays API usage data in a user-friendly way. It includes:

- **Provider-specific views**: Can display data for a specific provider or all providers
- **Automatic refreshing**: Periodically refreshes data based on a configurable interval
- **Compact mode**: Can display data in a compact format for space-constrained UIs
- **Visual indicators**: Color-coded indicators for usage levels

## Usage

### Using the Cache Service

```typescript
import { cacheService } from './services/cacheService';

// Get cached data
const data = cacheService.get<MyDataType>('my-cache-key');

// Set cached data with a 5-minute TTL
cacheService.set('my-cache-key', myData, 300);

// Get or set with a factory function
const data = await cacheService.getOrSet(
  'my-cache-key',
  async () => {
    // This function is only called if the data is not in the cache
    return await fetchMyData();
  },
  300 // 5-minute TTL
);
```

### Using the Enhanced API Service

```typescript
import * as enhancedApi from './services/enhancedApiService';

// Fetch data for a specific provider
const openaiData = await enhancedApi.fetchApiData('openai');

// Fetch data for all providers
const allData = await enhancedApi.fetchAllApiData();

// Clear cached data
enhancedApi.clearCachedApiData();
```

### Using the Real-Time API Usage Component

```tsx
import RealTimeApiUsage from './components/widgets/RealTimeApiUsage';

// Display data for all providers
<RealTimeApiUsage refreshInterval={60} />

// Display data for a specific provider
<RealTimeApiUsage provider="openai" refreshInterval={30} />

// Display data in compact mode
<RealTimeApiUsage compact={true} />
```

## Implementation Details

### Data Flow

1. The `RealTimeApiUsage` component requests data from the `enhancedApiService`
2. The `enhancedApiService` checks the cache for existing data
3. If data is not in cache or expired, it fetches new data from the API
4. The data is cached for future use
5. The component displays the data and sets up a refresh interval

### Error Handling

The system includes comprehensive error handling:

- API call failures are caught and logged
- Cache misses are handled gracefully
- Component displays appropriate error states
- Fallback to mock data when real data is unavailable

### Performance Considerations

- Caching reduces API calls and improves performance
- Configurable refresh intervals prevent excessive API calls
- Compact mode reduces rendering overhead for small displays
- Efficient state management minimizes re-renders

## Future Improvements

- **Real API Integration**: Replace simulated data with actual API calls
- **More Providers**: Add support for more API providers
- **Advanced Caching**: Implement more sophisticated caching strategies
- **Offline Support**: Add support for offline usage with cached data
- **Historical Data**: Implement storage and visualization of historical usage data
