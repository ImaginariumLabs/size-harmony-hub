import { describe, it, expect, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { LoadingProvider, useLoading } from './LoadingContext';

// Test component that uses the LoadingContext
const TestComponent = () => {
  const { isLoading, message, type, showLoading, hideLoading } = useLoading();
  
  return (
    <div>
      <div data-testid="loading-state">{isLoading ? 'Loading' : 'Not Loading'}</div>
      <div data-testid="loading-message">{message}</div>
      <div data-testid="loading-type">{type}</div>
      <button 
        data-testid="show-loading-button" 
        onClick={() => showLoading('Custom Message', 'linear')}
      >
        Show Loading
      </button>
      <button 
        data-testid="hide-loading-button" 
        onClick={() => hideLoading()}
      >
        Hide Loading
      </button>
    </div>
  );
};

describe('LoadingContext', () => {
  it('provides default loading state', () => {
    render(
      <LoadingProvider>
        <TestComponent />
      </LoadingProvider>
    );
    
    expect(screen.getByTestId('loading-state')).toHaveTextContent('Not Loading');
    expect(screen.getByTestId('loading-message')).toHaveTextContent('Loading...');
    expect(screen.getByTestId('loading-type')).toHaveTextContent('circular');
  });
  
  it('shows loading with custom message and type', () => {
    render(
      <LoadingProvider>
        <TestComponent />
      </LoadingProvider>
    );
    
    // Click the show loading button
    act(() => {
      screen.getByTestId('show-loading-button').click();
    });
    
    expect(screen.getByTestId('loading-state')).toHaveTextContent('Loading');
    expect(screen.getByTestId('loading-message')).toHaveTextContent('Custom Message');
    expect(screen.getByTestId('loading-type')).toHaveTextContent('linear');
  });
  
  it('hides loading', () => {
    render(
      <LoadingProvider>
        <TestComponent />
      </LoadingProvider>
    );
    
    // Show loading first
    act(() => {
      screen.getByTestId('show-loading-button').click();
    });
    
    expect(screen.getByTestId('loading-state')).toHaveTextContent('Loading');
    
    // Then hide loading
    act(() => {
      screen.getByTestId('hide-loading-button').click();
    });
    
    expect(screen.getByTestId('loading-state')).toHaveTextContent('Not Loading');
  });
  
  it('throws an error when used outside of a LoadingProvider', () => {
    // Suppress console.error for this test
    const consoleErrorMock = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    // Expect rendering TestComponent without a LoadingProvider to throw an error
    expect(() => {
      render(<TestComponent />);
    }).toThrow('useLoading must be used within a LoadingProvider');
    
    // Restore console.error
    consoleErrorMock.mockRestore();
  });
});
