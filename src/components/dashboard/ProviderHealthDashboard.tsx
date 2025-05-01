import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  CircularProgress,
  Alert,
  Typography,
  Button,
  Paper,
  Chip,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  HelpOutline as UnknownIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { useApiProviders } from '../../contexts/ApiProviderContext';
import { checkAllProvidersHealth, getProvidersHealth } from '../../services/providerHealthService';
import { ApiProviderHealth } from '../../types/api';

const ProviderHealthDashboard: React.FC = () => {
  const { providers } = useApiProviders();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [healthData, setHealthData] = useState<Record<string, ApiProviderHealth>>({});

  // Load initial health data with timeout protection
  useEffect(() => {
    const loadHealthData = async () => {
      setLoading(true);
      setError(null);

      // Create a timeout promise to prevent endless loading
      const timeout = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error('Health data request timed out after 10 seconds'));
        }, 10000); // 10 second timeout
      });

      try {
        // Race the API call against the timeout
        const data = await Promise.race([
          getProvidersHealth(),
          timeout
        ]);

        setHealthData(data);
      } catch (err) {
        console.error('Error loading health data:', err);

        // Provide more specific error messages
        if (err instanceof Error && err.message.includes('timed out')) {
          setError('Request timed out. Please try again later.');
        } else {
          setError(err instanceof Error ? err.message : 'Failed to load health data');
        }

        // Set empty data to prevent UI from breaking
        setHealthData({});
      } finally {
        // Ensure loading state is always reset
        setLoading(false);
      }
    };

    loadHealthData();
    // This effect doesn't have dependencies as it should only run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Refresh health data with timeout protection
  const handleRefresh = React.useCallback(async () => {
    setRefreshing(true);
    setError(null);

    // Create a timeout promise to prevent endless loading
    const timeout = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new Error('Health check request timed out after 15 seconds'));
      }, 15000); // 15 second timeout for health checks
    });

    try {
      // Race the API call against the timeout
      const data = await Promise.race([
        checkAllProvidersHealth(providers),
        timeout
      ]);

      setHealthData(data);
    } catch (err) {
      console.error('Error refreshing health data:', err);

      // Provide more specific error messages
      if (err instanceof Error && err.message.includes('timed out')) {
        setError('Request timed out. Please try again later.');
      } else {
        setError(err instanceof Error ? err.message : 'Failed to refresh health data');
      }

      // Keep existing data to prevent UI from breaking
      // Don't clear healthData here to preserve the previous state
    } finally {
      setRefreshing(false);
    }
  }, [providers]);

  // Get status icon based on health status
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational':
        return <CheckCircleIcon sx={{ color: 'success.main' }} />;
      case 'degraded':
        return <WarningIcon sx={{ color: 'warning.main' }} />;
      case 'outage':
        return <ErrorIcon sx={{ color: 'error.main' }} />;
      default:
        return <UnknownIcon sx={{ color: 'text.secondary' }} />;
    }
  };

  // Get status color based on health status
  const getStatusColor = (status: string): 'success' | 'warning' | 'error' | 'default' => {
    switch (status) {
      case 'operational':
        return 'success';
      case 'degraded':
        return 'warning';
      case 'outage':
        return 'error';
      default:
        return 'default';
    }
  };

  // Format date string
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString();
// eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      return 'Invalid date';
    }
  };

  // Format response time
  const formatResponseTime = (time?: number) => {
    if (!time) return 'N/A';
    return `${time} ms`;
  };

  // Get overall system status
  const getOverallStatus = (): 'operational' | 'degraded' | 'outage' | 'unknown' => {
    const statuses = Object.values(healthData).map(h => h.status);

    if (statuses.length === 0) return 'unknown';
    if (statuses.includes('outage')) return 'outage';
    if (statuses.includes('degraded')) return 'degraded';
    if (statuses.every(s => s === 'operational')) return 'operational';

    return 'degraded';
  };

  // Get overall status text
  const getOverallStatusText = (): string => {
    const status = getOverallStatus();

    switch (status) {
      case 'operational':
        return 'All Systems Operational';
      case 'degraded':
        return 'Some Systems Degraded';
      case 'outage':
        return 'System Outage Detected';
      default:
        return 'System Status Unknown';
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h2">
          API Provider Health Status
        </Typography>
        <Button
          variant="outlined"
          startIcon={refreshing ? <CircularProgress size={20} /> : <RefreshIcon />}
          onClick={handleRefresh}
          disabled={refreshing}
        >
          Refresh Status
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Overall Status Card */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: 2, background: 'rgba(30, 30, 30, 0.7)', backdropFilter: 'blur(10px)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
          <Chip
            label={getOverallStatusText()}
            color={getStatusColor(getOverallStatus())}
            icon={getStatusIcon(getOverallStatus())}
            sx={{ fontSize: '1.2rem', py: 2, px: 1 }}
          />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Last checked: {loading ? 'Loading...' : Object.values(healthData)[0]?.lastChecked ?
              formatDate(Object.values(healthData)[0]?.lastChecked) : 'Never'}
          </Typography>
        </Box>
      </Paper>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Provider Status Grid */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {providers.map(provider => {
              const health = healthData[provider.id];
              return (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={provider.id}>
                  <Paper sx={{ p: 2, height: '100%', borderRadius: 2, background: 'rgba(30, 30, 30, 0.7)', backdropFilter: 'blur(10px)' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box sx={{ mr: 1 }}>
                        {health ? getStatusIcon(health.status) : <UnknownIcon sx={{ color: 'text.secondary' }} />}
                      </Box>
                      <Typography variant="h6">{provider.name}</Typography>
                    </Box>
                    <Box sx={{ mb: 1 }}>
                      <Chip
                        label={health?.status || 'unknown'}
                        size="small"
                        color={health ? getStatusColor(health.status) : 'default'}
                        sx={{ textTransform: 'capitalize' }}
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Response Time: {health ? formatResponseTime(health.responseTime) : 'N/A'}
                    </Typography>
                    {health?.errorMessage && (
                      <Typography variant="body2" color="error" sx={{ mb: 1 }}>
                        Error: {health.errorMessage}
                      </Typography>
                    )}
                    <Typography variant="body2" color="text.secondary">
                      Last Checked: {health ? formatDate(health.lastChecked) : 'Never'}
                    </Typography>
                  </Paper>
                </Grid>
              );
            })}
          </Grid>

          {/* Detailed Status Table */}
          <Paper sx={{ width: '100%', overflow: 'hidden', mb: 4 }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Provider</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Response Time</TableCell>
                    <TableCell>Last Checked</TableCell>
                    <TableCell>Error Message</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {providers.map(provider => {
                    const health = healthData[provider.id];
                    return (
                      <TableRow key={provider.id}>
                        <TableCell>{provider.name}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {health ? getStatusIcon(health.status) : <UnknownIcon sx={{ color: 'text.secondary' }} />}
                            <Typography sx={{ ml: 1, textTransform: 'capitalize' }}>
                              {health?.status || 'unknown'}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{health ? formatResponseTime(health.responseTime) : 'N/A'}</TableCell>
                        <TableCell>{health ? formatDate(health.lastChecked) : 'Never'}</TableCell>
                        <TableCell>{health?.errorMessage || 'None'}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </>
      )}
    </Box>
  );
};

export default ProviderHealthDashboard;
