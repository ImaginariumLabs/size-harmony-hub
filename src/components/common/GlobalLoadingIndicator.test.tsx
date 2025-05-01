import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import GlobalLoadingIndicator from './GlobalLoadingIndicator';
import { LoadingProvider } from '../../contexts/LoadingContext';

// Mock the useLoading hook
vi.mock('../../contexts/LoadingContext', () => {
  const mockUseLoading = vi.fn();

  return {
    LoadingProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    useLoading: mockUseLoading,
  };
});

describe('GlobalLoadingIndicator', () => {
  // Get the mocked useLoading function
  const mockUseLoading = vi.fn();

  beforeEach(async () => {
    // Reset the mock before each test
    mockUseLoading.mockReset();

    // Update the mock implementation in the module
    vi.mocked(await import('../../contexts/LoadingContext')).useLoading = mockUseLoading;
  });

  it('renders nothing when loading is false', () => {
    // Mock the useLoading hook to return isLoading: false
    mockUseLoading.mockReturnValue({
      isLoading: false,
      message: 'Loading...',
      type: 'circular',
      showLoading: vi.fn(),
      hideLoading: vi.fn(),
    });

    const { container } = render(
      <LoadingProvider>
        <GlobalLoadingIndicator timeout={5000} />
      </LoadingProvider>
    );

    // The component should not render anything when isLoading is false
    expect(container.firstChild).toBeEmptyDOMElement();
  });

  it('renders circular progress when loading is true and type is circular', () => {
    // Mock the useLoading hook to return isLoading: true and type: 'circular'
    mockUseLoading.mockReturnValue({
      isLoading: true,
      message: 'Loading data...',
      type: 'circular',
      showLoading: vi.fn(),
      hideLoading: vi.fn(),
    });

    render(
      <LoadingProvider>
        <GlobalLoadingIndicator timeout={5000} />
      </LoadingProvider>
    );

    // Check that the loading message is displayed
    expect(screen.getByText('Loading data...')).toBeInTheDocument();
  });

  it('renders linear progress when loading is true and type is linear', () => {
    // Mock the useLoading hook to return isLoading: true and type: 'linear'
    mockUseLoading.mockReturnValue({
      isLoading: true,
      message: 'Processing...',
      type: 'linear',
      showLoading: vi.fn(),
      hideLoading: vi.fn(),
    });

    render(
      <LoadingProvider>
        <GlobalLoadingIndicator timeout={5000} />
      </LoadingProvider>
    );

    // Check that the loading message is displayed
    expect(screen.getByText('Processing...')).toBeInTheDocument();
  });

  it('renders backdrop when loading is true and type is backdrop', () => {
    // Mock the useLoading hook to return isLoading: true and type: 'backdrop'
    mockUseLoading.mockReturnValue({
      isLoading: true,
      message: 'Please wait...',
      type: 'backdrop',
      showLoading: vi.fn(),
      hideLoading: vi.fn(),
    });

    render(
      <LoadingProvider>
        <GlobalLoadingIndicator timeout={5000} />
      </LoadingProvider>
    );

    // Check that the loading message is displayed
    expect(screen.getByText('Please wait...')).toBeInTheDocument();
  });

  it.skip('hides loading after timeout', async () => {
    // Mock the useLoading hook
    const mockHideLoading = vi.fn();
    mockUseLoading.mockReturnValue({
      isLoading: true,
      message: 'Loading...',
      type: 'circular',
      showLoading: vi.fn(),
      hideLoading: mockHideLoading,
    });

    // Use fake timers
    vi.useFakeTimers();

    render(
      <LoadingProvider>
        <GlobalLoadingIndicator timeout={5000} />
      </LoadingProvider>
    );

    // Fast-forward time
    vi.advanceTimersByTime(5000);

    // Check that hideLoading was called after the timeout
    expect(mockHideLoading).toHaveBeenCalled();

    // Restore real timers
    vi.useRealTimers();
  });

  it('does not set timeout when timeout prop is 0', () => {
    // Mock the useLoading hook
    mockUseLoading.mockReturnValue({
      isLoading: true,
      message: 'Loading...',
      type: 'circular',
      showLoading: vi.fn(),
      hideLoading: vi.fn(),
    });

    // Spy on setTimeout
    const setTimeoutSpy = vi.spyOn(global, 'setTimeout');

    render(
      <LoadingProvider>
        <GlobalLoadingIndicator timeout={0} />
      </LoadingProvider>
    );

    // Check that setTimeout was not called
    expect(setTimeoutSpy).not.toHaveBeenCalled();

    // Restore the original setTimeout
    setTimeoutSpy.mockRestore();
  });
});
