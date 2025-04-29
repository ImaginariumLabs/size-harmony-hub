import { User } from '../types/auth';

/**
 * User roles in the application
 */
export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  USER = 'user',
  VIEWER = 'viewer'
}

/**
 * Check if a user has a specific role
 * @param user The user object
 * @param role The role to check
 * @returns {boolean} True if the user has the specified role
 */
export const hasRole = (user: User | null, role: UserRole): boolean => {
  if (!user) return false;
  return user.role === role;
};

/**
 * Check if a user has admin privileges
 * @param user The user object
 * @returns {boolean} True if the user is an admin
 */
export const isAdmin = (user: User | null): boolean => {
  return hasRole(user, UserRole.ADMIN);
};

/**
 * Check if a user has manager privileges
 * @param user The user object
 * @returns {boolean} True if the user is a manager
 */
export const isManager = (user: User | null): boolean => {
  return hasRole(user, UserRole.MANAGER) || isAdmin(user);
};

/**
 * Check if a user can access admin features
 * This combines platform checks with role checks
 * @param user The user object
 * @param isWebPlatform Whether the app is running in web mode
 * @returns {boolean} True if the user can access admin features
 */
export const canAccessAdminFeatures = (user: User | null, isWebPlatform: boolean): boolean => {
  return isWebPlatform && isAdmin(user);
};
