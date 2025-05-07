import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Paper,
  Typography,
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
import { useClaudeUsage } from '../../hooks/useClaudeUsage';
import { useApiProviders } from '../../contexts/ApiProviderContext';
import UsageBarChart from '../../components/charts/UsageBarChart';
import UsageLineChart from '../../components/charts/UsageLineChart';

const ClaudeProviderDetail: React.FC = () => {
  const navigate = useNavigate();
  const { providers } = useApiProviders();
  const { usage, loading, error, refetch } = useClaudeUsage();

  const provider = providers.find(p => p.id === 'claude');

  if (!provider) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Provider not found. The Claude provider does not exist or is not configured.
        </Alert>
        <Button variant="contained" onClick={() => navigate('/settings/api-keys')} sx={{ mt: 2 }}>
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

  const prepareDailyCostData = () => {
    if (!usage || !usage.daily_costs) return [];

    return usage.daily_costs.map((day: { date: string; cost: number }) => ({
      label: new Date(day.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      value: day.cost,
    }));
  };

  const prepareTokenTypeData = () => {
    if (!usage) return [];

    return [
      {
        label: 'Input',
        value: usage.input_tokens,
        color: '#8B5CF6',
      },
      {
        label: 'Output',
        value: usage.output_tokens,
        color: '#7C3AED',
      },
    ];
  };

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="h4" component="h1">
            Claude
          </Typography>
          <Chip
            label="Anthropic"
            size="small"
            sx={{ ml: 2, textTransform: 'uppercase', bgcolor: '#7C3AED', color: 'white' }}
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
            onClick={() => navigate('/settings/api-keys/claude')}
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
          No usage data available for Claude. Try refreshing or check your API key.
        </Alert>
      ) : (
        <>
          {/* Summary Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid size={{ xs: 12, md: 4 }}>
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
                      {usage.budget_used_percentage.toFixed(0)}% of monthly budget ($
                      {usage.monthly_budget})
                    </>
                  ) : (
                    <>
                      <TrendingUpIcon sx={{ mr: 0.5 }} fontSize="small" />
                      {usage.budget_used_percentage.toFixed(0)}% of monthly budget ($
                      {usage.monthly_budget})
                    </>
                  )}
                </Typography>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
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
                  Total Tokens
                </Typography>
                <Typography
                  component="p"
                  variant="h4"
                  sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}
                >
                  {usage.total_tokens.toLocaleString()}
                </Typography>
                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                  <InfoIcon sx={{ mr: 0.5 }} fontSize="small" />
                  {usage.input_tokens.toLocaleString()} input +{' '}
                  {usage.output_tokens.toLocaleString()} output
                </Typography>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
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
                  {formatDate(usage.last_updated)}
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
            <Grid size={{ xs: 12, md: 6 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Daily Cost Trend
                  </Typography>
                  <Divider sx={{ mb: 2 }} />

                  <UsageLineChart
                    data={prepareDailyCostData()}
                    height={250}
                    formatValue={value => `$${value.toFixed(2)}`}
                    color="#7C3AED"
                  />
                </CardContent>
              </Card>
            </Grid>

            {/* Token Distribution */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Token Distribution
                  </Typography>
                  <Divider sx={{ mb: 2 }} />

                  <Box sx={{ mb: 3 }}>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 6 }}>
                        <Paper sx={{ p: 2, bgcolor: 'rgba(124, 58, 237, 0.1)' }}>
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
                      <Grid size={{ xs: 6 }}>
                        <Paper sx={{ p: 2, bgcolor: 'rgba(139, 92, 246, 0.1)' }}>
                          <Typography variant="subtitle2" gutterBottom>
                            Output Tokens
                          </Typography>
                          <Typography variant="h6">
                            {usage.output_tokens.toLocaleString()}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {((usage.output_tokens / usage.total_tokens) * 100).toFixed(1)}% of
                            total
                          </Typography>
                        </Paper>
                      </Grid>
                    </Grid>
                  </Box>

                  <Typography variant="subtitle2" gutterBottom>
                    Token Usage by Type
                  </Typography>
                  <UsageBarChart
                    data={prepareTokenTypeData()}
                    height={200}
                    formatValue={value => value.toLocaleString()}
                  />
                </CardContent>
              </Card>
            </Grid>

            {/* Model Usage */}
            <Grid size={{ xs: 12 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Model Usage Details
                  </Typography>
                  <Divider sx={{ mb: 2 }} />

                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Model</TableCell>
                          <TableCell align="right">Input Tokens</TableCell>
                          <TableCell align="right">Output Tokens</TableCell>
                          <TableCell align="right">Total Tokens</TableCell>
                          <TableCell align="right">Cost</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {usage.models_used.map(
                          (model: {
                            model: string;
                            input_tokens: number;
                            output_tokens: number;
                            cost: number;
                          }) => {
                            const totalTokens = model.input_tokens + model.output_tokens;

                            return (
                              <TableRow key={model.model}>
                                <TableCell component="th" scope="row">
                                  {model.model}
                                </TableCell>
                                <TableCell align="right">
                                  {model.input_tokens.toLocaleString()}
                                </TableCell>
                                <TableCell align="right">
                                  {model.output_tokens.toLocaleString()}
                                </TableCell>
                                <TableCell align="right">{totalTokens.toLocaleString()}</TableCell>
                                <TableCell align="right">${model.cost.toFixed(2)}</TableCell>
                              </TableRow>
                            );
                          }
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>

            {/* Recommendations */}
            <Grid size={{ xs: 12 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Recommendations
                  </Typography>
                  <Divider sx={{ mb: 2 }} />

                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                    <Box sx={{ flex: '1 1 30%', minWidth: 250 }}>
                      <Paper sx={{ p: 2, height: '100%', bgcolor: 'rgba(124, 58, 237, 0.05)' }}>
                        <Typography variant="subtitle1" color="primary" gutterBottom>
                          Model Selection
                        </Typography>
                        <Typography variant="body2">
                          {usage.models_used.some((m: { model: string }) =>
                            m.model.includes('opus')
                          )
                            ? 'Claude Opus is the most expensive model. For most tasks, Claude Sonnet provides excellent results at a lower cost.'
                            : "You're efficiently using Claude Sonnet or Haiku. For complex tasks requiring more reasoning, consider Claude Opus."}
                        </Typography>
                      </Paper>
                    </Box>

                    <Box sx={{ flex: '1 1 30%', minWidth: 250 }}>
                      <Paper sx={{ p: 2, height: '100%', bgcolor: 'rgba(139, 92, 246, 0.05)' }}>
                        <Typography variant="subtitle1" color="primary" gutterBottom>
                          Input Optimization
                        </Typography>
                        <Typography variant="body2">
                          Your input-to-output token ratio is{' '}
                          {(usage.input_tokens / usage.output_tokens).toFixed(1)}:1.
                          {usage.input_tokens > usage.output_tokens * 2
                            ? ' Consider using more concise prompts to reduce input token usage.'
                            : ' You have a good balance of input to output tokens.'}
                        </Typography>
                      </Paper>
                    </Box>

                    <Box sx={{ flex: '1 1 30%', minWidth: 250 }}>
                      <Paper sx={{ p: 2, height: '100%', bgcolor: 'rgba(167, 139, 250, 0.05)' }}>
                        <Typography variant="subtitle1" color="primary" gutterBottom>
                          Cost Management
                        </Typography>
                        <Typography variant="body2">
                          Based on your current usage, your projected monthly cost is approximately
                          ${((usage.total_cost / usage.budget_used_percentage) * 100).toFixed(2)}.
                          {usage.budget_used_percentage > 50
                            ? ' Consider setting up usage alerts to avoid unexpected costs.'
                            : ' Your usage is well within your monthly budget.'}
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

export default ClaudeProviderDetail;
