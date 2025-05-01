import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/global.css';

// Export the widget component to make it available for fast refresh
export const TestWidget: React.FC = () => {
  // Define styles
  const containerStyle = {
    background: 'rgba(30, 30, 30, 0.7)',
    backdropFilter: 'blur(10px)',
    borderRadius: '12px',
    padding: '15px',
    color: 'white',
    fontFamily: 'Arial, sans-serif',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
    width: '100%',
    height: '100%',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  } as React.CSSProperties;

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  } as React.CSSProperties;

  const titleStyle = {
    margin: 0,
    fontSize: '14px'
  } as React.CSSProperties;

  const controlsStyle = {
    display: 'flex',
    gap: '8px'
  } as React.CSSProperties;

  const buttonStyle = {
    width: '16px',
    height: '16px',
    borderRadius: '50%',
    border: 'none',
    background: '#10a37f',
    cursor: 'pointer',
  } as React.CSSProperties;

  const contentStyle = {
    textAlign: 'center',
    margin: '15px 0'
  } as React.CSSProperties;

  const valueStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    margin: 0
  } as React.CSSProperties;

  const changeStyle = {
    color: '#4caf50',
    margin: '5px 0'
  } as React.CSSProperties;

  const footerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  } as React.CSSProperties;

  const timestampStyle = {
    fontSize: '12px',
    opacity: 0.7
  } as React.CSSProperties;

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h3 style={titleStyle}>OpenAI API USAGE</h3>
        <div style={controlsStyle}>
          <button style={buttonStyle}></button>
        </div>
      </div>

      <div style={contentStyle}>
        <p style={valueStyle}>$45.28</p>
        <p style={changeStyle}>
          <span>↑</span> $2.15 (4.9%)
        </p>
      </div>

      <div style={footerStyle}>
        <div style={timestampStyle}>Updated: just now</div>
      </div>
    </div>
  );
};

// Mount the test widget
const rootElement = document.getElementById('widget-root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <TestWidget />
    </React.StrictMode>
  );
}
