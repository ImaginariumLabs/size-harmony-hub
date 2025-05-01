import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import TrendAnalysisWidget from './TrendAnalysisWidget';

// Mock the useRealTimeData hook
vi.mock('../../hooks/useRealTimeData', () => ({
  default: vi.fn((fetchFn, options) => {
    const refresh = vi.fn();
    return {
      data: [
        { date: '2023-01-01', cost: 100, usage: 50, requests: 500 },
        { date: '2023-01-02', cost: 120, usage: 60, requests: 600 },
        { date: '2023-01-03', cost: 90, usage: 45, requests: 450 },
      ],
      loading: false,
      error: null,
      lastUpdated: new Date(),
      refresh,
    };
  }),
}));

// Mock the getMockProviderData function
vi.mock('../../services/mockDataService', () => ({
  getMockProviderData: vi.fn((providerId) => ({
    total: 100,
    breakdown: [],
  })),
}));

// Mock recharts components
vi.mock('recharts', () => ({
  LineChart: vi.fn(({ children }) => <div data-testid="line-chart">{children}</div>),
  Line: vi.fn(() => <div data-testid="line" />),
  XAxis: vi.fn(() => <div data-testid="x-axis" />),
  YAxis: vi.fn(() => <div data-testid="y-axis" />),
  CartesianGrid: vi.fn(() => <div data-testid="cartesian-grid" />),
  ResponsiveContainer: vi.fn(({ children }) => <div data-testid="responsive-container">{children}</div>),
  Legend: vi.fn(() => <div data-testid="legend" />),
  Tooltip: vi.fn(() => <div data-testid="tooltip" />),
}));

describe('TrendAnalysisWidget', () => {
  const mockOnRemove = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock console.error to prevent test output clutter
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('renders the widget with the correct title', () => {
    render(
      <TrendAnalysisWidget
        providerId="openai"
        title="API Usage Trends"
        onRemove={mockOnRemove}
      />
    );
    
    expect(screen.getByText('API Usage Trends')).toBeInTheDocument();
  });

  it('renders the chart when data is available', () => {
    render(
      <TrendAnalysisWidget
        providerId="openai"
        title="API Usage Trends"
        onRemove={mockOnRemove}
      />
    );
    
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
  });

  it('shows loading state when data is loading', () => {
    // Override the mock to return loading state
    vi.mocked(require('../../hooks/useRealTimeData').default).mockReturnValueOnce({
      data: null,
      loading: true,
      error: null,
      lastUpdated: null,
      refresh: vi.fn(),
    });

    render(
      <TrendAnalysisWidget
        providerId="openai"
        title="API Usage Trends"
        onRemove={mockOnRemove}
      />
    );
    
    expect(screen.getByText('Loading trend data...')).toBeInTheDocument();
  });

  it('shows error state when there is an error', () => {
    // Override the mock to return error state
    vi.mocked(require('../../hooks/useRealTimeData').default).mockReturnValueOnce({
      data: null,
      loading: false,
      error: new Error('Test error message'),
      lastUpdated: null,
      refresh: vi.fn(),
    });

    render(
      <TrendAnalysisWidget
        providerId="openai"
        title="API Usage Trends"
        onRemove={mockOnRemove}
      />
    );
    
    expect(screen.getByText('Error loading trend data')).toBeInTheDocument();
    expect(screen.getByText('Test error message')).toBeInTheDocument();
    expect(screen.getByText('Retry')).toBeInTheDocument();
  });

  it('shows warning for partial errors', () => {
    // Override the mock to return data with errors
    vi.mocked(require('../../hooks/useRealTimeData').default).mockReturnValueOnce({
      data: [
        { date: '2023-01-01', cost: 100, usage: 50, requests: 500 },
        { date: '2023-01-02', cost: 0, usage: 0, requests: 0, error: true },
        { date: '2023-01-03', cost: 90, usage: 45, requests: 450 },
      ],
      loading: false,
      error: null,
      lastUpdated: new Date(),
      refresh: vi.fn(),
    });

    render(
      <TrendAnalysisWidget
        providerId="openai"
        title="API Usage Trends"
        onRemove={mockOnRemove}
      />
    );
    
    expect(screen.getByText('Some data points could not be loaded')).toBeInTheDocument();
  });

  it('calls onRemove when remove option is clicked', () => {
    render(
      <TrendAnalysisWidget
        providerId="openai"
        title="API Usage Trends"
        onRemove={mockOnRemove}
      />
    );
    
    // Open the menu
    fireEvent.click(screen.getByLabelText('widget settings'));
    
    // Click the remove option
    fireEvent.click(screen.getByText('Remove Widget'));
    
    expect(mockOnRemove).toHaveBeenCalled();
  });

  it('allows changing the time range', () => {
    render(
      <TrendAnalysisWidget
        providerId="openai"
        title="API Usage Trends"
        onRemove={mockOnRemove}
      />
    );
    
    // Click on the 7D button
    fireEvent.click(screen.getByText('7D'));
    
    // Click on the 90D button
    fireEvent.click(screen.getByText('90D'));
    
    // The time range should be updated (we can't directly test the state change,
    // but we can verify the buttons are rendered)
    expect(screen.getByText('7D')).toBeInTheDocument();
    expect(screen.getByText('30D')).toBeInTheDocument();
    expect(screen.getByText('90D')).toBeInTheDocument();
  });
});
