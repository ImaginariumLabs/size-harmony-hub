import React from 'react';
import ReactDOM from 'react-dom/client';
import GlassMorphismWidget from './components/widgets/GlassMorphismWidget';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('widget-root')!).render(
  <React.StrictMode>
    <GlassMorphismWidget 
      onToggleMainWindow={() => window.electronAPI?.toggleMainWindow()}
      onClose={() => window.electronAPI?.closeWidget()}
    />
  </React.StrictMode>
);
