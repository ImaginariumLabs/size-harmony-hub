import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  Paper,
} from '@mui/material';
import RealTimeApiUsage from '../components/widgets/RealTimeApiUsage';
import {
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Api as ApiIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
  Settings as SettingsIcon,
  ViewDay as ViewDayIcon,
  ViewInAr as ViewInArIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useApiProviders } from '../contexts/ApiProviderContext';
import { useDashboardWidgets, DashboardWidget as DashboardWidgetType } from '../contexts/DashboardWidgetContext';
import DashboardWidget from '../components/widgets/DashboardWidget';
import MultiviewDisplay from '../components/widgets/MultiviewDisplay';
import { isElectron } from '../services/electronService';
import '../styles/components/layout/BentoGrid.css';

const ModernDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { providers, loading: providersLoading } = useApiProviders();
  const { widgets, addWidget, updateWidget, removeWidget, toggleWidgetVisibility, loading: widgetsLoading } = useDashboardWidgets();

  // Handle navigation in Electron environment
  const handleNavigation = (path: string) => {
    try {
      navigate(path);
    } catch (error) {
      console.error('Navigation error:', error);
      // If navigation fails in Electron, handle it gracefully
      if (isElectron()) {
        console.log('Electron environment detected, handling navigation differently');
        // In a real app, you might use IPC to communicate with the main process
        // For now, just log the intended navigation
        console.log('Would navigate to:', path);
      }
    }
  };

  const [addWidgetDialogOpen, setAddWidgetDialogOpen] = useState(false);
  const [newWidget, setNewWidget] = useState<Omit<DashboardWidgetType, 'id'>>({
    providerId: '',
    type: 'cost',
    size: 'medium',
    position: { x: 0, y: 0 },
    isVisible: true
  });

  // Add a refresh function
  const [lastRefreshed, setLastRefreshed] = useState(new Date());
  const [showMultiview, setShowMultiview] = useState(false);

  const configuredProviders = providers.filter(provider => provider.isConfigured);
  const unconfiguredProviders = providers.filter(provider => !provider.isConfigured);

  // Handle opening the add widget dialog
  const handleOpenAddWidgetDialog = () => {
    if (configuredProviders.length > 0) {
      setNewWidget(prev => ({
        ...prev,
        providerId: configuredProviders[0].id
      }));
    }
    setAddWidgetDialogOpen(true);
  };

  // Handle closing the add widget dialog
  const handleCloseAddWidgetDialog = () => {
    setAddWidgetDialogOpen(false);
  };

  // Handle adding a new widget
  const handleAddWidget = () => {
    addWidget(newWidget);
    handleCloseAddWidgetDialog();
  };

  // Handle widget size change
  const handleWidgetSizeChange = (id: string, size: 'small' | 'medium' | 'large') => {
    updateWidget(id, { size });
  };

  // State for API cost data
  const [apiCostData, setApiCostData] = useState<Record<string, any>>({});
  const [totalCost, setTotalCost] = useState(0);
  const [totalRequests, setTotalRequests] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch API cost data
  const fetchApiCostData = async () => {
    setIsLoading(true);
    try {
      // Import the API integration service
      const { fetchAllApiData } = await import('../services/apiIntegrationService');
      const data = await fetchAllApiData();

      setApiCostData(data);

      // Calculate total cost
      const total = Object.values(data).reduce((sum, item: any) => sum + item.total, 0);
      setTotalCost(total);

      // Calculate total requests (this is a mock value for now)
      setTotalRequests(Math.floor(Math.random() * 1000) + 500);

      setLastRefreshed(new Date());
    } catch (error) {
      console.error('Error fetching API cost data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchApiCostData();
  }, []);

  // Calculate total monthly cost
  const calculateTotalCost = () => {
    return totalCost;
  };

  // Calculate total API requests
  const calculateTotalRequests = () => {
    return totalRequests;
  };

  const handleRefresh = async () => {
    // Fetch fresh data
    await fetchApiCostData();
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

  const loading = providersLoading || widgetsLoading;

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          API Dashboard Overview
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Last updated: {formatLastRefreshed()}
          </Typography>
          <Tooltip title="Refresh data">
            <IconButton onClick={handleRefresh} size="small">
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleOpenAddWidgetDialog}
            disabled={configuredProviders.length === 0}
            startIcon={<AddIcon />}
          >
            Add Widget
          </Button>
          <Button
            variant={showMultiview ? "contained" : "outlined"}
            color="primary"
            onClick={() => setShowMultiview(!showMultiview)}
            startIcon={<ViewDayIcon />}
            sx={{ mr: 1 }}
          >
            Multiview
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => navigate('/floating-widgets')}
            startIcon={<ViewInArIcon />}
          >
            Floating Widgets
          </Button>
        </Box>
      </Box>

      {/* Multiview Display */}
      {showMultiview && (
        <Box sx={{ mb: 4 }}>
          <MultiviewDisplay onClose={() => setShowMultiview(false)} />
        </Box>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : configuredProviders.length === 0 ? (
        <Card sx={{ mb: 4, p: 2, textAlign: 'center', borderRadius: '16px', background: 'rgba(30, 30, 30, 0.7)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <CardContent>
            <Typography variant="h5" component="div" sx={{ mb: 2, fontWeight: 600 }}>
              Welcome to APIwidget!
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Get started by adding your first API key to monitor usage and costs.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => handleNavigation('/settings/api-keys/new')}
              startIcon={<ApiIcon />}
            >
              Add Your First API Key
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Bento Grid Layout */}
          <div className="bento-grid">
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
                  onClick={() => handleNavigation('/settings/api-keys')}
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
                {Object.entries(apiCostData).map(([providerId, data]: [string, any]) => {
                  // Only show alerts for high usage
                  if (data.usagePercentage > 50) {
                    const provider = providers.find(p => p.id === providerId);
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

                {Object.values(apiCostData).filter((data: any) => data.usagePercentage > 50).length === 0 && (
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
                        {provider.name} - {requests} requests (${providerData.total.toFixed(2)})
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
              <div className="bento-grid">
                {widgets.map((widget) => (
                  <div
                    key={widget.id}
                    className={`bento-item ${widget.size === 'small' ? 'small' : widget.size === 'medium' ? 'medium' : 'large'}`}
                  >
                    <DashboardWidget
                      widget={widget}
                      onRemove={removeWidget}
                      onSizeChange={handleWidgetSizeChange}
                      onToggleVisibility={toggleWidgetVisibility}
                    />
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}

      {/* Add Widget Dialog */}
      <Dialog open={addWidgetDialogOpen} onClose={handleCloseAddWidgetDialog} PaperProps={{
        style: {
          borderRadius: '16px',
          background: 'rgba(30, 30, 30, 0.95)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }
      }}>
        <DialogTitle sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
          Add New Widget
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Box sx={{ mt: 2 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="widget-provider-select-label">API Provider</InputLabel>
              <Select
                labelId="widget-provider-select-label"
                value={newWidget.providerId}
                label="API Provider"
                onChange={(e) => setNewWidget({ ...newWidget, providerId: e.target.value })}
              >
                {configuredProviders.map((provider) => (
                  <MenuItem key={provider.id} value={provider.id}>
                    {provider.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="widget-type-select-label">Widget Type</InputLabel>
              <Select
                labelId="widget-type-select-label"
                value={newWidget.type}
                label="Widget Type"
                onChange={(e) => setNewWidget({ ...newWidget, type: e.target.value as any })}
              >
                <MenuItem value="cost">Cost</MenuItem>
                <MenuItem value="usage">Usage</MenuItem>
                <MenuItem value="quota">Quota</MenuItem>
                <MenuItem value="history">History</MenuItem>
              </Select>
              <FormHelperText>Select the type of data to display</FormHelperText>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel id="widget-size-select-label">Widget Size</InputLabel>
              <Select
                labelId="widget-size-select-label"
                value={newWidget.size}
                label="Widget Size"
                onChange={(e) => setNewWidget({ ...newWidget, size: e.target.value as any })}
              >
                <MenuItem value="small">Small</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="large">Large</MenuItem>
              </Select>
              <FormHelperText>Select the widget size</FormHelperText>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)', p: 2 }}>
          <Button onClick={handleCloseAddWidgetDialog}>Cancel</Button>
          <Button
            onClick={handleAddWidget}
            variant="contained"
            color="primary"
            disabled={!newWidget.providerId}
          >
            Add Widget
          </Button>
        </DialogActions>
      </Dialog>

      {/* Floating Action Button for adding widgets */}
      <Fab
        color="primary"
        aria-label="add widget"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          background: 'linear-gradient(135deg, #64b5f6, #2196f3)',
          '&:hover': {
            background: 'linear-gradient(135deg, #2196f3, #1976d2)',
          }
        }}
        onClick={handleOpenAddWidgetDialog}
        disabled={configuredProviders.length === 0}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
};

export default ModernDashboard;
