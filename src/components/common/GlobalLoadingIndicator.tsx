import React, { useState, useEffect } from 'react';
import { Box, CircularProgress, Typography, LinearProgress, Backdrop } from '@mui/material';
import { useLoading } from '../../contexts/LoadingContext';

interface GlobalLoadingIndicatorProps {
  /**
   * The timeout in milliseconds after which the loading indicator will be hidden
   * regardless of the isLoading prop. This prevents endless loading states.
   */
  timeout?: number;
}

/**
 * A global loading indicator component that can be used to show loading states
 * across the application. It includes timeout protection to prevent endless loading.
 *
 * This component uses the LoadingContext to manage its state, so it can be controlled
 * from anywhere in the application.
 *
 * This is part of the Phase 2 implementation to improve loading state management.
 */
const GlobalLoadingIndicator: React.FC<GlobalLoadingIndicatorProps> = ({
  timeout = 30000 // 30 seconds default timeout
}) => {
  const { isLoading, message, type } = useLoading();
  const [visible, setVisible] = useState<boolean>(isLoading);
  const [timeoutReached, setTimeoutReached] = useState<boolean>(false);

  // Handle visibility based on isLoading prop
  useEffect(() => {
    setVisible(isLoading);

    // Reset timeout state when loading starts
    if (isLoading) {
      setTimeoutReached(false);
    }
  }, [isLoading]);

  // Handle timeout
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (isLoading && timeout > 0) {
      timeoutId = setTimeout(() => {
        setVisible(false);
        setTimeoutReached(true);
        console.warn(`Loading indicator timed out after ${timeout}ms`);
      }, timeout);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isLoading, timeout]);

  // If not loading or timeout reached, don't render anything
  if (!visible) {
    return null;
  }

  // Render different types of loading indicators
  switch (type) {
    case 'linear':
      return (
        <Box sx={{ width: '100%', position: 'fixed', top: 0, left: 0, zIndex: 9999 }}>
          <LinearProgress color="primary" />
          {message && (
            <Typography
              variant="body2"
              sx={{
                position: 'fixed',
                top: 8,
                left: '50%',
                transform: 'translateX(-50%)',
                bgcolor: 'background.paper',
                px: 2,
                py: 0.5,
                borderRadius: 1,
                boxShadow: 1
              }}
            >
              {message}
            </Typography>
          )}
        </Box>
      );

    case 'backdrop':
      return (
        <Backdrop
          sx={{
            color: '#fff',
            zIndex: (theme) => theme.zIndex.drawer + 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 2
          }}
          open={visible}
        >
          <CircularProgress color="inherit" />
          {message && <Typography variant="body1">{message}</Typography>}
        </Backdrop>
      );

    case 'circular':
    default:
      return (
        <Box
          sx={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            p: 3,
            borderRadius: 2,
            bgcolor: 'background.paper',
            boxShadow: 3,
            zIndex: 9999
          }}
        >
          <CircularProgress />
          {message && <Typography variant="body1">{message}</Typography>}
        </Box>
      );
  }
};

export default GlobalLoadingIndicator;
