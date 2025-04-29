import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  CircularProgress,
  Alert,
  AlertTitle,
  Chip,
  Divider,
  Paper,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Settings as SettingsIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { useGeminiUsage } from '../../hooks/useGeminiUsage';
import { useApiProviders } from '../../contexts/ApiProviderContext';
import UsageBarChart from '../../components/charts/UsageBarChart';
import UsageLineChart from '../../components/charts/UsageLineChart';

const GeminiProviderDetail: React.FC = () => {
  const navigate = useNavigate();
  const { providers } = useApiProviders();
  const { usage, loading, error, refetch } = useGeminiUsage();

  const provider = providers.find(p => p.id === 'google');

  if (!provider) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Provider not found. The Gemini provider does not exist or is not configured.
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

  // Prepare data for charts
  const prepareModelUsageData = () => {
    if (!usage || !usage.models_used) return [];

    return usage.models_used.map(model => ({
      label: model.model.replace('gemini-', ''),
      value: model.input_tokens + model.output_tokens,
      color: model.model.includes('pro') ? '#4285F4' : '#34A853'
    }));
  };

  const prepareDailyCostData = () => {
    if (!usage || !usage.daily_costs) return [];

    return usage.daily_costs.map(day => ({
      label: new Date(day.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      value: day.cost
    }));
  };

  const prepareDailyRequestsData = () => {
    if (!usage || !usage.daily_costs) return [];

    return usage.daily_costs.map(day => ({
      label: new Date(day.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      value: day.requests
    }));
  };

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="h4" component="h1">
            Gemini
          </Typography>
          <Chip
            label="Google AI"
            size="small"
            sx={{ ml: 2, textTransform: 'uppercase', bgcolor: '#4285F4', color: 'white' }}
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
            onClick={() => navigate('/settings/api-keys/google')}
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
          No usage data available for Gemini. Try refreshing or check your API key.
        </Alert>
      ) : (
        <>
          {/* Summary Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
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
                  {formatCost(usage.total_cost)}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ display: 'flex', alignItems: 'center' }}
                  color={usage.budget_used_percentage > 80 ? 'error.main' : 'success.main'}
                >
                  {usage.budget_used_percentage > 80 ? (
                    <>
                      <WarningIcon sx={{ mr: 0.5 }} fontSize="small" />
                      {usage.budget_used_percentage.toFixed(0)}% of monthly budget (${usage.monthly_budget})
                    </>
                  ) : (
                    <>
                      <TrendingUpIcon sx={{ mr: 0.5 }} fontSize="small" />
                      {usage.budget_used_percentage.toFixed(0)}% of monthly budget (${usage.monthly_budget})
                    </>
                  )}
                </Typography>
              </Paper>
            </Grid>

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
                  Free Tier Usage
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, mb: 1 }}>
                  <Box sx={{ width: '100%' }}>
                    <LinearProgress
                      variant="determinate"
                      value={usage.free_tier_used_percentage}
                      sx={{ height: 10, borderRadius: 5 }}
                      color={usage.free_tier_used_percentage > 80 ? 'error' : 'primary'}
                    />
                  </Box>
                </Box>
                <Typography
                  component="p"
                  variant="h5"
                  sx={{ mt: 1 }}
                >
                  {usage.free_tier_used_percentage}% Used
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <InfoIcon sx={{ mr: 0.5 }} fontSize="small" />
                  {usage.total_tokens.toLocaleString()} of 1M free tokens used
                </Typography>
              </Paper>
            </Grid>

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
                  {usage.requests.toLocaleString()}
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

          {/* Charts and Detailed Data */}
          <Grid container spacing={3}>
            {/* Daily Cost Chart */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Daily Cost Trend
                  </Typography>
                  <Divider sx={{ mb: 2 }} />

                  <UsageLineChart
                    data={prepareDailyCostData()}
                    height={250}
                    formatValue={(value) => `$${value.toFixed(4)}`}
                    color="#4285F4"
                  />
                </CardContent>
              </Card>
            </Grid>

            {/* Daily Requests Chart */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Daily Requests
                  </Typography>
                  <Divider sx={{ mb: 2 }} />

                  <UsageLineChart
                    data={prepareDailyRequestsData()}
                    height={250}
                    formatValue={(value) => value.toString()}
                    color="#34A853"
                  />
                </CardContent>
              </Card>
            </Grid>

            {/* Token Usage */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Token Usage
                  </Typography>
                  <Divider sx={{ mb: 2 }} />

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" gutterBottom>
                      Total Tokens: {usage.total_tokens.toLocaleString()}
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Paper sx={{ p: 2, bgcolor: 'rgba(66, 133, 244, 0.1)' }}>
                          <Typography variant="subtitle2" gutterBottom>
                            Input Tokens
                          </Typography>
                          <Typography variant="h6">
                            {usage.input_tokens.toLocaleString()}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {((usage.input_tokens / usage.total_tokens) * 100).toFixed(1)}% of total
                          </Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={6}>
                        <Paper sx={{ p: 2, bgcolor: 'rgba(52, 168, 83, 0.1)' }}>
                          <Typography variant="subtitle2" gutterBottom>
                            Output Tokens
                          </Typography>
                          <Typography variant="h6">
                            {usage.output_tokens.toLocaleString()}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {((usage.output_tokens / usage.total_tokens) * 100).toFixed(1)}% of total
                          </Typography>
                        </Paper>
                      </Grid>
                    </Grid>
                  </Box>

                  <Typography variant="subtitle2" gutterBottom>
                    Token Usage by Model
                  </Typography>
                  <UsageBarChart
                    data={prepareModelUsageData()}
                    height={200}
                    formatValue={(value) => value.toLocaleString()}
                  />
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

                  <Box sx={{ mb: 3 }}>
                    <Alert severity="info" sx={{ mb: 2 }}>
                      <AlertTitle>Free Tier Benefits</AlertTitle>
                      You're currently using {usage.free_tier_used_percentage}% of your free tier allocation.
                      Google provides 1M tokens per month for free.
                    </Alert>

                    <Typography variant="body1" paragraph>
                      Based on your current usage patterns, here are some recommendations:
                    </Typography>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Paper sx={{ p: 2, bgcolor: 'rgba(66, 133, 244, 0.05)' }}>
                        <Typography variant="subtitle1" color="primary" gutterBottom>
                          Model Selection
                        </Typography>
                        <Typography variant="body2">
                          For most tasks, Gemini-2.0-flash provides excellent results at a lower cost.
                          Only use Gemini-1.5-pro for tasks requiring complex reasoning or long context.
                        </Typography>
                      </Paper>

                      <Paper sx={{ p: 2, bgcolor: 'rgba(52, 168, 83, 0.05)' }}>
                        <Typography variant="subtitle1" color="primary" gutterBottom>
                          Input Optimization
                        </Typography>
                        <Typography variant="body2">
                          Your input-to-output token ratio is {(usage.input_tokens / usage.output_tokens).toFixed(1)}:1.
                          {usage.input_tokens > usage.output_tokens * 2 ?
                            ' Consider using more concise prompts to reduce input token usage.' :
                            ' You have a good balance of input to output tokens.'
                          }
                        </Typography>
                      </Paper>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
};

export default GeminiProviderDetail;
