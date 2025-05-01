import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  validateToken,
  isTokenExpiringSoon,
  getTokenExpirationTime,
  getTokenRemainingTime,
  getUserIdFromToken,
  securelyStoreToken,
  getStoredToken,
  removeStoredToken
} from './tokenUtils';

// Mock sessionStorage
const mockSessionStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    })
  };
})();

// Mock global sessionStorage
Object.defineProperty(window, 'sessionStorage', {
  value: mockSessionStorage
});

// Helper to create a valid JWT token for testing
const createTestToken = (expiresInSeconds: number, userId = 'test-user-id'): string => {
  const now = Math.floor(Date.now() / 1000);
  const expiresAt = now + expiresInSeconds;
  
  // Create a simple JWT structure (header.payload.signature)
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({
    sub: userId,
    exp: expiresAt,
    iat: now
  }));
  const signature = 'test-signature'; // Not a real signature, just for testing
  
  return `${header}.${payload}.${signature}`;
};

describe('tokenUtils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSessionStorage.clear();
    
    // Mock Date.now() to return a fixed timestamp
    vi.spyOn(Date, 'now').mockImplementation(() => 1625097600000); // 2021-07-01T00:00:00.000Z
  });
  
  afterEach(() => {
    vi.restoreAllMocks();
  });
  
  describe('validateToken', () => {
    it('should return false for undefined token', () => {
      expect(validateToken(undefined)).toBe(false);
    });
    
    it('should return false for malformed token', () => {
      expect(validateToken('invalid-token')).toBe(false);
      expect(validateToken('header.payload')).toBe(false);
    });
    
    it('should return false for expired token', () => {
      const expiredToken = createTestToken(-60); // Expired 1 minute ago
      expect(validateToken(expiredToken)).toBe(false);
    });
    
    it('should return true for valid token', () => {
      const validToken = createTestToken(3600); // Expires in 1 hour
      expect(validateToken(validToken)).toBe(true);
    });
  });
  
  describe('isTokenExpiringSoon', () => {
    it('should return false for undefined token', () => {
      expect(isTokenExpiringSoon(undefined)).toBe(false);
    });
    
    it('should return false for token that expires far in the future', () => {
      const validToken = createTestToken(3600); // Expires in 1 hour
      expect(isTokenExpiringSoon(validToken, 5)).toBe(false);
    });
    
    it('should return true for token that expires soon', () => {
      const expiringToken = createTestToken(240); // Expires in 4 minutes
      expect(isTokenExpiringSoon(expiringToken, 5)).toBe(true);
    });
  });
  
  describe('getTokenExpirationTime', () => {
    it('should return null for undefined token', () => {
      expect(getTokenExpirationTime(undefined)).toBeNull();
    });
    
    it('should return correct expiration time for valid token', () => {
      const now = Math.floor(Date.now() / 1000);
      const expiresInSeconds = 3600;
      const validToken = createTestToken(expiresInSeconds);
      
      const expectedExpirationTime = (now + expiresInSeconds) * 1000;
      expect(getTokenExpirationTime(validToken)).toBe(expectedExpirationTime);
    });
  });
  
  describe('getTokenRemainingTime', () => {
    it('should return null for undefined token', () => {
      expect(getTokenRemainingTime(undefined)).toBeNull();
    });
    
    it('should return correct remaining time for valid token', () => {
      const expiresInSeconds = 3600;
      const validToken = createTestToken(expiresInSeconds);
      
      const expectedRemainingTime = expiresInSeconds * 1000;
      expect(getTokenRemainingTime(validToken)).toBe(expectedRemainingTime);
    });
    
    it('should return 0 for expired token', () => {
      const expiredToken = createTestToken(-60); // Expired 1 minute ago
      expect(getTokenRemainingTime(expiredToken)).toBe(0);
    });
  });
  
  describe('getUserIdFromToken', () => {
    it('should return null for undefined token', () => {
      expect(getUserIdFromToken(undefined)).toBeNull();
    });
    
    it('should return correct user ID for valid token', () => {
      const userId = 'test-user-123';
      const validToken = createTestToken(3600, userId);
      
      expect(getUserIdFromToken(validToken)).toBe(userId);
    });
  });
  
  describe('securelyStoreToken, getStoredToken, removeStoredToken', () => {
    it('should store and retrieve token from session storage', () => {
      const token = 'test-token';
      securelyStoreToken(token);
      
      expect(mockSessionStorage.setItem).toHaveBeenCalledWith('auth_token', token);
      expect(getStoredToken()).toBe(token);
    });
    
    it('should remove token from session storage', () => {
      const token = 'test-token';
      securelyStoreToken(token);
      removeStoredToken();
      
      expect(mockSessionStorage.removeItem).toHaveBeenCalledWith('auth_token');
      expect(getStoredToken()).toBeNull();
    });
  });
});
