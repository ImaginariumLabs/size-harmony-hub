import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Button, Paper, Grid } from '@mui/material';
import { withTimeout, createDelayedPromise, createRejectedPromise } from '../utils/timeoutUtils';

// Mock API call that simulates a slow response
const mockApiCall = () => {
  return createDelayedPromise({ data: 'This should not be returned due to timeout' }, 10000);
};

// Mock API call that simulates an error
const mockErrorApiCall = () => {
  return createRejectedPromise('API error occurred', 2000);
};

const ComponentTest: React.FC = () => {
  const [timeoutData, setTimeoutData] = useState<string | null>(null);
  const [errorData, setErrorData] = useState<string | null>(null);
  const [timeoutLoading, setTimeoutLoading] = useState<boolean>(false);
  const [errorLoading, setErrorLoading] = useState<boolean>(false);
  const [timeoutError, setTimeoutError] = useState<string | null>(null);
  const [errorHandlingError, setErrorHandlingError] = useState<string | null>(null);

  // Test timeout protection
  const testTimeoutProtection = async () => {
    setTimeoutLoading(true);
    setTimeoutError(null);
    setTimeoutData(null);

    try {
      // Use our timeout protection
      const result = await withTimeout(
        mockApiCall(),
        5000, // 5 second timeout
        { data: 'Fallback data (timeout occurred)' }
      );

      setTimeoutData(result.data);
    } catch (err) {
      setTimeoutError(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setTimeoutLoading(false);
    }
  };

  // Test error handling
  const testErrorHandling = async () => {
    setErrorLoading(true);
    setErrorHandlingError(null);
    setErrorData(null);

    try {
      // Use our timeout protection with an API call that will fail
      const result = await withTimeout(
        mockErrorApiCall(),
        5000, // 5 second timeout
        { data: 'Fallback data (error occurred)' }
      );

      setErrorData(result.data);
    } catch (err) {
      setErrorHandlingError(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setErrorLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 3, m: 3, maxWidth: 800 }}>
      <Typography variant="h5" gutterBottom>
        Timeout Protection Tests
      </Typography>

      <Grid container spacing={3}>
        {/* Timeout Test */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Test 1: Timeout Protection
            </Typography>

            <Box sx={{ my: 2 }}>
              <Button
                variant="contained"
                onClick={testTimeoutProtection}
                disabled={timeoutLoading}
                color="primary"
              >
                Test Timeout Protection
              </Button>
            </Box>

            {timeoutLoading && (
              <Box sx={{ display: 'flex', alignItems: 'center', my: 2 }}>
                <CircularProgress size={24} sx={{ mr: 1 }} />
                <Typography>Loading data (should timeout after 5 seconds)...</Typography>
              </Box>
            )}

            {timeoutData && !timeoutLoading && (
              <Box sx={{ my: 2, p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
                <Typography>Result: {timeoutData}</Typography>
              </Box>
            )}

            {timeoutError && !timeoutLoading && (
              <Box sx={{ my: 2, p: 2, bgcolor: 'error.light', borderRadius: 1 }}>
                <Typography>{timeoutError}</Typography>
              </Box>
            )}

            <Typography variant="body2" sx={{ mt: 2 }}>
              This test simulates an API call that takes 10 seconds to complete.
              Our timeout protection should trigger after 5 seconds and use the fallback data.
            </Typography>
          </Paper>
        </Grid>

        {/* Error Handling Test */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Test 2: Error Handling
            </Typography>

            <Box sx={{ my: 2 }}>
              <Button
                variant="contained"
                onClick={testErrorHandling}
                disabled={errorLoading}
                color="secondary"
              >
                Test Error Handling
              </Button>
            </Box>

            {errorLoading && (
              <Box sx={{ display: 'flex', alignItems: 'center', my: 2 }}>
                <CircularProgress size={24} sx={{ mr: 1 }} />
                <Typography>Loading data (should fail after 2 seconds)...</Typography>
              </Box>
            )}

            {errorData && !errorLoading && (
              <Box sx={{ my: 2, p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
                <Typography>Result: {errorData}</Typography>
              </Box>
            )}

            {errorHandlingError && !errorLoading && (
              <Box sx={{ my: 2, p: 2, bgcolor: 'error.light', borderRadius: 1 }}>
                <Typography>{errorHandlingError}</Typography>
              </Box>
            )}

            <Typography variant="body2" sx={{ mt: 2 }}>
              This test simulates an API call that fails after 2 seconds.
              Our error handling should catch the error and use the fallback data.
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Typography variant="body1" fontWeight="bold">
          What to expect:
        </Typography>
        <Typography variant="body2">
          1. The timeout test should show "Fallback data (timeout occurred)" after 5 seconds.
        </Typography>
        <Typography variant="body2">
          2. The error handling test should show "Fallback data (error occurred)" after the API call fails.
        </Typography>
        <Typography variant="body2">
          3. Both tests should properly reset loading states and not get stuck in endless loading.
        </Typography>
      </Box>
    </Paper>
  );
};

export default ComponentTest;
