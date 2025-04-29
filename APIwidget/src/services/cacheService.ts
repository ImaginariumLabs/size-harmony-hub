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
}

class CacheService {
  private cache: Map<string, CacheItem<any>> = new Map();
  
  /**
   * Get an item from the cache
   * @param key The cache key
   * @returns The cached data or null if not found or expired
   */
  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }
    
    // Check if the item has expired
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data as T;
  }
  
  /**
   * Set an item in the cache
   * @param key The cache key
   * @param data The data to cache
   * @param ttl Time to live in seconds (default: 5 minutes)
   */
  set<T>(key: string, data: T, ttl: number = 300): void {
    const timestamp = Date.now();
    const expiresAt = timestamp + (ttl * 1000);
    
    this.cache.set(key, {
      data,
      timestamp,
      expiresAt
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
   */
  async getOrSet<T>(key: string, factory: () => Promise<T>, ttl: number = 300): Promise<T> {
    const cachedData = this.get<T>(key);
    
    if (cachedData !== null) {
      return cachedData;
    }
    
    const data = await factory();
    this.set(key, data, ttl);
    return data;
  }
}

// Export a singleton instance
export const cacheService = new CacheService();
