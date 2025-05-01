import React from 'react';
import { DashboardWidget } from '../../types/dashboard';
import GlassMorphismWidget from './GlassMorphismWidget';

interface WidgetRendererProps {
  widgets: DashboardWidget[];
  onOpenSettings: (widgetId: string) => void;
  onToggleVisibility: (widgetId: string) => void;
  isElectronApp?: boolean;
}

/**
 * Widget Renderer Component
 * 
 * Renders a collection of widgets based on their configuration
 */
const WidgetRenderer: React.FC<WidgetRendererProps> = ({
  widgets,
  onOpenSettings,
  onToggleVisibility,
  isElectronApp = false
}) => {
  // Get visible widgets
  const visibleWidgets = widgets.filter(widget => widget.isVisible);

  return (
    <>
      {visibleWidgets.map((widget) => (
        <GlassMorphismWidget
          key={widget.id}
          widgetId={widget.id}
          providerId={widget.providerId}
          initialSize={widget.size}
          initialPosition={widget.position}
          onOpenSettings={() => onOpenSettings(widget.id)}
          onClose={() => onToggleVisibility(widget.id)}
          isElectronApp={isElectronApp}
        />
      ))}
    </>
  );
};

export default WidgetRenderer;
