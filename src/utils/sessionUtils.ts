/**
 * Utilities for session management
 */
import { Session } from '@supabase/supabase-js';
import supabase from '../services/supabaseClient';
import { getTokenRemainingTime, isTokenExpiringSoon } from './tokenUtils';

// Default session timeout in minutes
const DEFAULT_SESSION_TIMEOUT = 60; // 1 hour

// Default session refresh threshold in minutes
const DEFAULT_REFRESH_THRESHOLD = 5; // 5 minutes

/**
 * Checks if a session is valid
 * @param session The session to check
 * @returns True if the session is valid, false otherwise
 */
export const isSessionValid = (session: Session | null): boolean => {
  if (!session) return false;
  
  // Check if the session has an access token
  if (!session.access_token) return false;
  
  // Check if the access token is valid and not expired
  const remainingTime = getTokenRemainingTime(session.access_token);
  return remainingTime !== null && remainingTime > 0;
};

/**
 * Checks if a session needs to be refreshed
 * @param session The session to check
 * @param thresholdMinutes Minutes before expiration to consider the session as needing refresh
 * @returns True if the session needs to be refreshed, false otherwise
 */
export const shouldRefreshSession = (
  session: Session | null, 
  thresholdMinutes = DEFAULT_REFRESH_THRESHOLD
): boolean => {
  if (!session) return false;
  
  // Check if the session has an access token
  if (!session.access_token) return false;
  
  // Check if the access token is about to expire
  return isTokenExpiringSoon(session.access_token, thresholdMinutes);
};

/**
 * Refreshes a session
 * @returns A promise that resolves to the refreshed session, or null if refresh failed
 */
export const refreshSession = async (): Promise<Session | null> => {
  try {
    const { data, error } = await supabase.auth.refreshSession();
    
    if (error) {
      console.error('Session refresh error:', error);
      return null;
    }
    
    return data.session;
  } catch (error) {
    console.error('Unexpected error during session refresh:', error);
    return null;
  }
};

/**
 * Sets up automatic session refresh
 * @param onRefresh Callback function to call when the session is refreshed
 * @param onError Callback function to call when an error occurs
 * @param refreshThresholdMinutes Minutes before expiration to refresh the session
 * @returns A function to clear the refresh interval
 */
export const setupSessionRefresh = (
  onRefresh: (session: Session) => void,
  onError: (error: Error) => void,
  refreshThresholdMinutes = DEFAULT_REFRESH_THRESHOLD
): () => void => {
  // Check session every minute
  const intervalId = setInterval(async () => {
    try {
      // Get the current session
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        onError(error);
        return;
      }
      
      const session = data.session;
      
      // If there's no session or it doesn't need to be refreshed, do nothing
      if (!session || !shouldRefreshSession(session, refreshThresholdMinutes)) {
        return;
      }
      
      // Refresh the session
      const refreshedSession = await refreshSession();
      
      if (refreshedSession) {
        onRefresh(refreshedSession);
      }
    } catch (error) {
      onError(error instanceof Error ? error : new Error(String(error)));
    }
  }, 60000); // Check every minute
  
  // Return a function to clear the interval
  return () => clearInterval(intervalId);
};

/**
 * Sets up session timeout
 * @param onTimeout Callback function to call when the session times out
 * @param timeoutMinutes Minutes of inactivity before timing out
 * @returns A function to clear the timeout
 */
export const setupSessionTimeout = (
  onTimeout: () => void,
  timeoutMinutes = DEFAULT_SESSION_TIMEOUT
): () => void => {
  let timeoutId: number | undefined;
  
  // Function to reset the timeout
  const resetTimeout = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    timeoutId = window.setTimeout(() => {
      onTimeout();
    }, timeoutMinutes * 60 * 1000);
  };
  
  // Reset the timeout on user activity
  const activityEvents = ['mousedown', 'keypress', 'scroll', 'touchstart'];
  
  // Add event listeners
  activityEvents.forEach(event => {
    window.addEventListener(event, resetTimeout);
  });
  
  // Initial timeout
  resetTimeout();
  
  // Return a function to clear the timeout and remove event listeners
  return () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    activityEvents.forEach(event => {
      window.removeEventListener(event, resetTimeout);
    });
  };
};
