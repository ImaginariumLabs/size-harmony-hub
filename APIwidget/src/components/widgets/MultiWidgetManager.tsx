import React, { useState, useEffect, useCallback } from 'react';
import { Box, IconButton, Tooltip, Fade } from '@mui/material';
import {
  Add as AddIcon,
  ViewColumn as ViewColumnIcon,
  GridView as GridViewIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { useDashboardWidgets } from '../../contexts/DashboardWidgetContext';
import { useApiProviders } from '../../contexts/ApiProviderContext';
import GlassMorphismWidget from './GlassMorphismWidget';
import WidgetSettingsDialog from './WidgetSettingsDialog';
import { isElectron } from '../../services/electronService';

interface MultiWidgetManagerProps {
  isElectronApp?: boolean;
}

type LayoutType = 'free' | 'grid' | 'line';

const MultiWidgetManager: React.FC<MultiWidgetManagerProps> = ({ isElectronApp = false }) => {
  const { widgets, addWidget, updateWidget, removeWidget, toggleWidgetVisibility } = useDashboardWidgets();
  const { providers } = useApiProviders();
  const [layout, setLayout] = useState<LayoutType>('free');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [selectedWidgetId, setSelectedWidgetId] = useState<string | null>(null);
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  // Get visible widgets
  const visibleWidgets = widgets.filter(widget => widget.isVisible);

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

  // Handle layout changes
  const applyLayout = useCallback(() => {
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
        
        updateWidget(widget.id, {
          position: {
            x: (col + 1) * cellWidth - widget.size === 'large' ? 150 : widget.size === 'small' ? 90 : 120,
            y: (row + 1) * cellHeight - widget.size === 'large' ? 90 : widget.size === 'small' ? 50 : 70
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

  // Apply layout when it changes or when widgets change
  useEffect(() => {
    applyLayout();
  }, [layout, visibleWidgets.length, applyLayout]);

  // Handle adding a new widget
  const handleAddWidget = () => {
    // Find a provider that doesn't have a widget yet
    const existingProviderIds = widgets.map(w => w.providerId);
    const availableProvider = providers.find(p => !existingProviderIds.includes(p.id));
    
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
    } else if (providers.length > 0) {
      // If all providers have widgets, add one for the first provider
      addWidget({
        providerId: providers[0].id,
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
  const handleSaveSettings = (widgetId: string, updates: any) => {
    updateWidget(widgetId, updates);
    setSettingsOpen(false);
    setSelectedWidgetId(null);
  };

  return (
    <>
      {/* Widgets */}
      {visibleWidgets.map((widget) => (
        <GlassMorphismWidget
          key={widget.id}
          widgetId={widget.id}
          providerId={widget.providerId}
          initialSize={widget.size}
          initialPosition={widget.position}
          onOpenSettings={() => handleOpenSettings(widget.id)}
          onClose={() => toggleWidgetVisibility(widget.id)}
          isElectronApp={isElectronApp}
        />
      ))}

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
        <Tooltip title="Add Widget" placement="left" TransitionComponent={Fade} arrow>
          <IconButton
            color="primary"
            onClick={handleAddWidget}
            sx={{
              bgcolor: 'background.paper',
              boxShadow: 2,
              '&:hover': { bgcolor: 'background.default' }
            }}
          >
            <AddIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Line Layout" placement="left" TransitionComponent={Fade} arrow>
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

        <Tooltip title="Grid Layout" placement="left" TransitionComponent={Fade} arrow>
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

        <Tooltip title="Free Layout" placement="left" TransitionComponent={Fade} arrow>
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
      </Box>

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
    </>
  );
};

export default MultiWidgetManager;
