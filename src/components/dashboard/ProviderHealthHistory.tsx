import React, { useState, useEffect } from 'react';
import { Box, Grid, CircularProgress, Alert, SelectChangeEvent, useTheme,  } from '@mui/material';
import {
// eslint-disable-next-line @typescript-eslint/no-unused-vars
  CheckCircle as CheckCircleIcon,
// eslint-disable-next-line @typescript-eslint/no-unused-vars
  Warning as WarningIcon,
// eslint-disable-next-line @typescript-eslint/no-unused-vars
  Error as ErrorIcon,
// eslint-disable-next-line @typescript-eslint/no-unused-vars
  HelpOutline as UnknownIcon,
  Refresh as RefreshIcon,
  Timeline as TimelineIcon,
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell,  } from 'recharts';
import { useApiProviders } from '../../contexts/ApiProviderContext';
import { getProviderHealthHistory } from '../../services/providerHealthHistoryService';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ApiProviderHealth, ApiProviderHealthHistory } from '../../types/api';

interface ProviderHealthHistoryProps {
  providerId?: string;
}

const ProviderHealthHistory: React.FC<ProviderHealthHistoryProps> = ({ providerId }) => {
  const theme = useTheme();
  const { providers } = useApiProviders();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<string>(providerId || '');
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('week');
  const [healthHistory, setHealthHistory] = useState<ApiProviderHealthHistory[]>([]);
  
  // Load health history data
  useEffect(() => {
    if (selectedProvider) {
      loadHealthHistory(selectedProvider, timeRange);
    } else if (providers.length > 0) {
      setSelectedProvider(providers[0].id);
    }
  }, [selectedProvider, timeRange, providers]);
  
  const loadHealthHistory = async (providerId: string, range: 'day' | 'week' | 'month') => {
    setLoading(true);
    setError(null);
    
    try {
      const history = await getProviderHealthHistory(providerId, range);
      setHealthHistory(history);
    } catch (err) {
      console.error('Error loading health history:', err);
      setError(err instanceof Error ? err.message : 'Failed to load health history');
    } finally {
      setLoading(false);
    }
  };
  
  const handleProviderChange = (event: SelectChangeEvent) => {
    setSelectedProvider(event.target.value);
  };
  
  const handleTimeRangeChange = (event: SelectChangeEvent) => {
    setTimeRange(event.target.value as 'day' | 'week' | 'month');
  };
  
  const handleRefresh = () => {
    if (selectedProvider) {
      loadHealthHistory(selectedProvider, timeRange);
    }
  };
  
  // Calculate metrics
  const calculateMetrics = () => {
    if (healthHistory.length === 0) {
      return {
        uptime: 0,
        avgResponseTime: 0,
        successRate: 0,
        errorCounts: {},
        statusDistribution: {
          operational: 0,
          degraded: 0,
          outage: 0,
          unknown: 0,
        },
      };
    }
    
    // Calculate uptime percentage
    const totalChecks = healthHistory.length;
    const operationalChecks = healthHistory.filter(h => h.status === 'operational').length;
    const uptime = (operationalChecks / totalChecks) * 100;
    
    // Calculate average response time
    const totalResponseTime = healthHistory.reduce((sum, h) => sum + (h.responseTime || 0), 0);
    const avgResponseTime = totalResponseTime / totalChecks;
    
    // Calculate success rate
    const totalSuccessRate = healthHistory.reduce((sum, h) => sum + (h.successRate || 0), 0);
    const successRate = totalSuccessRate / totalChecks;
    
    // Count errors by type
    const errorCounts: Record<string, number> = {};
    healthHistory.forEach(h => {
      if (h.errorMessage) {
        const errorType = h.errorMessage.includes('Rate limited') 
          ? 'Rate Limited' 
          : h.errorMessage.includes('HTTP 5') 
            ? 'Server Error' 
            : h.errorMessage.includes('HTTP 4') 
              ? 'Client Error' 
              : 'Other Error';
        
        errorCounts[errorType] = (errorCounts[errorType] || 0) + 1;
      }
    });
    
    // Count status distribution
    const statusDistribution = {
      operational: healthHistory.filter(h => h.status === 'operational').length,
      degraded: healthHistory.filter(h => h.status === 'degraded').length,
      outage: healthHistory.filter(h => h.status === 'outage').length,
      unknown: healthHistory.filter(h => h.status === 'unknown').length,
    };
    
    return {
      uptime,
      avgResponseTime,
      successRate,
      errorCounts,
      statusDistribution,
    };
  };
  
  const metrics = calculateMetrics();
  
  // Prepare chart data
  const prepareResponseTimeData = () => {
    return healthHistory.map(h => ({
      timestamp: new Date(h.lastChecked).toISOString(),
      responseTime: h.responseTime || 0,
    }));
  };
  
  const prepareSuccessRateData = () => {
    return healthHistory.map(h => ({
      timestamp: new Date(h.lastChecked).toISOString(),
      successRate: h.successRate || 0,
    }));
  };
  
  const prepareStatusDistributionData = () => {
    return [
      { name: 'Operational', value: metrics.statusDistribution.operational, color: theme.palette.success.main },
      { name: 'Degraded', value: metrics.statusDistribution.degraded, color: theme.palette.warning.main },
      { name: 'Outage', value: metrics.statusDistribution.outage, color: theme.palette.error.main },
      { name: 'Unknown', value: metrics.statusDistribution.unknown, color: theme.palette.grey[500] },
    ];
  };
  
  const prepareErrorCountsData = () => {
    return Object.entries(metrics.errorCounts).map(([name, value]) => ({
      name,
      value,
      color: name.includes('Rate Limited') 
        ? theme.palette.warning.main 
        : name.includes('Server Error') 
          ? theme.palette.error.main 
          : theme.palette.info.main,
    }));
  };
  
  // Format date for display
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  // Get provider name
// eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getProviderName = (id: string) => {
    const provider = providers.find(p => p.id === id);
    return provider ? provider.name : id;
  };
  
  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 2 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" component="h2" sx={{ display: 'flex', alignItems: 'center' }}>
          <TimelineIcon sx={{ mr: 1 }} />
          Provider Health History
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Provider</InputLabel>
            <Select
              value={selectedProvider}
              onChange={handleProviderChange}
              label="Provider"
              disabled={loading}
            >
              {providers.map(provider => (
                <MenuItem key={provider.id} value={provider.id}>
                  {provider.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Time Range</InputLabel>
            <Select
              value={timeRange}
              onChange={handleTimeRangeChange}
              label="Time Range"
              disabled={loading}
            >
              <MenuItem value="day">24 Hours</MenuItem>
              <MenuItem value="week">7 Days</MenuItem>
              <MenuItem value="month">30 Days</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="outlined"
            startIcon={loading ? <CircularProgress size={20} /> : <RefreshIcon />}
            onClick={handleRefresh}
            disabled={loading}
          >
            Refresh
          </Button>
        </Box>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Health Metrics Summary */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, height: '100%', borderRadius: 2, background: 'rgba(30, 30, 30, 0.7)', backdropFilter: 'blur(10px)' }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Uptime
                </Typography>
                <Typography variant="h4" sx={{ mb: 1 }}>
                  {metrics.uptime.toFixed(2)}%
                </Typography>
                <Chip
                  label={metrics.uptime > 99 ? 'Excellent' : metrics.uptime > 95 ? 'Good' : 'Poor'}
                  color={metrics.uptime > 99 ? 'success' : metrics.uptime > 95 ? 'warning' : 'error'}
                  size="small"
                />
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, height: '100%', borderRadius: 2, background: 'rgba(30, 30, 30, 0.7)', backdropFilter: 'blur(10px)' }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Avg Response Time
                </Typography>
                <Typography variant="h4" sx={{ mb: 1 }}>
                  {metrics.avgResponseTime.toFixed(0)} ms
                </Typography>
                <Chip
                  label={metrics.avgResponseTime < 200 ? 'Fast' : metrics.avgResponseTime < 500 ? 'Average' : 'Slow'}
                  color={metrics.avgResponseTime < 200 ? 'success' : metrics.avgResponseTime < 500 ? 'warning' : 'error'}
                  size="small"
                />
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, height: '100%', borderRadius: 2, background: 'rgba(30, 30, 30, 0.7)', backdropFilter: 'blur(10px)' }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Success Rate
                </Typography>
                <Typography variant="h4" sx={{ mb: 1 }}>
                  {metrics.successRate.toFixed(2)}%
                </Typography>
                <Chip
                  label={metrics.successRate > 99 ? 'Excellent' : metrics.successRate > 95 ? 'Good' : 'Poor'}
                  color={metrics.successRate > 99 ? 'success' : metrics.successRate > 95 ? 'warning' : 'error'}
                  size="small"
                />
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, height: '100%', borderRadius: 2, background: 'rgba(30, 30, 30, 0.7)', backdropFilter: 'blur(10px)' }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Status
                </Typography>
                <Typography variant="h4" sx={{ mb: 1 }}>
                  {healthHistory.length > 0 ? 
                    healthHistory[0].status.charAt(0).toUpperCase() + healthHistory[0].status.slice(1) : 
                    'Unknown'}
                </Typography>
                <Chip
                  label={healthHistory.length > 0 ? 
                    (healthHistory[0].status === 'operational' ? 'Healthy' : 
                     healthHistory[0].status === 'degraded' ? 'Degraded' : 
                     'Unhealthy') : 
                    'Unknown'}
                  color={healthHistory.length > 0 ? 
                    (healthHistory[0].status === 'operational' ? 'success' : 
                     healthHistory[0].status === 'degraded' ? 'warning' : 
                     'error') : 
                    'default'}
                  size="small"
                />
              </Paper>
            </Grid>
          </Grid>
          
          {/* Charts */}
          <Grid container spacing={3}>
            {/* Response Time Chart */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="Response Time History" />
                <Divider />
                <CardContent>
                  <Box sx={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={prepareResponseTimeData()}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="timestamp" 
                          tickFormatter={formatDate}
                          interval="preserveStartEnd"
                        />
                        <YAxis 
                          label={{ 
                            value: 'Response Time (ms)', 
                            angle: -90, 
                            position: 'insideLeft',
                            style: { textAnchor: 'middle' } 
                          }} 
                        />
                        <RechartsTooltip 
                          formatter={(value: number) => [`${value} ms`, 'Response Time']}
                          labelFormatter={formatDate}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="responseTime" 
                          stroke={theme.palette.primary.main} 
                          activeDot={{ r: 8 }} 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            {/* Success Rate Chart */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="Success Rate History" />
                <Divider />
                <CardContent>
                  <Box sx={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={prepareSuccessRateData()}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="timestamp" 
                          tickFormatter={formatDate}
                          interval="preserveStartEnd"
                        />
                        <YAxis 
                          domain={[0, 100]}
                          label={{ 
                            value: 'Success Rate (%)', 
                            angle: -90, 
                            position: 'insideLeft',
                            style: { textAnchor: 'middle' } 
                          }} 
                        />
                        <RechartsTooltip 
                          formatter={(value: number) => [`${value.toFixed(2)}%`, 'Success Rate']}
                          labelFormatter={formatDate}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="successRate" 
                          stroke={theme.palette.success.main} 
                          activeDot={{ r: 8 }} 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            {/* Status Distribution Chart */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="Status Distribution" />
                <Divider />
                <CardContent>
                  <Box sx={{ height: 300, display: 'flex', justifyContent: 'center' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={prepareStatusDistributionData()}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {prepareStatusDistributionData().map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <RechartsTooltip formatter={(value: number) => [`${value} checks`, '']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            {/* Error Distribution Chart */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="Error Distribution" />
                <Divider />
                <CardContent>
                  <Box sx={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={prepareErrorCountsData()}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis 
                          label={{ 
                            value: 'Error Count', 
                            angle: -90, 
                            position: 'insideLeft',
                            style: { textAnchor: 'middle' } 
                          }} 
                        />
                        <RechartsTooltip formatter={(value: number) => [`${value} occurrences`, '']} />
                        <Bar dataKey="value">
                          {prepareErrorCountsData().map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          
          {/* Incident History */}
          <Card sx={{ mt: 4 }}>
            <CardHeader title="Recent Incidents" />
            <Divider />
            <CardContent>
              {healthHistory.filter(h => h.status !== 'operational').length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                  No incidents recorded in the selected time period
                </Typography>
              ) : (
                <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                  {healthHistory
                    .filter(h => h.status !== 'operational')
                    .map((incident, index) => (
                      <Paper 
                        key={index} 
                        sx={{ 
                          p: 2, 
                          mb: 2, 
                          borderLeft: `4px solid ${
                            incident.status === 'degraded' 
                              ? theme.palette.warning.main 
                              : theme.palette.error.main
                          }` 
                        }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Box>
                            <Typography variant="subtitle1">
                              {incident.status === 'degraded' ? 'Service Degraded' : 'Service Outage'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {formatDate(incident.lastChecked)}
                            </Typography>
                          </Box>
                          <Chip
                            label={incident.status.charAt(0).toUpperCase() + incident.status.slice(1)}
                            color={incident.status === 'degraded' ? 'warning' : 'error'}
                            size="small"
                          />
                        </Box>
                        {incident.errorMessage && (
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            Error: {incident.errorMessage}
                          </Typography>
                        )}
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          Response Time: {incident.responseTime ? `${incident.responseTime} ms` : 'N/A'}
                        </Typography>
                      </Paper>
                    ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </Box>
  );
};

export default ProviderHealthHistory;
