import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { LoadingProvider } from '../../contexts/LoadingContext';
import { BrowserRouter } from 'react-router-dom';

// Define a custom render function that includes providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  withLoading?: boolean;
  withRouter?: boolean;
}

/**
 * Custom render function that wraps components with necessary providers
 * @param ui - The component to render
 * @param options - Render options including which providers to include
 * @returns The rendered component with testing utilities
 */
function customRender(
  ui: ReactElement,
  { withLoading = true, withRouter = true, ...renderOptions }: CustomRenderOptions = {}
) {
  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    let wrappedChildren = children;

    if (withLoading) {
      wrappedChildren = <LoadingProvider>{wrappedChildren}</LoadingProvider>;
    }

    if (withRouter) {
      wrappedChildren = <BrowserRouter>{wrappedChildren}</BrowserRouter>;
    }

    return <>{wrappedChildren}</>;
  };

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

// Re-export everything from testing-library
export * from '@testing-library/react';

// Override the render method
export { customRender as render };

/**
 * Creates a mock for the useNavigate hook
 * @returns A mock navigate function
 */
export function createMockNavigate() {
  return vi.fn();
}

/**
 * Creates a mock for the useParams hook
 * @param params - The params to return
 * @returns A mock params object
 */
export function createMockParams(params = {}) {
  return params;
}

/**
 * Creates a mock for the useLocation hook
 * @param pathname - The pathname to return
 * @returns A mock location object
 */
export function createMockLocation(pathname = '/') {
  return { pathname, search: '', hash: '', state: null, key: 'default' };
}

/**
 * Waits for a specified time
 * @param ms - The number of milliseconds to wait
 * @returns A promise that resolves after the specified time
 */
export function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Creates a mock for the ResizeObserver
 */
export function mockResizeObserver() {
  class MockResizeObserver {
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
  }

  window.ResizeObserver = MockResizeObserver as any;
  return MockResizeObserver;
}

/**
 * Creates a mock for the IntersectionObserver
 */
export function mockIntersectionObserver() {
  class MockIntersectionObserver {
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
  }

  window.IntersectionObserver = MockIntersectionObserver as any;
  return MockIntersectionObserver;
}
