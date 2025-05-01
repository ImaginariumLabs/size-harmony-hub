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
  CircularProgress,
  LinearProgress,
  Button,
  Alert,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  DragIndicator as DragIndicatorIcon,
  Edit as EditIcon,
  Refresh as RefreshIcon,
  ErrorOutline as ErrorIcon,
} from '@mui/icons-material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import useRealTimeData from '../../hooks/useRealTimeData';

interface CustomMetricWidgetProps {
  title: string;
  metricType: 'percentage' | 'value' | 'ratio' | 'distribution';
  metricConfig: {
    target?: number;
    threshold?: number;
    unit?: string;
    labels?: string[];
    colors?: string[];
  };
  fetchFunction: () => Promise<{
    value?: number;
    label?: string;
    change?: number;
    changePercentage?: number;
    current?: number;
    total?: number;
    distribution?: Array<{
      name: string;
      value: number;
    }>;
  }>;
  onRemove: () => void;
  onEdit: () => void;
}

/**
 * CustomMetricWidget component
 *
 * Displays custom metrics with various visualization options.
 */
const CustomMetricWidget: React.FC<CustomMetricWidgetProps> = ({
  title,
  metricType,
  metricConfig,
  fetchFunction,
  onRemove,
  onEdit,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  // Handle menu open
  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // Handle menu close
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Use real-time data hook with enhanced error handling
  const { data, loading, error, lastUpdated, refresh } = useRealTimeData(fetchFunction, {
    interval: 30000,
    autoStart: true,
    timeout: 5000,
    maxRetries: 3,
  });

  // Get status color based on value and threshold
  const getStatusColor = (value: number, target: number, threshold: number): string => {
    const ratio = value / target;

    if (ratio >= threshold) {
      return '#4caf50'; // Green
    } else if (ratio >= threshold * 0.7) {
      return '#ff9800'; // Orange
    } else {
      return '#f44336'; // Red
    }
  };

  // Render metric content based on type
  const renderMetricContent = () => {
    if (!data) return null;

    switch (metricType) {
      case 'percentage':
        const percentage = data.value;
        const target = metricConfig.target || 100;
        const threshold = metricConfig.threshold || 0.8;
        const statusColor = getStatusColor(percentage, target, threshold);

        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <Box sx={{ position: 'relative', display: 'inline-flex', mb: 2 }}>
              <CircularProgress
                variant="determinate"
                value={percentage > 100 ? 100 : percentage}
                size={120}
                thickness={5}
                sx={{ color: statusColor }}
              />
              <Box
                sx={{
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  position: 'absolute',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="h4" component="div" color="text.primary">
                  {percentage}%
                </Typography>
              </Box>
            </Box>
            <Typography variant="body2" color="text.secondary">
              {data.label || 'of target'}
            </Typography>
          </Box>
        );

      case 'value':
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <Typography variant="h3" component="div" sx={{ mb: 1 }}>
              {metricConfig.unit || ''}{data.value.toLocaleString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {data.label || ''}
            </Typography>
            {data.change !== undefined && (
              <Typography
                variant="body2"
                color={data.change >= 0 ? 'success.main' : 'error.main'}
                sx={{ mt: 1, display: 'flex', alignItems: 'center' }}
              >
                {data.change >= 0 ? '↑' : '↓'} {Math.abs(data.change).toLocaleString()} ({Math.abs(data.changePercentage || 0).toFixed(1)}%)
              </Typography>
            )}
          </Box>
        );

      case 'ratio':
        const current = data.current;
        const total = data.total;
        const ratio = (current / total) * 100;

        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <Typography variant="h3" component="div" sx={{ mb: 1 }}>
              {current.toLocaleString()} / {total.toLocaleString()}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {data.label || ''}
            </Typography>
            <Box sx={{ width: '80%' }}>
              <LinearProgress
                variant="determinate"
                value={ratio > 100 ? 100 : ratio}
                sx={{
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 5,
                  }
                }}
              />
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {ratio.toFixed(1)}% utilized
            </Typography>
          </Box>
        );

      case 'distribution':
        const COLORS = metricConfig.colors || ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

        // Custom tooltip
        interface DistributionTooltipProps {
          active?: boolean;
          payload?: Array<{
            name: string;
            value: number;
            payload: {
              name: string;
              value: number;
            };
          }>;
        }

        const CustomTooltip = ({ active, payload }: DistributionTooltipProps) => {
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
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  {payload[0].name}: {payload[0].value}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {((payload[0].value / data.distribution.reduce((sum: number, item: { value: number }) => sum + item.value, 0)) * 100).toFixed(1)}%
                </Typography>
              </Box>
            );
          }
          return null;
        };

        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <Box sx={{ width: '100%', height: 180 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.distribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    innerRadius={40}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                  >
                    {data.distribution.map((entry: { name: string; value: number }, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {data.label || 'Distribution'}
            </Typography>
          </Box>
        );

      default:
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <Typography variant="body1" color="text.secondary">
              Metric type not supported
            </Typography>
          </Box>
        );
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
            aria-controls={open ? 'custom-metric-widget-menu' : undefined}
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
        id="custom-metric-widget-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => { onEdit(); handleMenuClose(); }}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Edit Metric
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => { onRemove(); handleMenuClose(); }}>
          Remove Widget
        </MenuItem>
      </Menu>

      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', pt: 1 }}>
        {/* Loading State */}
        {loading && !data && (
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <CircularProgress size={32} sx={{ mb: 2 }} />
            <Typography variant="body2" color="text.secondary">
              Loading metric data...
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
              Error loading metric data
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {error.message || 'Failed to fetch metric data'}
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
            {/* Check for error property in data */}
            {data.error && (
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
                Some metric data could not be loaded
              </Alert>
            )}

            <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {renderMetricContent()}
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

export default CustomMetricWidget;
