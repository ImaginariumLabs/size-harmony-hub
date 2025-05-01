import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Box, Typography, Button, Snackbar, Alert, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Settings as SettingsIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { DashboardWidget as DashboardWidgetType } from '../../contexts/DashboardWidgetContext';
import DashboardWidget from '../widgets/DashboardWidget';
import WidgetErrorBoundary from '../common/WidgetErrorBoundary';
import { isElectron } from '../../services/electronService';
import { ApiProvider, ApiCostData } from '../../types/api';
import { useLoading } from '../../contexts/LoadingContext';
import '../../styles/components/dashboard/DraggableWidgetsGrid.css';

// Define the Layout type for react-grid-layout
declare namespace ReactGridLayout {
  interface Layout {
    i: string;
    x: number;
    y: number;
    w: number;
    h: number;
    minW?: number;
    minH?: number;
    maxW?: number;
    maxH?: number;
    static?: boolean;
    isDraggable?: boolean;
    isResizable?: boolean;
  }
}

interface DraggableWidgetsGridProps {
  configuredProviders: ApiProvider[];
  widgets: DashboardWidgetType[];
  onRemoveWidget: (id: string) => void;
  onSizeChange: (id: string, size: 'small' | 'medium' | 'large') => void;
  onToggleVisibility: (id: string) => void;
  onPositionChange: (id: string, position: { x: number; y: number }) => void;
  onNavigate: (path: string) => void;
  apiCostData?: Record<string, ApiCostData>;
}

/**
 * DraggableWidgetsGrid component
 *
 * A grid layout for dashboard widgets with drag-and-drop functionality.
 */
const DraggableWidgetsGrid: React.FC<DraggableWidgetsGridProps> = ({
  configuredProviders,
  widgets,
  onRemoveWidget,
  onSizeChange,
  onToggleVisibility,
  onPositionChange,
  onNavigate,
  apiCostData = {},
}) => {
  const navigate = useNavigate();
  const { showLoading, hideLoading } = useLoading();
  const [isElectronEnv, setIsElectronEnv] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [layouts, setLayouts] = useState<ReactGridLayout.Layout[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [layoutError, setLayoutError] = useState<Error | null>(null);
  const layoutRef = useRef<ReactGridLayout.Layout[]>([]);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Check if running in Electron
  useEffect(() => {
    try {
      setIsElectronEnv(isElectron());
    } catch (error) {
      console.error('Error detecting environment:', error);
      // Default to web environment if detection fails
      setIsElectronEnv(false);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, []);

  // Handle widget errors with improved error reporting
  const handleWidgetError = useCallback((widgetId: string, error: Error) => {
    console.error(`Widget error (ID: ${widgetId}):`, error);

    // Create a more descriptive error message
    const widgetType = widgets.find(w => w.id === widgetId)?.type || 'unknown';
    const errorMessage = `Widget error (${widgetType}): ${error.message}`;

    setErrorMessage(errorMessage);
    setSnackbarOpen(true);
  }, [widgets]);

  // Convert widgets to layout items with error handling
  useEffect(() => {
    try {
      setIsLoading(true);
      const newLayouts = widgets.map(widget => {
        // Convert widget size to grid dimensions
        let w = 3; // small
        let h = 2; // small

        if (widget.size === 'medium') {
          w = 6;
          h = 2;
        } else if (widget.size === 'large') {
          w = 9;
          h = 3;
        }

        return {
          i: widget.id,
          x: widget.position.x % 12, // Ensure x is within grid bounds (12 columns)
          y: widget.position.y,
          w,
          h,
          minW: 3,
          minH: 2,
        };
      });

      setLayouts(newLayouts);
      layoutRef.current = newLayouts;
      setLayoutError(null);
    } catch (error) {
      console.error('Error creating layouts:', error);
      setLayoutError(error instanceof Error ? error : new Error('Unknown error creating layouts'));

      // Retry with exponential backoff
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }

      retryTimeoutRef.current = setTimeout(() => {
        console.log('Retrying layout creation...');
        // Force re-run of the effect
        setLayouts([]);
      }, 2000);
    } finally {
      setIsLoading(false);
    }
  }, [widgets]);

  // Handle layout change with error handling
  const handleLayoutChange = useCallback((newLayout: ReactGridLayout.Layout[]) => {
    try {
      if (isDragging) {
        // Update widget positions based on layout changes
        newLayout.forEach(item => {
          const widget = widgets.find(w => w.id === item.i);
          if (widget) {
            const newPosition = {
              x: item.x,
              y: item.y
            };

            // Only update if position has changed
            if (widget.position.x !== newPosition.x || widget.position.y !== newPosition.y) {
              onPositionChange(item.i, newPosition);
            }
          }
        });
      }

      // Store the latest valid layout
      layoutRef.current = newLayout;
    } catch (error) {
      console.error('Error updating layout:', error);
      setErrorMessage(`Layout update error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setSnackbarOpen(true);
    }
  }, [widgets, onPositionChange, isDragging]);

  // Function to handle retry for layout errors
  const handleRetryLayoutCreation = useCallback(() => {
    setLayoutError(null);
    setLayouts([]);
    // Force re-run of the layout creation effect
  }, []);

  return (
    <Box className="draggable-widgets-container">
      {/* Loading State */}
      {isLoading && (
        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '200px',
          width: '100%'
        }}>
          <CircularProgress />
          <Typography variant="body2" sx={{ ml: 2 }}>
            Loading widgets...
          </Typography>
        </Box>
      )}

      {/* Layout Error State */}
      {layoutError && (
        <Box sx={{
          p: 3,
          mb: 3,
          borderRadius: 2,
          bgcolor: 'rgba(211, 47, 47, 0.1)',
          border: '1px solid rgba(211, 47, 47, 0.3)'
        }}>
          <Typography variant="h6" color="error" gutterBottom>
            Error Loading Dashboard Layout
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            {layoutError.message}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<RefreshIcon />}
            onClick={handleRetryLayoutCreation}
          >
            Retry Loading Layout
          </Button>
        </Box>
      )}

      {/* Dashboard Header */}
      {!layoutError && widgets.length > 0 && !isLoading && (
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

          {/* Draggable Grid Layout */}
          <div className={`draggable-grid-container ${isElectronEnv ? 'electron-environment' : ''}`}>
            <GridLayout
              className="draggable-grid"
              layout={layouts}
              cols={12}
              rowHeight={100}
              width={1200}
              margin={[16, 16]}
              onLayoutChange={handleLayoutChange}
              onDragStart={() => setIsDragging(true)}
              onDragStop={() => setIsDragging(false)}
              draggableHandle=".widget-drag-handle"
              isBounded
            >
              {widgets.map((widget) => (
                <div key={widget.id} className="draggable-grid-item">
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
            </GridLayout>
          </div>
        </>
      )}

      {/* Empty State */}
      {!layoutError && widgets.length === 0 && !isLoading && (
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: 8,
          textAlign: 'center'
        }}>
          <SettingsIcon sx={{ fontSize: 48, mb: 2, color: 'text.secondary' }} />
          <Typography variant="h6" gutterBottom>
            No Widgets Added
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 500 }}>
            Add widgets to your dashboard to monitor API usage and costs.
          </Typography>
          <Button
            variant="contained"
            onClick={() => onNavigate('/settings/api-keys')}
          >
            Configure API Keys
          </Button>
        </Box>
      )}

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
    </Box>
  );
};

export default DraggableWidgetsGrid;
