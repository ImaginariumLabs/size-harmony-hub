import React from 'react';
import ProtectedRoute from './ProtectedRoute';

interface AdminRouteProps {
  children: React.ReactNode;
}

/**
 * A specialized route component for admin-only pages
 * - Requires admin role
 * - Only available in web mode (not in Electron)
 * 
 * @param children The components to render if access is granted
 */
const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  return (
    <ProtectedRoute requireAdmin webOnly>
      {children}
    </ProtectedRoute>
  );
};

export default AdminRoute;
