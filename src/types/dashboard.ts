import { Size } from './common';

/**
 * Position interface
 * Represents the position of a widget on the dashboard
 */
export interface Position {
  x: number;
  y: number;
}

/**
 * Widget Type
 * Represents the type of widget to display
 */
export type WidgetType = 'cost' | 'usage' | 'quota' | 'history';

/**
 * Custom Size interface
 * Represents custom dimensions for a widget
 */
export interface CustomSize {
  width: number;
  height: number;
}

/**
 * Dashboard Widget
 * Represents a widget on the dashboard
 */
export interface DashboardWidget {
  id: string;
  providerId: string;
  type: WidgetType;
  size: Size;
  position: Position;
  isVisible: boolean;
  customSize?: CustomSize;
}

/**
 * Dashboard
 * Represents a dashboard with widgets
 */
export interface Dashboard {
  id: string;
  name: string;
  widgets: DashboardWidget[];
  createdAt: string;
  updatedAt: string;
  isDefault?: boolean;
  userId?: string;
  isShared?: boolean;
  sharedWith?: string[];
}

/**
 * Dashboard Context
 * Represents the context for dashboard widgets
 */
export interface DashboardWidgetContext {
  widgets: DashboardWidget[];
  addWidget: (widget: Omit<DashboardWidget, 'id'>) => void;
  updateWidget: (widgetId: string, updates: Partial<DashboardWidget>) => void;
  removeWidget: (widgetId: string) => void;
  toggleWidgetVisibility: (widgetId: string) => void;
}
