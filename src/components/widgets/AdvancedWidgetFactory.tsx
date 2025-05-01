import React, { useState, useCallback } from 'react';
import { Box, Typography, Button, CircularProgress, Alert } from '@mui/material';
import { ErrorOutline as ErrorIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import ComparisonWidget from './ComparisonWidget';
import TrendAnalysisWidget from './TrendAnalysisWidget';
import CustomMetricWidget from './CustomMetricWidget';
import AlertWidget from './AlertWidget';
import { withRetryAndTimeout } from '../../utils/retryUtils';

export type AdvancedWidgetType = 'comparison' | 'trend' | 'custom' | 'alert';

// Base config interface with common properties
interface BaseWidgetConfig {
  title?: string;
}

// Specific config interfaces for each widget type
interface ComparisonWidgetConfig extends BaseWidgetConfig {
  providers?: string[];
  metricType?: 'cost' | 'usage' | 'quota';
}

interface TrendWidgetConfig extends BaseWidgetConfig {
  providerId?: string;
}

interface CustomWidgetConfig extends BaseWidgetConfig {
  metricType?: 'percentage' | 'value' | 'ratio' | 'distribution';
  metricConfig?: {
    target?: number;
    threshold?: number;
    unit?: string;
    labels?: string[];
    colors?: string[];
  };
  label?: string;
}

interface AlertWidgetConfig extends BaseWidgetConfig {
  // No additional properties needed for alert widget
}

// Union type for all possible config types
export type AdvancedWidgetConfig =
  | ComparisonWidgetConfig
  | TrendWidgetConfig
  | CustomWidgetConfig
  | AlertWidgetConfig;

interface AdvancedWidgetFactoryProps {
  type: AdvancedWidgetType;
  config: AdvancedWidgetConfig;
  onRemove: () => void;
  onEdit?: () => void;
}

/**
 * AdvancedWidgetFactory component
 *
 * Factory component that renders different types of advanced widgets based on the provided type.
 * Includes error handling, retry mechanisms, and fallback UI.
 */
const AdvancedWidgetFactory: React.FC<AdvancedWidgetFactoryProps> = ({
  type,
  config,
  onRemove,
  onEdit,
}) => {
  // State for error handling
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // Mock fetch functions for demo purposes with enhanced error handling
  const fetchAlerts = useCallback(async () => {
    try {
      setIsLoading(true);

      // Use retry utility for better error handling
      return await withRetryAndTimeout(
        async () => {
          // Simulate API call delay
          await new Promise(resolve => setTimeout(resolve, 500));

          // Randomly throw an error for testing (10% chance)
          if (Math.random() < 0.1) {
            throw new Error('Failed to fetch alerts: Service temporarily unavailable');
          }

          // Generate random alerts
          const alertTypes = ['error', 'warning', 'info'];
          const providers = ['OpenAI', 'Claude', 'Google', 'GitHub'];
          const messages = [
            'API rate limit exceeded',
            'Unusual usage pattern detected',
            'Cost threshold exceeded',
            'API response time degraded',
            'New API version available',
            'Service disruption reported',
            'Authentication token expiring soon',
          ];

          const now = new Date();
          const alerts = Array.from({ length: Math.floor(Math.random() * 5) + 1 }, (_, i) => {
            const alertType = alertTypes[Math.floor(Math.random() * alertTypes.length)] as 'error' | 'warning' | 'info';
            const provider = providers[Math.floor(Math.random() * providers.length)];
            const message = messages[Math.floor(Math.random() * messages.length)];
            const timestamp = new Date(now.getTime() - Math.random() * 86400000 * 3).toISOString();

            return {
              id: `alert-${i}-${Date.now()}`,
              type: alertType,
              message,
              timestamp,
              provider,
              acknowledged: Math.random() > 0.7,
            };
          });

          return alerts;
        },
        5000, // 5 second timeout
        [], // Fallback to empty array if all retries fail
        {
          maxRetries: 3,
          onRetry: (attempt) => {
            console.log(`Retrying alert fetch (attempt ${attempt})`);
            setRetryCount(attempt);
          }
        }
      );
    } catch (err) {
      console.error('Error fetching alerts:', err);
      setError(err instanceof Error ? err : new Error('Unknown error fetching alerts'));
      return []; // Return empty array as fallback
    } finally {
      setIsLoading(false);
    }
  }, []);

  const acknowledgeAlert = useCallback(async (alertId: string) => {
    try {
      setIsLoading(true);

      // Use retry utility for better error handling
      await withRetryAndTimeout(
        async () => {
          // Simulate API call delay
          await new Promise(resolve => setTimeout(resolve, 1000));

          // Randomly throw an error for testing (10% chance)
          if (Math.random() < 0.1) {
            throw new Error(`Failed to acknowledge alert ${alertId}: Network error`);
          }

          console.log(`Alert ${alertId} acknowledged`);
        },
        5000, // 5 second timeout
        undefined, // No fallback needed for this operation
        {
          maxRetries: 3,
          onRetry: (attempt) => {
            console.log(`Retrying alert acknowledgment (attempt ${attempt})`);
            setRetryCount(attempt);
          }
        }
      );

      return true;
    } catch (err) {
      console.error(`Error acknowledging alert ${alertId}:`, err);
      setError(err instanceof Error ? err : new Error(`Unknown error acknowledging alert ${alertId}`));
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchCustomMetricData = useCallback(async () => {
    try {
      setIsLoading(true);

      // Use retry utility for better error handling
      return await withRetryAndTimeout(
        async () => {
          // Simulate API call delay
          await new Promise(resolve => setTimeout(resolve, 500));

          // Randomly throw an error for testing (10% chance)
          if (Math.random() < 0.1) {
            throw new Error('Failed to fetch custom metric data: Service temporarily unavailable');
          }

          switch (config.metricType) {
            case 'percentage':
              return {
                value: Math.floor(Math.random() * 100),
                label: config.label || 'Completion',
              };

            case 'value':
              const baseValue = 1000 + Math.floor(Math.random() * 9000);
              const change = Math.floor(Math.random() * 500) * (Math.random() > 0.5 ? 1 : -1);
              return {
                value: baseValue,
                change,
                changePercentage: (change / baseValue) * 100,
                label: config.label || 'Total Requests',
              };

            case 'ratio':
              const total = 10000;
              const current = Math.floor(Math.random() * total);
              return {
                current,
                total,
                label: config.label || 'Usage',
              };

            case 'distribution':
              return {
                distribution: [
                  { name: 'OpenAI', value: 400 + Math.floor(Math.random() * 300) },
                  { name: 'Claude', value: 300 + Math.floor(Math.random() * 200) },
                  { name: 'Google', value: 200 + Math.floor(Math.random() * 200) },
                  { name: 'GitHub', value: 100 + Math.floor(Math.random() * 100) },
                ],
                label: config.label || 'API Usage Distribution',
              };

            default:
              return {
                value: 0,
                label: 'Unknown metric type',
              };
          }
        },
        5000, // 5 second timeout
        { value: 0, label: 'Error fetching data' }, // Fallback data
        {
          maxRetries: 3,
          onRetry: (attempt) => {
            console.log(`Retrying custom metric fetch (attempt ${attempt})`);
            setRetryCount(attempt);
          }
        }
      );
    } catch (err) {
      console.error('Error fetching custom metric data:', err);
      setError(err instanceof Error ? err : new Error('Unknown error fetching custom metric data'));
      return { value: 0, label: 'Error fetching data' }; // Return fallback data
    } finally {
      setIsLoading(false);
    }
  }, [config.metricType, config.label]);

  // Function to handle retry
  const handleRetry = useCallback(() => {
    setError(null);
    setRetryCount(0);
    // Force re-render to trigger data fetching
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 100);
  }, []);

  // Render error state if there's an error
  if (error) {
    return (
      <Box sx={{
        p: 3,
        borderRadius: 2,
        bgcolor: 'rgba(211, 47, 47, 0.1)',
        border: '1px solid rgba(211, 47, 47, 0.3)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <ErrorIcon color="error" sx={{ fontSize: 40, mb: 2 }} />
        <Typography variant="h6" color="error" gutterBottom>
          Widget Error
        </Typography>
        <Typography variant="body2" sx={{ mb: 2, textAlign: 'center' }}>
          {error.message}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<RefreshIcon />}
          onClick={handleRetry}
        >
          Retry
        </Button>
      </Box>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <Box sx={{
        p: 3,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <CircularProgress size={40} sx={{ mb: 2 }} />
        <Typography variant="body2">
          Loading widget data...
        </Typography>
        {retryCount > 0 && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
            Retry attempt: {retryCount}
          </Typography>
        )}
      </Box>
    );
  }

  // Render the appropriate widget based on type with proper type checking
  try {
    switch (type) {
      case 'comparison':
        // Type guard for ComparisonWidgetConfig
        if ('providers' in config && 'metricType' in config) {
          return (
            <ComparisonWidget
              providers={config.providers || ['openai', 'claude', 'google']}
              title={config.title || 'API Provider Comparison'}
              metricType={config.metricType || 'cost'}
              onRemove={onRemove}
            />
          );
        }
        return (
          <ComparisonWidget
            providers={['openai', 'claude', 'google']}
            title={config.title || 'API Provider Comparison'}
            metricType={'cost'}
            onRemove={onRemove}
          />
        );

      case 'trend':
        // Type guard for TrendWidgetConfig
        if ('providerId' in config) {
          return (
            <TrendAnalysisWidget
              providerId={config.providerId || 'openai'}
              title={config.title || 'Usage Trends'}
              onRemove={onRemove}
            />
          );
        }
        return (
          <TrendAnalysisWidget
            providerId={'openai'}
            title={config.title || 'Usage Trends'}
            onRemove={onRemove}
          />
        );

      case 'custom':
        // Type guard for CustomWidgetConfig
        if ('metricType' in config && 'metricConfig' in config) {
          return (
            <CustomMetricWidget
              title={config.title || 'Custom Metric'}
              metricType={config.metricType || 'value'}
              metricConfig={config.metricConfig || {}}
              fetchFunction={fetchCustomMetricData}
              onRemove={onRemove}
              onEdit={onEdit || (() => {})}
            />
          );
        }
        return (
          <CustomMetricWidget
            title={config.title || 'Custom Metric'}
            metricType={'value'}
            metricConfig={{}}
            fetchFunction={fetchCustomMetricData}
            onRemove={onRemove}
            onEdit={onEdit || (() => {})}
          />
        );

      case 'alert':
        return (
          <AlertWidget
            title={config.title || 'Alerts & Notifications'}
            onRemove={onRemove}
            onConfigure={onEdit || (() => {})}
            fetchAlerts={fetchAlerts}
            onAcknowledgeAlert={(alertId) => {
              acknowledgeAlert(alertId);
              return Promise.resolve();
            }}
          />
        );

      default:
        return (
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="body1" color="error">
              Unknown widget type: {type}
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              size="small"
              onClick={onRemove}
              sx={{ mt: 2 }}
            >
              Remove Widget
            </Button>
          </Box>
        );
    }
  } catch (err) {
    console.error('Error rendering widget:', err);
    setError(err instanceof Error ? err : new Error('Unknown error rendering widget'));

    // Return a fallback UI
    return (
      <Box sx={{
        p: 3,
        borderRadius: 2,
        bgcolor: 'rgba(211, 47, 47, 0.1)',
        border: '1px solid rgba(211, 47, 47, 0.3)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <ErrorIcon color="error" sx={{ fontSize: 40, mb: 2 }} />
        <Typography variant="h6" color="error" gutterBottom>
          Widget Rendering Error
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<RefreshIcon />}
          onClick={handleRetry}
          sx={{ mt: 2 }}
        >
          Retry
        </Button>
        <Button
          variant="outlined"
          color="error"
          size="small"
          onClick={onRemove}
          sx={{ mt: 1 }}
        >
          Remove Widget
        </Button>
      </Box>
    );
  }
};

export default AdvancedWidgetFactory;
