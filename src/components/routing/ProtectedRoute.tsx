import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth, useAdminAccess } from '../../contexts/MockAuthContext';
import { isPlatform } from '../../utils/platformUtils';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  webOnly?: boolean;
}

/**
 * A component that protects routes based on authentication and role requirements
 * 
 * @param children The components to render if access is granted
 * @param requireAdmin Whether the route requires admin access
 * @param webOnly Whether the route is only available in web mode
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false,
  webOnly = false
}) => {
  const { user, isAuthenticated, loading } = useAuth();
  const { isAdmin } = useAdminAccess();
  const isWeb = isPlatform.web();

  // Show loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // Check authentication
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Check admin access if required
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Check platform restrictions
  if (webOnly && !isWeb) {
    return <Navigate to="/" replace />;
  }

  // All checks passed, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
