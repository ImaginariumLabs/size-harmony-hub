import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useWidgetLayout } from './useWidgetLayout';
import { DashboardWidget } from '../types/dashboard';

// Mock window dimensions
const originalInnerWidth = window.innerWidth;
const originalInnerHeight = window.innerHeight;

describe('useWidgetLayout', () => {
  const mockUpdateWidget = vi.fn();
  
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
    
    // Reset window dimensions
    Object.defineProperty(window, 'innerWidth', { value: 1024, writable: true });
    Object.defineProperty(window, 'innerHeight', { value: 768, writable: true });
    
    // Mock window resize event
    window.dispatchEvent = vi.fn();
  });

  afterAll(() => {
    // Restore original window dimensions
    Object.defineProperty(window, 'innerWidth', { value: originalInnerWidth });
    Object.defineProperty(window, 'innerHeight', { value: originalInnerHeight });
  });

  it('initializes with default layout and window dimensions', () => {
    const { result } = renderHook(() => useWidgetLayout({ 
      widgets, 
      updateWidget: mockUpdateWidget 
    }));

    expect(result.current.layout).toBe('free');
    expect(result.current.windowDimensions).toEqual({
      width: 1024,
      height: 768
    });
  });

  it('allows changing the layout', () => {
    const { result } = renderHook(() => useWidgetLayout({ 
      widgets, 
      updateWidget: mockUpdateWidget 
    }));

    act(() => {
      result.current.setLayout('grid');
    });

    expect(result.current.layout).toBe('grid');
  });

  it('applies grid layout when layout is set to grid', () => {
    const { result } = renderHook(() => useWidgetLayout({ 
      widgets, 
      updateWidget: mockUpdateWidget 
    }));

    act(() => {
      result.current.setLayout('grid');
    });

    // Only visible widgets should be updated
    expect(mockUpdateWidget).toHaveBeenCalledTimes(2);
    
    // Check that the widget positions were updated
    expect(mockUpdateWidget).toHaveBeenCalledWith('widget-1', expect.objectContaining({
      position: expect.any(Object)
    }));
    
    expect(mockUpdateWidget).toHaveBeenCalledWith('widget-2', expect.objectContaining({
      position: expect.any(Object)
    }));
    
    // The invisible widget should not be updated
    expect(mockUpdateWidget).not.toHaveBeenCalledWith('widget-3', expect.anything());
  });

  it('applies line layout when layout is set to line', () => {
    const { result } = renderHook(() => useWidgetLayout({ 
      widgets, 
      updateWidget: mockUpdateWidget 
    }));

    act(() => {
      result.current.setLayout('line');
    });

    // Only visible widgets should be updated
    expect(mockUpdateWidget).toHaveBeenCalledTimes(2);
    
    // Check that the widget positions were updated
    expect(mockUpdateWidget).toHaveBeenCalledWith('widget-1', expect.objectContaining({
      position: expect.objectContaining({
        y: 768 - 160 // Near bottom of screen
      })
    }));
    
    expect(mockUpdateWidget).toHaveBeenCalledWith('widget-2', expect.objectContaining({
      position: expect.objectContaining({
        y: 768 - 160 // Near bottom of screen
      })
    }));
    
    // The invisible widget should not be updated
    expect(mockUpdateWidget).not.toHaveBeenCalledWith('widget-3', expect.anything());
  });

  it('does not update positions when layout is free', () => {
    const { result } = renderHook(() => useWidgetLayout({ 
      widgets, 
      updateWidget: mockUpdateWidget 
    }));

    // Free layout is the default, so no updates should happen
    expect(mockUpdateWidget).not.toHaveBeenCalled();
    
    // Change to grid layout first
    act(() => {
      result.current.setLayout('grid');
    });
    
    // Clear the mock to check for new calls
    mockUpdateWidget.mockClear();
    
    // Change back to free layout
    act(() => {
      result.current.setLayout('free');
    });
    
    // No updates should happen when switching to free layout
    expect(mockUpdateWidget).not.toHaveBeenCalled();
  });
});
