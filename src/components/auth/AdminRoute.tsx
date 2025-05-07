import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useAdminAccess } from '../../hooks/useAdminAccess';
import { environment } from '../../utils/environment';
import LoadingOverlay from '../common/LoadingOverlay';
import { Box, Typography } from '@mui/material';

interface AdminRouteProps {
  children: React.ReactNode;
  /**
   * Optional loading message to display
   */
  loadingMessage?: string;
  /**
   * Optional type of loading indicator to display
   */
  loadingType?: 'circular' | 'linear' | 'backdrop' | 'skeleton';
}

/**
 * AdminRoute component
 *
 * This component protects routes that should only be accessible to admin users
 * and only in the web platform (not in the Electron app).
 * It also shows a loading state while checking authentication and admin access.
 */
const AdminRoute: React.FC<AdminRouteProps> = ({
  children,
  loadingMessage = 'Checking admin access...',
  loadingType = 'backdrop',
}) => {
  const { isAuthenticated, loading } = useAuth();
  const { canAccessAdminFeatures, loading: adminAccessLoading } = useAdminAccess();
  const isWeb = environment.isWeb();

  // Determine if we're still loading
  const isLoading = loading || adminAccessLoading;

  // Show loading state
  if (isLoading) {
    return (
      <Box
        sx={{
          width: '100%',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <LoadingOverlay isLoading={true} message={loadingMessage} type={loadingType}>
          <Typography variant="body1">{loadingMessage}</Typography>
        </LoadingOverlay>
      </Box>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if we're in development mode
  const isDevelopment = environment.isDevelopment();

  // In development mode, we'll show a warning but still allow access
  if (!canAccessAdminFeatures) {
    if (isDevelopment) {
      console.warn(
        '⚠️ Development mode: Allowing access to admin route despite access restrictions'
      );
      // Continue to render the protected route
    } else {
      // In production, redirect to home if not an admin
      return <Navigate to="/" replace />;
    }
  }

  // In production, also check if we're on the web platform
  if (!isDevelopment && !isWeb) {
    console.warn('Admin routes are only available on the web platform');
    return <Navigate to="/" replace />;
  }

  // Render the protected route
  return <>{children}</>;
};

export default AdminRoute;
