import React from 'react';
import ReactDOM from 'react-dom/client';
// Import only one widget component to avoid conflicts
import GlassMorphismWidget from './components/widgets/GlassMorphismWidget';
import './styles/global.css';
import './styles/electron.css';

// Add debugging
console.log('Widget.tsx is loading...');
console.log('Checking for widget-root element:', document.getElementById('widget-root'));

// Add a fallback if widget-root is not found
const rootElement = document.getElementById('widget-root') || document.body;

// Add a simple error boundary
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Widget Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '20px',
          background: 'rgba(255,0,0,0.7)',
          color: 'white',
          borderRadius: '10px',
          margin: '20px'
        }}>
          <h2>Something went wrong.</h2>
          <p>{this.state.error?.toString()}</p>
          <button onClick={() => window.location.reload()}>
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

try {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <ErrorBoundary>
        <div style={{ padding: '10px', background: 'rgba(0,0,0,0.5)', color: 'white', borderRadius: '10px' }}>
          <GlassMorphismWidget
            onToggleMainWindow={() => {
              console.log('Toggle main window clicked');
              return window.electronAPI?.toggleMainWindow();
            }}
            onClose={() => {
              console.log('Close widget clicked');
              return window.electronAPI?.closeWidget();
            }}
          />
        </div>
      </ErrorBoundary>
    </React.StrictMode>
  );
  console.log('Widget rendered successfully');
} catch (error) {
  console.error('Error rendering widget:', error);
  // Fallback rendering
  document.body.innerHTML = `
    <div style="padding: 20px; background: rgba(255,0,0,0.7); color: white; border-radius: 10px; margin: 20px">
      <h2>Failed to render widget</h2>
      <p>${error?.toString()}</p>
      <button onclick="window.location.reload()">Try again</button>
    </div>
  `;
}
