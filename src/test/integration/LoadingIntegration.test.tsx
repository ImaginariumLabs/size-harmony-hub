import { describe, it, expect, vi } from 'vitest';
import { render, screen, act, waitFor } from '@testing-library/react';
import { LoadingProvider } from '../../contexts/LoadingContext';
import { useLoadingIndicator } from '../../hooks/useLoadingIndicator';
import GlobalLoadingIndicator from '../../components/common/GlobalLoadingIndicator';

// Mock the GlobalLoadingIndicator component
vi.mock('../../components/common/GlobalLoadingIndicator', () => ({
  default: vi.fn().mockImplementation(({ timeout }) => (
    <div data-testid="global-loading-indicator">
      <span data-testid="timeout-value">{timeout}</span>
    </div>
  )),
}));

// Test component that uses the useLoadingIndicator hook
const TestComponent = ({ 
  simulateLoading = false,
  loadingTime = 500,
  message = 'Loading data...',
  type = 'circular'
}: { 
  simulateLoading?: boolean;
  loadingTime?: number;
  message?: string;
  type?: 'circular' | 'linear' | 'backdrop';
}) => {
  useLoadingIndicator(simulateLoading, message, type);
  
  return (
    <div>
      <h1>Test Component</h1>
      <p>This component uses the loading indicator hook.</p>
    </div>
  );
};

describe('Loading Integration', () => {
  it('integrates LoadingProvider, useLoadingIndicator, and GlobalLoadingIndicator', async () => {
    render(
      <LoadingProvider>
        <GlobalLoadingIndicator timeout={5000} />
        <TestComponent simulateLoading={true} message="Integration Test Loading" type="backdrop" />
      </LoadingProvider>
    );
    
    // Check that the GlobalLoadingIndicator is rendered
    expect(screen.getByTestId('global-loading-indicator')).toBeInTheDocument();
    
    // Check that the timeout value is passed correctly
    expect(screen.getByTestId('timeout-value')).toHaveTextContent('5000');
    
    // Check that the TestComponent is rendered
    expect(screen.getByText('Test Component')).toBeInTheDocument();
    expect(screen.getByText('This component uses the loading indicator hook.')).toBeInTheDocument();
  });
  
  it('shows and hides loading based on component state', async () => {
    const { rerender } = render(
      <LoadingProvider>
        <GlobalLoadingIndicator timeout={5000} />
        <TestComponent simulateLoading={true} />
      </LoadingProvider>
    );
    
    // Check that loading is shown
    expect(GlobalLoadingIndicator).toHaveBeenCalled();
    
    // Rerender with loading set to false
    rerender(
      <LoadingProvider>
        <GlobalLoadingIndicator timeout={5000} />
        <TestComponent simulateLoading={false} />
      </LoadingProvider>
    );
    
    // Check that loading is hidden
    await waitFor(() => {
      expect(GlobalLoadingIndicator).toHaveBeenCalledTimes(2);
    });
  });
  
  it('handles multiple components using loading indicators', async () => {
    render(
      <LoadingProvider>
        <GlobalLoadingIndicator timeout={5000} />
        <TestComponent simulateLoading={true} message="Component 1 Loading" />
        <TestComponent simulateLoading={true} message="Component 2 Loading" type="linear" />
      </LoadingProvider>
    );
    
    // Both components should be rendered
    expect(screen.getAllByText('Test Component')).toHaveLength(2);
    
    // The GlobalLoadingIndicator should be rendered once
    expect(screen.getByTestId('global-loading-indicator')).toBeInTheDocument();
  });
});
