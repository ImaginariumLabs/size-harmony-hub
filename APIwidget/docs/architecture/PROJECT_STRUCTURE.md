# APIwidget Project Structure

This document outlines the organization of the APIwidget codebase, following the principle of maintaining a single source of truth and clean code structure.

## Directory Structure

```text
APIwidget/
├── APIwidget/              # Main project directory
│   ├── electron/           # Electron-specific code
│   │   ├── main.js         # Main process entry point
│   │   ├── preload.js      # Preload script for secure IPC
│   │   ├── test-dashboard.js # Test dashboard script
│   │   ├── test-widget.js  # Test widget script
│   │   └── tests/          # Electron tests
│   ├── public/             # Static assets
│   │   ├── images/         # Image assets
│   │   ├── tests/          # Test HTML files
│   │   ├── about.html      # About page
│   │   ├── widget.html     # Widget HTML template
│   │   └── widget-bundle.js # Widget bundle for production
│   ├── src/                # Source code
│   │   ├── assets/         # Asset files
│   │   ├── components/     # React components
│   │   │   ├── app/        # App-level components
│   │   │   │   ├── ElectronApp.tsx       # Original Electron app
│   │   │   │   ├── ModernElectronApp.tsx # Modern Electron app
│   │   │   │   └── WebApp.tsx            # Web app version
│   │   │   ├── layout/     # Layout components
│   │   │   │   ├── AppLayout.tsx         # Web app layout
│   │   │   │   └── ElectronAppLayout.tsx # Electron app layout
│   │   │   ├── settings/   # Settings components
│   │   │   │   ├── GeminiApiSettings.tsx # Gemini API settings
│   │   │   │   ├── OpenAIApiSettings.tsx # OpenAI API settings
│   │   │   │   └── ClaudeApiSettings.tsx # Claude API settings
│   │   │   └── widgets/    # Widget components
│   │   │       ├── GlassMorphismWidget.tsx       # Basic glass morphism widget
│   │   │       ├── EnhancedGlassMorphismWidget.tsx # Enhanced widget with resize
│   │   │       └── FloatingWidgetManager.tsx     # Widget manager
│   │   ├── contexts/       # React contexts
│   │   │   ├── ApiProviderContext.tsx     # API provider context
│   │   │   ├── DashboardWidgetContext.tsx # Dashboard widget context
│   │   │   └── MockAuthContext.tsx        # Mock auth context
│   │   ├── electron/       # Electron-specific renderer code
│   │   │   └── widget.js   # Widget bridge file
│   │   ├── hooks/          # Custom React hooks
│   │   │   ├── useApiUsage.ts             # API usage hook
│   │   │   ├── useWidgetData.ts           # Widget data hook
│   │   │   └── useLocalStorage.ts         # Local storage hook
│   │   ├── pages/          # Page components
│   │   │   ├── ModernDashboard.tsx        # Main dashboard
│   │   │   ├── ApiKeySettings.tsx         # API key settings
│   │   │   ├── Login.tsx                  # Login page
│   │   │   ├── FloatingWidgetsPage.tsx    # Floating widgets page
│   │   │   ├── ProviderDetail.tsx         # Generic provider detail
│   │   │   └── providers/                 # Provider-specific pages
│   │   │       ├── OpenAIProviderDetail.tsx  # OpenAI details
│   │   │       ├── ClaudeProviderDetail.tsx  # Claude details
│   │   │       └── GeminiProviderDetail.tsx  # Gemini details
│   │   ├── services/       # Service modules
│   │   │   ├── openaiService.ts           # OpenAI service
│   │   │   ├── claudeService.ts           # Claude service
│   │   │   ├── geminiService.ts           # Gemini service
│   │   │   ├── electronService.ts         # Electron service
│   │   │   ├── apiIntegrationService.ts   # API integration service
│   │   │   ├── enhancedApiService.ts      # Enhanced API service
│   │   │   └── mockDataService.ts         # Mock data service
│   │   ├── styles/         # CSS and style files
│   │   │   ├── global.css                 # Global styles
│   │   │   ├── electron.css               # Electron-specific styles
│   │   │   └── components/                # Component-specific styles
│   │   │       └── widgets/               # Widget styles
│   │   │           ├── GlassMorphismWidget.css  # Widget styles
│   │   │           └── FloatingWidgetManager.css # Manager styles
│   │   ├── types/          # TypeScript type definitions
│   │   │   ├── api.ts                     # API types
│   │   │   └── widget.ts                  # Widget types
│   │   ├── App.tsx         # Main App component
│   │   ├── main.tsx        # Entry point
│   │   ├── test-widget.tsx # Test widget entry point
│   │   └── widget.tsx      # Widget entry point
│   ├── index.html          # Main HTML template
│   ├── widget.html         # Widget HTML template
│   ├── package.json        # Project dependencies
│   ├── tsconfig.json       # TypeScript configuration
│   └── vite.config.ts      # Vite configuration
├── docs/                   # Documentation
│   ├── architecture/       # Architecture documentation
│   ├── development/        # Development guides
│   │   ├── AI_API_COST_TRACKING.md        # API cost tracking docs
│   │   ├── GEMINI_API_INTEGRATION.md      # Gemini integration docs
│   │   ├── MULTIPLE_FLOATING_WIDGETS.md   # Multiple widgets docs
│   │   ├── REAL_TIME_API_USAGE.md         # Real-time API usage docs
│   │   ├── WIDGET_CONFIGURATION_PRESETS.md # Widget presets docs
│   │   └── SECURE_API_KEY_STORAGE.md      # API key storage docs
│   ├── design/             # Design documentation
│   ├── user-guides/        # User guides
│   ├── project-management/ # Project management documentation
│   └── archived/           # Archived documentation
└── run-widget.bat          # Script to run the widget
```

## Key Files

### Entry Points

- **src/main.tsx**: Main entry point for the React application
- **src/widget.tsx**: Entry point for the widget component
- **src/test-widget.tsx**: Entry point for the test widget
- **src/App.tsx**: Main application component
- **electron/main.js**: Main process for Electron

### Electron Integration

- **electron/main.js**: Main process for Electron
- **electron/preload.js**: Preload script for secure IPC
- **electron/test-dashboard.js**: Test dashboard script
- **electron/test-widget.js**: Test widget script
- **src/electron/widget.js**: Bridge file for the widget component

### App Components

- **src/components/app/ModernElectronApp.tsx**: Modern Electron application with improved UI
- **src/components/app/ElectronApp.tsx**: Original Electron application
- **src/components/app/WebApp.tsx**: Web application version

### Layout Components

- **src/components/layout/ElectronAppLayout.tsx**: Layout for Electron application
- **src/components/layout/AppLayout.tsx**: Layout for web application

### Widget Components

- **src/components/widgets/GlassMorphismWidget.tsx**: Basic glass morphism widget
- **src/components/widgets/EnhancedGlassMorphismWidget.tsx**: Enhanced widget with resize and drag
- **src/components/widgets/FloatingWidgetManager.tsx**: Manager for multiple widgets

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

### Context Providers

- **src/contexts/ApiProviderContext.tsx**: Context for managing API providers
- **src/contexts/DashboardWidgetContext.tsx**: Context for managing dashboard widgets
- **src/contexts/MockAuthContext.tsx**: Mock authentication context

### Service Modules

- **src/services/openaiService.ts**: OpenAI API integration
- **src/services/claudeService.ts**: Claude API integration
- **src/services/geminiService.ts**: Gemini API integration
- **src/services/electronService.ts**: Electron integration
- **src/services/apiIntegrationService.ts**: Generic API integration
- **src/services/enhancedApiService.ts**: Enhanced API service with caching
- **src/services/mockDataService.ts**: Mock data for development

### Page Components

- **src/pages/ModernDashboard.tsx**: Main dashboard page
- **src/pages/ApiKeySettings.tsx**: API key settings page
- **src/pages/Login.tsx**: Login page
- **src/pages/FloatingWidgetsPage.tsx**: Floating widgets management page
- **src/pages/ProviderDetail.tsx**: Generic provider detail page
- **src/pages/providers/OpenAIProviderDetail.tsx**: OpenAI provider detail page
- **src/pages/providers/ClaudeProviderDetail.tsx**: Claude provider detail page
- **src/pages/providers/GeminiProviderDetail.tsx**: Gemini provider detail page

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
- **Start Widget Development**: `npm run widget:dev`
- **Build for Production**: `npm run build`
- **Build Electron for Production**: `npm run electron:build`
- **Run Electron Test**: `npm run electron:test`
- **Run Widget Test**: `npm run widget:test`
- **Lint Code**: `npm run lint`

## Batch Scripts

- **run-widget.bat**: Script to run the widget in development mode
- **run-app.bat**: Script to run the full application in development mode
- **start.bat**: Script to start the application with all dependencies
