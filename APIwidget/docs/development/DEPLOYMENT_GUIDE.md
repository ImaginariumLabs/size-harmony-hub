# APIwidget Deployment Guide

This document provides comprehensive instructions for building, packaging, and deploying the APIwidget application for different platforms.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Development Environment](#development-environment)
3. [Build Configuration](#build-configuration)
4. [Building for Production](#building-for-production)
5. [Packaging with Electron Builder](#packaging-with-electron-builder)
6. [Platform-Specific Builds](#platform-specific-builds)
7. [Continuous Integration](#continuous-integration)
8. [Release Process](#release-process)
9. [Deployment Checklist](#deployment-checklist)
10. [Troubleshooting](#troubleshooting)

## Prerequisites

Before deploying APIwidget, ensure you have the following prerequisites installed:

- **Node.js**: Version 18.x or later
- **npm**: Version 9.x or later
- **Git**: For version control
- **Electron**: For desktop application packaging
- **Electron Builder**: For creating installers

For platform-specific builds, you'll also need:

- **Windows**: Windows 10 or later (for Windows builds)
- **macOS**: macOS 10.15 or later (for macOS builds)
- **Linux**: Ubuntu 20.04 or later (for Linux builds)

## Development Environment

The APIwidget project has a nested directory structure. The main code is in the `APIwidget/APIwidget` directory, not in the root `APIwidget` directory.

To set up the development environment:

1. Clone the repository:
   ```bash
   git clone https://github.com/ImaginariumLabs/APIwidget.git
   cd APIwidget
   ```

2. Install dependencies:
   ```bash
   cd APIwidget
   npm install
   ```

3. Start the development server:
   ```bash
   npm run electron:dev
   ```

Alternatively, you can use the provided batch scripts:

- `run-widget.bat`: Runs the widget in development mode
- `run-app.bat`: Runs the full application in development mode
- `start.bat`: Starts the application with all dependencies

## Build Configuration

The build configuration is defined in several files:

### package.json

The `package.json` file contains the main build configuration:

```json
{
  "name": "apiwidget",
  "private": true,
  "version": "0.0.0",
  "main": "electron/main.js",
  "type": "commonjs",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview",
    "electron:dev": "cross-env NODE_ENV=development concurrently \"npm run dev\" \"electron .\"",
    "electron:build": "npm run build && electron-builder",
    "electron:preview": "cross-env NODE_ENV=production electron .",
    "electron:start": "electron .",
    "electron:test": "electron electron/tests/simple-test.js",
    "test:widget": "cross-env NODE_ENV=development concurrently \"npm run dev\" \"electron electron/test-widget.js\"",
    "test:dashboard": "cross-env NODE_ENV=development concurrently \"npm run dev\" \"electron electron/test-dashboard.js\""
  },
  "build": {
    "appId": "com.apiwidget.app",
    "productName": "APIwidget",
    "files": [
      "dist/**/*",
      "electron/**/*"
    ],
    "directories": {
      "buildResources": "assets",
      "output": "release"
    },
    "win": {
      "target": [
        "portable",
        "nsis"
      ],
      "icon": "public/icon.png"
    },
    "mac": {
      "target": [
        "dmg"
      ],
      "icon": "public/icon.png"
    },
    "linux": {
      "target": [
        "AppImage"
      ],
      "icon": "public/icon.png"
    }
  }
}
```

### vite.config.ts

The `vite.config.ts` file configures the Vite build process:

```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5175, // Use a different port to avoid conflicts
    strictPort: false, // Try another port if this one is in use
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        widget: resolve(__dirname, 'widget.html'),
        testWidget: resolve(__dirname, 'test-widget.html'),
        about: resolve(__dirname, 'public/about.html')
      },
      output: {
        entryFileNames: (chunkInfo) => {
          return chunkInfo.name === 'widget' ? 'widget.js' : '[name]-[hash].js';
        },
        chunkFileNames: '[name]-[hash].js',
        assetFileNames: '[name]-[hash][extname]'
      }
    },
    // Ensure we're generating CommonJS modules for Node.js compatibility
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
});
```

## Building for Production

To build the application for production, follow these steps:

1. Navigate to the project directory:
   ```bash
   cd APIwidget
   ```

2. Build the application:
   ```bash
   npm run build
   ```
   This will:
   - Compile TypeScript files
   - Bundle the application with Vite
   - Generate production-ready files in the `dist` directory

3. Preview the production build:
   ```bash
   npm run preview
   ```

## Packaging with Electron Builder

To package the application with Electron Builder:

1. Build and package the application:
   ```bash
   npm run electron:build
   ```
   This will:
   - Build the React application
   - Package it with Electron
   - Create installers based on your platform in the `release` directory

2. Preview the packaged application:
   ```bash
   npm run electron:preview
   ```

## Platform-Specific Builds

### Windows

To build for Windows:

1. Ensure you're on a Windows machine or using a Windows virtual machine
2. Run the build command:
   ```bash
   npm run electron:build
   ```
3. The following files will be generated in the `release` directory:
   - `APIwidget-Setup-x.y.z.exe`: NSIS installer
   - `APIwidget-x.y.z.exe`: Portable executable

### macOS

To build for macOS:

1. Ensure you're on a macOS machine
2. Run the build command:
   ```bash
   npm run electron:build
   ```
3. The following file will be generated in the `release` directory:
   - `APIwidget-x.y.z.dmg`: macOS disk image

### Linux

To build for Linux:

1. Ensure you're on a Linux machine
2. Run the build command:
   ```bash
   npm run electron:build
   ```
3. The following file will be generated in the `release` directory:
   - `APIwidget-x.y.z.AppImage`: AppImage executable

## Continuous Integration

APIwidget uses GitHub Actions for continuous integration. The CI pipeline is defined in `.github/workflows/test.yml`:

```yaml
name: Test

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  test:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]
        node-version: [18.x]

    steps:
    - uses: actions/checkout@v3
    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v3
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'
    - name: Install dependencies
      run: npm ci
    - name: Run unit tests
      run: npm test
    - name: Run integration tests
      run: npm run test:integration
    - name: Build application
      run: npm run electron:build
    - name: Run E2E tests
      run: npm run test:e2e
    - name: Test widget
      run: npm run widget:test
```

This pipeline:
1. Runs on multiple operating systems (Windows, macOS, Linux)
2. Installs dependencies
3. Runs unit tests
4. Runs integration tests
5. Builds the application
6. Runs end-to-end tests
7. Tests the widget

## Release Process

To release a new version of APIwidget:

1. Update the version number in `package.json`
2. Update the CHANGELOG.md file with the changes in the new version
3. Commit the changes:
   ```bash
   git add package.json CHANGELOG.md
   git commit -m "chore: bump version to x.y.z"
   ```
4. Create a new tag:
   ```bash
   git tag -a vx.y.z -m "Release x.y.z"
   ```
5. Push the changes and tag:
   ```bash
   git push origin main
   git push origin vx.y.z
   ```
6. GitHub Actions will automatically build and create a release

## Deployment Checklist

Before deploying a new version, ensure:

1. All tests pass
2. The application builds successfully
3. The application runs correctly on all target platforms
4. The version number is updated
5. The CHANGELOG.md file is updated
6. All documentation is up to date
7. All required assets are included
8. The application icon is properly set
9. The application name and description are correct
10. The application is properly signed (if applicable)

## Troubleshooting

### Common Issues

#### Build Fails with Module Not Found Error

If the build fails with a "Module not found" error, ensure:
- All dependencies are installed
- The path to the module is correct
- The module is included in the `dependencies` section of `package.json`

#### Electron Builder Fails

If Electron Builder fails, ensure:
- The `build` configuration in `package.json` is correct
- The paths to icons and other assets are correct
- You have the necessary permissions to create files in the output directory

#### Application Crashes on Startup

If the application crashes on startup, check:
- The main process logs for errors
- The renderer process logs for errors
- The Electron configuration in `electron/main.js`
- The preload script in `electron/preload.js`

### Getting Help

If you encounter issues not covered in this guide:
1. Check the [GitHub Issues](https://github.com/ImaginariumLabs/APIwidget/issues) for similar problems
2. Search the [Electron documentation](https://www.electronjs.org/docs/latest/)
3. Ask for help in the project's communication channels

## References

- [Electron Documentation](https://www.electronjs.org/docs/latest/)
- [Electron Builder Documentation](https://www.electron.build/)
- [Vite Documentation](https://vitejs.dev/guide/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
