import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './styles/electron.css';
import App from './App';
import GlobalErrorBoundary from './components/common/GlobalErrorBoundary';
import { LoadingProvider } from './contexts/LoadingContext';
import GlobalLoadingIndicator from './components/common/GlobalLoadingIndicator';

// Determine if we should use mock data based on env variable
const useMockData = import.meta.env.VITE_USE_MOCK_DATA === 'true';

// Set up any mock services if needed
if (useMockData) {
  // Initialize mock services
  console.log('Using mock data services');
}

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

createRoot(rootElement).render(
  <StrictMode>
    <GlobalErrorBoundary>
      <LoadingProvider>
        <GlobalLoadingIndicator />
        <App />
      </LoadingProvider>
    </GlobalErrorBoundary>
  </StrictMode>
);
