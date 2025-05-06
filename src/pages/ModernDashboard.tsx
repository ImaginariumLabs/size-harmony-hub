import React, { useState, useEffect, lazy, Suspense } from 'react';
import {
  Box,
  CircularProgress,
  FormControlLabel,
  Grid,
  Switch,
  Tab,
  Tabs,
  Tooltip,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useApiProviders } from '../contexts/ApiProviderContext';
import {
  useDashboardWidgets,
  DashboardWidget as DashboardWidgetType,
} from '../contexts/DashboardWidgetContext';
import MultiviewDisplay from '../components/widgets/MultiviewDisplay';
import { environment } from '../utils/environment';
import '../styles/components/layout/BentoGrid.css';
import '../styles/components/dashboard/DraggableWidgetsGrid.css';

// Import our new components
import DashboardHeader from '../components/dashboard/DashboardHeader';
import EmptyDashboardState from '../components/dashboard/EmptyDashboardState';
import DashboardWidgetsGrid from '../components/dashboard/DashboardWidgetsGrid';
import DraggableWidgetsGrid from '../components/dashboard/DraggableWidgetsGrid';
import AddWidgetDialog from '../components/dashboard/AddWidgetDialog';
import AddAdvancedWidgetDialog from '../components/dashboard/AddAdvancedWidgetDialog';
import DashboardSharingDialog from '../components/dashboard/DashboardSharingDialog';
import DashboardActions from '../components/dashboard/DashboardActions';
import DashboardBreadcrumbs from '../components/navigation/DashboardBreadcrumbs';
import GlobalErrorBoundary from '../components/common/GlobalErrorBoundary';
import AdvancedWidgetFactory, {
  AdvancedWidgetType,
} from '../components/widgets/AdvancedWidgetFactory';
import { DashboardConfig } from '../services/dashboardSharingService';

// Lazy load the EnhancedCostMonitoringDashboard to improve initial load time
const EnhancedCostMonitoringDashboard = lazy(
  () => import('../components/dashboard/EnhancedCostMonitoringDashboard')
);

const ModernDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { providers, loading: providersLoading } = useApiProviders();
  const {
    widgets,
    addWidget,
    updateWidget,
    removeWidget,
    toggleWidgetVisibility,
    loading: widgetsLoading,
  } = useDashboardWidgets();

  // Enhanced navigation handler with better error handling and feedback
  const handleNavigation = (path: string) => {
    try {
      navigate(path);
    } catch (error) {
      console.error('Navigation error:', error);

      // If navigation fails in Electron, handle it gracefully
      if (environment.isElectron()) {
        console.log('Electron environment detected, handling navigation differently');

        // Use IPC to communicate with the main process if available
        if (window.electronAPI?.navigate) {
          window.electronAPI
            .navigate(path)
            .then(() => console.log(`Successfully navigated to ${path} via Electron IPC`))
            .catch(err => {
              console.error('Electron navigation failed:', err);
              // Show a fallback UI or message here
            });
        } else {
          // Fallback for when IPC is not available
          console.log('Would navigate to:', path);

          // Try to use window.location as a last resort
          try {
            window.location.href = path;
          } catch (locationError) {
            console.error('Failed to navigate using window.location:', locationError);
          }
        }
      }
    }
  };

  const [addWidgetDialogOpen, setAddWidgetDialogOpen] = useState(false);
  const [newWidget, setNewWidget] = useState<Omit<DashboardWidgetType, 'id'>>({
    providerId: '',
    type: 'cost',
    size: 'medium',
    position: { x: 0, y: 0 },
    isVisible: true,
  });

  // Add a refresh function
  const [lastRefreshed, setLastRefreshed] = useState(new Date());
  const [showMultiview, setShowMultiview] = useState(false);
  const [dashboardView, setDashboardView] = useState<'standard' | 'enhanced'>('standard');
  const [useDraggableGrid, setUseDraggableGrid] = useState(false);

  // Advanced widgets state
  const [advancedWidgets, setAdvancedWidgets] = useState<
    Array<{
      id: string;
      type: AdvancedWidgetType;
      config: unknown;
    }>
  >([]);
  const [addAdvancedWidgetDialogOpen, setAddAdvancedWidgetDialogOpen] = useState(false);

  // Dashboard sharing state
  const [sharingDialogOpen, setSharingDialogOpen] = useState(false);

  const configuredProviders = providers.filter(provider => provider.isConfigured);

  // Handle opening the add widget dialog
  const handleOpenAddWidgetDialog = () => {
    if (configuredProviders.length > 0) {
      setNewWidget(prev => ({
        ...prev,
        providerId: configuredProviders[0].id,
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

  // Handle widget position change
  const handleWidgetPositionChange = (id: string, position: { x: number; y: number }) => {
    updateWidget(id, { position });
  };

  // State for API cost data
  const [apiCostData, setApiCostData] = useState<Record<string, unknown>>({});
  const [, setIsLoading] = useState(false);

  // Fetch API cost data
  const fetchApiCostData = async () => {
    setIsLoading(true);
    try {
      // Import the API integration service
      const { fetchAllApiData } = await import('../services/apiIntegrationService');
      const data = await fetchAllApiData();

      setApiCostData(data);

      // Data is now available in apiCostData

      setLastRefreshed(new Date());
    } catch (error) {
      console.error('Error fetching API cost data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data on component mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchApiCostData();
  }, []);

  // Force render update in Electron environment
  useEffect(() => {
    if (environment.isElectron()) {
      console.log('Electron environment detected, forcing render update');
      // Force a re-render to ensure proper display in Electron
      const timer = setTimeout(() => {
        setShowMultiview(prev => !prev);
        setTimeout(() => setShowMultiview(prev => !prev), 100);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleRefresh = async () => {
    // Fetch fresh data
    await fetchApiCostData();
  };

  // DashboardHeader component has its own formatLastRefreshed function

  const loading = providersLoading || widgetsLoading;

  // Handle dashboard view toggle
  const handleDashboardViewChange = (
    _event: React.SyntheticEvent,
    newValue: 'standard' | 'enhanced'
  ) => {
    setDashboardView(newValue);
  };

  // Handle opening the add advanced widget dialog
  const handleOpenAddAdvancedWidgetDialog = () => {
    setAddAdvancedWidgetDialogOpen(true);
  };

  // Handle closing the add advanced widget dialog
  const handleCloseAddAdvancedWidgetDialog = () => {
    setAddAdvancedWidgetDialogOpen(false);
  };

  // Handle adding a new advanced widget
  const handleAddAdvancedWidget = (type: AdvancedWidgetType, config: unknown) => {
    const newAdvancedWidget = {
      id: `advanced-widget-${Date.now()}`,
      type,
      config,
    };

    setAdvancedWidgets(prev => [...prev, newAdvancedWidget]);
    handleCloseAddAdvancedWidgetDialog();
  };

  // Handle removing an advanced widget
  const handleRemoveAdvancedWidget = (id: string) => {
    setAdvancedWidgets(prev => prev.filter(widget => widget.id !== id));
  };

  // Handle opening the sharing dialog
  const handleOpenSharingDialog = () => {
    setSharingDialogOpen(true);
  };

  // Handle closing the sharing dialog
  const handleCloseSharingDialog = () => {
    setSharingDialogOpen(false);
  };

  // Handle importing a dashboard configuration
  const handleImportDashboard = (config: DashboardConfig) => {
    // Import widgets
    if (config.widgets && Array.isArray(config.widgets)) {
      // Remove existing widgets
      widgets.forEach(widget => {
        removeWidget(widget.id);
      });

      // Add imported widgets
      config.widgets.forEach(widget => {
        addWidget({
          providerId: widget.providerId,
          type: widget.type,
          size: widget.size,
          isVisible: widget.isVisible,
          position: widget.position,
        });
      });
    }

    // Import advanced widgets
    if (config.advancedWidgets && Array.isArray(config.advancedWidgets)) {
      setAdvancedWidgets(config.advancedWidgets);
    }

    // Set layout if specified
    if (config.layout) {
      setUseDraggableGrid(config.layout === 'draggable');
    }

    // Close the dialog
    handleCloseSharingDialog();
  };

  return (
    <GlobalErrorBoundary>
      <Box>
        <DashboardHeader
          lastRefreshed={lastRefreshed}
          showMultiview={showMultiview}
          configuredProvidersCount={configuredProviders.length}
          onRefresh={handleRefresh}
          onAddWidget={handleOpenAddWidgetDialog}
          onToggleMultiview={() => setShowMultiview(!showMultiview)}
          onShare={handleOpenSharingDialog}
        />

        {/* Breadcrumb Navigation */}
        <DashboardBreadcrumbs />

        {/* Multiview Display */}
        {showMultiview && (
          <Box sx={{ mb: 4 }}>
            <MultiviewDisplay onClose={() => setShowMultiview(false)} />
          </Box>
        )}

        {/* Dashboard View Toggle */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Tabs
              value={dashboardView}
              onChange={handleDashboardViewChange}
              aria-label="dashboard view tabs"
              sx={{ '& .MuiTab-root': { textTransform: 'none' } }}
            >
              <Tab value="standard" label="Standard Dashboard" />
              <Tab value="enhanced" label="Enhanced Cost Monitor" />
            </Tabs>

            {dashboardView === 'standard' && (
              <Tooltip title="Enable drag-and-drop to customize widget positions">
                <FormControlLabel
                  control={
                    <Switch
                      checked={useDraggableGrid}
                      onChange={e => setUseDraggableGrid(e.target.checked)}
                      size="small"
                    />
                  }
                  label="Draggable Widgets"
                  sx={{ mr: 1 }}
                />
              </Tooltip>
            )}
          </Box>
        </Box>

        {/* Dashboard Content */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {!loading && configuredProviders.length === 0 && (
          <EmptyDashboardState onAddApiKey={() => handleNavigation('/settings/api-keys/new')} />
        )}

        {!loading && configuredProviders.length > 0 && dashboardView === 'enhanced' && (
          <Suspense
            fallback={
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                <CircularProgress />
              </Box>
            }
          >
            <EnhancedCostMonitoringDashboard />
          </Suspense>
        )}

        {!loading &&
          configuredProviders.length > 0 &&
          dashboardView === 'standard' &&
          !useDraggableGrid && (
            <>
              <DashboardWidgetsGrid
                configuredProviders={configuredProviders}
                widgets={widgets}
                onRemoveWidget={removeWidget}
                onSizeChange={handleWidgetSizeChange}
                onToggleVisibility={toggleWidgetVisibility}
                onNavigate={handleNavigation}
                apiCostData={apiCostData}
              />

              {/* Advanced Widgets Section */}
              {advancedWidgets.length > 0 && (
                <Box sx={{ mt: 4 }}>
                  <Grid container spacing={3}>
                    {advancedWidgets.map(widget => (
                      <Grid item xs={12} md={6} key={widget.id}>
                        <AdvancedWidgetFactory
                          type={widget.type}
                          config={widget.config}
                          onRemove={() => handleRemoveAdvancedWidget(widget.id)}
                          onEdit={() => {
                            /* Handle edit */
                          }}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}
            </>
          )}

        {!loading &&
          configuredProviders.length > 0 &&
          dashboardView === 'standard' &&
          useDraggableGrid && (
            <>
              <DraggableWidgetsGrid
                configuredProviders={configuredProviders}
                widgets={widgets}
                onRemoveWidget={removeWidget}
                onSizeChange={handleWidgetSizeChange}
                onToggleVisibility={toggleWidgetVisibility}
                onPositionChange={handleWidgetPositionChange}
                onNavigate={handleNavigation}
                apiCostData={apiCostData}
              />

              {/* Advanced Widgets Section */}
              {advancedWidgets.length > 0 && (
                <Box sx={{ mt: 4 }}>
                  <Grid container spacing={3}>
                    {advancedWidgets.map(widget => (
                      <Grid size={{ xs: 12, md: 6 }} key={widget.id}>
                        <AdvancedWidgetFactory
                          type={widget.type}
                          config={widget.config}
                          onRemove={() => handleRemoveAdvancedWidget(widget.id)}
                          onEdit={() => {
                            /* Handle edit */
                          }}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}
            </>
          )}

        {/* Add Widget Dialog */}
        <AddWidgetDialog
          open={addWidgetDialogOpen}
          newWidget={newWidget}
          configuredProviders={configuredProviders}
          onClose={handleCloseAddWidgetDialog}
          onAdd={handleAddWidget}
          onChange={setNewWidget}
        />

        {/* Floating Action Button for adding widgets */}
        <DashboardActions
          onAddWidget={handleOpenAddWidgetDialog}
          onAddAdvancedWidget={handleOpenAddAdvancedWidgetDialog}
          disabled={configuredProviders.length === 0}
        />

        {/* Add Advanced Widget Dialog */}
        <AddAdvancedWidgetDialog
          open={addAdvancedWidgetDialogOpen}
          onClose={handleCloseAddAdvancedWidgetDialog}
          onAdd={handleAddAdvancedWidget}
          configuredProviders={configuredProviders}
        />

        {/* Dashboard Sharing Dialog */}
        <DashboardSharingDialog
          open={sharingDialogOpen}
          onClose={handleCloseSharingDialog}
          widgets={widgets}
          advancedWidgets={advancedWidgets}
          layout={useDraggableGrid ? 'draggable' : 'standard'}
          onImport={handleImportDashboard}
        />
      </Box>
    </GlobalErrorBoundary>
  );
};

export default ModernDashboard;
