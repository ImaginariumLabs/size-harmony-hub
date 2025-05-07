import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Tooltip,
  Typography,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import InfoIcon from '@mui/icons-material/Info';
import { fetchAllApiData, ApiProvider, ApiUsageData } from '../../services/enhancedApiService';
import useLoadingIndicator from '../../hooks/useLoadingIndicator';
import DefaultDashboardView from './DefaultDashboardView';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip as RechartsTooltip,
} from 'recharts';

// Time period options for data display
type TimePeriod = 'day' | 'week' | 'month' | 'year';

/**
 * Enhanced Cost Monitoring Dashboard Component
 *
 * This component displays a comprehensive dashboard for monitoring API costs
 * with improved visualizations based on competitor analysis.
 */
const EnhancedCostMonitoringDashboard: React.FC = () => {
  const [apiData, setApiData] = useState<Record<ApiProvider, ApiUsageData> | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('week');

  // Use the loading indicator hook
  useLoadingIndicator(loading, 'Loading cost data...', 'linear');

  // Fetch API data on component mount and when time period changes
  useEffect(() => {
    fetchData();
    // fetchData is defined inside the component and depends on state variables
    // that are used in the dependency array (timePeriod), so it's safe to exclude
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timePeriod]);

  // Function to fetch API data with timeout
  const fetchData = async () => {
    setLoading(true);
    setError(null);

    // Set a safety timeout to ensure loading state is always reset
    const safetyTimeout = setTimeout(() => {
      if (loading) {
        console.warn('Safety timeout triggered to prevent perpetual loading');
        setLoading(false);
        setError('Request took too long. Using fallback data.');

        // Create minimal fallback data if we have nothing
        if (!apiData) {
          const fallbackData: Record<ApiProvider, ApiUsageData> = {
            openai: {
              total: 0,
              change: 0,
              changeType: 'increase',
              usagePercentage: 0,
              lastUpdated: new Date().toISOString(),
            },
            claude: {
              total: 0,
              change: 0,
              changeType: 'increase',
              usagePercentage: 0,
              lastUpdated: new Date().toISOString(),
            },
            google: {
              total: 0,
              change: 0,
              changeType: 'increase',
              usagePercentage: 0,
              lastUpdated: new Date().toISOString(),
            },
            github: {
              total: 0,
              change: 0,
              changeType: 'increase',
              usagePercentage: 0,
              lastUpdated: new Date().toISOString(),
            },
          };
          setApiData(fallbackData);
        }
      }
    }, 5000); // 5 second safety timeout

    try {
      // Use a shorter timeout for the API call
      const data = await fetchAllApiData();

      // Check if we got valid data
      if (!data || Object.keys(data).length === 0) {
        throw new Error('No data received from API');
      }

      setApiData(data as Record<ApiProvider, ApiUsageData>);
    } catch (err) {
      // Provide more specific error messages
      if (err instanceof Error) {
        if (err.message.includes('timed out')) {
          setError('Request timed out. Please try again later.');
        } else {
          setError(`Error: ${err.message}`);
        }
      } else {
        setError('Unknown error occurred');
      }

      if (process.env.NODE_ENV !== 'production' || process.env.DEBUG === 'true') {
        console.error('Error fetching API data:', err);
      }

      // If we have previous data, keep using it
      if (!apiData) {
        // Create minimal fallback data if we have nothing
        const fallbackData: Record<ApiProvider, ApiUsageData> = {
          openai: {
            total: 0,
            change: 0,
            changeType: 'increase',
            usagePercentage: 0,
            lastUpdated: new Date().toISOString(),
          },
          claude: {
            total: 0,
            change: 0,
            changeType: 'increase',
            usagePercentage: 0,
            lastUpdated: new Date().toISOString(),
          },
          google: {
            total: 0,
            change: 0,
            changeType: 'increase',
            usagePercentage: 0,
            lastUpdated: new Date().toISOString(),
          },
          github: {
            total: 0,
            change: 0,
            changeType: 'increase',
            usagePercentage: 0,
            lastUpdated: new Date().toISOString(),
          },
        };
        setApiData(fallbackData);
      }
    } finally {
      // Ensure loading state is always reset
      setLoading(false);
      clearTimeout(safetyTimeout);
    }
  };

  // Handle time period change
  const handleTimePeriodChange = (event: SelectChangeEvent<TimePeriod>) => {
    setTimePeriod(event.target.value as TimePeriod);
  };

  // Generate weekly spend data for bar chart
  const generateWeeklySpendData = () => {
    if (!apiData) return [];

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    // Generate random data for demonstration
    // In a real implementation, this would use actual historical data
    return days.map(day => {
      const openai = Math.random() * 5 + 1; // $1 to $6
      const claude = Math.random() * 3 + 0.5; // $0.5 to $3.5
      const gemini = Math.random() * 0.5 + 0.1; // $0.1 to $0.6

      return {
        day,
        OpenAI: openai.toFixed(2),
        Claude: claude.toFixed(2),
        Gemini: gemini.toFixed(2),
        total: (openai + claude + gemini).toFixed(2),
      };
    });
  };

  // Generate project-based usage data for pie chart
  const generateProjectData = () => {
    if (!apiData) return [];

    // Generate random data for demonstration
    // In a real implementation, this would use actual project data
    return [
      { name: 'Project Alpha', value: 3674, percentage: 85 },
      { name: 'Project Nebula', value: 234, percentage: 5 },
      { name: 'Project Quantum', value: 415, percentage: 10 },
    ];
  };

  // Generate model-specific cost breakdown data
  const generateModelCostData = () => {
    if (!apiData) return [];

    // In a real implementation, this would use actual model usage data
    return [
      { name: 'GPT-4 Turbo', value: 93.6, color: '#4CAF50' },
      { name: 'Claude Opus', value: 81.93, color: '#00BCD4' },
      { name: 'GPT-3.5 Turbo', value: 58.47, color: '#F44336' },
    ];
  };

  // Calculate total API requests
  const calculateTotalRequests = () => {
    if (!apiData) return 0;

    // In a real implementation, this would calculate the actual total
    // For now, we'll use a random number for demonstration
    return 4323;
  };

  // Calculate total spend
  const calculateTotalSpend = () => {
    if (!apiData) return 0;

    // Sum up the totals from all providers
    const total = Object.values(apiData).reduce((sum, data) => sum + data.total, 0);
    return total.toFixed(2);
  };

  // Calculate change percentage
  const calculateChangePercentage = () => {
    if (!apiData) return 0;

    // In a real implementation, this would calculate the actual change
    // For now, we'll use a random number for demonstration
    return '+4.2%';
  };

  // Colors for the pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  // If loading, show a loading indicator with a timeout
  useEffect(() => {
    // Set a safety timeout to ensure we always show something
    const safetyTimeout = setTimeout(() => {
      if (loading && !apiData) {
        console.warn('Safety timeout triggered in EnhancedCostMonitoringDashboard');
        setLoading(false);
        // If we don't have data yet, create default empty data
        if (!apiData) {
          const defaultData: Record<ApiProvider, ApiUsageData> = {
            openai: {
              total: 0,
              change: 0,
              changeType: 'increase',
              usagePercentage: 0,
              lastUpdated: new Date().toISOString(),
            },
            claude: {
              total: 0,
              change: 0,
              changeType: 'increase',
              usagePercentage: 0,
              lastUpdated: new Date().toISOString(),
            },
            google: {
              total: 0,
              change: 0,
              changeType: 'increase',
              usagePercentage: 0,
              lastUpdated: new Date().toISOString(),
            },
            github: {
              total: 0,
              change: 0,
              changeType: 'increase',
              usagePercentage: 0,
              lastUpdated: new Date().toISOString(),
            },
          };
          setApiData(defaultData);
        }
      }
    }, 3000); // 3 second safety timeout

    return () => clearTimeout(safetyTimeout);
  }, [loading, apiData]);

  // If loading, show a loading indicator
  if (loading && !apiData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  // If error, show error message with fallback data
  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error" gutterBottom>
          {error}
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          Showing default dashboard view. Your actual data will appear when connection is restored.
        </Typography>
        <Box sx={{ mt: 2, mb: 4 }}>
          <Button
            startIcon={<RefreshIcon />}
            variant="contained"
            onClick={fetchData}
            color="primary"
          >
            Retry Connection
          </Button>
        </Box>

        {/* Show default dashboard view */}
        <DefaultDashboardView
          title="Cost Monitoring Dashboard"
          subtitle="Unable to load data. You can retry the connection or configure your API keys."
        />
      </Box>
    );
  }

  // If no API data is available, show the default dashboard view
  if (!apiData || Object.keys(apiData).length === 0) {
    return (
      <DefaultDashboardView
        title="Cost Monitoring Dashboard"
        subtitle="Configure your API keys to start monitoring your usage and costs."
      />
    );
  }

  // Weekly spend data for bar chart
  const weeklySpendData = generateWeeklySpendData();

  // Project data for pie chart
  const projectData = generateProjectData();

  // Model cost data
  const modelCostData = generateModelCostData();

  // Total API requests
  const totalRequests = calculateTotalRequests();

  return (
    <Box sx={{ p: 3, bgcolor: 'background.default' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          AI API Cost Monitor
        </Typography>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel id="time-period-label">Time Period</InputLabel>
            <Select
              labelId="time-period-label"
              id="time-period-select"
              value={timePeriod}
              label="Time Period"
              onChange={handleTimePeriodChange}
            >
              <MenuItem value="day">Day</MenuItem>
              <MenuItem value="week">Week</MenuItem>
              <MenuItem value="month">Month</MenuItem>
              <MenuItem value="year">Year</MenuItem>
            </Select>
          </FormControl>

          <IconButton aria-label="Button description" onClick={fetchData} color="primary">
            <RefreshIcon />
          </IconButton>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Total Spend Card */}
        <Grid sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
          <Card
            sx={{
              height: '100%',
              bgcolor: 'background.paper',
              borderRadius: 2,
              boxShadow: 3,
              background: 'rgba(30, 30, 30, 0.7)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <CardHeader
              title={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="h6">AI API Spend</Typography>
                  <Typography variant="body2" sx={{ ml: 1, color: 'text.secondary' }}>
                    {timePeriod === 'week'
                      ? 'Weekly Overview'
                      : `${timePeriod.charAt(0).toUpperCase() + timePeriod.slice(1)}ly Overview`}
                  </Typography>
                </Box>
              }
              action={
                <Tooltip title="Total spend across all API providers">
                  <IconButton aria-label="Button description" size="small">
                    <InfoIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              }
            />
            <Divider />
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h3" component="div">
                  ${calculateTotalSpend()}
                </Typography>
                <Box
                  sx={{
                    bgcolor: 'success.main',
                    color: 'success.contrastText',
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                    height: 'fit-content',
                  }}
                >
                  <Typography variant="body2">{calculateChangePercentage()}</Typography>
                </Box>
              </Box>

              <Box sx={{ height: 250 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={weeklySpendData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <RechartsTooltip />
                    <Bar dataKey="OpenAI" fill="#4CAF50" />
                    <Bar dataKey="Claude" fill="#00BCD4" />
                    <Bar dataKey="Gemini" fill="#F44336" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Project Usage Card */}
        <Grid sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
          <Card
            sx={{
              height: '100%',
              bgcolor: 'background.paper',
              borderRadius: 2,
              boxShadow: 3,
              background: 'rgba(30, 30, 30, 0.7)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <CardHeader
              title={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="h6">By Project</Typography>
                  <Typography variant="body2" sx={{ ml: 1, color: 'text.secondary' }}>
                    Last 7 Days
                  </Typography>
                </Box>
              }
              action={
                <Tooltip title="API usage breakdown by project">
                  <IconButton aria-label="Button description" size="small">
                    <InfoIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              }
            />
            <Divider />
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h3" component="div">
                  {totalRequests.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total API Requests
                </Typography>
              </Box>

              <Box sx={{ height: 250, display: 'flex', justifyContent: 'center' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={projectData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percentage }) => `${name}: ${percentage}%`}
                    >
                      {projectData.map(entry => (
                        <Cell
                          key={`cell-${entry.name}`}
                          fill={
                            COLORS[
                              projectData.findIndex(p => p.name === entry.name) % COLORS.length
                            ]
                          }
                        />
                      ))}
                    </Pie>
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Model Cost Breakdown */}
        <Grid sx={{ gridColumn: 'span 12' }}>
          <Card
            sx={{
              bgcolor: 'background.paper',
              borderRadius: 2,
              boxShadow: 3,
              background: 'rgba(30, 30, 30, 0.7)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <CardHeader
              title={<Typography variant="h6">Model Cost Breakdown</Typography>}
              action={
                <Tooltip title="Cost breakdown by model">
                  <IconButton aria-label="Button description" size="small">
                    <InfoIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              }
            />
            <Divider />
            <CardContent>
              <Grid container spacing={2}>
                {modelCostData.map(model => (
                  <Grid
                    sx={{ gridColumn: { xs: 'span 12', md: 'span 4' } }}
                    key={`model-${model.name}`}
                  >
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: 'background.default',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      <Typography variant="body1">{model.name}</Typography>
                      <Typography variant="h5" sx={{ color: model.color }}>
                        ${model.value}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EnhancedCostMonitoringDashboard;
