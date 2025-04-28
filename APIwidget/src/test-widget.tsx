import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/global.css';

// Simple test widget component
const TestWidget: React.FC = () => {
  return (
    <div style={{
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
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: '14px' }}>OpenAI API USAGE</h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button style={{
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            border: 'none',
            background: '#10a37f',
            cursor: 'pointer',
          }}></button>
        </div>
      </div>
      
      <div style={{ textAlign: 'center', margin: '15px 0' }}>
        <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>$45.28</p>
        <p style={{ color: '#4caf50', margin: '5px 0' }}>
          <span>↑</span> $2.15 (4.9%)
        </p>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '12px', opacity: 0.7 }}>Updated: just now</div>
      </div>
    </div>
  );
};

// Mount the test widget
ReactDOM.createRoot(document.getElementById('widget-root')!).render(
  <React.StrictMode>
    <TestWidget />
  </React.StrictMode>
);
