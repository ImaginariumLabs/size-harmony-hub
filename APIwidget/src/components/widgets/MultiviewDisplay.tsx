import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Tooltip,
  ToggleButtonGroup,
  ToggleButton,
  Fade,
  Divider,
  Badge,
  useTheme,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Chip
} from '@mui/material';
import {
  GridView as GridViewIcon,
  ViewList as ViewListIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Settings as SettingsIcon,
  Close as CloseIcon,
  Refresh as RefreshIcon,
  Add as AddIcon,
  ViewInAr as ViewInArIcon,
  OpenInNew as OpenInNewIcon
} from '@mui/icons-material';
import { useDashboardWidgets } from '../../contexts/DashboardWidgetContext';
import { useApiProviders } from '../../contexts/ApiProviderContext';
import { fetchAllApiData } from '../../services/apiIntegrationService';

interface MultiviewDisplayProps {
  onClose: () => void;
}

const MultiviewDisplay: React.FC<MultiviewDisplayProps> = ({ onClose }) => {
  const theme = useTheme();
  const { widgets, toggleWidgetVisibility, addWidget, updateWidget } = useDashboardWidgets();
  const { providers } = useApiProviders();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [apiData, setApiData] = useState<Record<string, any>>({});
  const [lastRefreshed, setLastRefreshed] = useState(new Date());
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [showFloatingButton, setShowFloatingButton] = useState(false);

  // Filter to only show visible widgets
  const visibleWidgets = widgets.filter(widget => widget.isVisible);
  const hiddenWidgets = widgets.filter(widget => !widget.isVisible);
  const configuredProviders = providers.filter(p => p.isConfigured);

  // Effect to fetch data on mount
  useEffect(() => {
    handleRefresh();
  }, []);

  // Handle view mode change
  const handleViewModeChange = (
    event: React.MouseEvent<HTMLElement>,
    newMode: 'grid' | 'list' | null
  ) => {
    if (newMode !== null) {
      setViewMode(newMode);
    }
  };

  // Handle opening the menu
  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  // Handle closing the menu
  const handleCloseMenu = () => {
    setMenuAnchorEl(null);
  };

  // Handle adding a new widget
  const handleAddWidget = () => {
    handleCloseMenu();

    // Find a provider that doesn't have a visible widget yet
    const existingProviderIds = visibleWidgets.map(w => w.providerId);
    const availableProvider = providers.find(p => !existingProviderIds.includes(p.id) && p.isConfigured);

    if (availableProvider) {
      // Add widget for this provider
      addWidget({
        providerId: availableProvider.id,
        type: 'cost',
        size: 'medium',
        position: { x: 0, y: 0 },
        isVisible: true
      });
    } else if (configuredProviders.length > 0) {
      // If all providers have widgets, add one for the first configured provider
      addWidget({
        providerId: configuredProviders[0].id,
        type: 'cost',
        size: 'medium',
        position: { x: 0, y: 0 },
        isVisible: true
      });
    }
  };

  // Handle showing a hidden widget
  const handleShowWidget = (widgetId: string) => {
    handleCloseMenu();
    toggleWidgetVisibility(widgetId);
  };

  // Toggle floating button visibility
  const toggleFloatingButton = () => {
    setShowFloatingButton(!showFloatingButton);
  };

  // Refresh API data
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const data = await fetchAllApiData();
      setApiData(data);
      setLastRefreshed(new Date());
    } catch (error) {
      console.error('Error refreshing API data:', error);
    } finally {
      setIsRefreshing(false);
    }
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

  // Get provider color
  const getProviderColor = (providerId: string): string => {
    const provider = providers.find(p => p.id === providerId);
    return provider?.color || theme.palette.primary.main;
  };

  // Get provider name
  const getProviderName = (providerId: string): string => {
    const provider = providers.find(p => p.id === providerId);
    return provider?.name || 'Unknown';
  };

  // Get widget data
  const getWidgetData = (providerId: string) => {
    return apiData[providerId] || { total: 0, change: 0, changeType: 'increase', usagePercentage: 0 };
  };

  // Render grid view
  const renderGridView = () => (
    <Box sx={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
      gap: 2,
      mt: 2
    }}>
      {visibleWidgets.map(widget => {
        const providerData = getWidgetData(widget.providerId);

        return (
          <Paper
            key={widget.id}
            sx={{
              p: 2,
              borderRadius: 2,
              background: 'rgba(30, 30, 30, 0.7)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)'
              }
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    background: getProviderColor(widget.providerId),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 1
                  }}
                >
                  <Typography variant="caption" sx={{ color: 'white', fontWeight: 'bold' }}>
                    {getProviderName(widget.providerId).charAt(0)}
                  </Typography>
                </Box>
                <Typography variant="subtitle2" noWrap>
                  {getProviderName(widget.providerId)}
                </Typography>
              </Box>
              <Tooltip title="Hide Widget">
                <IconButton
                  size="small"
                  onClick={() => toggleWidgetVisibility(widget.id)}
                  sx={{ p: 0.5 }}
                >
                  <VisibilityOffIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>

            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
                ${providerData.total.toFixed(2)}
              </Typography>
              <Typography
                variant="body2"
                color={providerData.changeType === 'increase' ? 'error.main' : 'success.main'}
                sx={{ display: 'flex', alignItems: 'center' }}
              >
                {providerData.changeType === 'increase' ? '↑' : '↓'} ${providerData.change.toFixed(2)}
              </Typography>
            </Box>

            {providerData.usagePercentage !== undefined && (
              <Box sx={{ mt: 1, width: '100%' }}>
                <Box sx={{ width: '100%', height: 4, bgcolor: 'background.paper', borderRadius: 2, overflow: 'hidden' }}>
                  <Box
                    sx={{
                      height: '100%',
                      width: `${providerData.usagePercentage}%`,
                      bgcolor: providerData.usagePercentage > 80 ? 'error.main' :
                              providerData.usagePercentage > 50 ? 'warning.main' : 'success.main',
                      borderRadius: 2
                    }}
                  />
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                  {providerData.usagePercentage}% used
                </Typography>
              </Box>
            )}
          </Paper>
        );
      })}
    </Box>
  );

  // Render list view
  const renderListView = () => (
    <Box sx={{ mt: 2 }}>
      {visibleWidgets.map(widget => {
        const providerData = getWidgetData(widget.providerId);

        return (
          <Paper
            key={widget.id}
            sx={{
              p: 2,
              mb: 1,
              borderRadius: 2,
              background: 'rgba(30, 30, 30, 0.7)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateX(4px)',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
              }
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    background: getProviderColor(widget.providerId),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 1
                  }}
                >
                  <Typography variant="caption" sx={{ color: 'white', fontWeight: 'bold' }}>
                    {getProviderName(widget.providerId).charAt(0)}
                  </Typography>
                </Box>
                <Typography variant="subtitle2">
                  {getProviderName(widget.providerId)}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography
                  variant="h6"
                  component="div"
                  sx={{ fontWeight: 'bold', mr: 1 }}
                >
                  ${providerData.total.toFixed(2)}
                </Typography>
                <Typography
                  variant="body2"
                  color={providerData.changeType === 'increase' ? 'error.main' : 'success.main'}
                  sx={{ display: 'flex', alignItems: 'center', mr: 2 }}
                >
                  {providerData.changeType === 'increase' ? '↑' : '↓'} ${providerData.change.toFixed(2)}
                </Typography>

                {providerData.usagePercentage !== undefined && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mr: 2, width: 100 }}>
                    <Box sx={{ width: '100%', height: 4, bgcolor: 'background.paper', borderRadius: 2, overflow: 'hidden', mr: 1 }}>
                      <Box
                        sx={{
                          height: '100%',
                          width: `${providerData.usagePercentage}%`,
                          bgcolor: providerData.usagePercentage > 80 ? 'error.main' :
                                  providerData.usagePercentage > 50 ? 'warning.main' : 'success.main',
                          borderRadius: 2
                        }}
                      />
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {providerData.usagePercentage}%
                    </Typography>
                  </Box>
                )}

                <Tooltip title="Hide Widget">
                  <IconButton
                    size="small"
                    onClick={() => toggleWidgetVisibility(widget.id)}
                    sx={{ p: 0.5 }}
                  >
                    <VisibilityOffIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Paper>
        );
      })}
    </Box>
  );

  return (
    <>
      <Paper
        sx={{
          p: 2,
          borderRadius: 2,
          background: 'rgba(30, 30, 30, 0.85)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          maxWidth: '100%',
          width: '100%',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
          position: 'relative'
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" component="h2">
            API Widgets Multiview
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="caption" color="text.secondary" sx={{ mr: 1 }}>
              Updated {formatLastRefreshed()}
            </Typography>

            <Tooltip title="Add Widget">
              <IconButton
                size="small"
                onClick={handleOpenMenu}
                sx={{ mr: 1 }}
              >
                <AddIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Floating Widgets">
              <IconButton
                size="small"
                onClick={toggleFloatingButton}
                color={showFloatingButton ? "primary" : "default"}
                sx={{ mr: 1 }}
              >
                <ViewInArIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Refresh Data">
              <IconButton
                size="small"
                onClick={handleRefresh}
                disabled={isRefreshing}
                sx={{ mr: 1 }}
              >
                <RefreshIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={handleViewModeChange}
              size="small"
              sx={{ mr: 1 }}
            >
              <ToggleButton value="grid" aria-label="grid view">
                <GridViewIcon fontSize="small" />
              </ToggleButton>
              <ToggleButton value="list" aria-label="list view">
                <ViewListIcon fontSize="small" />
              </ToggleButton>
            </ToggleButtonGroup>

            <Tooltip title="Close">
              <IconButton size="small" onClick={onClose}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {visibleWidgets.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="text.secondary">
              No visible widgets to display.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Add widgets from the Widget Gallery or make existing widgets visible.
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleOpenMenu}
              sx={{ mt: 2 }}
            >
              Add Widget
            </Button>
          </Box>
        ) : (
          viewMode === 'grid' ? renderGridView() : renderListView()
        )}
      </Paper>

      {/* Floating Widget Button */}
      {showFloatingButton && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            gap: 1
          }}
        >
          <Tooltip title="Open Floating Widgets" placement="left">
            <Button
              variant="contained"
              color="primary"
              component="a"
              href="/floating-widgets"
              target="_blank"
              startIcon={<OpenInNewIcon />}
              sx={{
                borderRadius: 8,
                px: 2,
                py: 1,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                background: 'linear-gradient(135deg, #4285f4, #0d69c8)',
              }}
            >
              Launch Floating Widgets
            </Button>
          </Tooltip>
        </Box>
      )}

      {/* Widget Menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleCloseMenu}
        PaperProps={{
          elevation: 3,
          sx: { width: 250, maxHeight: 400 }
        }}
      >
        <MenuItem onClick={handleAddWidget}>
          <ListItemIcon>
            <AddIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Add New Widget" />
        </MenuItem>

        {hiddenWidgets.length > 0 && (
          <>
            <Divider />
            <MenuItem disabled>
              <ListItemText
                primary="Hidden Widgets"
                primaryTypographyProps={{ variant: 'caption', color: 'text.secondary' }}
              />
            </MenuItem>

            {hiddenWidgets.map(widget => {
              const provider = providers.find(p => p.id === widget.providerId);
              return (
                <MenuItem key={widget.id} onClick={() => handleShowWidget(widget.id)}>
                  <ListItemIcon>
                    <VisibilityIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary={provider?.name || widget.providerId} />
                </MenuItem>
              );
            })}
          </>
        )}
      </Menu>
    </>
  );
};

export default MultiviewDisplay;
