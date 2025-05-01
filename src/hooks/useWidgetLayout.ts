import { useState, useEffect, useCallback } from 'react';
import { DashboardWidget } from '../types/dashboard';

export type LayoutType = 'free' | 'grid' | 'line';

interface WindowDimensions {
  width: number;
  height: number;
}

interface UseWidgetLayoutProps {
  widgets: DashboardWidget[];
  updateWidget: (widgetId: string, updates: Partial<DashboardWidget>) => void;
}

/**
 * Custom hook for managing widget layouts
 * 
 * This hook handles different layout types (free, grid, line) and
 * calculates widget positions based on the selected layout.
 */
export const useWidgetLayout = ({ widgets, updateWidget }: UseWidgetLayoutProps) => {
  const [layout, setLayout] = useState<LayoutType>('free');
  const [windowDimensions, setWindowDimensions] = useState<WindowDimensions>({
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

  // Handle layout changes
  const applyLayout = useCallback(() => {
    if (layout === 'free') {
      // Free layout doesn't need any position adjustments
      return;
    }

    const visibleWidgets = widgets.filter(widget => widget.isVisible);
    
    if (layout === 'grid') {
      // Arrange widgets in a grid
      const columns = Math.ceil(Math.sqrt(visibleWidgets.length));
      const cellWidth = Math.floor(windowDimensions.width / (columns + 1));
      const cellHeight = Math.floor(windowDimensions.height / (Math.ceil(visibleWidgets.length / columns) + 1));
      
      visibleWidgets.forEach((widget, index) => {
        const row = Math.floor(index / columns);
        const col = index % columns;
        
        const widthOffset = widget.size === 'large' ? 150 : widget.size === 'small' ? 90 : 120;
        const heightOffset = widget.size === 'large' ? 90 : widget.size === 'small' ? 50 : 70;
        
        updateWidget(widget.id, {
          position: {
            x: (col + 1) * cellWidth - widthOffset,
            y: (row + 1) * cellHeight - heightOffset
          }
        });
      });
    } else if (layout === 'line') {
      // Arrange widgets in a horizontal line
      const spacing = 20;
      const startX = spacing;
      const y = windowDimensions.height - 160; // Position near bottom of screen
      
      let currentX = startX;
      
      visibleWidgets.forEach((widget) => {
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
  }, [layout, widgets, windowDimensions, updateWidget]);

  // Apply layout when it changes or when widgets change
  useEffect(() => {
    applyLayout();
  }, [layout, widgets.length, applyLayout]);

  return {
    layout,
    setLayout,
    windowDimensions
  };
};
