import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Divider,
  Paper,
  Button,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { useApiProviders } from '../contexts/ApiProviderContext';
import UsageLineChart from '../components/charts/UsageLineChart';
import UsageBarChart from '../components/charts/UsageBarChart';
import RealTimeApiUsage from '../components/widgets/RealTimeApiUsage';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`usage-tabpanel-${index}`}
      aria-labelledby={`usage-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `usage-tab-${index}`,
    'aria-controls': `usage-tabpanel-${index}`,
  };
}

const UsagePage: React.FC = () => {
  const { providers, loading: providersLoading } = useApiProviders();
  const [tabValue, setTabValue] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('week');

  const configuredProviders = providers.filter(provider => provider.isConfigured);

  // Fetch usage data
  const fetchUsageData = async () => {
    setIsLoading(true);
    try {
      // In a real implementation, this would fetch data from the API
      // For now, we'll just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLastRefreshed(new Date());
    } catch (error) {
      console.error('Error fetching usage data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchUsageData();
  }, []);

  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Format the last refreshed time
  const formatLastRefreshed = () => {
    const now = new Date();
    const diff = now.getTime() - lastRefreshed.getTime();

    if (diff < 60000) {
      return 'just now';
    } else if (diff < 3600000) {
      return `${Math.floor(diff / 60000)}m ago`;
    } else {
      return `${Math.floor(diff / 3600000)}h ago`;
    }
  };

  // Generate sample data for charts
  const generateSampleData = (days: number) => {
    const data = [];
    const now = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      data.push({
        label: date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        value: Math.random() * 10 + 5, // Random value between 5 and 15
      });
    }
    
    return data;
  };

  // Generate sample data for provider comparison
  const generateProviderComparisonData = () => {
    return configuredProviders.map(provider => ({
      label: provider.name,
      value: Math.random() * 100 + 50, // Random value between 50 and 150
      color: provider.color || '#90caf9',
    }));
  };

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          API Usage Analytics
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Last updated: {formatLastRefreshed()}
          </Typography>
          <Tooltip title="Refresh data">
            <IconButton onClick={fetchUsageData} size="small" disabled={isLoading}>
              {isLoading ? <CircularProgress size={20} /> : <RefreshIcon />}
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {configuredProviders.length === 0 ? (
        <Alert severity="info" sx={{ mb: 3 }}>
          No API providers configured. Add your first API key in settings to start tracking usage.
        </Alert>
      ) : (
        <>
          {/* Real-time API Usage Overview */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" component="h2" sx={{ mb: 2, fontWeight: 600 }}>
              Real-time Overview
            </Typography>
            <RealTimeApiUsage refreshInterval={60} />
          </Box>

          {/* Usage Tabs */}
          <Card sx={{ mb: 4 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                aria-label="usage tabs"
                sx={{ px: 2, pt: 2 }}
              >
                <Tab label="Usage Trends" {...a11yProps(0)} />
                <Tab label="Provider Comparison" {...a11yProps(1)} />
                <Tab label="Cost Analysis" {...a11yProps(2)} />
              </Tabs>
            </Box>

            {/* Usage Trends Tab */}
            <TabPanel value={tabValue} index={0}>
              <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" component="h3">
                  API Usage Over Time
                </Typography>
                <Box>
                  <Button
                    variant={timeRange === 'day' ? 'contained' : 'outlined'}
                    size="small"
                    onClick={() => setTimeRange('day')}
                    sx={{ mr: 1 }}
                  >
                    Day
                  </Button>
                  <Button
                    variant={timeRange === 'week' ? 'contained' : 'outlined'}
                    size="small"
                    onClick={() => setTimeRange('week')}
                    sx={{ mr: 1 }}
                  >
                    Week
                  </Button>
                  <Button
                    variant={timeRange === 'month' ? 'contained' : 'outlined'}
                    size="small"
                    onClick={() => setTimeRange('month')}
                  >
                    Month
                  </Button>
                </Box>
              </Box>

              <UsageLineChart
                data={generateSampleData(timeRange === 'day' ? 24 : timeRange === 'week' ? 7 : 30)}
                height={300}
                formatValue={(value) => `$${value.toFixed(2)}`}
                color="#90caf9"
              />

              <Box sx={{ mt: 4, display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                <Box sx={{ flex: '1 1 30%', minWidth: 250 }}>
                  <Paper sx={{ p: 2, height: '100%' }}>
                    <Typography variant="subtitle1" color="primary" gutterBottom>
                      Total Cost
                    </Typography>
                    <Typography variant="h4" component="div" sx={{ mb: 1 }}>
                      $127.45
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ display: 'flex', alignItems: 'center' }}
                      color="success.main"
                    >
                      <TrendingDownIcon sx={{ mr: 0.5 }} fontSize="small" />
                      8.3% less than last {timeRange}
                    </Typography>
                  </Paper>
                </Box>

                <Box sx={{ flex: '1 1 30%', minWidth: 250 }}>
                  <Paper sx={{ p: 2, height: '100%' }}>
                    <Typography variant="subtitle1" color="primary" gutterBottom>
                      Total Requests
                    </Typography>
                    <Typography variant="h4" component="div" sx={{ mb: 1 }}>
                      5,842
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ display: 'flex', alignItems: 'center' }}
                      color="error.main"
                    >
                      <TrendingUpIcon sx={{ mr: 0.5 }} fontSize="small" />
                      12.7% more than last {timeRange}
                    </Typography>
                  </Paper>
                </Box>

                <Box sx={{ flex: '1 1 30%', minWidth: 250 }}>
                  <Paper sx={{ p: 2, height: '100%' }}>
                    <Typography variant="subtitle1" color="primary" gutterBottom>
                      Average Cost per Request
                    </Typography>
                    <Typography variant="h4" component="div" sx={{ mb: 1 }}>
                      $0.022
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ display: 'flex', alignItems: 'center' }}
                      color="success.main"
                    >
                      <TrendingDownIcon sx={{ mr: 0.5 }} fontSize="small" />
                      18.5% less than last {timeRange}
                    </Typography>
                  </Paper>
                </Box>
              </Box>
            </TabPanel>

            {/* Provider Comparison Tab */}
            <TabPanel value={tabValue} index={1}>
              <Typography variant="h6" component="h3" sx={{ mb: 3 }}>
                API Provider Comparison
              </Typography>

              <UsageBarChart
                data={generateProviderComparisonData()}
                height={300}
                formatValue={(value) => `$${value.toFixed(2)}`}
              />

              <Box sx={{ mt: 4 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Provider Efficiency
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                  {configuredProviders.map(provider => (
                    <Box key={provider.id} sx={{ flex: '1 1 45%', minWidth: 300 }}>
                      <Paper sx={{ p: 2 }}>
                        <Typography variant="subtitle2" color="primary" gutterBottom>
                          {provider.name}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2">Cost per 1K tokens:</Typography>
                          <Typography variant="body2" fontWeight="bold">
                            ${(Math.random() * 0.02 + 0.01).toFixed(4)}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2">Average response time:</Typography>
                          <Typography variant="body2" fontWeight="bold">
                            {Math.floor(Math.random() * 500 + 200)}ms
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2">Success rate:</Typography>
                          <Typography variant="body2" fontWeight="bold">
                            {(Math.random() * 5 + 95).toFixed(1)}%
                          </Typography>
                        </Box>
                      </Paper>
                    </Box>
                  ))}
                </Box>
              </Box>
            </TabPanel>

            {/* Cost Analysis Tab */}
            <TabPanel value={tabValue} index={2}>
              <Typography variant="h6" component="h3" sx={{ mb: 3 }}>
                Cost Breakdown Analysis
              </Typography>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
                <Box sx={{ flex: '1 1 45%', minWidth: 300 }}>
                  <Card>
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom>
                        Cost by Model Type
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      
                      <UsageBarChart
                        data={[
                          { label: 'GPT-4', value: 78.42, color: '#10B981' },
                          { label: 'GPT-3.5', value: 23.18, color: '#6366F1' },
                          { label: 'Claude Opus', value: 15.75, color: '#8B5CF6' },
                          { label: 'Claude Sonnet', value: 8.32, color: '#A78BFA' },
                          { label: 'Gemini Pro', value: 1.78, color: '#4285F4' },
                        ]}
                        height={250}
                        formatValue={(value) => `$${value.toFixed(2)}`}
                      />
                    </CardContent>
                  </Card>
                </Box>

                <Box sx={{ flex: '1 1 45%', minWidth: 300 }}>
                  <Card>
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom>
                        Cost by Usage Type
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      
                      <UsageBarChart
                        data={[
                          { label: 'Prompt Tokens', value: 42.35, color: '#3B82F6' },
                          { label: 'Completion Tokens', value: 85.10, color: '#10B981' },
                        ]}
                        height={250}
                        formatValue={(value) => `$${value.toFixed(2)}`}
                      />
                    </CardContent>
                  </Card>
                </Box>
              </Box>

              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Cost Optimization Recommendations
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                  <Box sx={{ flex: '1 1 30%', minWidth: 250 }}>
                    <Paper sx={{ p: 2, height: '100%', bgcolor: 'rgba(16, 185, 129, 0.05)' }}>
                      <Typography variant="subtitle2" color="primary" gutterBottom>
                        Prompt Engineering
                      </Typography>
                      <Typography variant="body2">
                        Optimize your prompts to be more concise. Your current prompt-to-completion ratio is 1:2, 
                        which suggests you could reduce prompt length by up to 20% without affecting quality.
                      </Typography>
                    </Paper>
                  </Box>
                  
                  <Box sx={{ flex: '1 1 30%', minWidth: 250 }}>
                    <Paper sx={{ p: 2, height: '100%', bgcolor: 'rgba(99, 102, 241, 0.05)' }}>
                      <Typography variant="subtitle2" color="primary" gutterBottom>
                        Model Selection
                      </Typography>
                      <Typography variant="body2">
                        Consider using GPT-3.5 for simpler tasks. Our analysis shows that 35% of your GPT-4 
                        requests could be handled by GPT-3.5 with similar results at 1/10th the cost.
                      </Typography>
                    </Paper>
                  </Box>
                  
                  <Box sx={{ flex: '1 1 30%', minWidth: 250 }}>
                    <Paper sx={{ p: 2, height: '100%', bgcolor: 'rgba(249, 115, 22, 0.05)' }}>
                      <Typography variant="subtitle2" color="primary" gutterBottom>
                        Caching Strategy
                      </Typography>
                      <Typography variant="body2">
                        Implement response caching for common queries. We've identified that 22% of your 
                        requests are similar enough that caching could significantly reduce API calls.
                      </Typography>
                    </Paper>
                  </Box>
                </Box>
              </Box>
            </TabPanel>
          </Card>
        </>
      )}
    </Box>
  );
};

export default UsagePage;
