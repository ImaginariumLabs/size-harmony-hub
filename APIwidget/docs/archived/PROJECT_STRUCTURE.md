# APIwidget Project Structure

This document outlines the organization of the APIwidget codebase, following the principle of maintaining a single source of truth and clean code structure.

## Directory Structure

```text
apiwidget/
├── electron/               # Electron-specific code
│   ├── main.js             # Main process entry point
│   ├── preload.js          # Preload script for secure IPC
│   └── tests/              # Electron tests
│       └── simple-test.js  # Simple Electron test
├── src/
│   ├── components/         # React components
│   │   └── widgets/        # Widget-related components
│   │       └── GlassMorphismWidget.tsx  # Glass morphism widget component
│   ├── contexts/           # React contexts
│   ├── electron/           # Electron-specific renderer code
│   │   └── widget.js       # Widget bridge file
│   ├── hooks/              # Custom React hooks
│   ├── pages/              # Page components
│   ├── services/           # Service modules
│   │   └── keyManager.ts   # API key management service
│   ├── styles/             # CSS and style files
│   │   └── global.css      # Global styles
│   ├── App.tsx             # Main App component
│   ├── main.tsx            # Entry point
│   └── widget.tsx          # Widget entry point
├── public/                 # Static assets
│   ├── images/             # Image assets
│   ├── tests/              # Test HTML files
│   │   └── test.html       # Test HTML file
│   ├── about.html          # About page
│   ├── widget.html         # Widget HTML template
│   └── widget-bundle.js    # Widget bundle for production
├── docs/                   # Documentation
│   ├── ELECTRON_DEVELOPMENT_GUIDE.md  # Electron development guide
│   ├── PROJECT_STRUCTURE.md           # Project structure documentation
│   ├── WIDGET_IMPLEMENTATION.md       # Widget implementation guide
│   └── DEVELOPMENT_WORKFLOW.md        # Development workflow guide
├── index.html              # Main HTML template
├── package.json            # Project configuration
├── tsconfig.app.json       # TypeScript configuration
└── vite.config.ts          # Vite configuration
```

## Key Files

### Entry Points

- **src/main.tsx**: Main entry point for the React application
- **src/widget.tsx**: Entry point for the widget component
- **src/App.tsx**: Main application component
- **electron/main.js**: Main process for Electron

### Electron Integration

- **electron/main.js**: Main process for Electron
- **electron/preload.js**: Preload script for secure IPC
- **src/electron/widget.js**: Bridge file for the widget component

### Widget Implementation

- **src/components/widgets/GlassMorphismWidget.tsx**: Glass morphism widget component
- **public/widget.html**: HTML template for the widget
- **public/widget-bundle.js**: Fallback bundle for the widget in production

## Design Principles

1. **Modular and Simple Approach**
   - Avoid duplicates or over-engineering code
   - Check existing implementations before creating new ones
   - Favor clean, maintainable solutions over complex ones

2. **Single Source of Truth**
   - Maintain a clean code structure
   - Avoid redundant files and messy organization
   - Use a consistent approach to state management

3. **Step-by-Step Implementation**
   - Follow a test-then-implement methodology
   - Make small, incremental changes
   - Validate each step before moving to the next

4. **Modern UI/UX Design**
   - Implement minimal modern 2025 UI/UX
   - Focus on glass-like, low-impact UI design
   - Prioritize functionality that delivers value quickly

## Environment Variables

The application uses environment variables to control its behavior:

```env
# .env
VITE_USE_MOCK_DATA=false       # Use mock data for development
VITE_API_BASE_URL=...          # API endpoint
VITE_ENABLE_ANALYTICS=false    # Feature flags
```

## Build Configuration

The application can be built for both web and Electron:

- **Web**: `npm run build`
- **Electron**: `npm run electron:build`

## Development Scripts

- **Start Development Server**: `npm run dev`
- **Start Electron Development**: `npm run electron:dev`
- **Build for Production**: `npm run build`
- **Build Electron for Production**: `npm run electron:build`
- **Run Electron Test**: `npm run electron:test`
- **Lint Code**: `npm run lint`
