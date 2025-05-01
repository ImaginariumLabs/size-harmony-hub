import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { withTimeout, createDelayedPromise, createRejectedPromise } from './timeoutUtils';

describe('timeoutUtils', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  describe('createDelayedPromise', () => {
    it('creates a promise that resolves after the specified delay', async () => {
      const delayedPromise = createDelayedPromise('success', 1000);

      // The promise should not resolve immediately
      const immediateCheck = Promise.race([
        delayedPromise.then(() => 'resolved'),
        Promise.resolve('not resolved'),
      ]);

      expect(await immediateCheck).toBe('not resolved');

      // Advance time to trigger the resolution
      vi.advanceTimersByTime(1000);

      // The promise should resolve with the data
      expect(await delayedPromise).toBe('success');
    });
  });

  describe('createRejectedPromise', () => {
    it('creates a promise that rejects after the specified delay', async () => {
      const rejectedPromise = createRejectedPromise('Operation failed', 1000);

      // The promise should not reject immediately
      const immediateCheck = Promise.race([
        rejectedPromise.catch(() => 'rejected'),
        Promise.resolve('not rejected'),
      ]);

      expect(await immediateCheck).toBe('not rejected');

      // Advance time to trigger the rejection
      vi.advanceTimersByTime(1000);

      // The promise should reject with the error message
      await expect(rejectedPromise).rejects.toThrow('Operation failed');
    });
  });

  describe('withTimeout', () => {
    it('returns the result of the promise if it completes before the timeout', async () => {
      const promise = Promise.resolve('success');

      const result = await withTimeout(promise, 1000, 'fallback');

      expect(result).toBe('success');
    });

    it('returns fallback data when the promise times out', async () => {
      // Create a promise that never resolves
      const promise = new Promise(() => {});

      const result = withTimeout(promise, 1000, 'fallback');

      // Advance time to trigger the timeout
      vi.advanceTimersByTime(1000);

      // The function should return the fallback data
      expect(await result).toBe('fallback');
    });

    it('returns fallback data when the promise fails', async () => {
      // Create a promise that rejects
      const promise = Promise.reject(new Error('Operation failed'));

      const result = await withTimeout(promise, 1000, 'fallback');

      // The function should return the fallback data
      expect(result).toBe('fallback');
    });

    it('logs a warning when the promise fails', async () => {
      // Spy on console.warn
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      // Create a promise that rejects
      const promise = Promise.reject(new Error('Operation failed'));

      await withTimeout(promise, 1000, 'fallback');

      // Check that console.warn was called
      expect(consoleWarnSpy).toHaveBeenCalledWith('API call failed: Operation failed');

      // Restore console.warn
      consoleWarnSpy.mockRestore();
    });
  });
});
