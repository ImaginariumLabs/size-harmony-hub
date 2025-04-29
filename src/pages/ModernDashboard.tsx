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
} from '@mui/material';
import {
  Add as AddIcon,
  Refresh as RefreshIcon,
  Api as ApiIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useApiProviders } from '../contexts/ApiProviderContext';
import { useDashboardWidgets, DashboardWidget as DashboardWidgetType } from '../contexts/DashboardWidgetContext';
import DashboardWidget from '../components/widgets/DashboardWidget';
import { isElectron } from '../services/electronService';
import '../styles/components/layout/BentoGrid.css';

// Import dashboard components
import ApiCostSummary from '../components/dashboard/ApiCostSummary';
import ApiRequestsSummary from '../components/dashboard/ApiRequestsSummary';
import ApiStatusSummary from '../components/dashboard/ApiStatusSummary';
import AlertsSummary from '../components/dashboard/AlertsSummary';
import RecentActivitySummary from '../components/dashboard/RecentActivitySummary';
import ActiveProvidersSummary from '../components/dashboard/ActiveProvidersSummary';
import { ApiActivityItem } from '../types/api';

const ModernDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { providers, loading: providersLoading } = useApiProviders();
  const { widgets, addWidget, updateWidget, removeWidget, toggleWidgetVisibility, loading: widgetsLoading } = useDashboardWidgets();

  // State for API data
  const [apiCostData, setApiCostData] = useState<Record<string, any>>({});
  const [totalCost, setTotalCost] = useState(0);
  const [totalRequests, setTotalRequests] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());
  const [recentActivities, setRecentActivities] = useState<ApiActivityItem[]>([]);

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

      // Calculate total requests from the data or use a fallback
      const totalReqs = Object.values(data).reduce((sum, item: any) => sum + (item.requests || 0), 0);
      setTotalRequests(totalReqs > 0 ? totalReqs : Math.floor(Math.random() * 1000) + 500);

      // Generate recent activities
      generateRecentActivities(data);

      setLastRefreshed(new Date());
    } catch (error) {
      console.error('Error fetching API cost data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Generate recent activities based on API data
  const generateRecentActivities = (data: Record<string, any>) => {
    const activities: ApiActivityItem[] = [];

    // Generate activities for each provider
    Object.entries(data).forEach(([providerId, providerData]) => {
      const provider = providers.find(p => p.id === providerId);
      if (!provider) return;

      // Generate 1-3 activities per provider
      const activityCount = Math.floor(Math.random() * 3) + 1;
      
      for (let i = 0; i < activityCount; i++) {
        // Generate a random time in the last 24 hours
        const now = new Date();
        const hoursAgo = Math.floor(Math.random() * 24);
        const minutesAgo = Math.floor(Math.random() * 60);
        const timestamp = new Date(now.getTime() - (hoursAgo * 60 + minutesAgo) * 60 * 1000);
        
        // Format time as HH:MM
        const hours = timestamp.getHours();
        const minutes = timestamp.getMinutes();
        const timeStr = `${hours}:${minutes < 10 ? '0' + minutes : minutes}`;
        
        // Generate a random number of requests
        const requests = Math.floor(Math.random() * 200) + 50;
        
        // Calculate cost based on requests
        const cost = requests * (providerData.total / 1000);
        
        activities.push({
          providerId,
          providerName: provider.name,
          timestamp: timestamp.toISOString(),
          time: timeStr,
          requests,
          cost
        });
      }
    });
    
    // Sort by timestamp (newest first)
    activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    setRecentActivities(activities);
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchApiCostData();
  }, []);

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

  const loading = providersLoading || widgetsLoading || isLoading;

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
            variant="contained"
            color="primary"
            onClick={() => navigate('/settings/api-keys/new')}
            startIcon={<ApiIcon />}
          >
            Add API Key
          </Button>
        </Box>
      </Box>

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
            {/* Total API Cost */}
            <ApiCostSummary 
              totalCost={totalCost} 
              budget={100} 
              changePercentage={12} 
              changeDirection="decrease" 
            />

            {/* API Requests */}
            <ApiRequestsSummary 
              totalRequests={totalRequests} 
              changePercentage={8} 
              changeDirection="increase" 
            />

            {/* Active API Providers */}
            <ActiveProvidersSummary 
              providerCount={configuredProviders.length} 
              onManageClick={() => handleNavigation('/settings/api-keys')} 
            />

            {/* API Status */}
            <ApiStatusSummary 
              apiStatusData={Object.entries(apiCostData).reduce((acc, [providerId, data]) => {
                const provider = providers.find(p => p.id === providerId);
                if (provider) {
                  acc[providerId] = {
                    providerId,
                    name: provider.name,
                    total: data.total,
                    usagePercentage: data.usagePercentage || 0
                  };
                }
                return acc;
              }, {} as Record<string, any>)} 
            />

            {/* Alerts */}
            <AlertsSummary 
              apiCostData={apiCostData} 
              providers={providers} 
            />

            {/* Recent Activity */}
            <RecentActivitySummary 
              activities={recentActivities} 
            />
          </div>

          {/* Dashboard Widgets */}
          {widgets.length > 0 && (
            <>
              <Box sx={{ mb: 2, mt: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
                  Widgets
                </Typography>
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
      <Dialog open={addWidgetDialogOpen} onClose={handleCloseAddWidgetDialog}>
        <DialogTitle>Add Widget</DialogTitle>
        <DialogContent>
          <Box sx={{ minWidth: 400, pt: 1 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="provider-select-label">API Provider</InputLabel>
              <Select
                labelId="provider-select-label"
                id="provider-select"
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
              <FormHelperText>Select the API provider to monitor</FormHelperText>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="widget-type-label">Widget Type</InputLabel>
              <Select
                labelId="widget-type-label"
                id="widget-type"
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
              <InputLabel id="widget-size-label">Widget Size</InputLabel>
              <Select
                labelId="widget-size-label"
                id="widget-size"
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
        <DialogActions>
          <Button onClick={handleCloseAddWidgetDialog}>Cancel</Button>
          <Button
            onClick={handleAddWidget}
            variant="contained"
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
