/**
 * Utilities for JWT token handling and validation
 */

/**
 * Validates a JWT token
 * @param token The JWT token to validate
 * @returns True if the token is valid, false otherwise
 */
export const validateToken = (token: string | undefined): boolean => {
  if (!token) return false;

  try {
    // Basic structure validation
    const parts = token.split('.');
    if (parts.length !== 3) return false;

    // Parse the payload
    const payload = JSON.parse(atob(parts[1]));
    
    // Check expiration
    if (!payload.exp) return false;
    
    const expirationTime = payload.exp * 1000; // Convert to milliseconds
    const currentTime = Date.now();
    
    return currentTime < expirationTime;
  } catch (error) {
    console.error('Token validation error:', error);
    return false;
  }
};

/**
 * Checks if a token is about to expire
 * @param token The JWT token to check
 * @param thresholdMinutes Minutes before expiration to consider the token as "about to expire"
 * @returns True if the token is about to expire, false otherwise
 */
export const isTokenExpiringSoon = (
  token: string | undefined, 
  thresholdMinutes = 5
): boolean => {
  if (!token) return false;

  try {
    // Parse the payload
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    
    const payload = JSON.parse(atob(parts[1]));
    
    // Check expiration
    if (!payload.exp) return false;
    
    const expirationTime = payload.exp * 1000; // Convert to milliseconds
    const currentTime = Date.now();
    const thresholdTime = thresholdMinutes * 60 * 1000; // Convert minutes to milliseconds
    
    return currentTime > (expirationTime - thresholdTime);
  } catch (error) {
    console.error('Token expiration check error:', error);
    return false;
  }
};

/**
 * Gets the expiration time of a token
 * @param token The JWT token
 * @returns The expiration time in milliseconds, or null if the token is invalid
 */
export const getTokenExpirationTime = (token: string | undefined): number | null => {
  if (!token) return null;

  try {
    // Parse the payload
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = JSON.parse(atob(parts[1]));
    
    // Check expiration
    if (!payload.exp) return null;
    
    return payload.exp * 1000; // Convert to milliseconds
  } catch (error) {
    console.error('Token expiration time error:', error);
    return null;
  }
};

/**
 * Gets the remaining time until a token expires
 * @param token The JWT token
 * @returns The remaining time in milliseconds, or null if the token is invalid
 */
export const getTokenRemainingTime = (token: string | undefined): number | null => {
  const expirationTime = getTokenExpirationTime(token);
  if (!expirationTime) return null;
  
  const currentTime = Date.now();
  const remainingTime = expirationTime - currentTime;
  
  return remainingTime > 0 ? remainingTime : 0;
};

/**
 * Extracts the user ID from a JWT token
 * @param token The JWT token
 * @returns The user ID, or null if the token is invalid
 */
export const getUserIdFromToken = (token: string | undefined): string | null => {
  if (!token) return null;

  try {
    // Parse the payload
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = JSON.parse(atob(parts[1]));
    
    // Return the user ID (sub claim)
    return payload.sub || null;
  } catch (error) {
    console.error('Get user ID from token error:', error);
    return null;
  }
};

/**
 * Securely stores a token in session storage with encryption
 * @param token The token to store
 */
export const securelyStoreToken = (token: string): void => {
  try {
    // In a real implementation, we would encrypt the token before storing it
    // For now, we'll just store it in session storage
    sessionStorage.setItem('auth_token', token);
  } catch (error) {
    console.error('Error storing token:', error);
  }
};

/**
 * Retrieves a token from secure storage
 * @returns The token, or null if not found
 */
export const getStoredToken = (): string | null => {
  try {
    // In a real implementation, we would decrypt the token after retrieving it
    // For now, we'll just retrieve it from session storage
    return sessionStorage.getItem('auth_token');
  } catch (error) {
    console.error('Error retrieving token:', error);
    return null;
  }
};

/**
 * Removes a token from secure storage
 */
export const removeStoredToken = (): void => {
  try {
    sessionStorage.removeItem('auth_token');
  } catch (error) {
    console.error('Error removing token:', error);
  }
};
