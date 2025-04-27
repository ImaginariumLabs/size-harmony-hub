import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  CircularProgress,
  Alert,
  Chip,
  Divider,
  Paper,
  LinearProgress,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Settings as SettingsIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { useApiUsage } from '../hooks/useApiUsage';
import { useApiProviders } from '../contexts/ApiProviderContext';

const ProviderDetail: React.FC = () => {
  const { providerId } = useParams<{ providerId: string }>();
  const navigate = useNavigate();
  const { providers } = useApiProviders();
  const { usage, loading, error, refetch } = useApiUsage(providerId || '');
  
  const provider = providers.find(p => p.id === providerId);
  
  if (!provider) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Provider not found. The API provider "{providerId}" does not exist or is not configured.
        </Alert>
        <Button
          variant="contained"
          onClick={() => navigate('/settings/api-keys')}
          sx={{ mt: 2 }}
        >
          Manage API Keys
        </Button>
      </Box>
    );
  }

  const formatCost = (cost?: number) => {
    if (cost === undefined) return 'N/A';
    return `$${cost.toFixed(2)}`;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  const getUsagePercentage = () => {
    if (!usage?.quota) return 0;
    return (usage.quota.used / usage.quota.total) * 100;
  };

  const getRequestsPercentage = () => {
    if (!usage?.requests) return 0;
    return (usage.requests.total / usage.requests.limit) * 100;
  };

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="h4" component="h1">
            {provider.name}
          </Typography>
          <Chip
            label={provider.id}
            size="small"
            sx={{ ml: 2, textTransform: 'uppercase' }}
          />
        </Box>
        <Box>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => refetch()}
            sx={{ mr: 2 }}
            disabled={loading}
          >
            Refresh
          </Button>
          <Button
            variant="outlined"
            startIcon={<SettingsIcon />}
            onClick={() => navigate('/settings/api-keys')}
          >
            Manage Key
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
      ) : !usage ? (
        <Alert severity="info" sx={{ mb: 3 }}>
          No usage data available for {provider.name}. Try refreshing or check your API key.
        </Alert>
      ) : (
        <>
          {/* Summary Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {usage.cost !== undefined && (
              <Grid item xs={12} md={4}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 140,
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Total Cost (This Month)
                  </Typography>
                  <Typography
                    component="p"
                    variant="h4"
                    sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}
                  >
                    {formatCost(usage.cost)}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ display: 'flex', alignItems: 'center' }}
                    color={getUsagePercentage() > 80 ? 'error.main' : 'success.main'}
                  >
                    {getUsagePercentage() > 80 ? (
                      <>
                        <WarningIcon sx={{ mr: 0.5 }} fontSize="small" />
                        {getUsagePercentage().toFixed(0)}% of monthly quota
                      </>
                    ) : (
                      <>
                        <TrendingUpIcon sx={{ mr: 0.5 }} fontSize="small" />
                        {getUsagePercentage().toFixed(0)}% of monthly quota
                      </>
                    )}
                  </Typography>
                </Paper>
              </Grid>
            )}
            
            {usage.requests && (
              <Grid item xs={12} md={4}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 140,
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    API Requests
                  </Typography>
                  <Typography
                    component="p"
                    variant="h4"
                    sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}
                  >
                    {usage.requests.total.toLocaleString()}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ display: 'flex', alignItems: 'center' }}
                  >
                    {usage.requests.remaining === Infinity ? (
                      'No rate limit'
                    ) : (
                      `${usage.requests.remaining.toLocaleString()} remaining of ${usage.requests.limit.toLocaleString()}`
                    )}
                  </Typography>
                </Paper>
              </Grid>
            )}
            
            <Grid item xs={12} md={4}>
              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 140,
                  borderRadius: 2,
                }}
              >
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Last Updated
                </Typography>
                <Typography
                  component="p"
                  variant="h6"
                  sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}
                >
                  {formatDate(usage.lastUpdated)}
                </Typography>
                <Button
                  size="small"
                  startIcon={<RefreshIcon />}
                  onClick={() => refetch()}
                  sx={{ alignSelf: 'flex-start' }}
                  disabled={loading}
                >
                  Refresh Data
                </Button>
              </Paper>
            </Grid>
          </Grid>

          {/* Detailed Cards */}
          <Grid container spacing={3}>
            {/* Usage Details */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Usage Details
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  
                  {usage.quota && (
                    <Box sx={{ mb: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Quota Usage</Typography>
                        <Typography variant="body2">
                          {usage.quota.used.toFixed(2)} / {usage.quota.total.toFixed(2)}
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={getUsagePercentage()}
                        sx={{ height: 8, borderRadius: 4 }}
                        color={getUsagePercentage() > 80 ? 'error' : 'primary'}
                      />
                      {usage.quota.resetDate && (
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                          Resets on {new Date(usage.quota.resetDate).toLocaleDateString()}
                        </Typography>
                      )}
                    </Box>
                  )}
                  
                  {usage.requests && usage.requests.limit !== Infinity && (
                    <Box sx={{ mb: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Rate Limit Usage</Typography>
                        <Typography variant="body2">
                          {usage.requests.total} / {usage.requests.limit}
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={getRequestsPercentage()}
                        sx={{ height: 8, borderRadius: 4 }}
                        color={getRequestsPercentage() > 80 ? 'error' : 'primary'}
                      />
                    </Box>
                  )}
                  
                  {/* Provider-specific details */}
                  {providerId === 'openai' && usage.rawData && (
                    <>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2">Token Usage</Typography>
                        <Typography variant="body2">
                          Total: {usage.rawData.total_tokens.toLocaleString()} tokens
                        </Typography>
                        <Typography variant="body2">
                          Prompt: {usage.rawData.prompt_tokens.toLocaleString()} tokens
                        </Typography>
                        <Typography variant="body2">
                          Completion: {usage.rawData.completion_tokens.toLocaleString()} tokens
                        </Typography>
                      </Box>
                      
                      <Typography variant="subtitle2" sx={{ mb: 1 }}>Models Used</Typography>
                      {usage.rawData.models_used.map((model: any) => (
                        <Box key={model.model} sx={{ mb: 1 }}>
                          <Typography variant="body2">
                            {model.model}: {model.tokens.toLocaleString()} tokens (${(model.cost / 100).toFixed(2)})
                          </Typography>
                        </Box>
                      ))}
                    </>
                  )}
                  
                  {providerId === 'github' && usage.rawData && (
                    <>
                      <Typography variant="subtitle2" sx={{ mb: 1 }}>Rate Limits</Typography>
                      <Box sx={{ mb: 1 }}>
                        <Typography variant="body2">
                          Core: {usage.rawData.rate_limits.resources.core.used} / {usage.rawData.rate_limits.resources.core.limit}
                        </Typography>
                      </Box>
                      <Box sx={{ mb: 1 }}>
                        <Typography variant="body2">
                          Search: {usage.rawData.rate_limits.resources.search.used} / {usage.rawData.rate_limits.resources.search.limit}
                        </Typography>
                      </Box>
                      <Box sx={{ mb: 1 }}>
                        <Typography variant="body2">
                          GraphQL: {usage.rawData.rate_limits.resources.graphql.used} / {usage.rawData.rate_limits.resources.graphql.limit}
                        </Typography>
                      </Box>
                    </>
                  )}
                </CardContent>
              </Card>
            </Grid>
            
            {/* Recommendations */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Recommendations
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  
                  {providerId === 'openai' && (
                    <Box>
                      <Typography variant="body1" sx={{ mb: 2 }}>
                        Based on your current usage patterns, here are some recommendations:
                      </Typography>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="primary">
                          Optimize Token Usage
                        </Typography>
                        <Typography variant="body2">
                          Consider using more efficient prompts to reduce token consumption. Your prompt-to-completion ratio is higher than optimal.
                        </Typography>
                      </Box>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="primary">
                          Model Selection
                        </Typography>
                        <Typography variant="body2">
                          For simpler tasks, consider using gpt-3.5-turbo instead of gpt-4 to reduce costs.
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" color="primary">
                          Caching
                        </Typography>
                        <Typography variant="body2">
                          Implement response caching for common queries to reduce API calls and costs.
                        </Typography>
                      </Box>
                    </Box>
                  )}
                  
                  {providerId === 'github' && (
                    <Box>
                      <Typography variant="body1" sx={{ mb: 2 }}>
                        Based on your current usage patterns, here are some recommendations:
                      </Typography>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="primary">
                          Conditional Requests
                        </Typography>
                        <Typography variant="body2">
                          Use conditional requests with If-None-Match and If-Modified-Since headers to save on rate limits.
                        </Typography>
                      </Box>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="primary">
                          GraphQL
                        </Typography>
                        <Typography variant="body2">
                          Consider using GraphQL API for complex queries to reduce the number of API calls.
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" color="primary">
                          Pagination
                        </Typography>
                        <Typography variant="body2">
                          Implement proper pagination to avoid hitting rate limits when fetching large datasets.
                        </Typography>
                      </Box>
                    </Box>
                  )}
                  
                  {providerId !== 'openai' && providerId !== 'github' && (
                    <Typography variant="body1">
                      Recommendations will be available once we have more usage data for this provider.
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
};

export default ProviderDetail;
