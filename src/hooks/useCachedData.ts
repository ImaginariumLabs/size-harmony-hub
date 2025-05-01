import { useState, useEffect, useCallback } from 'react';
import { cacheService } from '../services/cacheService';

interface UseCachedDataOptions {
  /**
   * Cache key to use for storing the data
   */
  cacheKey: string;
  
  /**
   * Time to live in seconds for the cached data
   * @default 300 (5 minutes)
   */
  ttl?: number;
  
  /**
   * Time in seconds after which data is considered stale but still usable
   * @default 60 (1 minute)
   */
  staleTime?: number;
  
  /**
   * Whether to allow stale data to be returned while fetching fresh data
   * @default true
   */
  allowStale?: boolean;
  
  /**
   * Whether to refresh stale data in the background
   * @default true
   */
  backgroundRefresh?: boolean;
  
  /**
   * Whether to fetch data automatically on mount
   * @default true
   */
  autoFetch?: boolean;
  
  /**
   * Dependencies array for refetching data when dependencies change
   * @default []
   */
  dependencies?: unknown[];
}

/**
 * Hook for fetching and caching data with stale-while-revalidate pattern
 * 
 * @param fetchFn Function that returns a promise with the data to cache
 * @param options Options for the hook
 * @returns Object with data, loading state, error, and refetch function
 */
export function useCachedData<T>(
  fetchFn: () => Promise<T>,
  options: UseCachedDataOptions
): {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<T>;
} {
  const {
    cacheKey,
    ttl = 300,
    staleTime = 60,
    allowStale = true,
    backgroundRefresh = true,
    autoFetch = true,
    dependencies = []
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(autoFetch);
  const [error, setError] = useState<Error | null>(null);

  // Fetch data function that uses the cache service
  const fetchData = useCallback(async (): Promise<T> => {
    setLoading(true);
    setError(null);

    try {
      // Use the cache service to get or set the data
      const result = await cacheService.getOrSet<T>(
        cacheKey,
        fetchFn,
        ttl,
        staleTime,
        {
          allowStale,
          backgroundRefresh
        }
      );

      setData(result);
      return result;
    } catch (err) {
      const fetchError = err instanceof Error ? err : new Error(String(err));
      setError(fetchError);
      throw fetchError;
    } finally {
      setLoading(false);
    }
  }, [cacheKey, fetchFn, ttl, staleTime, allowStale, backgroundRefresh]);

  // Fetch data on mount and when dependencies change
  useEffect(() => {
    if (autoFetch) {
      fetchData().catch(err => {
        console.error(`Error fetching data for cache key ${cacheKey}:`, err);
      });
    }
  }, [autoFetch, fetchData, cacheKey, ...dependencies]);

  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
}
