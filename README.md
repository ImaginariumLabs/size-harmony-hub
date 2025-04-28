# APIwidget

A floating widget for Windows that displays API costs in real-time, similar to stock price trackers, using Electron with a glass morphism UI design.

## Project Structure

The project has a nested structure:

```
APIwidget/
├── APIwidget/         # Main project directory
│   ├── electron/      # Electron-specific code
│   ├── public/        # Public assets
│   ├── src/           # Source code
│   └── package.json   # Project dependencies
└── run-widget.bat     # Script to run the widget
```

## Running the Application

To run the application, use the provided batch script:

```
.\run-widget.bat
```

This will navigate to the correct directory and run the application in development mode.

## Development

The application is built using:

- React 19
- TypeScript
- Material UI 7
- Vite 6
- Electron 29
- Supabase for database/auth

## Features

- Glass morphism UI design
- Draggable and resizable widget
- Theme switching (dark/light)
- Size variations (compact, small, medium, large)
- Provider switching
- Real-time data updates

## Known Issues

- The widget may not be draggable in some environments
- The widget may not display correctly in some environments
- The application may have issues with mixed/old code affecting the single source of truth principle

## Next Steps

- Implement real-time data fetching from API providers
- Add customization options for the widget
- Develop the main application interface
