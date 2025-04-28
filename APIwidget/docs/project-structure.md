# APIwidget Project Structure

## Directory Structure

The APIwidget project has a nested directory structure that's important to understand when working with the codebase:

```
APIwidget/                  # Root project directory
└── APIwidget/              # Main application directory
    ├── .github/            # GitHub configuration files
    ├── database/           # Database scripts and migrations
    ├── docs/               # Project documentation
    ├── electron/           # Electron-specific code
    ├── node_modules/       # Dependencies (generated)
    ├── public/             # Static assets
    ├── src/                # Source code
    │   ├── components/     # React components
    │   ├── contexts/       # React context providers
    │   ├── pages/          # Page components
    │   ├── services/       # Service modules
    │   └── styles/         # CSS styles
    ├── .env                # Environment variables
    ├── package.json        # Project configuration
    ├── tsconfig.json       # TypeScript configuration
    └── vite.config.ts      # Vite configuration
```

## Important Notes

1. **Nested Structure**: The main application code is in the `APIwidget/APIwidget` directory, not in the root `APIwidget` directory.

2. **Running Commands**: When running npm commands, make sure you're in the correct directory:
   ```
   cd APIwidget/APIwidget
   npm run electron:dev
   ```

3. **Importing Files**: When importing files in your code, paths are relative to the `src` directory within the nested `APIwidget` folder.

4. **Documentation**: All documentation should be placed in the `APIwidget/APIwidget/docs` directory.

## Key Files

- `package.json`: Contains project dependencies and scripts
- `electron/main.js`: Main Electron process entry point
- `src/App.tsx`: Main React application component
- `src/components/app/ElectronApp.tsx`: Electron-specific application component
- `src/contexts/DashboardWidgetContext.tsx`: Context for managing dashboard widgets

## Running the Application

To run the application in development mode:

```bash
# Navigate to the correct directory
cd APIwidget/APIwidget

# Run the Electron app
npm run electron:dev
```

This will start both the Vite development server for the React application and the Electron process.
