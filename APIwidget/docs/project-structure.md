# APIwidget Project Structure

## Directory Structure

The APIwidget project has a nested directory structure that's important to understand when working with the codebase:

```plaintext
APIwidget/                  # Root project directory
└── APIwidget/              # Main application directory
    ├── .github/            # GitHub configuration files
    ├── database/           # Database scripts and migrations
    ├── docs/               # Project documentation
    │   ├── architecture/   # Architecture documentation
    │   ├── development/    # Development guides
    │   ├── design/         # Design documentation
    │   ├── user-guides/    # User guides
    │   ├── project-management/ # Project management docs
    │   └── archived/       # Archived documentation
    ├── electron/           # Electron-specific code
    │   ├── main.js         # Main Electron process
    │   └── preload.js      # Preload script for renderer
    ├── node_modules/       # Dependencies (generated)
    ├── public/             # Static assets
    │   └── images/         # Image assets
    ├── src/                # Source code
    │   ├── components/     # React components
    │   │   ├── app/        # Application components
    │   │   │   ├── ElectronApp.tsx       # Original Electron app
    │   │   │   └── ModernElectronApp.tsx # Modern Electron app
    │   │   ├── layout/     # Layout components
    │   │   │   ├── AppLayout.tsx # Main app layout
    │   │   │   └── Header.tsx    # App header
    │   │   └── widgets/    # Widget components
    │   │       ├── GlassMorphismWidget.tsx # Glass morphism widget
    │   │       └── DashboardWidget.tsx     # Dashboard widget
    │   ├── contexts/       # React context providers
    │   │   ├── ApiProviderContext.tsx    # API provider context
    │   │   ├── DashboardWidgetContext.tsx # Dashboard widget context
    │   │   └── MockAuthContext.tsx       # Auth context
    │   ├── pages/          # Page components
    │   │   ├── Dashboard.tsx        # Original dashboard
    │   │   ├── ModernDashboard.tsx  # Modern dashboard
    │   │   ├── Login.tsx            # Login page
    │   │   └── ApiKeySettings.tsx   # API key settings
    │   ├── services/       # Service modules
    │   │   ├── electronService.ts   # Electron integration
    │   │   ├── mockDataService.ts   # Mock data service
    │   │   └── settingsService.ts   # Settings management
    │   ├── styles/         # CSS styles
    │   │   ├── components/ # Component-specific styles
    │   │   │   ├── layout/  # Layout styles
    │   │   │   │   └── BentoGrid.css # Bento grid layout
    │   │   │   └── widgets/ # Widget styles
    │   │   │       └── GlassMorphismWidget.css # Widget styles
    │   │   ├── global.css  # Global styles
    │   │   └── electron.css # Electron-specific styles
    │   ├── types/          # TypeScript type definitions
    │   │   └── electron.d.ts # Electron type definitions
    │   ├── App.tsx         # Main React app component
    │   ├── main.tsx        # Main entry point
    │   └── widget.tsx      # Widget entry point
    ├── .env                # Environment variables
    ├── index.html          # Main HTML entry
    ├── widget.html         # Widget HTML entry
    ├── package.json        # Project configuration
    ├── tsconfig.json       # TypeScript configuration
    └── vite.config.ts      # Vite configuration
```

## Important Notes

1. **Nested Structure**: The main application code is in the `APIwidget/APIwidget` directory, not in the root `APIwidget` directory.

2. **Running Commands**: When running npm commands, make sure you're in the correct directory:

   ```bash
   cd APIwidget/APIwidget
   npm run electron:dev
   ```

3. **Importing Files**: When importing files in your code, paths are relative to the `src` directory within the nested `APIwidget` folder.

4. **Documentation**: All documentation should be placed in the `APIwidget/APIwidget/docs` directory.

## Key Files

- `package.json`: Contains project dependencies and scripts
- `electron/main.js`: Main Electron process entry point
- `electron/preload.js`: Preload script for Electron renderer process
- `src/App.tsx`: Main React application component
- `src/main.tsx`: Main application entry point
- `src/widget.tsx`: Widget entry point
- `src/components/app/ModernElectronApp.tsx`: Modern Electron application component
- `src/components/widgets/GlassMorphismWidget.tsx`: Glass morphism widget component
- `src/components/settings/ApiKeyManager.tsx`: API key management component
- `src/contexts/DashboardWidgetContext.tsx`: Context for managing dashboard widgets
- `src/contexts/ApiProviderContext.tsx`: Context for managing API providers
- `src/services/electronService.ts`: Service for Electron integration
- `src/services/apiIntegrationService.ts`: Service for API integration
- `src/styles/electron.css`: Electron-specific styles
- `vite.config.ts`: Vite configuration for building the application
- `docs/development/SECURE_API_KEY_STORAGE.md`: Documentation for secure API key storage

## Component Architecture

The application follows a modular component architecture:

1. **App Components**: High-level application components
   - `ElectronApp.tsx`: Original Electron application wrapper
   - `ModernElectronApp.tsx`: Modern Electron application wrapper with improved UI

2. **Layout Components**: Components for page layout
   - `AppLayout.tsx`: Main application layout with sidebar and content area
   - `Header.tsx`: Application header with navigation and controls

3. **Widget Components**: Specialized widget components
   - `GlassMorphismWidget.tsx`: Floating widget with glass morphism effect
   - `DashboardWidget.tsx`: Dashboard widget for displaying API data

4. **Page Components**: Full page components
   - `Dashboard.tsx`: Original dashboard page
   - `ModernDashboard.tsx`: Modern dashboard with improved UI
   - `Login.tsx`: Login page
   - `ApiKeySettings.tsx`: Settings page for API keys

## Context Providers

The application uses React Context for state management:

1. **ApiProviderContext**: Manages API provider data and state
2. **DashboardWidgetContext**: Manages dashboard widget state and configuration
3. **MockAuthContext**: Provides authentication functionality

## Styling Approach

The application uses a combination of:

1. **CSS Modules**: Component-specific styles
2. **Material UI**: UI component library
3. **Global CSS**: Shared styles across components

## Security Features

The application includes several security features:

1. **Secure API Key Storage**: API keys are stored locally and encrypted using machine-specific encryption keys
2. **Context Isolation**: Electron's context isolation is enabled to prevent direct access to Node.js APIs
3. **Content Security Policy**: Strict CSP to prevent XSS attacks
4. **Input Validation**: All IPC inputs are validated in the main process
5. **Local-Only Storage**: No sensitive data is transmitted to external servers

## Running the Application

To run the application in development mode:

```bash
# Navigate to the correct directory
cd APIwidget/APIwidget

# Run the Electron app
npm run electron:dev
```

This will start both the Vite development server for the React application and the Electron process.

## Build Process

To build the application:

```bash
# Navigate to the correct directory
cd APIwidget/APIwidget

# Build the application
npm run build

# Build the Electron app
npm run electron:build
```

## Testing

To run tests:

```bash
# Navigate to the correct directory
cd APIwidget/APIwidget

# Run tests
npm test
```

## Troubleshooting Common Issues

1. **Black Screen in Electron**: If the Electron app shows a black screen, check:
   - Port configuration in `vite.config.ts` and `electron/main.js`
   - CSS imports in `src/main.tsx` and `src/widget.tsx`
   - Electron-specific styles in `src/styles/electron.css`

2. **Widget Not Showing**: If the widget doesn't appear, check:
   - Widget window creation in `electron/main.js`
   - Widget component in `src/components/widgets/GlassMorphismWidget.tsx`
   - Widget HTML entry in `widget.html`

3. **CSS Not Applied**: If styles aren't applied correctly, check:
   - CSS imports in `src/main.tsx` and `src/widget.tsx`
   - Global styles in `src/styles/global.css` and `src/styles/electron.css`
   - Component-specific styles in `src/styles/components/`
