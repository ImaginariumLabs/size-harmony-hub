import React, { useState } from 'react';
import { useDashboardWidgets } from '../../contexts/DashboardWidgetContext';
import { useApiProviders } from '../../contexts/ApiProviderContext';
import WidgetSettingsDialog from './WidgetSettingsDialog';
import WidgetRenderer from './WidgetRenderer';
import WidgetControls from './WidgetControls';
import { useWidgetLayout } from '../../hooks/useWidgetLayout';
import { DashboardWidget } from '../../types/dashboard';

interface MultiWidgetManagerProps {
  isElectronApp?: boolean;
}

/**
 * MultiWidgetManager Component
 *
 * Manages multiple widgets, their layout, and settings
 */
const MultiWidgetManager: React.FC<MultiWidgetManagerProps> = ({ isElectronApp = false }) => {
  const { widgets, addWidget, updateWidget, toggleWidgetVisibility } = useDashboardWidgets();
  const { providers } = useApiProviders();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [selectedWidgetId, setSelectedWidgetId] = useState<string | null>(null);

  // Use the widget layout hook
  const { layout, setLayout, windowDimensions } = useWidgetLayout({
    widgets,
    updateWidget
  });

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
  const handleSaveSettings = (widgetId: string, updates: unknown) => {
    updateWidget(widgetId, updates as Partial<Omit<DashboardWidget, 'id'>>);
    setSettingsOpen(false);
    setSelectedWidgetId(null);
  };

  return (
    <>
      {/* Render Widgets */}
      <WidgetRenderer
        widgets={widgets}
        onOpenSettings={handleOpenSettings}
        onToggleVisibility={toggleWidgetVisibility}
        isElectronApp={isElectronApp}
      />

      {/* Widget Controls */}
      <WidgetControls
        layout={layout}
        onLayoutChange={setLayout}
        onAddWidget={handleAddWidget}
      />

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
