import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import WidgetControls from './WidgetControls';
import { LayoutType } from '../../hooks/useWidgetLayout';

describe('WidgetControls', () => {
  const mockOnLayoutChange = vi.fn();
  const mockOnAddWidget = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all control buttons', () => {
    render(
      <WidgetControls
        layout="free"
        onLayoutChange={mockOnLayoutChange}
        onAddWidget={mockOnAddWidget}
      />
    );

    // Check that all buttons are rendered
    expect(screen.getByTitle('Add Widget')).toBeInTheDocument();
    expect(screen.getByTitle('Line Layout')).toBeInTheDocument();
    expect(screen.getByTitle('Grid Layout')).toBeInTheDocument();
    expect(screen.getByTitle('Free Layout')).toBeInTheDocument();
  });

  it('highlights the active layout button', () => {
    const { rerender } = render(
      <WidgetControls
        layout="free"
        onLayoutChange={mockOnLayoutChange}
        onAddWidget={mockOnAddWidget}
      />
    );

    // Free layout button should be highlighted
    const freeButton = screen.getByTitle('Free Layout');
    expect(freeButton).toHaveAttribute('color', 'secondary');
    
    // Other buttons should not be highlighted
    expect(screen.getByTitle('Line Layout')).toHaveAttribute('color', 'default');
    expect(screen.getByTitle('Grid Layout')).toHaveAttribute('color', 'default');

    // Change layout to grid
    rerender(
      <WidgetControls
        layout="grid"
        onLayoutChange={mockOnLayoutChange}
        onAddWidget={mockOnAddWidget}
      />
    );

    // Grid layout button should be highlighted
    expect(screen.getByTitle('Grid Layout')).toHaveAttribute('color', 'secondary');
    
    // Other buttons should not be highlighted
    expect(screen.getByTitle('Line Layout')).toHaveAttribute('color', 'default');
    expect(screen.getByTitle('Free Layout')).toHaveAttribute('color', 'default');
  });

  it('calls onAddWidget when add button is clicked', () => {
    render(
      <WidgetControls
        layout="free"
        onLayoutChange={mockOnLayoutChange}
        onAddWidget={mockOnAddWidget}
      />
    );

    fireEvent.click(screen.getByTitle('Add Widget'));
    expect(mockOnAddWidget).toHaveBeenCalledTimes(1);
  });

  it('calls onLayoutChange with correct layout type when layout buttons are clicked', () => {
    render(
      <WidgetControls
        layout="free"
        onLayoutChange={mockOnLayoutChange}
        onAddWidget={mockOnAddWidget}
      />
    );

    // Click line layout button
    fireEvent.click(screen.getByTitle('Line Layout'));
    expect(mockOnLayoutChange).toHaveBeenCalledWith('line');

    // Click grid layout button
    fireEvent.click(screen.getByTitle('Grid Layout'));
    expect(mockOnLayoutChange).toHaveBeenCalledWith('grid');

    // Click free layout button
    fireEvent.click(screen.getByTitle('Free Layout'));
    expect(mockOnLayoutChange).toHaveBeenCalledWith('free');

    // Check total calls
    expect(mockOnLayoutChange).toHaveBeenCalledTimes(3);
  });
});
