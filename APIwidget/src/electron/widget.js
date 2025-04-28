// This file is a bridge between the CommonJS and ES modules worlds
// It imports the widget.tsx file and re-exports it
import '../widget.tsx';

// Add debugging information
console.log('Widget bridge loaded');

// Check if Electron API is available
if (window.electronAPI) {
  console.log('Electron API is available');
} else {
  console.warn('Electron API is not available - widget may not function correctly');
}

// Export the widget for use in other files
export * from '../widget.tsx';
