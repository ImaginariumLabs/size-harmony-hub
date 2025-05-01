import { useState, useEffect, useCallback } from 'react';
import { withRetryAndTimeout } from '../utils/retryUtils';

interface UseRealTimeDataOptions {
  /**
   * Polling interval in milliseconds
   */
  interval?: number;
  
  /**
   * Whether to start polling immediately
   */
  autoStart?: boolean;
  
  /**
   * Timeout for each fetch operation in milliseconds
   */
  timeout?: number;
  
  /**
   * Maximum number of retries for failed fetch operations
   */
  maxRetries?: number;
  
  /**
   * Fallback data to use when fetch fails
   */
  fallbackData?: any;
  
  /**
   * Whether to keep previous data when fetch fails
   */
  keepPreviousDataOnError?: boolean;
}

/**
 * Hook for fetching real-time data with polling
 * 
 * @param fetchFunction Function that returns a promise with the data
 * @param options Configuration options
 * @returns Object with data, loading state, error, and control functions
 */
export function useRealTimeData<T>(
  fetchFunction: () => Promise<T>,
  options: UseRealTimeDataOptions = {}
) {
  const {
    interval = 30000,
    autoStart = true,
    timeout = 10000,
    maxRetries = 3,
    fallbackData = null,
    keepPreviousDataOnError = true,
  } = options;
  
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(autoStart);
  const [error, setError] = useState<Error | null>(null);
  const [isPolling, setIsPolling] = useState(autoStart);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
  // Fetch data with retry and timeout protection
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Use the retry utility to handle retries and timeouts
      const result = await withRetryAndTimeout(
        fetchFunction,
        timeout,
        keepPreviousDataOnError ? data || fallbackData : fallbackData,
        {
          maxRetries,
          onRetry: (attempt, error) => {
            console.warn(`Retry attempt ${attempt} after error:`, error);
          }
        }
      );
      
      setData(result);
      setLastUpdated(new Date());
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      console.error('Error fetching data:', error);
      setError(error);
      
      // If we're not keeping previous data on error, clear it
      if (!keepPreviousDataOnError) {
        setData(fallbackData);
      }
    } finally {
      setLoading(false);
    }
  }, [fetchFunction, timeout, maxRetries, keepPreviousDataOnError, data, fallbackData]);
  
  // Start polling
  const startPolling = useCallback(() => {
    setIsPolling(true);
  }, []);
  
  // Stop polling
  const stopPolling = useCallback(() => {
    setIsPolling(false);
  }, []);
  
  // Manually trigger a refresh
  const refresh = useCallback(() => {
    if (!loading) {
      fetchData();
    }
  }, [fetchData, loading]);
  
  // Set up polling effect
  useEffect(() => {
    let mounted = true;
    let timeoutId: NodeJS.Timeout | null = null;
    
    const poll = async () => {
      if (!mounted || !isPolling) return;
      
      await fetchData();
      
      if (mounted && isPolling) {
        timeoutId = setTimeout(poll, interval);
      }
    };
    
    if (isPolling) {
      poll();
    }
    
    return () => {
      mounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [fetchData, interval, isPolling]);
  
  return {
    data,
    loading,
    error,
    lastUpdated,
    isPolling,
    refresh,
    startPolling,
    stopPolling
  };
}

export default useRealTimeData;
