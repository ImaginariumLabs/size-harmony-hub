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
import { useOpenAIUsage } from '../../hooks/useOpenAIUsage';
import { useApiProviders } from '../../contexts/ApiProviderContext';
import UsageBarChart from '../../components/charts/UsageBarChart';
import UsageLineChart from '../../components/charts/UsageLineChart';

const OpenAIProviderDetail: React.FC = () => {
  const navigate = useNavigate();
  const { providers } = useApiProviders();
  const { usage, loading, error, refetch } = useOpenAIUsage();

  const provider = providers.find(p => p.id === 'openai');

  if (!provider) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Provider not found. The OpenAI provider does not exist or is not configured.
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

  const getUsagePercentage = () => {
    if (!usage) return 0;
    // Assuming $120 monthly quota
    return (usage.total_usage / 100 / 120) * 100;
  };

  // Prepare data for charts
  const prepareModelUsageData = () => {
    return (
      usage?.models_used?.map((model: { model: string; tokens: number; cost: number }) => ({
        label: model.model.replace('gpt-', ''),
        value: model.tokens,
        color: model.model.includes('gpt-4') ? '#10B981' : '#6366F1',
      })) ?? []
    );
  };

  const prepareDailyCostData = () => {
    return (
      usage?.daily_costs?.map((day: { date: string; cost: number }) => ({
        label: new Date(day.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        value: day.cost / 100, // Convert cents to dollars
      })) ?? []
    );
  };

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="h4" component="h1">
            OpenAI
          </Typography>
          <Chip
            label="GPT"
            size="small"
            sx={{ ml: 2, textTransform: 'uppercase', bgcolor: '#10B981', color: 'white' }}
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
            onClick={() => navigate('/settings/api-keys/openai')}
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

      {(() => {
        if (loading) {
          return (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress />
            </Box>
          );
        }

        if (!usage) {
          return (
            <Alert severity="info" sx={{ mb: 3 }}>
              No usage data available for OpenAI. Try refreshing or check your API key.
            </Alert>
          );
        }

        return (
          <>
            {/* Summary Cards */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
              <Box sx={{ flex: '1 1 30%', minWidth: 250 }}>
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
                    {formatCost(usage.total_usage / 100)}
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
              </Box>

              <Box sx={{ flex: '1 1 30%', minWidth: 250 }}>
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
                    {usage.prompt_tokens.toLocaleString()} prompt +{' '}
                    {usage.completion_tokens.toLocaleString()} completion
                  </Typography>
                </Paper>
              </Box>

              <Box sx={{ flex: '1 1 30%', minWidth: 250 }}>
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
                    {new Date().toLocaleString()}
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
              </Box>
            </Box>

            {/* Charts and Detailed Data */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Charts Row */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                {/* Daily Cost Chart */}
                <Box sx={{ flex: '1 1 45%', minWidth: 300 }}>
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
                        color="#10B981"
                      />
                    </CardContent>
                  </Card>
                </Box>

                {/* Model Usage Chart */}
                <Box sx={{ flex: '1 1 45%', minWidth: 300 }}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Model Usage (Tokens)
                      </Typography>
                      <Divider sx={{ mb: 2 }} />

                      <UsageBarChart
                        data={prepareModelUsageData()}
                        height={250}
                        formatValue={value => value.toLocaleString()}
                      />
                    </CardContent>
                  </Card>
                </Box>
              </Box>

              {/* Model Usage Details */}
              <Box sx={{ width: '100%' }}>
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
                            <TableCell align="right">Tokens</TableCell>
                            <TableCell align="right">Cost</TableCell>
                            <TableCell align="right">% of Total</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {usage.models_used.map(
                            (model: { model: string; tokens: number; cost: number }) => {
                              const percentage = (model.tokens / usage.total_tokens) * 100;

                              return (
                                <TableRow key={model.model}>
                                  <TableCell component="th" scope="row">
                                    {model.model}
                                  </TableCell>
                                  <TableCell align="right">
                                    {model.tokens.toLocaleString()}
                                  </TableCell>
                                  <TableCell align="right">
                                    ${(model.cost / 100).toFixed(2)}
                                  </TableCell>
                                  <TableCell align="right">{percentage.toFixed(1)}%</TableCell>
                                </TableRow>
                              );
                            }
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              </Box>

              {/* Recommendations */}
              <Box sx={{ width: '100%' }}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Recommendations
                    </Typography>
                    <Divider sx={{ mb: 2 }} />

                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                      <Box sx={{ flex: '1 1 30%', minWidth: 250 }}>
                        <Paper sx={{ p: 2, height: '100%', bgcolor: 'rgba(16, 185, 129, 0.05)' }}>
                          <Typography variant="subtitle1" color="primary" gutterBottom>
                            Optimize Token Usage
                          </Typography>
                          <Typography variant="body2">
                            Your prompt-to-completion ratio is{' '}
                            {(usage.prompt_tokens / usage.completion_tokens).toFixed(1)}:1. Consider
                            using more efficient prompts to reduce token consumption.
                          </Typography>
                        </Paper>
                      </Box>

                      <Box sx={{ flex: '1 1 30%', minWidth: 250 }}>
                        <Paper sx={{ p: 2, height: '100%', bgcolor: 'rgba(99, 102, 241, 0.05)' }}>
                          <Typography variant="subtitle1" color="primary" gutterBottom>
                            Model Selection
                          </Typography>
                          <Typography variant="body2">
                            {usage.models_used.some((m: { model: string }) =>
                              m.model.includes('gpt-4')
                            )
                              ? 'For simpler tasks, consider using gpt-3.5-turbo instead of gpt-4 to reduce costs.'
                              : "You're efficiently using gpt-3.5-turbo. For complex tasks requiring more reasoning, consider gpt-4."}
                          </Typography>
                        </Paper>
                      </Box>

                      <Box sx={{ flex: '1 1 30%', minWidth: 250 }}>
                        <Paper sx={{ p: 2, height: '100%', bgcolor: 'rgba(249, 115, 22, 0.05)' }}>
                          <Typography variant="subtitle1" color="primary" gutterBottom>
                            Caching
                          </Typography>
                          <Typography variant="body2">
                            Implement response caching for common queries to reduce API calls and
                            costs. This can significantly reduce your token usage for repetitive
                            tasks.
                          </Typography>
                        </Paper>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            </Box>
          </>
        );
      })()}
    </Box>
  );
};

export default OpenAIProviderDetail;
