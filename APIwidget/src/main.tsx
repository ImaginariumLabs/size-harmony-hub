import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

// Determine if we should use mock data based on env variable
const useMockData = import.meta.env.VITE_USE_MOCK_DATA === 'true';

// Set up any mock services if needed
if (useMockData) {
  // Initialize mock services
  console.log('Using mock data services');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
