import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Box, Menu, ListItemIcon, ListItemText, Snackbar, Alert, CircularProgress } from '@mui/material';
import {
  Add as AddIcon,
  ViewColumn as ViewColumnIcon,
  GridView as GridViewIcon,
  Settings as SettingsIcon,
  Visibility as VisibilityIcon,
  Dashboard as DashboardIcon,
  Close as CloseIcon,
  Info as InfoIcon,
// eslint-disable-next-line @typescript-eslint/no-unused-vars
  Refresh as RefreshIcon,
// eslint-disable-next-line @typescript-eslint/no-unused-vars
  ViewInAr as ViewInArIcon,
// eslint-disable-next-line @typescript-eslint/no-unused-vars
  ArrowBack as ArrowBackIcon,
  Fullscreen as FullscreenIcon,
  FullscreenExit as FullscreenExitIcon,
  Save as SaveIcon,
  Restore as RestoreIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useDashboardWidgets, DashboardWidget } from '../../contexts/DashboardWidgetContext';
import { useApiProviders } from '../../contexts/ApiProviderContext';
import WidgetSettingsDialog from './WidgetSettingsDialog';
import { isElectron } from '../../services/electronService';

// Lazy load the EnhancedGlassMorphismWidget component to avoid conflicts
const EnhancedGlassMorphismWidget = lazy(() => import('./EnhancedGlassMorphismWidget'));

// Layout types for widget arrangement
type LayoutType = 'free' | 'grid' | 'line';

// Widget configuration preset
interface WidgetPreset {
  id: string;
  name: string;
  widgets: Array<Omit<DashboardWidget, 'id'>>;
}

// Main component
const FloatingWidgetManager: React.FC = () => {
// eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { widgets, addWidget, updateWidget, removeWidget, toggleWidgetVisibility } = useDashboardWidgets();
  const { providers } = useApiProviders();
  const [layout, setLayout] = useState<LayoutType>('free');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [selectedWidgetId, setSelectedWidgetId] = useState<string | null>(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [presetsMenuAnchorEl, setPresetsMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [showHelpPanel, setShowHelpPanel] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'info' | 'warning' | 'error'>('success');
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  // Widget presets (saved configurations)
  const [widgetPresets, setWidgetPresets] = useState<WidgetPreset[]>([]);

  // Get visible widgets
  const visibleWidgets = widgets.filter(widget => widget.isVisible);
  const hiddenWidgets = widgets.filter(widget => !widget.isVisible);

  // Update window dimensions when they change
  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Apply layout when it changes
  useEffect(() => {
    if (layout === 'free') {
      // Free layout doesn't need any position adjustments
      return;
    }

    const updatedWidgets = [...visibleWidgets];

    if (layout === 'grid') {
      // Arrange widgets in a grid
      const columns = Math.ceil(Math.sqrt(updatedWidgets.length));
      const cellWidth = Math.floor(windowDimensions.width / (columns + 1));
      const cellHeight = Math.floor(windowDimensions.height / (Math.ceil(updatedWidgets.length / columns) + 1));

      updatedWidgets.forEach((widget, index) => {
        const row = Math.floor(index / columns);
        const col = index % columns;
        const widgetWidth = widget.size === 'large' ? 300 : widget.size === 'small' ? 180 : 240;
        const widgetHeight = widget.size === 'large' ? 180 : widget.size === 'small' ? 100 : 140;

        updateWidget(widget.id, {
          position: {
            x: (col + 1) * cellWidth - widgetWidth / 2,
            y: (row + 1) * cellHeight - widgetHeight / 2
          }
        });
      });
    } else if (layout === 'line') {
      // Arrange widgets in a horizontal line
      const spacing = 20;
      const startX = spacing;
      const y = windowDimensions.height - 160; // Position near bottom of screen

      let currentX = startX;

      updatedWidgets.forEach((widget) => {
        let width;
        switch (widget.size) {
          case 'small': width = 180; break;
          case 'large': width = 300; break;
          default: width = 240; // medium
        }

        updateWidget(widget.id, {
          position: { x: currentX, y }
        });

        currentX += width + spacing;
      });
    }
  }, [layout, visibleWidgets, windowDimensions, updateWidget]);

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
        position: {
          x: Math.random() * (windowDimensions.width - 300) + 50,
          y: Math.random() * (windowDimensions.height - 200) + 50
        },
        isVisible: true
      });
    } else if (providers.filter(p => p.isConfigured).length > 0) {
      // If all providers have widgets, add one for the first configured provider
      const configuredProviders = providers.filter(p => p.isConfigured);
      addWidget({
        providerId: configuredProviders[0].id,
        type: 'cost',
        size: 'medium',
        position: {
          x: Math.random() * (windowDimensions.width - 300) + 50,
          y: Math.random() * (windowDimensions.height - 200) + 50
        },
        isVisible: true
      });
    }
  };

  // Handle showing a hidden widget
  const handleShowWidget = (widgetId: string) => {
    handleCloseMenu();
    toggleWidgetVisibility(widgetId);
  };

  // Handle opening widget settings
  const handleOpenSettings = (widgetId: string) => {
    setSelectedWidgetId(widgetId);
    setSettingsOpen(true);
  };

  // Handle closing widget settings
  const handleCloseSettings = () => {
    setSettingsOpen(false);
    setSelectedWidgetId(null);
  };

  // Handle saving widget settings
  const handleSaveSettings = (widgetId: string, updates: unknown) => {
    updateWidget(widgetId, updates);
    setSettingsOpen(false);
    setSelectedWidgetId(null);
  };

  // Toggle help panel
  const toggleHelpPanel = () => {
    setShowHelpPanel(!showHelpPanel);
  };

  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    if (!isFullscreen) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
        showSnackbar('Failed to enter fullscreen mode', 'error');
      });
    } else {
      document.exitFullscreen().catch(err => {
        console.error(`Error attempting to exit fullscreen: ${err.message}`);
        showSnackbar('Failed to exit fullscreen mode', 'error');
      });
    }
    setIsFullscreen(!isFullscreen);
  };

  // Show snackbar notification
  const showSnackbar = (message: string, severity: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  // Handle closing the snackbar
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  // Save current widget configuration as a preset
  const saveWidgetPreset = () => {
    if (visibleWidgets.length === 0) {
      showSnackbar('No widgets to save', 'warning');
      return;
    }

    const presetName = `Preset ${widgetPresets.length + 1}`;
    const newPreset: WidgetPreset = {
      id: `preset-${Date.now()}`,
      name: presetName,
      widgets: visibleWidgets.map(widget => ({
        providerId: widget.providerId,
        type: widget.type,
        size: widget.size,
        position: { ...widget.position },
        isVisible: true,
        customSize: widget.customSize ? { ...widget.customSize } : undefined
      }))
    };

    setWidgetPresets([...widgetPresets, newPreset]);
    showSnackbar(`Saved widget configuration as "${presetName}"`, 'success');
    setPresetsMenuAnchorEl(null);
  };

  // Load a saved widget preset
  const loadWidgetPreset = (preset: WidgetPreset) => {
    // Clear existing widgets
    widgets.forEach(widget => {
      if (widget.isVisible) {
        toggleWidgetVisibility(widget.id);
      }
    });

    // Add widgets from preset
    preset.widgets.forEach(widgetConfig => {
      addWidget(widgetConfig);
    });

    showSnackbar(`Loaded widget configuration "${preset.name}"`, 'success');
    setPresetsMenuAnchorEl(null);
  };

  // Delete a saved widget preset
  const deleteWidgetPreset = (presetId: string) => {
    setWidgetPresets(widgetPresets.filter(preset => preset.id !== presetId));
    showSnackbar('Deleted widget configuration', 'info');
    setPresetsMenuAnchorEl(null);
  };

  return (
    <>
      {/* Floating Widgets */}
      <Suspense fallback={<Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>}>
        {visibleWidgets.map((widget) => (
          <EnhancedGlassMorphismWidget
            key={widget.id}
            widgetId={widget.id}
            providerId={widget.providerId}
            initialSize={widget.size}
            initialPosition={widget.position}
            onOpenSettings={() => handleOpenSettings(widget.id)}
            onClose={() => toggleWidgetVisibility(widget.id)}
            isElectronApp={isElectron()}
          />
        ))}
      </Suspense>

      {/* Controls */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          zIndex: 9999
        }}
      >
        <Tooltip title="Widget Menu" placement="left">
          <IconButton
            color="primary"
            onClick={handleOpenMenu}
            sx={{
              bgcolor: 'background.paper',
              boxShadow: 2,
              '&:hover': { bgcolor: 'background.default' }
            }}
          >
            <AddIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Widget Presets" placement="left">
          <IconButton
            color="primary"
            onClick={(e) => setPresetsMenuAnchorEl(e.currentTarget)}
            sx={{
              bgcolor: 'background.paper',
              boxShadow: 2,
              '&:hover': { bgcolor: 'background.default' }
            }}
          >
            <Badge badgeContent={widgetPresets.length} color="secondary" invisible={widgetPresets.length === 0}>
              <SaveIcon />
            </Badge>
          </IconButton>
        </Tooltip>

        <Tooltip title="Line Layout" placement="left">
          <IconButton
            color={layout === 'line' ? 'secondary' : 'default'}
            onClick={() => setLayout('line')}
            sx={{
              bgcolor: 'background.paper',
              boxShadow: 2,
              '&:hover': { bgcolor: 'background.default' }
            }}
          >
            <ViewColumnIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Grid Layout" placement="left">
          <IconButton
            color={layout === 'grid' ? 'secondary' : 'default'}
            onClick={() => setLayout('grid')}
            sx={{
              bgcolor: 'background.paper',
              boxShadow: 2,
              '&:hover': { bgcolor: 'background.default' }
            }}
          >
            <GridViewIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Free Layout" placement="left">
          <IconButton
            color={layout === 'free' ? 'secondary' : 'default'}
            onClick={() => setLayout('free')}
            sx={{
              bgcolor: 'background.paper',
              boxShadow: 2,
              '&:hover': { bgcolor: 'background.default' }
            }}
          >
            <SettingsIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"} placement="left">
          <IconButton
            onClick={toggleFullscreen}
            sx={{
              bgcolor: 'background.paper',
              boxShadow: 2,
              '&:hover': { bgcolor: 'background.default' }
            }}
          >
            {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
          </IconButton>
        </Tooltip>

        <Tooltip title="Help" placement="left">
          <IconButton
            color={showHelpPanel ? 'secondary' : 'default'}
            onClick={toggleHelpPanel}
            sx={{
              bgcolor: 'background.paper',
              boxShadow: 2,
              '&:hover': { bgcolor: 'background.default' }
            }}
          >
            <InfoIcon />
          </IconButton>
        </Tooltip>
      </Box>

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

        <Divider />

        <MenuItem onClick={handleCloseMenu}>
          <ListItemIcon>
            <DashboardIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Go to Dashboard" />
        </MenuItem>

        <MenuItem onClick={handleCloseMenu}>
          <ListItemIcon>
            <CloseIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Close Menu" />
        </MenuItem>
      </Menu>

      {/* Widget Presets Menu */}
      <Menu
        anchorEl={presetsMenuAnchorEl}
        open={Boolean(presetsMenuAnchorEl)}
        onClose={() => setPresetsMenuAnchorEl(null)}
        PaperProps={{
          elevation: 3,
          sx: { width: 250, maxHeight: 400 }
        }}
      >
        <MenuItem onClick={saveWidgetPreset}>
          <ListItemIcon>
            <SaveIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Save Current Layout" />
        </MenuItem>

        {widgetPresets.length > 0 && (
          <>
            <Divider />
            <MenuItem disabled>
              <ListItemText
                primary="Saved Layouts"
                primaryTypographyProps={{ variant: 'caption', color: 'text.secondary' }}
              />
            </MenuItem>

            {widgetPresets.map(preset => (
              <MenuItem key={preset.id}>
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }} onClick={() => loadWidgetPreset(preset)}>
                    <ListItemIcon>
                      <RestoreIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={`${preset.name} (${preset.widgets.length})`} />
                  </Box>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteWidgetPreset(preset.id);
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </MenuItem>
            ))}
          </>
        )}
      </Menu>

      {/* Settings Dialog */}
      {selectedWidgetId && (
        <WidgetSettingsDialog
          open={settingsOpen}
          widgetId={selectedWidgetId}
          widget={widgets.find(w => w.id === selectedWidgetId)!}
          onClose={handleCloseSettings}
          onSave={handleSaveSettings}
        />
      )}

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default FloatingWidgetManager;
