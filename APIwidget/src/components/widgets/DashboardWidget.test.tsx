import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DashboardWidget from './DashboardWidget';
import { DashboardWidget as DashboardWidgetType } from '../../contexts/DashboardWidgetContext';

// Mock the mockDataService
jest.mock('../../services/mockDataService', () => ({
  getMockProviderData: () => ({
    total: 24.56,
    change: 1.23,
    changeType: 'increase'
  })
}));

describe('DashboardWidget', () => {
  const mockWidget: DashboardWidgetType = {
    id: 'test-widget-1',
    providerId: 'openai',
    type: 'cost',
    size: 'medium',
    position: { x: 0, y: 0 },
    isVisible: true
  };

  const mockHandlers = {
    onRemove: jest.fn(),
    onSizeChange: jest.fn(),
    onToggleVisibility: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the widget with correct provider name', () => {
    render(
      <DashboardWidget
        widget={mockWidget}
        onRemove={mockHandlers.onRemove}
        onSizeChange={mockHandlers.onSizeChange}
        onToggleVisibility={mockHandlers.onToggleVisibility}
      />
    );

    expect(screen.getByText(/OpenAI Cost/i)).toBeInTheDocument();
  });

  it('displays the correct cost data', () => {
    render(
      <DashboardWidget
        widget={mockWidget}
        onRemove={mockHandlers.onRemove}
        onSizeChange={mockHandlers.onSizeChange}
        onToggleVisibility={mockHandlers.onToggleVisibility}
      />
    );

    expect(screen.getByText('$24.56')).toBeInTheDocument();
    expect(screen.getByText(/\$1.23/)).toBeInTheDocument();
  });

  it('calls onRemove when remove option is clicked', () => {
    render(
      <DashboardWidget
        widget={mockWidget}
        onRemove={mockHandlers.onRemove}
        onSizeChange={mockHandlers.onSizeChange}
        onToggleVisibility={mockHandlers.onToggleVisibility}
      />
    );

    // Open the menu
    fireEvent.click(screen.getByLabelText('widget settings'));
    
    // Click the remove option
    fireEvent.click(screen.getByText('Remove'));
    
    expect(mockHandlers.onRemove).toHaveBeenCalledWith(mockWidget.id);
  });

  it('calls onSizeChange when size option is clicked', () => {
    render(
      <DashboardWidget
        widget={mockWidget}
        onRemove={mockHandlers.onRemove}
        onSizeChange={mockHandlers.onSizeChange}
        onToggleVisibility={mockHandlers.onToggleVisibility}
      />
    );

    // Open the menu
    fireEvent.click(screen.getByLabelText('widget settings'));
    
    // Click the small size option
    fireEvent.click(screen.getByText('Small'));
    
    expect(mockHandlers.onSizeChange).toHaveBeenCalledWith(mockWidget.id, 'small');
  });

  it('calls onToggleVisibility when visibility option is clicked', () => {
    render(
      <DashboardWidget
        widget={mockWidget}
        onRemove={mockHandlers.onRemove}
        onSizeChange={mockHandlers.onSizeChange}
        onToggleVisibility={mockHandlers.onToggleVisibility}
      />
    );

    // Open the menu
    fireEvent.click(screen.getByLabelText('widget settings'));
    
    // Click the visibility option
    fireEvent.click(screen.getByText('Hide in Widget'));
    
    expect(mockHandlers.onToggleVisibility).toHaveBeenCalledWith(mockWidget.id);
  });
});
