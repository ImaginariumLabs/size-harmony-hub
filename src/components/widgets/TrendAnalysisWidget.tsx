import React, { useState, useCallback } from 'react';
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  ToggleButtonGroup,
  ToggleButton,
  CircularProgress,
  Button,
  Alert,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  DragIndicator as DragIndicatorIcon,
  Refresh as RefreshIcon,
  ErrorOutline as ErrorIcon,
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';
import { getMockProviderData } from '../../services/mockDataService';
import useRealTimeData from '../../hooks/useRealTimeData';

interface TrendAnalysisWidgetProps {
  providerId: string;
  title: string;
  onRemove: () => void;
}

type TimeRange = '7d' | '30d' | '90d';

/**
 * TrendAnalysisWidget component
 *
 * Displays trend analysis for a specific API provider over time.
 */
const TrendAnalysisWidget: React.FC<TrendAnalysisWidgetProps> = ({
  providerId,
  title,
  onRemove,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');

  // Handle menu open
  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // Handle menu close
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Handle time range change
  const handleTimeRangeChange = (_event: React.MouseEvent<HTMLElement>, newTimeRange: TimeRange | null) => {
    if (newTimeRange !== null) {
      setTimeRange(newTimeRange);
    }
  };

  // Get provider color
  const getProviderColor = (id: string): string => {
    switch (id) {
      case 'openai':
        return '#10a37f';
      case 'github':
        return '#24292e';
      case 'aws':
        return '#ff9900';
      case 'google':
        return '#4285f4';
      case 'azure':
        return '#0089d6';
      case 'claude':
        return '#7c3aed';
      default:
        return '#64b5f6';
    }
  };

  // Get provider name
  const getProviderName = (id: string): string => {
    switch (id) {
      case 'openai':
        return 'OpenAI';
      case 'github':
        return 'GitHub';
      case 'aws':
        return 'AWS';
      case 'google':
        return 'Google';
      case 'azure':
        return 'Azure';
      case 'claude':
        return 'Claude';
      default:
        return id;
    }
  };

  // Generate dates for the selected time range
  const generateDates = (range: TimeRange): Date[] => {
    const dates: Date[] = [];
    const today = new Date();
    const days = range === '7d' ? 7 : range === '30d' ? 30 : 90;

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      dates.push(date);
    }

    return dates;
  };

  // Fetch trend data with enhanced error handling
  const fetchTrendData = useCallback(async () => {
    try {
      // Simulate random network error (10% chance)
      if (Math.random() < 0.1) {
        throw new Error('Network error: Failed to fetch trend data');
      }

      // In a real app, this would fetch data from an API
      const providerData = getMockProviderData(providerId);
      const dates = generateDates(timeRange);

      // Generate random trend data
      const costData = dates.map(date => {
        try {
          // Base value with some randomness
          const baseValue = providerData.total * (0.8 + Math.random() * 0.4);

          // Add a trend component (increasing over time)
          const trendFactor = date.getTime() / dates[dates.length - 1].getTime();
          const trendValue = baseValue * (0.8 + trendFactor * 0.4);

          return {
            date: date.toISOString().split('T')[0],
            cost: parseFloat(trendValue.toFixed(2)),
            usage: Math.floor(Math.random() * 100),
            requests: Math.floor(Math.random() * 1000),
          };
        } catch (err) {
          console.error(`Error processing data for date ${date}:`, err);
          // Return fallback data for this date
          return {
            date: date.toISOString().split('T')[0],
            cost: 0,
            usage: 0,
            requests: 0,
            error: true,
          };
        }
      });

      // Check if we have any data points with errors
      const hasErrors = costData.some(item => item.error);
      if (hasErrors) {
        console.warn('Some data points could not be processed correctly');
      }

      return costData;
    } catch (err) {
      console.error('Error in fetchTrendData:', err);
      throw err; // Let the useRealTimeData hook handle the error
    }
  }, [providerId, timeRange]);

  // Use real-time data hook
  const { data, loading, error, lastUpdated, refresh } = useRealTimeData(fetchTrendData, {
    interval: 60000,
    autoStart: true,
    timeout: 5000,
    maxRetries: 3,
  });

  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  // Custom tooltip formatter
  interface TooltipProps {
    active?: boolean;
    payload?: Array<{
      name: string;
      value: number;
      color: string;
    }>;
    label?: string;
  }

  const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            backgroundColor: 'rgba(30, 30, 30, 0.9)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            p: 1.5,
            borderRadius: 1,
          }}
        >
          <Typography variant="body2" sx={{ mb: 1 }}>
            {label ? formatDate(label) : ''}
          </Typography>
          {payload.map((entry, index) => (
            <Box key={`item-${index}`} sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  backgroundColor: entry.color,
                  mr: 1,
                  borderRadius: '50%',
                }}
              />
              <Typography variant="caption" sx={{ mr: 1 }}>
                {entry.name}:
              </Typography>
              <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                {entry.name === 'Cost' ? `$${entry.value}` : entry.value}
              </Typography>
            </Box>
          ))}
        </Box>
      );
    }
    return null;
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'visible',
        background: 'rgba(30, 30, 30, 0.7)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        borderRadius: 2,
      }}
    >
      <CardHeader
        title={title || `${getProviderName(providerId)} Trends`}
        avatar={
          <Box className="widget-drag-handle" sx={{ cursor: 'grab', display: 'flex', alignItems: 'center', '&:active': { cursor: 'grabbing' } }}>
            <DragIndicatorIcon fontSize="small" sx={{ color: 'text.secondary' }} />
          </Box>
        }
        action={
          <IconButton
            aria-label="widget settings"
            aria-controls={open ? 'trend-widget-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleMenuClick}
          >
            <MoreVertIcon />
          </IconButton>
        }
        sx={{
          pb: 0,
          '& .MuiCardHeader-title': {
            fontSize: '1rem',
            fontWeight: 500,
          },
          '& .MuiCardHeader-avatar': {
            marginRight: 1
          }
        }}
      />
      <Menu
        id="trend-widget-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={onRemove}>
          Remove Widget
        </MenuItem>
      </Menu>

      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', pt: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <ToggleButtonGroup
            value={timeRange}
            exclusive
            onChange={handleTimeRangeChange}
            aria-label="time range"
            size="small"
          >
            <ToggleButton value="7d" aria-label="7 days">
              7D
            </ToggleButton>
            <ToggleButton value="30d" aria-label="30 days">
              30D
            </ToggleButton>
            <ToggleButton value="90d" aria-label="90 days">
              90D
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* Loading State */}
        {loading && !data && (
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <CircularProgress size={32} sx={{ mb: 2 }} />
            <Typography variant="body2" color="text.secondary">
              Loading trend data...
            </Typography>
          </Box>
        )}

        {/* Error State with Retry Button */}
        {error && (
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            p: 2,
            textAlign: 'center'
          }}>
            <ErrorIcon color="error" sx={{ fontSize: 40, mb: 2 }} />
            <Typography variant="body1" color="error" gutterBottom>
              Error loading trend data
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {error.message || 'Failed to fetch trend data'}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<RefreshIcon />}
              onClick={() => {
                if (refresh) refresh();
              }}
              sx={{ mt: 1 }}
            >
              Retry
            </Button>
          </Box>
        )}

        {/* Data Visualization */}
        {data && (
          <>
            {/* Alert for partial errors */}
            {data.some(item => item.error) && (
              <Alert
                severity="warning"
                sx={{ mb: 2 }}
                action={
                  <Button
                    color="inherit"
                    size="small"
                    onClick={() => {
                      if (refresh) refresh();
                    }}
                  >
                    Retry
                  </Button>
                }
              >
                Some data points could not be loaded
              </Alert>
            )}

            <Box sx={{ flexGrow: 1, width: '100%', height: '100%', minHeight: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={data}
                  margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                  <XAxis
                    dataKey="date"
                    tickFormatter={formatDate}
                    tick={{ fontSize: 10 }}
                    tickCount={timeRange === '7d' ? 7 : 6}
                  />
                  <YAxis yAxisId="left" tick={{ fontSize: 10 }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} />
                  <RechartsTooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="cost"
                    name="Cost"
                    stroke={getProviderColor(providerId)}
                    activeDot={{ r: 8 }}
                    strokeWidth={2}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="usage"
                    name="Usage %"
                    stroke="#8884d8"
                    strokeWidth={2}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="requests"
                    name="Requests"
                    stroke="#82ca9d"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>

            {lastUpdated && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, textAlign: 'right' }}>
                Updated: {lastUpdated.toLocaleTimeString()}
              </Typography>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default TrendAnalysisWidget;
