import React, { useState, useEffect, useCallback } from 'react';
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
  Tooltip,
  CircularProgress,
  Button,
  Alert,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  DragIndicator as DragIndicatorIcon,
  Refresh as RefreshIcon,
  ErrorOutline as ErrorIcon,
} from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell, LabelList } from 'recharts';
import { getMockProviderData } from '../../services/mockDataService';
import useRealTimeData from '../../hooks/useRealTimeData';

interface ComparisonWidgetProps {
  providers: string[];
  title: string;
  metricType: 'cost' | 'usage' | 'quota';
  onRemove: () => void;
}

/**
 * ComparisonWidget component
 *
 * Displays a comparison of metrics across multiple API providers.
 */
const ComparisonWidget: React.FC<ComparisonWidgetProps> = ({
  providers,
  title,
  metricType,
  onRemove,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Handle menu open
  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // Handle menu close
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Handle sort order change
  const handleSortOrderChange = (order: 'asc' | 'desc') => {
    setSortOrder(order);
    handleMenuClose();
  };

  // Get provider color
  const getProviderColor = (providerId: string): string => {
    switch (providerId) {
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
  const getProviderName = (providerId: string): string => {
    switch (providerId) {
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
        return providerId;
    }
  };

  // Fetch data for all providers with enhanced error handling
  const fetchComparisonData = useCallback(async () => {
    try {
      // Simulate random network error (10% chance)
      if (Math.random() < 0.1) {
        throw new Error('Network error: Failed to fetch comparison data');
      }

      // In a real app, this would fetch data from an API
      const data = providers.map(providerId => {
        try {
          const providerData = getMockProviderData(providerId);

          let value = 0;
          let unit = '';

          switch (metricType) {
            case 'cost':
              value = providerData.total;
              unit = '$';
              break;
            case 'usage':
              value = Math.floor(Math.random() * 100);
              unit = '%';
              break;
            case 'quota':
              value = Math.floor(Math.random() * 10000);
              unit = '';
              break;
            default:
              // Handle unexpected metric type
              console.warn(`Unknown metric type: ${metricType}, defaulting to cost`);
              value = providerData.total;
              unit = '$';
          }

          return {
            providerId,
            name: getProviderName(providerId),
            value,
            unit,
            color: getProviderColor(providerId),
          };
        } catch (err) {
          console.error(`Error processing provider ${providerId}:`, err);
          // Return fallback data for this provider
          return {
            providerId,
            name: getProviderName(providerId),
            value: 0,
            unit: metricType === 'cost' ? '$' : metricType === 'usage' ? '%' : '',
            color: getProviderColor(providerId),
            error: true,
          };
        }
      });

      return data;
    } catch (err) {
      console.error('Error in fetchComparisonData:', err);
      throw err; // Let the useRealTimeData hook handle the error
    }
  }, [providers, metricType]);

  // Use real-time data hook
  const { data, loading, error, lastUpdated } = useRealTimeData(fetchComparisonData, {
    interval: 30000,
    autoStart: true,
    timeout: 5000,
    maxRetries: 3,
  });

  // Sort data based on sort order
  const sortedData = React.useMemo(() => {
    if (!data) return [];

    return [...data].sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.value - b.value;
      } else {
        return b.value - a.value;
      }
    });
  }, [data, sortOrder]);

  // Format value based on metric type
  const formatValue = (value: number, unit: string) => {
    if (metricType === 'cost') {
      return `${unit}${value.toFixed(2)}`;
    } else if (metricType === 'quota') {
      return value.toLocaleString();
    } else {
      return `${value}${unit}`;
    }
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
        title={title}
        avatar={
          <Box className="widget-drag-handle" sx={{ cursor: 'grab', display: 'flex', alignItems: 'center', '&:active': { cursor: 'grabbing' } }}>
            <DragIndicatorIcon fontSize="small" sx={{ color: 'text.secondary' }} />
          </Box>
        }
        action={
          <IconButton
            aria-label="widget settings"
            aria-controls={open ? 'comparison-widget-menu' : undefined}
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
        id="comparison-widget-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleSortOrderChange('desc')}>
          <ArrowDownwardIcon fontSize="small" sx={{ mr: 1 }} />
          Sort Descending
        </MenuItem>
        <MenuItem onClick={() => handleSortOrderChange('asc')}>
          <ArrowUpwardIcon fontSize="small" sx={{ mr: 1 }} />
          Sort Ascending
        </MenuItem>
        <Divider />
        <MenuItem onClick={onRemove}>
          Remove Widget
        </MenuItem>
      </Menu>

      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', pt: 1 }}>
        {/* Loading State */}
        {loading && !data && (
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <CircularProgress size={32} sx={{ mb: 2 }} />
            <Typography variant="body2" color="text.secondary">
              Loading comparison data...
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
              Error loading data
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {error.message || 'Failed to fetch comparison data'}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<RefreshIcon />}
              onClick={() => {
                // Trigger a refresh of the data
                const { refresh } = useRealTimeData(fetchComparisonData, {
                  interval: 30000,
                  autoStart: true,
                  timeout: 5000,
                  maxRetries: 3,
                });
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
                      // Trigger a refresh of the data
                      const { refresh } = useRealTimeData(fetchComparisonData, {
                        interval: 30000,
                        autoStart: true,
                        timeout: 5000,
                        maxRetries: 3,
                      });
                      if (refresh) refresh();
                    }}
                  >
                    Retry
                  </Button>
                }
              >
                Some provider data could not be loaded
              </Alert>
            )}

            <Box sx={{ flexGrow: 1, width: '100%', height: '100%', minHeight: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={sortedData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" hide />
                  <YAxis
                    dataKey="name"
                    type="category"
                    width={60}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Bar dataKey="value" barSize={20} radius={[0, 4, 4, 0]}>
                    {sortedData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                    <LabelList
                      dataKey="value"
                      position="right"
                      formatter={(value: number, entry: { unit: string }) => formatValue(value, entry.unit)}
                    />
                  </Bar>
                </BarChart>
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

export default ComparisonWidget;
