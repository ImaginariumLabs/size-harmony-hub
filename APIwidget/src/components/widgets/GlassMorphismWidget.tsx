import React, { useState, useEffect, useRef, useCallback } from 'react';
import '../../styles/components/widgets/GlassMorphismWidget.css';
import { getApiCost, getAllApiCosts, isElectron } from '../../services/electronService';
import { loadSettings, saveSettings, isAboveThreshold } from '../../services/settingsService';
import { getAllProviders } from '../../services/mockDataService';
import WidgetSettings from './WidgetSettings';

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
  const [refreshInterval, setRefreshInterval] = useState(storedSettings.refreshInterval || 30);

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

  // Handle mouse events for dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target instanceof HTMLElement &&
        (e.target.className.includes('button') ||
         e.target.className.includes('provider-icon') ||
         e.target.className.includes('resize-handle'))) {
      return;
    }

    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
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
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y
        });
      } else if (isResizing) {
        handleResize(e);
      }
    };

    const onMouseUp = () => {
      setIsDragging(false);
      handleResizeEnd();
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [isDragging, dragOffset, isResizing]);

  // Save position and preferences
  useEffect(() => {
    // In a real app, we would save these to localStorage or Electron store
    localStorage.setItem('widget_position', JSON.stringify(position));
    localStorage.setItem('widget_size', size);
    localStorage.setItem('widget_theme', theme);
    localStorage.setItem('widget_provider', activeProvider);
  }, [position, size, theme, activeProvider]);

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
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // Cycle through sizes
  const cycleSize = () => {
    const sizes: ('small' | 'medium' | 'large' | 'compact')[] = ['compact', 'small', 'medium', 'large'];
    const currentIndex = sizes.indexOf(size);
    const nextIndex = (currentIndex + 1) % sizes.length;
    setSize(sizes[nextIndex]);
  };

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
        case 'ArrowRight':
          // Right arrow to switch to next provider
          const currentIndex = providers.findIndex(p => p.id === activeProvider);
          const nextIndex = (currentIndex + 1) % providers.length;
          setActiveProvider(providers[nextIndex].id);
          break;
        case 'ArrowLeft':
          // Left arrow to switch to previous provider
          const currIndex = providers.findIndex(p => p.id === activeProvider);
          const prevIndex = (currIndex - 1 + providers.length) % providers.length;
          setActiveProvider(providers[prevIndex].id);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [providers, activeProvider]);

  return (
    <>
      <div
        ref={widgetRef}
        className={`glass-widget ${size} ${theme}`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          cursor: isDragging ? 'grabbing' : 'grab'
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        tabIndex={0} // Make widget focusable for keyboard shortcuts
        role="region"
        aria-label="API usage widget"
      >
        {/* Header */}
        <div className="glass-widget-header">
          <h1 className="glass-widget-title">{activeProviderData.name} API USAGE</h1>
          <div className="glass-widget-controls">
            <button
              className="glass-widget-button settings"
              onClick={openSettings}
              title="Settings"
            >
              ⚙
            </button>
            <button
              className="glass-widget-button expand"
              onClick={() => {
                if (isElectron() && onToggleMainWindow) {
                  onToggleMainWindow();
                } else {
                  cycleSize();
                }
              }}
              title="Expand"
            >
              +
            </button>
            <button
              className="glass-widget-button close"
              onClick={() => {
                if (isElectron() && onClose) {
                  onClose();
                } else {
                  toggleTheme();
                }
              }}
              title={isElectron() ? "Close" : "Toggle Theme"}
            >
              {isElectron() ? "×" : "T"}
            </button>
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
          <span>Updated {getTimeSinceUpdate()}</span>
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
          <button
            className="alert-indicator"
            onClick={dismissAlert}
            title="Cost threshold exceeded"
            aria-label="Dismiss cost threshold alert"
          />
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
