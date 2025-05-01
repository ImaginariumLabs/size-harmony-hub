/**
 * Authentication utilities for the APIwidget application
 */

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
 * Check if a user has admin privileges
 * @param role The user's role
 * @returns True if the user is an admin
 */
export const isAdmin = (role?: string): boolean => {
  return role === UserRole.ADMIN;
};

/**
 * Check if a user has manager privileges or higher
 * @param role The user's role
 * @returns True if the user is a manager or admin
 */
export const isManagerOrHigher = (role?: string): boolean => {
  return role === UserRole.ADMIN || role === UserRole.MANAGER;
};

/**
 * Check if a user has regular user privileges or higher
 * @param role The user's role
 * @returns True if the user is a user, manager, or admin
 */
export const isUserOrHigher = (role?: string): boolean => {
  return role === UserRole.ADMIN || role === UserRole.MANAGER || role === UserRole.USER;
};

/**
 * Get the display name for a role
 * @param role The user's role
 * @returns The display name for the role
 */
export const getRoleDisplayName = (role?: string): string => {
  switch (role) {
    case UserRole.ADMIN:
      return 'Administrator';
    case UserRole.MANAGER:
      return 'Manager';
    case UserRole.USER:
      return 'User';
    case UserRole.VIEWER:
      return 'Viewer';
    default:
      return 'Unknown';
  }
};

/**
 * Get the available roles for user assignment
 * @param currentUserRole The current user's role
 * @returns Array of roles that can be assigned
 */
export const getAvailableRoles = (currentUserRole?: string): UserRole[] => {
  // Admins can assign any role
  if (currentUserRole === UserRole.ADMIN) {
    return [UserRole.ADMIN, UserRole.MANAGER, UserRole.USER, UserRole.VIEWER];
  }

  // Managers can assign user and viewer roles
  if (currentUserRole === UserRole.MANAGER) {
    return [UserRole.USER, UserRole.VIEWER];
  }

  // Others can't assign roles
  return [];
};
