# APIwidget Dependency Map

This document maps the dependencies and relationships between key components in the APIwidget project.

## Entry Points

```
index.html
└── src/main.tsx
    ├── src/index.css
    ├── src/styles/electron.css
    └── src/App.tsx
        ├── src/components/app/ModernElectronApp.tsx (if in Electron)
        └── Web App Structure (if in browser)
            ├── src/contexts/MockAuthContext.tsx
            ├── src/contexts/ApiProviderContext.tsx
            ├── src/contexts/DashboardWidgetContext.tsx
            ├── src/components/layout/AppLayout.tsx
            └── src/pages/ModernDashboard.tsx
```

```
widget.html
└── src/widget.tsx
    ├── src/styles/global.css
    ├── src/styles/electron.css
    └── src/components/widgets/GlassMorphismWidget.tsx
```

## Component Dependencies

### ModernElectronApp.tsx
- Dependencies:
  - React
  - Material UI components
  - src/contexts/DashboardWidgetContext.tsx
  - src/contexts/ApiProviderContext.tsx
  - src/pages/ModernDashboard.tsx
  - src/services/electronService.ts

### GlassMorphismWidget.tsx
- Dependencies:
  - React
  - src/styles/components/widgets/GlassMorphismWidget.css
  - src/services/electronService.ts
  - src/services/settingsService.ts
  - src/services/mockDataService.ts

### ModernDashboard.tsx
- Dependencies:
  - React
  - Material UI components
  - src/contexts/ApiProviderContext.tsx
  - src/contexts/DashboardWidgetContext.tsx
  - src/styles/components/layout/BentoGrid.css

## Context Provider Dependencies

### ApiProviderContext.tsx
- Dependencies:
  - React
  - src/services/mockDataService.ts

### DashboardWidgetContext.tsx
- Dependencies:
  - React
  - src/components/widgets/DashboardWidget.tsx

### MockAuthContext.tsx
- Dependencies:
  - React

## Service Dependencies

### electronService.ts
- Dependencies:
  - src/services/mockDataService.ts (fallback)
  - window.electronAPI (from preload.js)

### mockDataService.ts
- No external dependencies

### settingsService.ts
- Dependencies:
  - localStorage or window.electronAPI

## Electron Process Flow

```
electron/main.js
├── Creates main window
│   └── Loads index.html
│       └── Runs src/main.tsx
├── Creates widget window
│   └── Loads widget.html
│       └── Runs src/widget.tsx
└── Sets up IPC handlers
    └── Exposed via electron/preload.js
        └── Available as window.electronAPI in renderer
```

## Data Flow

```
User Interaction
├── Component Event Handlers
│   └── Context Updates
│       └── Component Re-renders
└── Electron IPC Calls (if in Electron)
    ├── Main Process Handlers
    │   └── Response to Renderer
    └── Component Updates
```

## Style Inheritance

```
src/index.css
├── Global styles
└── Imports src/styles/components/layout/BentoGrid.css

src/styles/global.css
└── Global styles for widget

src/styles/electron.css
└── Electron-specific styles

Component-specific CSS
└── Scoped to specific components
```

## Build Process Flow

```
npm run dev
└── Vite development server
    └── Serves web version

npm run electron:dev
├── Vite development server
│   └── Serves content for Electron
└── Electron process
    └── Loads content from Vite server

npm run build
└── Vite production build
    └── Outputs to dist/

npm run electron:build
├── Vite production build
│   └── Outputs to dist/
└── Electron-builder
    └── Packages app for distribution
```

## Key Interfaces

### Electron API Interface (window.electronAPI)
```typescript
interface ElectronAPI {
  // Window management
  toggleMainWindow: () => Promise<void>;
  closeWidget: () => Promise<void>;
  toggleWidgetVisibility: () => Promise<boolean>;

  // API key management
  getApiKey: (provider: string) => Promise<string | null>;
  saveApiKey: (provider: string, key: string) => Promise<boolean>;
  deleteApiKey: (provider: string) => Promise<boolean>;

  // API data
  getApiCost: (provider: string) => Promise<ApiCostData>;
  getAllApiCosts: () => Promise<Record<string, ApiCostData>>;

  // Settings management
  getSettings: () => Promise<any>;
  saveSettings: (settings: any) => Promise<boolean>;
  getSetting: (key: string) => Promise<any>;
  setSetting: (key: string, value: any) => Promise<boolean>;

  // App management
  getAppSettings: () => Promise<any>;
  saveAppSettings: (settings: any) => Promise<boolean>;
  setStartWithSystem: (enabled: boolean) => Promise<boolean>;

  // System information
  getDisplays: () => Promise<any[]>;
  getCurrentDisplay: () => Promise<any>;

  // Utility
  isElectron: boolean;
  getVersion: () => Promise<string>;
  openExternal: (url: string) => Promise<boolean>;
  debug: (message: any) => Promise<any>;
}
```

### Provider Interface
```typescript
interface Provider {
  id: string;
  name: string;
  cost: number;
  change: number;
  isIncrease: boolean;
}
```

### ApiCostData Interface
```typescript
interface ApiCostData {
  total: number;
  change: number;
  changeType: 'increase' | 'decrease';
}
```

## Conclusion

This dependency map provides a high-level overview of the relationships between components in the APIwidget project. Use this map to understand how changes in one component might affect others, and to identify potential areas for refactoring or optimization.
