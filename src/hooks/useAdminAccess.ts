/**
 * useAdminAccess.ts
 * Custom hook for checking if a user has admin access
 */
import { UserRole } from '../utils/authUtils';
import { environment } from '../utils/environment';
import { useAuth } from './useAuth';

/**
 * Custom hook to check if a user can access admin features
 * @returns Object with isAdmin and canAccessAdminFeatures flags
 */
export function useAdminAccess() {
  const { user } = useAuth();

  // Use the environment utility directly instead of the deprecated service
  // Force a fresh check to ensure we get the correct platform
  const isWebPlatform = environment.isWeb(true);

  // For development purposes, allow admin access regardless of platform
  const isDevelopment = environment.isDevelopment();

  return {
    // Check if the user is an admin
    isAdmin: user?.role === UserRole.ADMIN,

    // Check if the user can access admin features:
    // - In development: allow admin access regardless of platform and role
    // - In production: require admin role + web platform
    canAccessAdminFeatures: isDevelopment || (user?.role === UserRole.ADMIN && isWebPlatform),
  };
}

export default useAdminAccess;
