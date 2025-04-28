import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { getAllProviders } from '../services/mockDataService';

// Widget configuration interface
export interface DashboardWidget {
  id: string;
  providerId: string;
  type: 'cost' | 'usage' | 'quota' | 'history';
  size: 'small' | 'medium' | 'large';
  position: { x: number; y: number };
  isVisible: boolean;
}

interface DashboardWidgetContextType {
  widgets: DashboardWidget[];
  addWidget: (widget: Omit<DashboardWidget, 'id'>) => void;
  updateWidget: (id: string, updates: Partial<Omit<DashboardWidget, 'id'>>) => void;
  removeWidget: (id: string) => void;
  toggleWidgetVisibility: (id: string) => void;
  loading: boolean;
}

// Storage key for dashboard widgets
const DASHBOARD_WIDGETS_KEY = 'apiwidget_dashboard_widgets';

// Create the context
const DashboardWidgetContext = createContext<DashboardWidgetContextType | undefined>(undefined);

// Default widgets based on available providers
const createDefaultWidgets = (providers: any[]): DashboardWidget[] => {
  return providers
    .filter(provider => provider.isConfigured)
    .map((provider, index) => ({
      id: `widget-${provider.id}`,
      providerId: provider.id,
      type: 'cost',
      size: 'medium',
      position: { x: 20 + (index * 20), y: 20 + (index * 20) },
      isVisible: true
    }));
};

export function DashboardWidgetProvider({ children }: { children: React.ReactNode }) {
  const [widgets, setWidgets] = useState<DashboardWidget[]>([]);
  const [loading, setLoading] = useState(true);

  // Load widgets from storage or create defaults
  useEffect(() => {
    const loadWidgets = async () => {
      try {
        setLoading(true);
        
        // Try to load from localStorage
        const storedWidgets = localStorage.getItem(DASHBOARD_WIDGETS_KEY);
        
        if (storedWidgets) {
          setWidgets(JSON.parse(storedWidgets));
        } else {
          // Create default widgets based on configured providers
          const providers = getAllProviders();
          const defaultWidgets = createDefaultWidgets(providers);
          setWidgets(defaultWidgets);
          
          // Save the default widgets
          localStorage.setItem(DASHBOARD_WIDGETS_KEY, JSON.stringify(defaultWidgets));
        }
      } catch (error) {
        console.error('Error loading dashboard widgets:', error);
        setWidgets([]);
      } finally {
        setLoading(false);
      }
    };

    loadWidgets();
  }, []);

  // Save widgets to storage whenever they change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem(DASHBOARD_WIDGETS_KEY, JSON.stringify(widgets));
    }
  }, [widgets, loading]);

  // Add a new widget
  const addWidget = (widget: Omit<DashboardWidget, 'id'>) => {
    const newWidget: DashboardWidget = {
      ...widget,
      id: `widget-${Date.now()}`
    };
    
    setWidgets(prevWidgets => [...prevWidgets, newWidget]);
  };

  // Update an existing widget
  const updateWidget = (id: string, updates: Partial<Omit<DashboardWidget, 'id'>>) => {
    setWidgets(prevWidgets => 
      prevWidgets.map(widget => 
        widget.id === id ? { ...widget, ...updates } : widget
      )
    );
  };

  // Remove a widget
  const removeWidget = (id: string) => {
    setWidgets(prevWidgets => prevWidgets.filter(widget => widget.id !== id));
  };

  // Toggle widget visibility
  const toggleWidgetVisibility = (id: string) => {
    setWidgets(prevWidgets => 
      prevWidgets.map(widget => 
        widget.id === id ? { ...widget, isVisible: !widget.isVisible } : widget
      )
    );
  };

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    widgets,
    addWidget,
    updateWidget,
    removeWidget,
    toggleWidgetVisibility,
    loading
  }), [widgets, loading]);

  return <DashboardWidgetContext.Provider value={value}>{children}</DashboardWidgetContext.Provider>;
}

// Custom hook to use the dashboard widget context
export function useDashboardWidgets() {
  const context = useContext(DashboardWidgetContext);
  if (context === undefined) {
    throw new Error('useDashboardWidgets must be used within a DashboardWidgetProvider');
  }
  return context;
}
