/**
 * Cache Service
 *
 * A simple caching mechanism for API responses to reduce unnecessary API calls
 * and improve performance.
 */

interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
  staleAt?: number; // Optional time when data becomes stale but still usable
}

class CacheService {
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  private cache: Map<string, CacheItem<any>> = new Map();

  /**
   * Get an item from the cache
   * @param key The cache key
   * @param options Additional options for the get operation
   * @returns The cached data or null if not found or expired
   */
  get<T>(key: string, options: { allowStale?: boolean } = {}): T | null {
    const item = this.cache.get(key);
    const now = Date.now();

    if (!item) {
      return null;
    }

    // Check if the item has expired
    if (now > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    // Check if the item is stale but we're allowing stale data
    if (options.allowStale && item.staleAt && now > item.staleAt) {
      // Mark this item as needing a refresh, but still return the data
      // This is the "stale-while-revalidate" pattern
      return item.data as T;
    }

    return item.data as T;
  }

  /**
   * Check if an item in the cache is stale
   * @param key The cache key
   * @returns True if the item exists and is stale, false otherwise
   */
  isStale(key: string): boolean {
    const item = this.cache.get(key);

    if (!item || !item.staleAt) {
      return false;
    }

    return Date.now() > item.staleAt;
  }

  /**
   * Set an item in the cache
   * @param key The cache key
   * @param data The data to cache
   * @param ttl Time to live in seconds (default: 5 minutes)
   * @param staleTime Time in seconds after which data is considered stale but still usable (default: 60 seconds)
   */
  set<T>(key: string, data: T, ttl: number = 300, staleTime?: number): void {
    const timestamp = Date.now();
    const expiresAt = timestamp + (ttl * 1000);

    // If staleTime is provided, calculate when the data becomes stale
    const staleAt = staleTime ? timestamp + (staleTime * 1000) : undefined;

    this.cache.set(key, {
      data,
      timestamp,
      expiresAt,
      staleAt
    });
  }

  /**
   * Remove an item from the cache
   * @param key The cache key
   */
  remove(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Alias for remove() to maintain backward compatibility
   * @param key The cache key
   */
  delete(key: string): void {
    this.remove(key);
  }

  /**
   * Clear all items from the cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get the number of items in the cache
   */
  size(): number {
    return this.cache.size;
  }

  /**
   * Check if the cache contains a key
   * @param key The cache key
   */
  has(key: string): boolean {
    return this.cache.has(key);
  }

  /**
   * Get all cache keys
   */
  keys(): string[] {
    return Array.from(this.cache.keys());
  }

  /**
   * Get or set cache item with a factory function
   * @param key The cache key
   * @param factory Function to create the data if not in cache
   * @param ttl Time to live in seconds
   * @param staleTime Time in seconds after which data is considered stale but still usable
   * @param options Additional options for the operation
   */
  async getOrSet<T>(
    key: string,
    factory: () => Promise<T>,
    ttl: number = 300,
    staleTime?: number,
    options: {
      allowStale?: boolean,
      backgroundRefresh?: boolean
    } = {}
  ): Promise<T> {
    // First try to get from cache, allowing stale data if specified
    const cachedData = this.get<T>(key, { allowStale: options.allowStale });

    // If we have data (fresh or allowed stale), return it
    if (cachedData !== null) {
      // If the data is stale and we're allowing background refresh, trigger a refresh
      if (options.backgroundRefresh && this.isStale(key)) {
        // Use setTimeout to make this non-blocking
        setTimeout(async () => {
          try {
            const freshData = await factory();
            this.set(key, freshData, ttl, staleTime);
            console.log(`Background refresh completed for key: ${key}`);
          } catch (error) {
            console.error(`Background refresh failed for key: ${key}`, error);
          }
        }, 0);
      }

      return cachedData;
    }

    // If we don't have cached data, fetch fresh data
    const data = await factory();
    this.set(key, data, ttl, staleTime);
    return data;
  }
}

// Export a singleton instance
export const cacheService = new CacheService();
