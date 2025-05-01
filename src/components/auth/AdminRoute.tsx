import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useAdminAccess } from '../../contexts/AuthContext';
import { isPlatform } from '../../utils/platformUtils';

interface AdminRouteProps {
  children: React.ReactNode;
}

/**
 * AdminRoute component
 * 
 * This component protects routes that should only be accessible to admin users
 * and only in the web platform (not in the Electron app).
 */
const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const { canAccessAdminFeatures } = useAdminAccess();
  const isWeb = isPlatform.web();

  // Show loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to home if not an admin or not on web platform
  if (!canAccessAdminFeatures || !isWeb) {
    return <Navigate to="/" replace />;
  }

  // Render the protected route
  return <>{children}</>;
};

export default AdminRoute;
