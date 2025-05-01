import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import DraggableWidgetsGrid from './DraggableWidgetsGrid';

// Mock react-grid-layout
vi.mock('react-grid-layout', () => {
  return {
    default: vi.fn(({ children, onLayoutChange }) => (
      <div data-testid="mock-grid" onClick={() => onLayoutChange([])}>
        {children}
      </div>
    )),
    Responsive: vi.fn(({ children }) => <div data-testid="mock-grid">{children}</div>),
    WidthProvider: vi.fn((Component) => Component),
  };
});

// Mock isElectron
vi.mock('../../services/electronService', () => ({
  isElectron: vi.fn(() => false),
}));

// Mock LoadingContext
vi.mock('../../contexts/LoadingContext', () => ({
  useLoading: () => ({
    showLoading: vi.fn(),
    hideLoading: vi.fn(),
    isLoading: false,
    message: '',
    type: 'circular',
  }),
}));

// Mock react-router-dom
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
}));

describe('DraggableWidgetsGrid', () => {
  const mockProps = {
    configuredProviders: [
      { id: 'openai', name: 'OpenAI' },
      { id: 'claude', name: 'Claude' },
    ],
    widgets: [
      {
        id: 'widget-1',
        providerId: 'openai',
        type: 'usage',
        size: 'small',
        isVisible: true,
        position: { x: 0, y: 0 },
      },
      {
        id: 'widget-2',
        providerId: 'claude',
        type: 'cost',
        size: 'medium',
        isVisible: true,
        position: { x: 1, y: 0 },
      },
    ],
    onRemoveWidget: vi.fn(),
    onSizeChange: vi.fn(),
    onToggleVisibility: vi.fn(),
    onPositionChange: vi.fn(),
    onNavigate: vi.fn(),
    apiCostData: {},
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders empty state when no widgets are provided', () => {
    render(
      <DraggableWidgetsGrid
        {...mockProps}
        widgets={[]}
      />
    );

    expect(screen.getByText(/No Widgets Added/i)).toBeInTheDocument();
  });

  it('renders widgets when provided', () => {
    render(<DraggableWidgetsGrid {...mockProps} />);

    // The grid should be rendered
    expect(screen.getByTestId('mock-grid')).toBeInTheDocument();

    // Check for widget container
    expect(screen.getByText('Widgets')).toBeInTheDocument();
  });

  it('calls onPositionChange when layout changes', () => {
    const { getByTestId } = render(<DraggableWidgetsGrid {...mockProps} />);

    // Simulate layout change
    const grid = getByTestId('mock-grid');
    const layoutChangeHandler = grid.props.onLayoutChange;

    // Set isDragging to true first (normally done by onDragStart)
    const dragStartHandler = grid.props.onDragStart;
    if (dragStartHandler) dragStartHandler();

    layoutChangeHandler(
      [
        { i: 'widget-1', x: 1, y: 1, w: 1, h: 2 },
        { i: 'widget-2', x: 0, y: 0, w: 1, h: 3 },
      ]
    );

    expect(mockProps.onPositionChange).toHaveBeenCalledWith('widget-1', { x: 1, y: 1 });
    expect(mockProps.onPositionChange).toHaveBeenCalledWith('widget-2', { x: 0, y: 0 });
  });

  it('handles widget errors properly', () => {
    // Mock the console.error to prevent test output clutter
    const originalConsoleError = console.error;
    console.error = vi.fn();

    // Create a component that will trigger the error handler
    vi.mock('../common/WidgetErrorBoundary', () => ({
      __esModule: true,
      default: ({ onError, widgetId, children }) => {
        // Simulate an error
        setTimeout(() => {
          if (onError) onError(widgetId, new Error('Test widget error'));
        }, 0);
        return <div>{children}</div>;
      },
    }));

    render(<DraggableWidgetsGrid {...mockProps} />);

    // Verify error handling (would normally check for snackbar, but it's mocked)
    expect(console.error).toHaveBeenCalled();

    // Restore console.error
    console.error = originalConsoleError;
  });
});
