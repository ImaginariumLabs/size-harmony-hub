/**
 * Utility functions for implementing retry mechanisms for API calls
 *
 * This is part of the Phase 2 implementation to improve error handling and recovery.
 */

/**
 * Configuration options for the retry mechanism
 */
export interface RetryOptions {
  /**
   * Maximum number of retry attempts
   */
  maxRetries: number;

  /**
   * Base delay in milliseconds between retries
   */
  baseDelay: number;

  /**
   * Whether to use exponential backoff for retry delays
   */
  useExponentialBackoff: boolean;

  /**
   * Maximum delay in milliseconds between retries
   */
  maxDelay?: number;

  /**
   * Function to determine if a retry should be attempted based on the error
   */
  shouldRetry?: (error: any) => boolean;

  /**
   * Callback function to execute before each retry attempt
   */
  onRetry?: (attempt: number, error: any) => void;
}

/**
 * Default retry options
 */
const defaultRetryOptions: RetryOptions = {
  maxRetries: 3,
  baseDelay: 1000, // 1 second
  useExponentialBackoff: true,
  maxDelay: 10000, // 10 seconds
  shouldRetry: () => true, // Retry all errors by default
  onRetry: (attempt, error) => {
    console.warn(`Retry attempt ${attempt} after error:`, error);
  }
};

/**
 * Calculate the delay for a retry attempt
 *
 * @param attempt The current retry attempt (1-based)
 * @param options Retry options
 * @returns The delay in milliseconds
 */
export const calculateRetryDelay = (
  attempt: number,
  options: RetryOptions
): number => {
  if (!options.useExponentialBackoff) {
    return options.baseDelay;
  }

  // Calculate exponential backoff: baseDelay * 2^(attempt-1)
  const exponentialDelay = options.baseDelay * Math.pow(2, attempt - 1);

  // Add some randomness to prevent all retries happening at the same time
  // This is known as "jitter" and helps prevent thundering herd problems
  const jitter = Math.random() * 0.3 * exponentialDelay;

  // Apply maximum delay if specified
  if (options.maxDelay) {
    return Math.min(exponentialDelay + jitter, options.maxDelay);
  }

  return exponentialDelay + jitter;
};

/**
 * Executes a function with retry logic
 *
 * @param fn The function to execute with retry logic
 * @param options Retry options
 * @returns A promise that resolves with the result of the function or rejects after all retries fail
 */
export const withRetry = async <T,>(
  fn: () => Promise<T>,
  options: Partial<RetryOptions> = {}
): Promise<T> => {
  // Merge default options with provided options
  const retryOptions: RetryOptions = {
    ...defaultRetryOptions,
    ...options
  };

  let attempt = 0;

  while (true) {
    try {
      return await fn();
    } catch (error) {
      attempt++;

      // Check if we should retry
      const shouldRetry =
        attempt <= retryOptions.maxRetries &&
        retryOptions.shouldRetry?.(error);

      if (!shouldRetry) {
        throw error;
      }

      // Execute onRetry callback if provided
      if (retryOptions.onRetry) {
        retryOptions.onRetry(attempt, error);
      }

      // Calculate delay for this attempt
      const delay = calculateRetryDelay(attempt, retryOptions);

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

/**
 * Combines retry logic with timeout protection
 *
 * This function has been enhanced to better support both web and Electron environments,
 * with improved error handling and logging.
 *
 * @param fn The function to execute with retry and timeout protection
 * @param timeoutMs The timeout in milliseconds
 * @param fallbackData The fallback data to return if all retries fail or timeout occurs
 * @param retryOptions Retry options
 * @returns A promise that resolves with the result of the function or the fallback data
 */
export const withRetryAndTimeout = async <T,>(
  fn: () => Promise<T>,
  timeoutMs: number,
  fallbackData: T,
  retryOptions: Partial<RetryOptions> = {}
): Promise<T> => {
  try {
    // Create a timeout promise
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new Error(`Operation timed out after ${timeoutMs}ms`));
      }, timeoutMs);
    });

    // Race the retry logic against the timeout
    return await Promise.race([
      withRetry(fn, retryOptions),
      timeoutPromise
    ]);
  } catch (error) {
    // Enhanced error logging with environment detection
    const isElectron = typeof window !== 'undefined' &&
      (window.navigator.userAgent.toLowerCase().indexOf('electron') !== -1 ||
       window.electronAPI !== undefined);

    console.error(
      `Operation failed in ${isElectron ? 'Electron' : 'web'} environment:`,
      error instanceof Error ? error.message : error
    );

    // Log to Electron main process if available
    if (isElectron && window.electronAPI?.debug) {
      try {
        window.electronAPI.debug({
          component: 'retryUtils',
          event: 'operation-failed',
          error: error instanceof Error ? error.message : String(error)
        });
      } catch (debugError) {
        console.error('Failed to send debug info to Electron main process:', debugError);
      }
    }

    return fallbackData;
  }
};

/**
 * Example usage:
 *
 * ```typescript
 * const fetchData = async () => {
 *   return withRetryAndTimeout(
 *     async () => {
 *       const response = await fetch('/api/data');
 *       if (!response.ok) {
 *         throw new Error(`HTTP error! status: ${response.status}`);
 *       }
 *       return await response.json();
 *     },
 *     5000, // 5 second timeout
 *     { data: 'fallback data' }, // Fallback data
 *     {
 *       maxRetries: 3,
 *       shouldRetry: (error) => {
 *         // Only retry network errors or 5xx server errors
 *         return error.name === 'TypeError' ||
 *                (error.status && error.status >= 500);
 *       }
 *     }
 *   );
 * };
 * ```
 */
