import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AdvancedWidgetFactory from './AdvancedWidgetFactory';

// Mock the retry utils
vi.mock('../../utils/retryUtils', () => ({
  withRetryAndTimeout: vi.fn(async (fn, timeout, fallback) => {
    try {
      return await fn();
    } catch (error) {
      return fallback;
    }
  }),
}));

// Mock the advanced widget components
vi.mock('./ComparisonWidget', () => ({
  default: vi.fn(() => <div data-testid="comparison-widget">Comparison Widget</div>),
}));

vi.mock('./TrendAnalysisWidget', () => ({
  default: vi.fn(() => <div data-testid="trend-widget">Trend Analysis Widget</div>),
}));

vi.mock('./CustomMetricWidget', () => ({
  default: vi.fn(() => <div data-testid="custom-metric-widget">Custom Metric Widget</div>),
}));

vi.mock('./AlertWidget', () => ({
  default: vi.fn(() => <div data-testid="alert-widget">Alert Widget</div>),
}));

describe('AdvancedWidgetFactory', () => {
  const mockOnRemove = vi.fn();
  const mockOnEdit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock console.error to prevent test output clutter
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('renders ComparisonWidget when type is comparison', () => {
    render(
      <AdvancedWidgetFactory
        type="comparison"
        config={{
          providers: ['openai', 'claude'],
          title: 'API Comparison',
          metricType: 'cost',
        }}
        onRemove={mockOnRemove}
        onEdit={mockOnEdit}
      />
    );

    expect(screen.getByTestId('comparison-widget')).toBeInTheDocument();
  });

  it('renders TrendAnalysisWidget when type is trend', () => {
    render(
      <AdvancedWidgetFactory
        type="trend"
        config={{
          providerId: 'openai',
          title: 'Usage Trends',
        }}
        onRemove={mockOnRemove}
        onEdit={mockOnEdit}
      />
    );

    expect(screen.getByTestId('trend-widget')).toBeInTheDocument();
  });

  it('renders CustomMetricWidget when type is custom', () => {
    render(
      <AdvancedWidgetFactory
        type="custom"
        config={{
          title: 'Custom Metric',
          metricType: 'percentage',
          metricConfig: {},
        }}
        onRemove={mockOnRemove}
        onEdit={mockOnEdit}
      />
    );

    expect(screen.getByTestId('custom-metric-widget')).toBeInTheDocument();
  });

  it('renders AlertWidget when type is alert', () => {
    render(
      <AdvancedWidgetFactory
        type="alert"
        config={{
          title: 'Alerts & Notifications',
        }}
        onRemove={mockOnRemove}
        onEdit={mockOnEdit}
      />
    );

    expect(screen.getByTestId('alert-widget')).toBeInTheDocument();
  });

  it('renders error message for unknown widget type', () => {
    render(
      <AdvancedWidgetFactory
        type={'unknown' as any}
        config={{}}
        onRemove={mockOnRemove}
        onEdit={mockOnEdit}
      />
    );

    expect(screen.getByText(/Unknown widget type/i)).toBeInTheDocument();
    expect(screen.getByText(/Remove Widget/i)).toBeInTheDocument();
  });

  it('handles missing config properties gracefully', () => {
    // Test with incomplete config for comparison widget
    render(
      <AdvancedWidgetFactory
        type="comparison"
        config={{
          // Missing providers and metricType
          title: 'Incomplete Config',
        }}
        onRemove={mockOnRemove}
        onEdit={mockOnEdit}
      />
    );

    // Should still render with default values
    expect(screen.getByTestId('comparison-widget')).toBeInTheDocument();
  });

  it('handles rendering errors gracefully', () => {
    // Mock ComparisonWidget to throw an error
    vi.mocked(require('./ComparisonWidget').default).mockImplementationOnce(() => {
      throw new Error('Test rendering error');
    });

    render(
      <AdvancedWidgetFactory
        type="comparison"
        config={{
          providers: ['openai'],
          metricType: 'cost',
        }}
        onRemove={mockOnRemove}
        onEdit={mockOnEdit}
      />
    );

    // Should show error UI
    expect(screen.getByText(/Widget Rendering Error/i)).toBeInTheDocument();
    expect(screen.getByText(/Retry/i)).toBeInTheDocument();
    expect(screen.getByText(/Remove Widget/i)).toBeInTheDocument();
  });
});
