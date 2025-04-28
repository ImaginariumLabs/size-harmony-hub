import React, { useState, useEffect, useRef, useCallback } from 'react';
import '../../styles/components/widgets/GlassMorphismWidget.css';
import { getApiCost, getAllApiCosts, isElectron } from '../../services/electronService';
import { loadSettings, saveSettings, isAboveThreshold } from '../../services/settingsService';
import { getAllProviders } from '../../services/mockDataService';
import WidgetSettings from './WidgetSettings';
import { Tooltip, Fade, Badge, IconButton } from '@mui/material';
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

interface Provider {
  id: string;
  name: string;
  cost: number;
  change: number;
  isIncrease: boolean;
}

interface GlassMorphismWidgetProps {
  initialSize?: 'small' | 'medium' | 'large' | 'compact';
  initialTheme?: 'dark' | 'light';
  initialPosition?: { x: number; y: number };
  onToggleMainWindow?: () => void;
  onClose?: () => void;
}

const GlassMorphismWidget: React.FC<GlassMorphismWidgetProps> = ({
  initialSize = 'medium',
  initialTheme = 'dark',
  initialPosition = { x: 20, y: 20 },
  onToggleMainWindow,
  onClose
}) => {
  // Load settings from storage
  const storedSettings = loadSettings();

  // State for widget data and behavior
  const [providers, setProviders] = useState<Provider[]>([
    { id: 'openai', name: 'OpenAI', cost: 24.56, change: 1.2, isIncrease: true },
    { id: 'github', name: 'GitHub', cost: 0.00, change: 0.0, isIncrease: false },
    { id: 'aws', name: 'AWS', cost: 12.34, change: 0.8, isIncrease: false }
  ]);
  const [activeProvider, setActiveProvider] = useState<string>(storedSettings.activeProvider || 'openai');
  const [position, setPosition] = useState(storedSettings.position || initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState<'small' | 'medium' | 'large' | 'compact'>(storedSettings.size || initialSize);
  const [theme, setTheme] = useState<'dark' | 'light'>(storedSettings.theme || initialTheme);
  const [isResizing, setIsResizing] = useState(false);
  const [valueChanged, setValueChanged] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [refreshInterval] = useState(storedSettings.refreshInterval || 30);

  // Refs
  const widgetRef = useRef<HTMLDivElement>(null);
  const lastUpdateRef = useRef<Date>(new Date());

  // Load providers from mock data service
  useEffect(() => {
    const loadProviderData = async () => {
      try {
        // Get provider info
        const allProviders = getAllProviders();

        // Get cost data for all providers
        const costData = await getAllApiCosts();

        // Combine provider info with cost data
        const updatedProviders = allProviders.map(provider => {
          const cost = costData[provider.id] || { total: 0, change: 0, changeType: 'increase' };
          return {
            id: provider.id,
            name: provider.name,
            cost: cost.total,
            change: cost.change,
            isIncrease: cost.changeType === 'increase'
          };
        });

        setProviders(updatedProviders);
      } catch (error) {
        console.error('Error loading provider data:', error);
      }
    };

    loadProviderData();
  }, []);

  // Fetch data from Electron or use mock data
  const fetchData = useCallback(async () => {
    try {
      // Get data for the active provider
      const data = await getApiCost(activeProvider);

      // Update the active provider with new data
      setProviders(prev => prev.map(provider => {
        if (provider.id === activeProvider) {
          // Check if value has changed significantly
          const hasChanged = Math.abs(provider.cost - data.total) > 0.01;

          // Check if we should show an alert (cost exceeded threshold)
          const shouldAlert = isAboveThreshold(provider.id, data.total);

          if (hasChanged) {
            setValueChanged(true);
            setTimeout(() => setValueChanged(false), 500);
          }

          if (shouldAlert) {
            setShowAlert(true);
          }

          return {
            ...provider,
            cost: data.total,
            change: data.change,
            isIncrease: data.changeType === 'increase'
          };
        }
        return provider;
      }));

      lastUpdateRef.current = new Date();
    } catch (error) {
      console.error('Error fetching API cost data:', error);
    }
  }, [activeProvider]);

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

  // Save settings when they change
  useEffect(() => {
    saveSettings({
      position,
      size,
      theme,
      activeProvider,
      refreshInterval
    });
  }, [position, size, theme, activeProvider, refreshInterval]);

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

  // Calculate widget dimensions based on size
  const getWidgetDimensions = useCallback(() => {
    switch (size) {
      case 'compact':
        return { width: 120, height: 60 };
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

    // Log dragging start for debugging
    console.log('Dragging started', {
      clientX: e.clientX,
      clientY: e.clientY,
      position,
      offset: {
        x: e.clientX - position.x,
        y: e.clientY - position.y
      }
    });
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

      // Save position to settings
      saveSettings({ position });
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

      // Save position to settings
      saveSettings({ position });
    }
  };

  // Handle resize
  const handleResizeStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
  };

  const handleResize = (e: MouseEvent) => {
    if (isResizing && widgetRef.current) {
      const width = e.clientX - position.x;
      const height = e.clientY - position.y;

      // Determine size based on dimensions
      if (width < 150 && height < 80) {
        setSize('compact');
      } else if (width < 220 && height < 120) {
        setSize('small');
      } else if (width < 280 && height < 160) {
        setSize('medium');
      } else {
        setSize('large');
      }
    }
  };

  const handleResizeEnd = () => {
    setIsResizing(false);
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

        // Log position updates for debugging
        console.log('Dragging position update', {
          clientX: e.clientX,
          clientY: e.clientY,
          newPosition,
          boundedPosition
        });
      } else if (isResizing) {
        handleResize(e);
      }
    };

    const onMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        document.body.classList.remove('widget-dragging');

        // Save position to settings
        saveSettings({ position });

        // Log dragging end for debugging
        console.log('Dragging ended', { finalPosition: position });
      }

      handleResizeEnd();
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

    const onTouchEnd = () => {
      if (isDragging) {
        setIsDragging(false);
        document.body.classList.remove('widget-dragging');

        // Save position to settings
        saveSettings({ position });
      }
    };

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
  }, [isDragging, dragOffset, isResizing, ensureWithinBoundaries, position, saveSettings]);

  // Initialize widget position within screen boundaries on first load
  useEffect(() => {
    // Check if the widget is outside the screen boundaries
    const boundedPosition = ensureWithinBoundaries(position);

    // If the position needs adjustment, update it
    if (boundedPosition.x !== position.x || boundedPosition.y !== position.y) {
      setPosition(boundedPosition);
      saveSettings({ position: boundedPosition });
    }

    // Log widget initialization for debugging
    console.log('Widget initialized', {
      position,
      boundedPosition,
      size,
      theme,
      isElectron: isElectron()
    });

    // Send debug info to main process if in Electron
    if (isElectron() && window.electronAPI?.debug) {
      window.electronAPI.debug({
        component: 'GlassMorphismWidget',
        event: 'initialized',
        data: { position, size, theme }
      });
    }

    // Add special handling for Electron environment
    if (isElectron()) {
      // Force the widget to be draggable in Electron
      const handleElectronDrag = (e: MouseEvent) => {
        // Only handle events on the widget header (for better UX)
        const target = e.target as HTMLElement;
        if (target && target.closest('.glass-widget-header')) {
          console.log('Electron drag detected');

          // Send debug info to main process
          if (window.electronAPI?.debug) {
            window.electronAPI.debug({
              component: 'GlassMorphismWidget',
              event: 'drag-start',
              data: { clientX: e.clientX, clientY: e.clientY, position }
            });
          }

          // Simulate our own drag start
          setIsDragging(true);
          setDragOffset({
            x: e.clientX - position.x,
            y: e.clientY - position.y
          });

          // Add dragging class to body
          document.body.classList.add('widget-dragging');
        }
      };

      // Add the event listener to the document
      document.addEventListener('mousedown', handleElectronDrag);

      // Clean up
      return () => {
        document.removeEventListener('mousedown', handleElectronDrag);
      };
    }
  }, [windowDimensions, ensureWithinBoundaries, position, saveSettings, size, theme]);

  // Helper function to get provider color
  const getProviderColor = (providerId: string): string => {
    switch (providerId) {
      case 'openai':
        return '#10a37f';
      case 'github':
        return '#24292e';
      case 'aws':
        return '#ff9900';
      default:
        return '#64b5f6';
    }
  };

  // Get active provider data
  const activeProviderData = providers.find(p => p.id === activeProvider) || providers[0];

  // Format time since last update
  const getTimeSinceUpdate = () => {
    const now = new Date();
    const diff = now.getTime() - lastUpdateRef.current.getTime();

    if (diff < 60000) {
      return 'just now';
    } else if (diff < 3600000) {
      return `${Math.floor(diff / 60000)}m ago`;
    } else {
      return `${Math.floor(diff / 3600000)}h ago`;
    }
  };

  // Toggle theme
  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme]);

  // Cycle through sizes
  const cycleSize = useCallback(() => {
    const sizes: ('small' | 'medium' | 'large' | 'compact')[] = ['compact', 'small', 'medium', 'large'];
    const currentIndex = sizes.indexOf(size);
    const nextIndex = (currentIndex + 1) % sizes.length;
    setSize(sizes[nextIndex]);
  }, [size]);

  // Dismiss alert
  const dismissAlert = () => {
    setShowAlert(false);
  };

  // Open settings panel
  const openSettings = () => {
    setShowSettings(true);
  };

  // Close settings panel
  const closeSettings = () => {
    setShowSettings(false);
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle keyboard shortcuts when widget is focused
      if (!widgetRef.current?.contains(document.activeElement)) return;

      switch (e.key) {
        case 's':
          // 's' to open settings
          openSettings();
          break;
        case 'Escape':
          // Escape to close settings
          closeSettings();
          break;
        case 't':
          // 't' to toggle theme
          toggleTheme();
          break;
        case 'c':
          // 'c' to cycle size
          cycleSize();
          break;
        case 'ArrowRight': {
          // Right arrow to switch to next provider
          const currentIndex = providers.findIndex(p => p.id === activeProvider);
          const nextIndex = (currentIndex + 1) % providers.length;
          setActiveProvider(providers[nextIndex].id);
          break;
        }
        case 'ArrowLeft': {
          // Left arrow to switch to previous provider
          const currIndex = providers.findIndex(p => p.id === activeProvider);
          const prevIndex = (currIndex - 1 + providers.length) % providers.length;
          setActiveProvider(providers[prevIndex].id);
          break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [providers, activeProvider, cycleSize, toggleTheme]);

  return (
    <>
      <div
        ref={widgetRef}
        className={`glass-widget ${size} ${theme} ${isDragging ? 'dragging' : ''}`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          cursor: isDragging ? 'grabbing' : 'grab'
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        tabIndex={0} // Make widget focusable for keyboard shortcuts
        role="region"
        aria-label="API usage widget"
      >
        {/* Header */}
        <div className="glass-widget-header">
          <h1 className="glass-widget-title">{activeProviderData.name} API USAGE</h1>
          <div className="glass-widget-controls">
            <Tooltip title="Settings" placement="top" TransitionComponent={Fade} arrow>
              <IconButton
                size="small"
                className="glass-widget-icon-button settings"
                onClick={openSettings}
                sx={{
                  padding: '4px',
                  color: 'rgba(255, 255, 255, 0.8)',
                  background: 'rgba(255, 165, 0, 0.2)',
                  '&:hover': { background: 'rgba(255, 165, 0, 0.4)' }
                }}
              >
                <SettingsIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip
              title={isElectron() && onToggleMainWindow ? "Open Dashboard" : "Change Size"}
              placement="top"
              TransitionComponent={Fade}
              arrow
            >
              <IconButton
                size="small"
                className="glass-widget-icon-button expand"
                onClick={() => {
                  if (isElectron() && onToggleMainWindow) {
                    onToggleMainWindow();
                  } else {
                    cycleSize();
                  }
                }}
                sx={{
                  padding: '4px',
                  color: 'rgba(255, 255, 255, 0.8)',
                  background: 'rgba(33, 150, 243, 0.2)',
                  '&:hover': { background: 'rgba(33, 150, 243, 0.4)' }
                }}
              >
                {size === 'large' ? <CompressIcon fontSize="small" /> : <ExpandIcon fontSize="small" />}
              </IconButton>
            </Tooltip>

            <Tooltip
              title={isElectron() && onClose ? "Close Widget" : "Toggle Theme"}
              placement="top"
              TransitionComponent={Fade}
              arrow
            >
              <IconButton
                size="small"
                className="glass-widget-icon-button close"
                onClick={() => {
                  if (isElectron() && onClose) {
                    onClose();
                  } else {
                    toggleTheme();
                  }
                }}
                sx={{
                  padding: '4px',
                  color: 'rgba(255, 255, 255, 0.8)',
                  background: isElectron() && onClose ? 'rgba(244, 67, 54, 0.2)' : 'rgba(156, 39, 176, 0.2)',
                  '&:hover': {
                    background: isElectron() && onClose ? 'rgba(244, 67, 54, 0.4)' : 'rgba(156, 39, 176, 0.4)'
                  }
                }}
              >
                {isElectron() && onClose ?
                  <CloseIcon fontSize="small" /> :
                  (theme === 'dark' ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />)
                }
              </IconButton>
            </Tooltip>
          </div>
        </div>

        {/* Content */}
        <div className={`glass-widget-content ${valueChanged ? 'value-changed' : ''}`}>
          <p className="cost-value">${activeProviderData.cost.toFixed(2)}</p>
          <p className={`cost-change ${activeProviderData.isIncrease ? 'cost-increase' : 'cost-decrease'}`}>
            <span className="cost-change-icon">{activeProviderData.isIncrease ? '↑' : '↓'}</span>
            ${activeProviderData.change.toFixed(2)}
            <span className="cost-percentage">
              ({(activeProviderData.change / (activeProviderData.cost || 1) * 100).toFixed(1)}%)
            </span>
          </p>
        </div>

        {/* Footer */}
        <div className="glass-widget-footer">
          <div className="provider-indicator">
            <div className={`provider-dot ${activeProviderData.id}`}></div>
            <span>{activeProviderData.id}</span>
          </div>
          <div className="update-info">
            <span>Updated {getTimeSinceUpdate()}</span>
            <Tooltip title="Refresh data" placement="top">
              <IconButton
                onClick={fetchData}
                size="small"
                sx={{
                  padding: '2px',
                  marginLeft: '4px',
                  color: 'rgba(255, 255, 255, 0.5)',
                  '&:hover': { color: 'rgba(255, 255, 255, 0.8)' }
                }}
              >
                <RefreshIcon fontSize="small" sx={{ fontSize: '14px' }} />
              </IconButton>
            </Tooltip>
          </div>
        </div>

        {/* Provider switcher */}
        {size !== 'compact' && (
          <div className="provider-switcher">
            {providers.map(provider => (
              <button
                key={provider.id}
                className={`provider-icon ${provider.id} ${activeProvider === provider.id ? 'active' : ''}`}
                onClick={() => setActiveProvider(provider.id)}
                title={provider.name}
                aria-label={`Switch to ${provider.name}`}
                style={{
                  backgroundColor: getProviderColor(provider.id)
                }}
              />
            ))}
          </div>
        )}

        {/* Resize handle */}
        <div
          className="resize-handle"
          onMouseDown={handleResizeStart}
          role="button"
          tabIndex={0}
          aria-label="Resize widget"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleResizeStart(e as unknown as React.MouseEvent);
            }
          }}
        />

        {/* Alert indicator */}
        {showAlert && (
          <Tooltip title="Cost threshold exceeded" placement="left">
            <IconButton
              className="alert-indicator"
              onClick={dismissAlert}
              aria-label="Dismiss cost threshold alert"
              size="small"
              sx={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                width: '24px',
                height: '24px',
                padding: '2px',
                color: '#fff',
                background: 'rgba(244, 67, 54, 0.8)',
                '&:hover': { background: 'rgba(244, 67, 54, 1)' },
                animation: 'blink 1s infinite'
              }}
            >
              <WarningIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}

        {/* Keyboard shortcuts hint (only visible on hover) */}
        <div className="keyboard-shortcuts-hint">
          Press 's' for settings
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <WidgetSettings onClose={closeSettings} />
      )}
    </>
  );
};

export default GlassMorphismWidget;
