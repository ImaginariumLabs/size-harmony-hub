# APIwidget

<p align="center">
  <img src="../public/icon.png" alt="APIwidget Logo" width="128" height="128">
</p>

<p align="center">
  A floating widget for monitoring API costs in real-time
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#installation">Installation</a> •
  <a href="#usage">Usage</a> •
  <a href="#development">Development</a> •
  <a href="#contributing">Contributing</a> •
  <a href="#license">License</a>
</p>

## Features

- Track API costs across multiple providers (OpenAI, GitHub, AWS, etc.)
- Modern glass morphism floating widget for at-a-glance cost monitoring
- Customizable widget with themes, sizes, and positioning
- Multiple API provider support with visual indicators
- Desktop application with Electron integration
- Secure API key storage
- Cost alerts and notifications
- Historical usage tracking

## Installation

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher

### Desktop Application

Download the latest release for your platform:

- Windows: `APIwidget-Setup-x.x.x.exe`
- macOS: `APIwidget-x.x.x.dmg`
- Linux: `APIwidget-x.x.x.AppImage`

### From Source

```bash
# Clone the repository
git clone https://github.com/ImaginariumLabs/apiwidget.git

# Navigate to the project directory
cd apiwidget

# Install dependencies
npm install

# Start the development server
npm run dev

# Or start the Electron app
npm run electron:dev
```

## Usage

### Adding API Keys

1. Open the application
2. Navigate to Settings > API Keys
3. Click "Add New API Key"
4. Select the provider and enter your API key
5. Click "Save"

### Widget Customization

1. Right-click on the widget
2. Select "Settings"
3. Customize appearance, size, and position
4. Set cost thresholds for alerts

### Monitoring Costs

The widget displays:
- Current month's total cost
- Daily change (increase/decrease)
- Cost breakdown by provider

## Development

### Project Structure

```
src/
├── components/       # React components
├── contexts/         # React contexts
├── hooks/            # Custom React hooks
├── pages/            # Page components
├── services/         # Services and API clients
├── styles/           # CSS and style files
├── App.tsx           # Main application component
└── main.tsx          # Application entry point

electron/             # Electron-specific code
├── main.js           # Main process
└── preload.js        # Preload script
```

### Available Scripts

- `npm run dev`: Start the web development server
- `npm run electron:dev`: Start the Electron app in development mode
- `npm run build`: Build the web application
- `npm run electron:build`: Build the Electron application
- `npm run lint`: Run ESLint
- `npm run preview`: Preview the built web application

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Electron](https://www.electronjs.org/) for the desktop application framework
- [React](https://reactjs.org/) for the UI library
- [Vite](https://vitejs.dev/) for the build tool
- [Supabase](https://supabase.io/) for authentication and database
- [Material-UI](https://mui.com/) for UI components
