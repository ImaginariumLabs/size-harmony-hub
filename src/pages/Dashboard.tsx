import React, { useState } from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {
  Box,
  CircularProgress,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormHelperText,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  LinearProgress,
  Typography,
  Button,
  Card,
  CardContent,
  CardHeader,
  Paper,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Api as ApiIcon,
  Add as AddIcon,
// eslint-disable-next-line @typescript-eslint/no-unused-vars
  Refresh as RefreshIcon,
// eslint-disable-next-line @typescript-eslint/no-unused-vars
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useApiProviders } from '../contexts/ApiProviderContext';
import { useDashboardWidgets, DashboardWidget as DashboardWidgetType } from '../contexts/DashboardWidgetContext';
import DashboardWidget from '../components/widgets/DashboardWidget';
import '../styles/components/layout/BentoGrid.css';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { providers, loading: providersLoading } = useApiProviders();
  const { widgets, addWidget, updateWidget, removeWidget, toggleWidgetVisibility, loading: widgetsLoading } = useDashboardWidgets();

  const [addWidgetDialogOpen, setAddWidgetDialogOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [newWidget, setNewWidget] = useState<Omit<DashboardWidgetType, 'id'>>({
    providerId: '',
    type: 'cost',
    size: 'medium',
    position: { x: 0, y: 0 },
    isVisible: true
  });

  const configuredProviders = providers.filter(provider => provider.isConfigured);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleWidgetSizeChange = (id: string, size: 'small' | 'medium' | 'large') => {
    updateWidget(id, { size });
  };

  // Calculate total monthly cost
  const calculateTotalCost = () => {
    // In a real app, this would come from actual API data
    return 24.56;
  };

  // Calculate total API requests
  const calculateTotalRequests = () => {
    // In a real app, this would come from actual API data
    return 1284;
  };

  const loading = providersLoading || widgetsLoading;

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Dashboard
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleOpenAddWidgetDialog}
            disabled={configuredProviders.length === 0}
          >
            Add Widget
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/settings/api-keys/new')}
          >
            Add New API Key
          </Button>
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : configuredProviders.length === 0 ? (
        <Card sx={{ mb: 4, p: 2, textAlign: 'center' }}>
          <CardContent>
            <Typography variant="h5" component="div" sx={{ mb: 2 }}>
              Welcome to APIwidget!
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Get started by adding your first API key to monitor usage and costs.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => navigate('/settings/api-keys/new')}
            >
              Add Your First API Key
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Summary Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 140,
                  borderRadius: 2,
                }}
              >
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Total API Cost (This Month)
                </Typography>
                <Typography
                  component="p"
                  variant="h4"
                  sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}
                >
                  ${calculateTotalCost().toFixed(2)}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ display: 'flex', alignItems: 'center' }}
                  color="success.main"
                >
                  <TrendingUpIcon sx={{ mr: 0.5 }} fontSize="small" />
                  12% less than last month
                </Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 140,
                  borderRadius: 2,
                }}
              >
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  API Requests (Today)
                </Typography>
                <Typography
                  component="p"
                  variant="h4"
                  sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}
                >
                  {calculateTotalRequests().toLocaleString()}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ display: 'flex', alignItems: 'center' }}
                  color="success.main"
                >
                  <TrendingUpIcon sx={{ mr: 0.5 }} fontSize="small" />
                  8% more than yesterday
                </Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 140,
                  borderRadius: 2,
                }}
              >
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Active API Providers
                </Typography>
                <Typography
                  component="p"
                  variant="h4"
                  sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}
                >
                  {configuredProviders.length}
                </Typography>
                <Button
                  size="small"
                  onClick={() => navigate('/settings/api-keys')}
                  sx={{ alignSelf: 'flex-start' }}
                >
                  Manage API Keys
                </Button>
              </Paper>
            </Grid>
          </Grid>

          {/* Dashboard Widgets */}
          {widgets.length > 0 && (
            <>
              <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h5" component="h2">
                  Widgets
                </Typography>
              </Box>
              <Grid container spacing={3} sx={{ mb: 4 }}>
                {widgets.map((widget) => (
                  <Grid
                    key={widget.id}
                    size={{
                      xs: 12,
                      sm: widget.size === 'small' ? 6 : 12,
                      md: widget.size === 'small' ? 4 : widget.size === 'medium' ? 6 : 12
                    }}
                  >
                    <DashboardWidget
                      widget={widget}
                      onRemove={removeWidget}
                      onSizeChange={handleWidgetSizeChange}
                      onToggleVisibility={toggleWidgetVisibility}
                    />
                  </Grid>
                ))}
              </Grid>
            </>
          )}

          {/* API Status */}
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 8 }}>
              <Card>
                <CardHeader title="API Status" />
                <Divider />
                <CardContent>
                  <List>
                    {configuredProviders.map((provider) => (
                      <ListItem
                        key={provider.id}
                        secondaryAction={
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => navigate(`/provider/${provider.id}`)}
                          >
                            Details
                          </Button>
                        }
                      >
                        <ListItemIcon>
                          <ApiIcon sx={{ color: provider.color }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={provider.name}
                          secondary={
                            <Box sx={{ mt: 1 }}>
                              <Typography variant="body2" sx={{ mb: 0.5 }}>
                                Usage: 65%
                              </Typography>
                              <LinearProgress
                                variant="determinate"
                                value={65}
                                sx={{ height: 8, borderRadius: 4 }}
                              />
                            </Box>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Card>
                <CardHeader title="Alerts" />
                <Divider />
                <CardContent>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <WarningIcon color="warning" />
                      </ListItemIcon>
                      <ListItemText
                        primary="OpenAI API Usage"
                        secondary="80% of monthly quota used"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <WarningIcon color="warning" />
                      </ListItemIcon>
                      <ListItemText
                        primary="GitHub API Rate Limit"
                        secondary="Reset in 30 minutes"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon color="success" />
                      </ListItemIcon>
                      <ListItemText
                        primary="AWS API"
                        secondary="All services operational"
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </>
      )}

      {/* Add Widget Dialog */}
      <Dialog open={addWidgetDialogOpen} onClose={handleCloseAddWidgetDialog}>
        <DialogTitle>Add New Widget</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, minWidth: 300 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="provider-select-label">API Provider</InputLabel>
              <Select
                labelId="provider-select-label"
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
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onChange={(e) => setNewWidget({ ...newWidget, type: e.target.value as 'cost' | 'usage' | 'quota' | 'history' })}
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
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onChange={(e) => setNewWidget({ ...newWidget, size: e.target.value as 'small' | 'medium' | 'large' })}
              >
                <MenuItem value="small">Small</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="large">Large</MenuItem>
              </Select>
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
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={handleOpenAddWidgetDialog}
        disabled={configuredProviders.length === 0}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
};

export default Dashboard;
