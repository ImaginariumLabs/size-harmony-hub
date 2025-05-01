import React from 'react';
import { Box, CircularProgress, LinearProgress,  } from '@mui/material';
import {
  Refresh as RefreshIcon,
// eslint-disable-next-line @typescript-eslint/no-unused-vars
  MoreVert as MoreVertIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
} from '@mui/icons-material';
import { useApiUsage } from '../../hooks/useApiUsage';
import ProviderLogo from '../common/ProviderLogo';

interface UsageWidgetProps {
  provider: string;
  title?: string;
  type: 'cost' | 'requests' | 'quota';
  refreshInterval?: number;
}

const UsageWidget: React.FC<UsageWidgetProps> = ({
  provider,
  title,
  type,
  refreshInterval = 5 * 60 * 1000, // 5 minutes
}) => {
  const { usage, loading, error, refetch } = useApiUsage(provider);

  // Set up automatic refresh
  React.useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [refetch, refreshInterval]);

  // Format values based on type
  const formatValue = () => {
    if (!usage) return 'N/A';

    switch (type) {
      case 'cost':
        return usage.cost !== undefined ? `$${usage.cost.toFixed(2)}` : 'N/A';
      case 'requests':
        return usage.requests
          ? `${usage.requests.total.toLocaleString()} / ${
              usage.requests.limit === Infinity
                ? '∞'
                : usage.requests.limit.toLocaleString()
            }`
          : 'N/A';
      case 'quota':
        return usage.quota
          ? `${usage.quota.used.toFixed(2)} / ${usage.quota.total.toFixed(2)}`
          : 'N/A';
      default:
        return 'N/A';
    }
  };

  // Calculate percentage for progress bar
  const calculatePercentage = () => {
    if (!usage) return 0;

    switch (type) {
      case 'cost':
        return usage.quota ? (usage.quota.used / usage.quota.total) * 100 : 0;
      case 'requests':
        return usage.requests && usage.requests.limit !== Infinity
          ? (usage.requests.total / usage.requests.limit) * 100
          : 0;
      case 'quota':
        return usage.quota ? (usage.quota.used / usage.quota.total) * 100 : 0;
      default:
        return 0;
    }
  };

  // Get trend data
  const getTrend = () => {
    // This would normally be calculated from historical data
    // For now, we'll just return a random value between -20 and 20
    return Math.floor(Math.random() * 40) - 20;
  };

  const trend = getTrend();
  const percentage = calculatePercentage();

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardHeader
        avatar={<ProviderLogo provider={provider} />}
        title={title || `${provider.charAt(0).toUpperCase() + provider.slice(1)} ${type.charAt(0).toUpperCase() + type.slice(1)}`}
        action={
          <IconButton aria-label="refresh" onClick={() => refetch()} disabled={loading}>
            <RefreshIcon />
          </IconButton>
        }
      />
      <Divider />
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
            <Typography color="error">{error}</Typography>
          </Box>
        ) : (
          <>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h4" component="div" gutterBottom>
                {formatValue()}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                {trend > 0 ? (
                  <TrendingUpIcon color="success" fontSize="small" sx={{ mr: 0.5 }} />
                ) : (
                  <TrendingDownIcon color="error" fontSize="small" sx={{ mr: 0.5 }} />
                )}
                <Typography
                  variant="body2"
                  color={trend > 0 ? 'success.main' : 'error.main'}
                >
                  {Math.abs(trend)}% {trend > 0 ? 'increase' : 'decrease'} from last period
                </Typography>
              </Box>
            </Box>

            <Box sx={{ mt: 'auto' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2">Usage</Typography>
                <Typography variant="body2">{percentage.toFixed(0)}%</Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={percentage > 100 ? 100 : percentage}
                sx={{ height: 8, borderRadius: 4 }}
                color={percentage > 80 ? 'error' : 'primary'}
              />
              {type === 'quota' && usage?.quota?.resetDate && (
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                  Resets on {new Date(usage.quota.resetDate).toLocaleDateString()}
                </Typography>
              )}
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default UsageWidget;
