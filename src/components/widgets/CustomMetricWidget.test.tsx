import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import CustomMetricWidget from './CustomMetricWidget';

// Mock the useRealTimeData hook
vi.mock('../../hooks/useRealTimeData', () => ({
  default: vi.fn((fetchFn, options) => {
    const refresh = vi.fn();
    return {
      data: {
        value: 75,
        label: 'Test Metric',
        change: 10,
        changePercentage: 15,
      },
      loading: false,
      error: null,
      lastUpdated: new Date(),
      refresh,
    };
  }),
}));

// Mock recharts components
vi.mock('recharts', () => ({
  PieChart: vi.fn(({ children }) => <div data-testid="pie-chart">{children}</div>),
  Pie: vi.fn(({ children }) => <div data-testid="pie">{children}</div>),
  Cell: vi.fn(() => <div data-testid="cell" />),
  ResponsiveContainer: vi.fn(({ children }) => <div data-testid="responsive-container">{children}</div>),
  Tooltip: vi.fn(() => <div data-testid="tooltip" />),
}));

describe('CustomMetricWidget', () => {
  const mockOnRemove = vi.fn();
  const mockOnEdit = vi.fn();
  const mockFetchFunction = vi.fn().mockResolvedValue({
    value: 75,
    label: 'Test Metric',
    change: 10,
    changePercentage: 15,
  });

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock console.error to prevent test output clutter
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('renders the widget with the correct title', () => {
    render(
      <CustomMetricWidget
        title="Custom Metric Test"
        metricType="percentage"
        metricConfig={{}}
        fetchFunction={mockFetchFunction}
        onRemove={mockOnRemove}
        onEdit={mockOnEdit}
      />
    );
    
    expect(screen.getByText('Custom Metric Test')).toBeInTheDocument();
  });

  it('renders percentage metric correctly', () => {
    // Override the mock to return percentage data
    vi.mocked(require('../../hooks/useRealTimeData').default).mockReturnValueOnce({
      data: {
        value: 75,
        label: 'Completion',
      },
      loading: false,
      error: null,
      lastUpdated: new Date(),
      refresh: vi.fn(),
    });

    render(
      <CustomMetricWidget
        title="Percentage Metric"
        metricType="percentage"
        metricConfig={{ target: 100, threshold: 0.8 }}
        fetchFunction={mockFetchFunction}
        onRemove={mockOnRemove}
        onEdit={mockOnEdit}
      />
    );
    
    expect(screen.getByText('75%')).toBeInTheDocument();
    expect(screen.getByText('Completion')).toBeInTheDocument();
  });

  it('renders value metric correctly', () => {
    // Override the mock to return value data
    vi.mocked(require('../../hooks/useRealTimeData').default).mockReturnValueOnce({
      data: {
        value: 1500,
        label: 'Total Requests',
        change: 200,
        changePercentage: 15,
      },
      loading: false,
      error: null,
      lastUpdated: new Date(),
      refresh: vi.fn(),
    });

    render(
      <CustomMetricWidget
        title="Value Metric"
        metricType="value"
        metricConfig={{ unit: '$' }}
        fetchFunction={mockFetchFunction}
        onRemove={mockOnRemove}
        onEdit={mockOnEdit}
      />
    );
    
    expect(screen.getByText('$1,500')).toBeInTheDocument();
    expect(screen.getByText('Total Requests')).toBeInTheDocument();
    expect(screen.getByText(/↑ 200/)).toBeInTheDocument();
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
      <CustomMetricWidget
        title="Loading Test"
        metricType="percentage"
        metricConfig={{}}
        fetchFunction={mockFetchFunction}
        onRemove={mockOnRemove}
        onEdit={mockOnEdit}
      />
    );
    
    expect(screen.getByText('Loading metric data...')).toBeInTheDocument();
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
      <CustomMetricWidget
        title="Error Test"
        metricType="percentage"
        metricConfig={{}}
        fetchFunction={mockFetchFunction}
        onRemove={mockOnRemove}
        onEdit={mockOnEdit}
      />
    );
    
    expect(screen.getByText('Error loading metric data')).toBeInTheDocument();
    expect(screen.getByText('Test error message')).toBeInTheDocument();
    expect(screen.getByText('Retry')).toBeInTheDocument();
  });

  it('shows warning for partial errors', () => {
    // Override the mock to return data with errors
    vi.mocked(require('../../hooks/useRealTimeData').default).mockReturnValueOnce({
      data: {
        value: 0,
        label: 'Error Data',
        error: true,
      },
      loading: false,
      error: null,
      lastUpdated: new Date(),
      refresh: vi.fn(),
    });

    render(
      <CustomMetricWidget
        title="Partial Error Test"
        metricType="percentage"
        metricConfig={{}}
        fetchFunction={mockFetchFunction}
        onRemove={mockOnRemove}
        onEdit={mockOnEdit}
      />
    );
    
    expect(screen.getByText('Some metric data could not be loaded')).toBeInTheDocument();
  });

  it('calls onEdit when edit option is clicked', () => {
    render(
      <CustomMetricWidget
        title="Edit Test"
        metricType="percentage"
        metricConfig={{}}
        fetchFunction={mockFetchFunction}
        onRemove={mockOnRemove}
        onEdit={mockOnEdit}
      />
    );
    
    // Open the menu
    fireEvent.click(screen.getByLabelText('widget settings'));
    
    // Click the edit option
    fireEvent.click(screen.getByText('Edit Metric'));
    
    expect(mockOnEdit).toHaveBeenCalled();
  });

  it('calls onRemove when remove option is clicked', () => {
    render(
      <CustomMetricWidget
        title="Remove Test"
        metricType="percentage"
        metricConfig={{}}
        fetchFunction={mockFetchFunction}
        onRemove={mockOnRemove}
        onEdit={mockOnEdit}
      />
    );
    
    // Open the menu
    fireEvent.click(screen.getByLabelText('widget settings'));
    
    // Click the remove option
    fireEvent.click(screen.getByText('Remove Widget'));
    
    expect(mockOnRemove).toHaveBeenCalled();
  });
});
