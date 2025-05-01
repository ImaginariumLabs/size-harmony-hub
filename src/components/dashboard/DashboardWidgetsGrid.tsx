import React, { useEffect, useState, useCallback } from 'react';
import { Box, Typography, Button, Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Settings as SettingsIcon } from '@mui/icons-material';
import DashboardWidget from '../widgets/DashboardWidget';
import RealTimeApiUsage from '../widgets/RealTimeApiUsage';
import { DashboardWidget as DashboardWidgetType } from '../../contexts/DashboardWidgetContext';
import { isElectron } from '../../services/electronService';
import WidgetErrorBoundary from '../common/WidgetErrorBoundary';

interface DashboardWidgetsGridProps {
  configuredProviders: Array<{ id: string; name: string; isConfigured: boolean }>;
  widgets: DashboardWidgetType[];
  onRemoveWidget: (id: string) => void;
  onSizeChange: (id: string, size: 'small' | 'medium' | 'large') => void;
  onToggleVisibility: (id: string) => void;
  onNavigate: (path: string) => void;
  apiCostData?: Record<string, any>;
}

const DashboardWidgetsGrid: React.FC<DashboardWidgetsGridProps> = ({
  configuredProviders,
  widgets,
  onRemoveWidget,
  onSizeChange,
  onToggleVisibility,
  onNavigate,
  apiCostData = {},
}) => {
  const navigate = useNavigate();
  const [isElectronEnv, setIsElectronEnv] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // Check if running in Electron
  useEffect(() => {
    setIsElectronEnv(isElectron());
  }, []);

  // Handle widget errors
  const handleWidgetError = useCallback((widgetId: string, error: Error) => {
    console.error(`Widget error (ID: ${widgetId}):`, error);
    setErrorMessage(`Widget error: ${error.message}`);
    setSnackbarOpen(true);
  }, []);

  return (
    <>
      {/* Bento Grid Layout */}
      <div className={`bento-grid ${isElectronEnv ? 'electron-environment' : ''}`}>
        {/* Real-Time API Usage */}
        <div className="bento-item medium cost-summary">
          <RealTimeApiUsage refreshInterval={30} />
        </div>

        {/* API Requests - Gemini */}
        <div className="bento-item medium">
          <RealTimeApiUsage provider="google" refreshInterval={30} />
        </div>

        {/* Active API Providers */}
        <div className="bento-item small">
          <div className="bento-item-header">
            <h3 className="bento-item-title">Active Providers</h3>
          </div>
          <div className="bento-item-content">
            <div className="value">{configuredProviders.length}</div>
            <Button
              size="small"
              onClick={() => onNavigate('/settings/api-keys')}
              sx={{ mt: 1 }}
              startIcon={<SettingsIcon />}
            >
              Manage
            </Button>
          </div>
        </div>

        {/* API Status */}
        <div className="bento-item medium provider-list">
          <RealTimeApiUsage refreshInterval={30} compact={true} />
        </div>

        {/* Alerts */}
        <div className="bento-item small">
          <div className="bento-item-header">
            <h3 className="bento-item-title">Alerts</h3>
          </div>
          <div className="bento-item-content">
            {Object.entries(apiCostData).map(([providerId, data]) => {
              // Only show alerts for high usage
              if (data && data.usagePercentage > 50) {
                const provider = configuredProviders.find(p => p.id === providerId);
                if (!provider) return null;

                return (
                  <div className="provider-status" key={providerId}>
                    <div className={`provider-status-indicator ${data.usagePercentage > 80 ? 'error' : 'warning'}`}></div>
                    <span className="provider-status-name">{provider.name}</span>
                    <span className="provider-status-value">{data.usagePercentage}% used</span>
                  </div>
                );
              }
              return null;
            })}

            {Object.values(apiCostData).filter(data => data && data.usagePercentage > 50).length === 0 && (
              <div className="provider-status">
                <div className="provider-status-indicator healthy"></div>
                <span className="provider-status-name">All APIs</span>
                <span className="provider-status-value">Operational</span>
              </div>
            )}

            {Object.keys(apiCostData).length === 0 && (
              <div style={{ padding: '12px 0', textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  No alerts to display
                </Typography>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bento-item medium tall">
          <div className="bento-item-header">
            <h3 className="bento-item-title">Recent Activity</h3>
          </div>
          <div className="bento-item-content">
            {/* Generate activity items based on configured providers */}
            {configuredProviders.map((provider) => {
              const providerData = apiCostData[provider.id];
              if (!providerData) return null;

              // Generate a random time for demo purposes
              const hours = new Date().getHours() - Math.floor(Math.random() * 5);
              const minutes = Math.floor(Math.random() * 60);
              const timeStr = `${hours}:${minutes < 10 ? '0' + minutes : minutes}`;

              // Generate a random number of requests
              const requests = Math.floor(Math.random() * 200) + 50;

              return (
                <div className="activity-item" key={provider.id}>
                  <div className="activity-time">Today, {timeStr} {hours >= 12 ? 'PM' : 'AM'}</div>
                  <div className="activity-description">
                    {provider.name} - {requests} requests (${providerData.total?.toFixed(2) || '0.00'})
                  </div>
                </div>
              );
            })}

            {configuredProviders.length === 0 && (
              <div style={{ padding: '12px 0', textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  No recent activity to display
                </Typography>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dashboard Widgets */}
      {widgets.length > 0 && (
        <>
          <Box sx={{ mb: 2, mt: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
              Widgets
            </Typography>
            <Button
              variant="outlined"
              size="small"
              onClick={() => navigate('/widgets')}
            >
              View All Widgets
            </Button>
          </Box>
          <div className={`bento-grid ${isElectronEnv ? 'electron-environment' : ''}`}>
            {widgets.map((widget) => (
              <div
                key={widget.id}
                className={`bento-item ${widget.size === 'small' ? 'small' : widget.size === 'medium' ? 'medium' : 'large'}`}
              >
                <WidgetErrorBoundary widgetId={widget.id} onError={handleWidgetError}>
                  <DashboardWidget
                    widget={widget}
                    onRemove={onRemoveWidget}
                    onSizeChange={onSizeChange}
                    onToggleVisibility={onToggleVisibility}
                  />
                </WidgetErrorBoundary>
              </div>
            ))}
          </div>

          {/* Error Snackbar */}
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={() => setSnackbarOpen(false)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <Alert
              onClose={() => setSnackbarOpen(false)}
              severity="error"
              variant="filled"
              sx={{ width: '100%' }}
            >
              {errorMessage}
            </Alert>
          </Snackbar>
        </>
      )}
    </>
  );
};

export default DashboardWidgetsGrid;
