import React, { useState, useEffect, useRef, useCallback } from 'react';
import '../../styles/components/widgets/GlassMorphismWidget.css';
import { getApiCost } from '../../services/electronService';
import { Tooltip, IconButton } from '@mui/material';
import {
  Settings as SettingsIcon,
  OpenInFull as ExpandIcon,
  CloseFullscreen as CompressIcon,
  Close as CloseIcon,
  Refresh as RefreshIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { fetchApiData } from '../../services/apiIntegrationService';
import { useDashboardWidgets, WidgetSize } from '../../contexts/DashboardWidgetContext';
import { useApiProviders } from '../../contexts/ApiProviderContext';

interface EnhancedGlassMorphismWidgetProps {
  widgetId: string;
  providerId: string;
  initialSize?: WidgetSize;
  initialPosition?: { x: number; y: number };
  onOpenSettings?: () => void;
  onClose?: () => void;
  isElectronApp?: boolean;
}

const EnhancedGlassMorphismWidget: React.FC<EnhancedGlassMorphismWidgetProps> = ({
  widgetId,
  providerId,
  initialSize = 'medium',
  initialPosition = { x: 20, y: 20 },
  onOpenSettings,
  onClose,
  isElectronApp = false
}) => {
  // Get context data
  const { updateWidget } = useDashboardWidgets();
  const { providers } = useApiProviders();

  // Find the provider
  const provider = providers.find(p => p.id === providerId);

  // State for widget data and behavior
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState<WidgetSize>(initialSize);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [isResizing, setIsResizing] = useState(false);
  const [valueChanged, setValueChanged] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [apiData, setApiData] = useState({
    total: 0,
    change: 0,
    changeType: 'increase' as 'increase' | 'decrease',
    usagePercentage: 0
  });
  const [refreshInterval] = useState(30); // 30 seconds

  // Refs
  const widgetRef = useRef<HTMLDivElement>(null);
  const lastUpdateRef = useRef<Date>(new Date());

  // Get window dimensions for boundary detection
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

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

  // Fetch data from API
  const fetchData = useCallback(async () => {
    try {
      // Get data for the provider using real API calls
      const data = await fetchApiData(providerId);
      console.log(`Fetched real API data for ${providerId}:`, data);

      // Check if value has changed significantly
      const hasChanged = Math.abs(apiData.total - data.total) > 0.01;

      if (hasChanged) {
        setValueChanged(true);
        setTimeout(() => setValueChanged(false), 500);
      }

      // Check if we should show an alert (cost exceeded threshold)
      if (data.usagePercentage > 80) {
        setShowAlert(true);
      }

      setApiData(data);
      lastUpdateRef.current = new Date();
    } catch (error) {
      console.error('Error fetching API cost data:', error);

      // Fallback to Electron API if real API calls fail
      if (isElectronApp) {
        try {
          const data = await getApiCost(providerId);
          setApiData(data);
          lastUpdateRef.current = new Date();
        } catch (fallbackError) {
          console.error('Error fetching fallback data:', fallbackError);
        }
      }
    }
  }, [providerId, apiData.total, isElectronApp]);

  // Set up data fetching interval
  useEffect(() => {
    // Initial fetch
    fetchData();

    // Set up interval for updates
    const interval = setInterval(() => {
      fetchData();
    }, refreshInterval * 1000); // Convert seconds to milliseconds

    return () => clearInterval(interval);
  }, [fetchData, refreshInterval]);

  // Calculate widget dimensions based on size
  const getWidgetDimensions = useCallback(() => {
    switch (size) {
      case 'small':
        return { width: 180, height: 100 };
      case 'large':
        return { width: 300, height: 180 };
      default: // medium
        return { width: 240, height: 140 };
    }
  }, [size]);

  // Ensure position is within screen boundaries
  const ensureWithinBoundaries = useCallback((pos: { x: number; y: number }) => {
    const { width, height } = getWidgetDimensions();

    // Add padding to ensure widget is always at least partially visible
    const padding = 20;

    return {
      x: Math.max(padding - width / 2, Math.min(windowDimensions.width - width / 2 - padding, pos.x)),
      y: Math.max(padding, Math.min(windowDimensions.height - padding - height / 2, pos.y))
    };
  }, [windowDimensions, getWidgetDimensions]);

  // Handle mouse events for dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    // Ignore if clicking on interactive elements
    if (e.target instanceof HTMLElement &&
        (e.target.className.includes('button') ||
         e.target.className.includes('provider-icon') ||
         e.target.className.includes('resize-handle'))) {
      return;
    }

    // Start dragging
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });

    // Add dragging class to body for cursor changes
    document.body.classList.add('widget-dragging');
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      // Calculate new position
      const newPosition = {
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      };

      // Ensure position is within boundaries
      const boundedPosition = ensureWithinBoundaries(newPosition);
      setPosition(boundedPosition);
    }
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);

      // Remove dragging class from body
      document.body.classList.remove('widget-dragging');

      // Update widget position in context
      updateWidget(widgetId, { position });
    }
  };

  // Handle touch events for mobile/tablet
  const handleTouchStart = (e: React.TouchEvent) => {
    // Ignore if touching interactive elements
    if (e.target instanceof HTMLElement &&
        (e.target.className.includes('button') ||
         e.target.className.includes('provider-icon') ||
         e.target.className.includes('resize-handle'))) {
      return;
    }

    // Prevent default to avoid scrolling
    e.preventDefault();

    // Start dragging
    setIsDragging(true);
    setDragOffset({
      x: e.touches[0].clientX - position.x,
      y: e.touches[0].clientY - position.y
    });

    // Add dragging class to body
    document.body.classList.add('widget-dragging');
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging) {
      // Prevent default to avoid scrolling
      e.preventDefault();

      // Calculate new position
      const newPosition = {
        x: e.touches[0].clientX - dragOffset.x,
        y: e.touches[0].clientY - dragOffset.y
      };

      // Ensure position is within boundaries
      const boundedPosition = ensureWithinBoundaries(newPosition);
      setPosition(boundedPosition);
    }
  };

  const handleTouchEnd = () => {
    if (isDragging) {
      setIsDragging(false);

      // Remove dragging class from body
      document.body.classList.remove('widget-dragging');

      // Update widget position in context
      updateWidget(widgetId, { position });
    }

    // Also handle resizing end if needed
    if (isResizing) {
      setIsResizing(false);
    }
  };

  // State for custom sizing
  const [customSize, setCustomSize] = useState<{ width: number; height: number } | null>(null);
  const [resizeStartPos, setResizeStartPos] = useState({ x: 0, y: 0 });
  const [initialSize, setInitialSize] = useState({ width: 0, height: 0 });

  // Handle resize
  const handleResizeStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);

    // Store the initial mouse position
    setResizeStartPos({
      x: e.clientX,
      y: e.clientY
    });

    // Store the initial widget size
    if (widgetRef.current) {
      setInitialSize({
        width: widgetRef.current.offsetWidth,
        height: widgetRef.current.offsetHeight
      });
    }
  };

  // Global mouse event listeners
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        // Calculate new position
        const newPosition = {
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y
        };

        // Ensure position is within boundaries
        const boundedPosition = ensureWithinBoundaries(newPosition);
        setPosition(boundedPosition);
      } else if (isResizing && widgetRef.current) {
        // Calculate the change in mouse position
        const deltaX = e.clientX - resizeStartPos.x;
        const deltaY = e.clientY - resizeStartPos.y;

        // Calculate new dimensions
        const newWidth = Math.max(120, initialSize.width + deltaX);
        const newHeight = Math.max(60, initialSize.height + deltaY);

        // Set custom size
        setCustomSize({ width: newWidth, height: newHeight });

        // Determine standard size based on dimensions for context storage
        let newSize: WidgetSize = 'medium';
        if (newWidth < 220 && newHeight < 120) {
          newSize = 'small';
        } else if (newWidth > 280 || newHeight > 160) {
          newSize = 'large';
        }

        if (newSize !== size) {
          setSize(newSize);
          updateWidget(widgetId, { size: newSize });
        }
      }
    };

    const onMouseUp = () => {
      // Handle end of dragging
      if (isDragging) {
        setIsDragging(false);
        document.body.classList.remove('widget-dragging');

        // Update widget position in context
        updateWidget(widgetId, { position });
      }

      // Handle end of resizing
      if (isResizing) {
        setIsResizing(false);

        // Save custom size to context if it exists
        if (customSize) {
          updateWidget(widgetId, {
            size,
            customSize: {
              width: customSize.width,
              height: customSize.height
            }
          });
        }
      }
    };

    // Handle touch events for mobile/tablet
    const onTouchMove = (e: TouchEvent) => {
      if (isDragging && e.touches.length > 0) {
        // Prevent default to avoid scrolling
        e.preventDefault();

        // Calculate new position
        const newPosition = {
          x: e.touches[0].clientX - dragOffset.x,
          y: e.touches[0].clientY - dragOffset.y
        };

        // Ensure position is within boundaries
        const boundedPosition = ensureWithinBoundaries(newPosition);
        setPosition(boundedPosition);
      }
    };

    // Touch end handler - simplified to avoid duplication
    const onTouchEnd = onMouseUp;

    if (isDragging || isResizing) {
      // Mouse events
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);

      // Touch events
      document.addEventListener('touchmove', onTouchMove, { passive: false });
      document.addEventListener('touchend', onTouchEnd);
      document.addEventListener('touchcancel', onTouchEnd);
    }

    return () => {
      // Clean up all event listeners
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchend', onTouchEnd);
      document.removeEventListener('touchcancel', onTouchEnd);
    };
  }, [isDragging, dragOffset, isResizing, ensureWithinBoundaries, position, size, widgetId, updateWidget]);

  // Initialize widget position within screen boundaries on first load
  useEffect(() => {
    // Check if the widget is outside the screen boundaries
    const boundedPosition = ensureWithinBoundaries(position);

    // If the position needs adjustment, update it
    if (boundedPosition.x !== position.x || boundedPosition.y !== position.y) {
      setPosition(boundedPosition);
      updateWidget(widgetId, { position: boundedPosition });
    }
  }, [windowDimensions, ensureWithinBoundaries, position, widgetId, updateWidget]);

  // Toggle theme
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // Toggle size
  const cycleSize = () => {
    const sizes: ('small' | 'medium' | 'large')[] = ['small', 'medium', 'large'];
    const currentIndex = sizes.indexOf(size);
    const nextIndex = (currentIndex + 1) % sizes.length;
    const newSize = sizes[nextIndex];
    setSize(newSize);
    updateWidget(widgetId, { size: newSize });
  };

  // Handle refresh
  const handleRefresh = () => {
    fetchData();
  };

  // Open settings
  const openSettings = () => {
    if (onOpenSettings) {
      onOpenSettings();
    }
  };

  // Get provider name
  const providerName = provider?.name ?? providerId;

  // Determine icon for theme toggle or close
  const getThemeOrCloseIcon = () => {
    if (onClose) {
      return <CloseIcon fontSize="small" />;
    } else {
      return theme === 'dark' ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />;
    }
  };

  return (
    <div className="widget-container">
      <section
        ref={widgetRef}
        className={`glass-widget ${size} ${theme} ${isDragging ? 'dragging' : ''} ${isResizing ? 'resizing' : ''}`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          cursor: isDragging ? 'grabbing' : 'grab',
          ...(customSize && {
            width: `${customSize.width}px`,
            height: `${customSize.height}px`
          })
        }}
        aria-label={`${providerName} API usage widget`}
      >
        {/* Interactive overlay for mouse/touch events */}
        <button
          className="widget-interactive-overlay"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          aria-label="Drag to move widget"
        >
      {/* Header */}
      <div className="glass-widget-header">
        <h1 className="glass-widget-title">{providerName} API USAGE</h1>
        <div className="glass-widget-controls">
          <Tooltip title="Settings" placement="top" arrow>
            <IconButton
              size="small"
              className="glass-widget-icon-button settings"
              onClick={openSettings}
              sx={{
                padding: '4px',
                color: 'rgba(255, 255, 255, 0.8)',
                background: 'rgba(255, 165, 0, 0.2)',
                '&:hover': {
                  background: 'rgba(255, 165, 0, 0.4)'
                }
              }}
            >
              <SettingsIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Refresh" placement="top" arrow>
            <IconButton
              size="small"
              className="glass-widget-icon-button refresh"
              onClick={handleRefresh}
              sx={{
                padding: '4px',
                color: 'rgba(255, 255, 255, 0.8)',
                background: 'rgba(33, 150, 243, 0.2)',
                '&:hover': {
                  background: 'rgba(33, 150, 243, 0.4)'
                }
              }}
            >
              <RefreshIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Resize" placement="top" arrow>
            <IconButton
              size="small"
              className="glass-widget-icon-button resize"
              onClick={cycleSize}
              sx={{
                padding: '4px',
                color: 'rgba(255, 255, 255, 0.8)',
                background: 'rgba(76, 175, 80, 0.2)',
                '&:hover': {
                  background: 'rgba(76, 175, 80, 0.4)'
                }
              }}
            >
              {size === 'large' ? (
                <CompressIcon fontSize="small" />
              ) : (
                <ExpandIcon fontSize="small" />
              )}
            </IconButton>
          </Tooltip>

          <Tooltip
            title={onClose ? "Close Widget" : "Toggle Theme"}
            placement="top"
            arrow
          >
            <IconButton
              size="small"
              className="glass-widget-icon-button close"
              onClick={() => {
                if (onClose) {
                  onClose();
                } else {
                  toggleTheme();
                }
              }}
              sx={{
                padding: '4px',
                color: 'rgba(255, 255, 255, 0.8)',
                background: onClose ? 'rgba(244, 67, 54, 0.2)' : 'rgba(156, 39, 176, 0.2)',
                '&:hover': {
                  background: onClose ? 'rgba(244, 67, 54, 0.4)' : 'rgba(156, 39, 176, 0.4)'
                }
              }}
            >
              {getThemeOrCloseIcon()}
            </IconButton>
          </Tooltip>
        </div>
      </div>

      {/* Content */}
      <div className={`glass-widget-content ${valueChanged ? 'value-changed' : ''}`}>
        <p className="cost-value">${apiData.total.toFixed(2)}</p>
        <p className={`cost-change ${apiData.changeType === 'increase' ? 'cost-increase' : 'cost-decrease'}`}>
          <span className="cost-change-icon">{apiData.changeType === 'increase' ? '↑' : '↓'}</span>
          ${apiData.change.toFixed(2)}
          <span className="cost-percentage">
            ({(apiData.change / (apiData.total || 1) * 100).toFixed(1)}%)
          </span>
        </p>
      </div>

      {/* Alert indicator */}
      {showAlert && (
        <div className="glass-widget-alert">
          <WarningIcon fontSize="small" />
        </div>
      )}

      {/* Resize handle */}
      <button
        className="glass-widget-resize-handle"
        onMouseDown={handleResizeStart}
        title="Drag to resize"
        aria-label="Resize widget"
      />
        </div>
      </section>
    </div>
  );
};

export default EnhancedGlassMorphismWidget;
