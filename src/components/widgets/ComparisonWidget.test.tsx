import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ComparisonWidget from './ComparisonWidget';

// Mock the useRealTimeData hook
vi.mock('../../hooks/useRealTimeData', () => ({
  default: vi.fn((fetchFn, options) => {
    const refresh = vi.fn();
    return {
      data: [
        { providerId: 'openai', name: 'OpenAI', value: 100, unit: '$', color: '#10a37f' },
        { providerId: 'claude', name: 'Claude', value: 75, unit: '$', color: '#7c3aed' },
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
  BarChart: vi.fn(({ children }) => <div data-testid="bar-chart">{children}</div>),
  Bar: vi.fn(({ children }) => <div data-testid="bar">{children}</div>),
  XAxis: vi.fn(() => <div data-testid="x-axis" />),
  YAxis: vi.fn(() => <div data-testid="y-axis" />),
  CartesianGrid: vi.fn(() => <div data-testid="cartesian-grid" />),
  ResponsiveContainer: vi.fn(({ children }) => <div data-testid="responsive-container">{children}</div>),
  Cell: vi.fn(() => <div data-testid="cell" />),
  LabelList: vi.fn(() => <div data-testid="label-list" />),
}));

describe('ComparisonWidget', () => {
  const mockOnRemove = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock console.error to prevent test output clutter
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('renders the widget with the correct title', () => {
    render(
      <ComparisonWidget
        providers={['openai', 'claude']}
        title="API Cost Comparison"
        metricType="cost"
        onRemove={mockOnRemove}
      />
    );
    
    expect(screen.getByText('API Cost Comparison')).toBeInTheDocument();
  });

  it('renders the chart when data is available', () => {
    render(
      <ComparisonWidget
        providers={['openai', 'claude']}
        title="API Cost Comparison"
        metricType="cost"
        onRemove={mockOnRemove}
      />
    );
    
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
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
      <ComparisonWidget
        providers={['openai', 'claude']}
        title="API Cost Comparison"
        metricType="cost"
        onRemove={mockOnRemove}
      />
    );
    
    expect(screen.getByText('Loading comparison data...')).toBeInTheDocument();
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
      <ComparisonWidget
        providers={['openai', 'claude']}
        title="API Cost Comparison"
        metricType="cost"
        onRemove={mockOnRemove}
      />
    );
    
    expect(screen.getByText('Error loading data')).toBeInTheDocument();
    expect(screen.getByText('Test error message')).toBeInTheDocument();
    expect(screen.getByText('Retry')).toBeInTheDocument();
  });

  it('shows warning for partial errors', () => {
    // Override the mock to return data with errors
    vi.mocked(require('../../hooks/useRealTimeData').default).mockReturnValueOnce({
      data: [
        { providerId: 'openai', name: 'OpenAI', value: 100, unit: '$', color: '#10a37f' },
        { providerId: 'claude', name: 'Claude', value: 0, unit: '$', color: '#7c3aed', error: true },
      ],
      loading: false,
      error: null,
      lastUpdated: new Date(),
      refresh: vi.fn(),
    });

    render(
      <ComparisonWidget
        providers={['openai', 'claude']}
        title="API Cost Comparison"
        metricType="cost"
        onRemove={mockOnRemove}
      />
    );
    
    expect(screen.getByText('Some provider data could not be loaded')).toBeInTheDocument();
  });

  it('calls onRemove when remove option is clicked', () => {
    render(
      <ComparisonWidget
        providers={['openai', 'claude']}
        title="API Cost Comparison"
        metricType="cost"
        onRemove={mockOnRemove}
      />
    );
    
    // Open the menu
    fireEvent.click(screen.getByLabelText('widget settings'));
    
    // Click the remove option
    fireEvent.click(screen.getByText('Remove Widget'));
    
    expect(mockOnRemove).toHaveBeenCalled();
  });
});
