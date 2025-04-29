import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Paper, IconButton, Tooltip } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { fetchApiData, fetchAllApiData } from '../../services/enhancedApiService';
import { ApiProvider, ApiUsageData } from '../../services/enhancedApiService';
import { cacheService } from '../../services/cacheService';

interface RealTimeApiUsageProps {
  provider?: ApiProvider;
  refreshInterval?: number; // in seconds
  showRefreshButton?: boolean;
  compact?: boolean;
}

const RealTimeApiUsage: React.FC<RealTimeApiUsageProps> = ({
  provider,
  refreshInterval = 60,
  showRefreshButton = true,
  compact = false
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ApiUsageData | Record<ApiProvider, ApiUsageData> | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Function to fetch data
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (provider) {
        // Fetch data for a specific provider
        const result = await fetchApiData(provider);
        setData(result);
      } else {
        // Fetch data for all providers
        const result = await fetchAllApiData();
        setData(result);
      }
      
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching API usage data:', error);
      setError('Failed to fetch API usage data');
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on mount and when refresh interval changes
  useEffect(() => {
    fetchData();
    
    // Set up refresh interval
    const intervalId = setInterval(() => {
      fetchData();
    }, refreshInterval * 1000);
    
    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, [refreshInterval, provider]);

  // Handle manual refresh
  const handleRefresh = () => {
    // Clear cache for the provider
    if (provider) {
      cacheService.remove(`${provider}_data`);
    } else {
      cacheService.clear();
    }
    
    // Fetch fresh data
    fetchData();
  };

  // Format the last updated time
  const formatLastUpdated = () => {
    return lastUpdated.toLocaleTimeString();
  };

  // Render loading state
  if (loading && !data) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 2 }}>
        <CircularProgress size={24} />
        <Typography variant="body2" sx={{ ml: 1 }}>
          Loading API usage data...
        </Typography>
      </Box>
    );
  }

  // Render error state
  if (error) {
    return (
      <Box sx={{ p: 2, color: 'error.main' }}>
        <Typography variant="body2">{error}</Typography>
      </Box>
    );
  }

  // Render data for a specific provider
  if (provider && data && !Array.isArray(data) && 'total' in data) {
    const providerData = data as ApiUsageData;
    
    return (
      <Paper 
        sx={{ 
          p: compact ? 1 : 2, 
          borderRadius: 2,
          position: 'relative',
          overflow: 'hidden',
          bgcolor: providerData.usagePercentage > 80 ? 'rgba(255, 0, 0, 0.05)' : 'background.paper'
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: compact ? 0.5 : 1 }}>
          <Typography variant={compact ? "body2" : "subtitle1"} fontWeight="medium">
            {provider.charAt(0).toUpperCase() + provider.slice(1)} Usage
          </Typography>
          
          {showRefreshButton && (
            <Tooltip title="Refresh data">
              <IconButton size="small" onClick={handleRefresh}>
                <RefreshIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'baseline', mb: compact ? 0.5 : 1 }}>
          <Typography variant={compact ? "h6" : "h5"} component="div" fontWeight="bold">
            ${providerData.total.toFixed(2)}
          </Typography>
          <Typography 
            variant="caption" 
            color={providerData.changeType === 'increase' ? 'error.main' : 'success.main'}
            sx={{ ml: 1 }}
          >
            {providerData.changeType === 'increase' ? '+' : '-'}${providerData.change.toFixed(2)}
          </Typography>
        </Box>
        
        <Box sx={{ position: 'relative', height: 4, bgcolor: 'grey.200', borderRadius: 2, mb: compact ? 0.5 : 1 }}>
          <Box 
            sx={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              height: '100%', 
              width: `${Math.min(providerData.usagePercentage, 100)}%`,
              bgcolor: providerData.usagePercentage > 80 ? 'error.main' : 
                      providerData.usagePercentage > 50 ? 'warning.main' : 'success.main',
              borderRadius: 2,
              transition: 'width 0.5s ease-in-out'
            }} 
          />
        </Box>
        
        <Typography variant="caption" color="text.secondary">
          {providerData.usagePercentage.toFixed(0)}% of monthly quota • Updated {formatLastUpdated()}
        </Typography>
      </Paper>
    );
  }

  // Render data for all providers
  if (!provider && data && typeof data === 'object' && !('total' in data)) {
    const allProvidersData = data as Record<ApiProvider, ApiUsageData>;
    const providers = Object.keys(allProvidersData) as ApiProvider[];
    
    if (compact) {
      // Compact view for all providers
      return (
        <Paper sx={{ p: 1.5, borderRadius: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="subtitle2" fontWeight="medium">
              API Usage Summary
            </Typography>
            
            {showRefreshButton && (
              <Tooltip title="Refresh all data">
                <IconButton size="small" onClick={handleRefresh}>
                  <RefreshIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Box>
          
          {providers.map((providerKey) => {
            const providerData = allProvidersData[providerKey];
            return (
              <Box key={providerKey} sx={{ mb: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <Typography variant="body2">
                    {providerKey.charAt(0).toUpperCase() + providerKey.slice(1)}
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    ${providerData.total.toFixed(2)}
                  </Typography>
                </Box>
                
                <Box sx={{ position: 'relative', height: 3, bgcolor: 'grey.200', borderRadius: 2 }}>
                  <Box 
                    sx={{ 
                      position: 'absolute', 
                      top: 0, 
                      left: 0, 
                      height: '100%', 
                      width: `${Math.min(providerData.usagePercentage, 100)}%`,
                      bgcolor: providerData.usagePercentage > 80 ? 'error.main' : 
                              providerData.usagePercentage > 50 ? 'warning.main' : 'success.main',
                      borderRadius: 2
                    }} 
                  />
                </Box>
              </Box>
            );
          })}
          
          <Typography variant="caption" color="text.secondary">
            Updated {formatLastUpdated()}
          </Typography>
        </Paper>
      );
    }
    
    // Full view for all providers
    return (
      <Paper sx={{ p: 2, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">API Usage Dashboard</Typography>
          
          {showRefreshButton && (
            <Tooltip title="Refresh all data">
              <IconButton size="small" onClick={handleRefresh}>
                <RefreshIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          {providers.map((providerKey) => {
            const providerData = allProvidersData[providerKey];
            return (
              <Box 
                key={providerKey} 
                sx={{ 
                  flex: '1 1 200px',
                  p: 1.5,
                  borderRadius: 1,
                  bgcolor: providerData.usagePercentage > 80 ? 'rgba(255, 0, 0, 0.05)' : 'rgba(0, 0, 0, 0.02)'
                }}
              >
                <Typography variant="subtitle2" fontWeight="medium" gutterBottom>
                  {providerKey.charAt(0).toUpperCase() + providerKey.slice(1)}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 1 }}>
                  <Typography variant="h6" component="div" fontWeight="bold">
                    ${providerData.total.toFixed(2)}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    color={providerData.changeType === 'increase' ? 'error.main' : 'success.main'}
                    sx={{ ml: 1 }}
                  >
                    {providerData.changeType === 'increase' ? '+' : '-'}${providerData.change.toFixed(2)}
                  </Typography>
                </Box>
                
                <Box sx={{ position: 'relative', height: 4, bgcolor: 'grey.200', borderRadius: 2, mb: 1 }}>
                  <Box 
                    sx={{ 
                      position: 'absolute', 
                      top: 0, 
                      left: 0, 
                      height: '100%', 
                      width: `${Math.min(providerData.usagePercentage, 100)}%`,
                      bgcolor: providerData.usagePercentage > 80 ? 'error.main' : 
                              providerData.usagePercentage > 50 ? 'warning.main' : 'success.main',
                      borderRadius: 2
                    }} 
                  />
                </Box>
                
                <Typography variant="caption" color="text.secondary">
                  {providerData.usagePercentage.toFixed(0)}% of monthly quota
                </Typography>
              </Box>
            );
          })}
        </Box>
        
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
          Last updated: {formatLastUpdated()}
        </Typography>
      </Paper>
    );
  }

  // Fallback for unexpected data format
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="body2">No API usage data available</Typography>
    </Box>
  );
};

export default RealTimeApiUsage;
