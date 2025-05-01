/**
 * Utility functions for handling timeouts in API calls
 */

/**
 * Wraps a promise with a timeout to prevent endless loading
 * @param promise The promise to wrap with a timeout
 * @param timeoutMs The timeout in milliseconds
 * @param fallbackData The fallback data to return if the promise times out
 * @returns The result of the promise or the fallback data if the promise times out
 */
export const withTimeout = <T,>(
  promise: Promise<T>,
  timeoutMs: number,
  fallbackData: T
): Promise<T> => {
  // Create a timeout promise that rejects after the specified time
  const timeout = new Promise<never>((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Operation timed out after ${timeoutMs}ms`));
    }, timeoutMs);
  });

  // Race the original promise against the timeout
  return Promise.race([promise, timeout])
    .then((result) => result)
    .catch((error) => {
      console.warn(`API call failed: ${error.message}`);
      return fallbackData;
    });
};

/**
 * Creates a delayed promise that resolves after the specified time
 * @param data The data to resolve with
 * @param delayMs The delay in milliseconds
 * @returns A promise that resolves with the data after the delay
 */
export const createDelayedPromise = <T,>(data: T, delayMs: number): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, delayMs);
  });
};

/**
 * Creates a promise that always rejects after the specified time
 * @param errorMessage The error message
 * @param delayMs The delay in milliseconds
 * @returns A promise that rejects with the error after the delay
 */
export const createRejectedPromise = (errorMessage: string, delayMs: number): Promise<never> => {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(errorMessage));
    }, delayMs);
  });
};
