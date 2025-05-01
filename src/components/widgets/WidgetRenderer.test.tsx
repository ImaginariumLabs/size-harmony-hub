import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import WidgetRenderer from './WidgetRenderer';
import { DashboardWidget } from '../../types/dashboard';

// Mock the GlassMorphismWidget component
vi.mock('./GlassMorphismWidget', () => ({
  default: vi.fn(({ widgetId, providerId, onOpenSettings, onClose }) => (
    <div data-testid={`widget-${widgetId}`} data-provider={providerId}>
      <button onClick={() => onOpenSettings()}>Open Settings</button>
      <button onClick={() => onClose()}>Close</button>
    </div>
  ))
}));

describe('WidgetRenderer', () => {
  const mockOnOpenSettings = vi.fn();
  const mockOnToggleVisibility = vi.fn();
  
  // Sample widgets for testing
  const widgets: DashboardWidget[] = [
    {
      id: 'widget-1',
      providerId: 'provider-1',
      type: 'cost',
      size: 'medium',
      position: { x: 10, y: 10 },
      isVisible: true
    },
    {
      id: 'widget-2',
      providerId: 'provider-2',
      type: 'usage',
      size: 'small',
      position: { x: 200, y: 200 },
      isVisible: true
    },
    {
      id: 'widget-3',
      providerId: 'provider-3',
      type: 'cost',
      size: 'large',
      position: { x: 400, y: 400 },
      isVisible: false // This one is not visible
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders only visible widgets', () => {
    render(
      <WidgetRenderer
        widgets={widgets}
        onOpenSettings={mockOnOpenSettings}
        onToggleVisibility={mockOnToggleVisibility}
      />
    );

    // Check that only visible widgets are rendered
    expect(screen.getByTestId('widget-widget-1')).toBeInTheDocument();
    expect(screen.getByTestId('widget-widget-2')).toBeInTheDocument();
    expect(screen.queryByTestId('widget-widget-3')).not.toBeInTheDocument();
  });

  it('passes correct props to GlassMorphismWidget', () => {
    render(
      <WidgetRenderer
        widgets={widgets}
        onOpenSettings={mockOnOpenSettings}
        onToggleVisibility={mockOnToggleVisibility}
        isElectronApp={true}
      />
    );

    // Check that provider IDs are passed correctly
    expect(screen.getByTestId('widget-widget-1')).toHaveAttribute('data-provider', 'provider-1');
    expect(screen.getByTestId('widget-widget-2')).toHaveAttribute('data-provider', 'provider-2');
  });

  it('calls onOpenSettings with correct widget ID when settings button is clicked', () => {
    render(
      <WidgetRenderer
        widgets={widgets}
        onOpenSettings={mockOnOpenSettings}
        onToggleVisibility={mockOnToggleVisibility}
      />
    );

    // Click the settings button on the first widget
    screen.getAllByText('Open Settings')[0].click();
    
    // Check that onOpenSettings was called with the correct widget ID
    expect(mockOnOpenSettings).toHaveBeenCalledWith('widget-1');
  });

  it('calls onToggleVisibility with correct widget ID when close button is clicked', () => {
    render(
      <WidgetRenderer
        widgets={widgets}
        onOpenSettings={mockOnOpenSettings}
        onToggleVisibility={mockOnToggleVisibility}
      />
    );

    // Click the close button on the second widget
    screen.getAllByText('Close')[1].click();
    
    // Check that onToggleVisibility was called with the correct widget ID
    expect(mockOnToggleVisibility).toHaveBeenCalledWith('widget-2');
  });

  it('renders no widgets when all are invisible', () => {
    const invisibleWidgets = widgets.map(widget => ({ ...widget, isVisible: false }));
    
    render(
      <WidgetRenderer
        widgets={invisibleWidgets}
        onOpenSettings={mockOnOpenSettings}
        onToggleVisibility={mockOnToggleVisibility}
      />
    );

    // Check that no widgets are rendered
    expect(screen.queryByTestId(/widget-/)).not.toBeInTheDocument();
  });
});
