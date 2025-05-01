import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useCachedData } from './useCachedData';
import { cacheService } from '../services/cacheService';

// Mock the cache service
vi.mock('../services/cacheService', () => ({
  cacheService: {
    getOrSet: vi.fn(),
    get: vi.fn(),
    set: vi.fn(),
    isStale: vi.fn(),
  }
}));

describe('useCachedData', () => {
  const mockData = { id: 1, name: 'Test Data' };
  const mockFetchFn = vi.fn().mockResolvedValue(mockData);

  beforeEach(() => {
    vi.clearAllMocks();
    // Default mock implementation for getOrSet
    vi.mocked(cacheService.getOrSet).mockResolvedValue(mockData);
  });

  it('should fetch and return data on mount when autoFetch is true', async () => {
    const { result } = renderHook(() => useCachedData(mockFetchFn, {
      cacheKey: 'test-key',
      autoFetch: true
    }));

    // Initial state
    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();

    // Wait for the fetch to complete
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // After fetch
    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBeNull();
    expect(cacheService.getOrSet).toHaveBeenCalledTimes(1);
    expect(cacheService.getOrSet).toHaveBeenCalledWith(
      'test-key',
      expect.any(Function),
      300, // default ttl
      60,  // default staleTime
      { allowStale: true, backgroundRefresh: true }
    );
  });

  it('should not fetch data on mount when autoFetch is false', () => {
    renderHook(() => useCachedData(mockFetchFn, {
      cacheKey: 'test-key',
      autoFetch: false
    }));

    expect(cacheService.getOrSet).not.toHaveBeenCalled();
  });

  it('should refetch data when dependencies change', async () => {
    const dependency = { value: 1 };

    const { result, rerender } = renderHook(
      ({ dep }) => useCachedData(mockFetchFn, {
        cacheKey: 'test-key',
        dependencies: [dep]
      }),
      { initialProps: { dep: dependency.value } }
    );

    // Wait for the initial fetch
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Clear the mock to check for new calls
    vi.mocked(cacheService.getOrSet).mockClear();

    // Change the dependency
    dependency.value = 2;

    // Rerender with the new dependency
    rerender({ dep: dependency.value });

    // Wait for the refetch
    await waitFor(() => {
      expect(cacheService.getOrSet).toHaveBeenCalled();
    });

    // Should have fetched again
    expect(cacheService.getOrSet).toHaveBeenCalledTimes(1);
  });

  it('should handle fetch errors', async () => {
    const mockError = new Error('Fetch failed');
    vi.mocked(cacheService.getOrSet).mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useCachedData(mockFetchFn, {
      cacheKey: 'test-key'
    }));

    // Wait for the fetch to fail
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Should have set the error
    expect(result.current.data).toBeNull();
    expect(result.current.error).toEqual(mockError);
  });

  it('should allow manual refetching of data', async () => {
    const { result } = renderHook(() => useCachedData(mockFetchFn, {
      cacheKey: 'test-key'
    }));

    // Wait for the initial fetch
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Clear the mock to check for new calls
    vi.mocked(cacheService.getOrSet).mockClear();

    // Manually refetch
    act(() => {
      result.current.refetch();
    });

    // Wait for the refetch
    await waitFor(() => {
      expect(cacheService.getOrSet).toHaveBeenCalled();
    });

    // Should have fetched again
    expect(cacheService.getOrSet).toHaveBeenCalledTimes(1);
  });

  it('should use custom ttl and staleTime values', async () => {
    const { result } = renderHook(() => useCachedData(mockFetchFn, {
      cacheKey: 'test-key',
      ttl: 600,
      staleTime: 120
    }));

    // Wait for the fetch to complete
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Should have used the custom values
    expect(cacheService.getOrSet).toHaveBeenCalledWith(
      'test-key',
      expect.any(Function),
      600, // custom ttl
      120, // custom staleTime
      expect.any(Object)
    );
  });
});
