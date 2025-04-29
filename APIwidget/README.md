# APIwidget

A modern desktop application for managing and monitoring API usage across multiple providers with real-time tracking and visualization.

## Features

- **Real-Time API Tracking**: Monitor API usage and costs as they happen
- **Secure Key Management**: Store and manage API keys securely on your local device
- **Comprehensive Analytics**: Visualize usage trends, costs, and performance metrics
- **Detailed History**: Track and analyze all API requests with filtering and export options
- **Multiple Provider Support**: Track OpenAI, Claude, Gemini, and GitHub APIs in one place
- **Floating Widgets**: Modern glass morphism floating widgets for at-a-glance monitoring
- **Customizable Experience**: Personalize widgets with different themes, sizes, and layouts
- **Multi-Widget Display**: View multiple widgets simultaneously in different layouts
- **Widget Gallery**: Browse and add pre-configured widgets for different use cases
- **Desktop Integration**: Seamless integration with your desktop environment using Electron
- **Intelligent Caching**: Efficient data fetching with smart caching to reduce API calls

## Supported API Providers

- OpenAI - Track token usage and costs for GPT models
- Claude (Anthropic) - Monitor usage of Claude models
- Gemini (Google) - Track Google AI API usage with free tier support
- GitHub - Monitor API rate limits and usage
- AWS (coming soon)
- Azure (coming soon)

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm 7.x or higher
- Supabase account for authentication and database

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/apiwidget.git
   cd apiwidget/APIwidget
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

   **Note**: Make sure you're in the nested `APIwidget/APIwidget` directory, not the root directory.

3. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update with your Supabase credentials

4. Set up the database:
   - Create a new Supabase project
   - Run the SQL scripts in the `database` folder

5. Start the development server:

   **Web Application:**
   ```bash
   npm run dev
   ```

   **Electron Application:**
   ```bash
   npm run electron:dev
   ```

6. Build for production:

   **Web Application:**
   ```bash
   npm run build
   ```

   **Electron Application:**
   ```bash
   npm run electron:build
   ```
   This will create installers in the `release` directory.

## Project Structure

**Important Note**: The project has a nested directory structure with the main code in `APIwidget/APIwidget` directory, not in the root `APIwidget` directory.

```text
APIwidget/                  # Root project directory
└── APIwidget/              # Main application directory
    ├── .github/            # GitHub configuration files
    ├── database/           # Database scripts and migrations
    ├── documentation/      # Project documentation
    │   ├── architecture/   # Architecture documentation
    │   ├── design/         # Design documentation
    │   ├── development/    # Development documentation
    │   ├── project-management/ # Project management documentation
    │   └── user-guides/    # User guides
    ├── electron/           # Electron-specific code
    │   ├── main.js         # Main process entry point
    │   ├── preload.js      # Preload script for secure IPC
    │   └── tests/          # Electron tests
    ├── src/
    │   ├── components/     # React components
    │   │   ├── app/        # App-specific components
    │   │   │   ├── ElectronApp.tsx        # Electron app component
    │   │   │   └── ModernElectronApp.tsx  # Modern Electron app component
    │   │   ├── charts/     # Chart components
    │   │   ├── layout/     # Layout components
    │   │   │   ├── ElectronAppLayout.tsx  # Electron app layout
    │   │   │   └── Sidebar.tsx            # Sidebar navigation
    │   │   └── widgets/    # Widget-related components
    │   │       ├── GlassMorphismWidget.tsx  # Glass morphism widget component
    │   │       ├── EnhancedGlassMorphismWidget.tsx  # Enhanced widget component
    │   │       ├── FloatingWidgetManager.tsx  # Floating widget manager
    │   │       ├── RealTimeApiUsage.tsx   # Real-time API usage component
    │   │       └── WidgetSettingsDialog.tsx  # Widget settings dialog
    │   ├── contexts/       # React contexts
    │   │   ├── ApiProviderContext.tsx     # API provider context
    │   │   ├── DashboardWidgetContext.tsx # Dashboard widget context
    │   │   └── MockAuthContext.tsx        # Mock authentication context
    │   ├── pages/          # Page components
    │   │   ├── ModernDashboard.tsx        # Modern dashboard page
    │   │   ├── ApiKeySettings.tsx         # API key settings page
    │   │   ├── FloatingWidgetsPage.tsx    # Floating widgets page
    │   │   ├── WidgetGalleryPage.tsx      # Widget gallery page
    │   │   ├── UsagePage.tsx              # Usage analytics page
    │   │   ├── HistoryPage.tsx            # Request history page
    │   │   ├── HelpPage.tsx               # Help and support page
    │   │   └── providers/                 # Provider-specific pages
    │   │       ├── OpenAIProviderDetail.tsx  # OpenAI provider details
    │   │       ├── ClaudeProviderDetail.tsx  # Claude provider details
    │   │       └── GeminiProviderDetail.tsx  # Gemini provider details
    │   ├── services/       # Service modules
    │   │   ├── apiIntegrationService.ts   # API integration service
    │   │   ├── cacheService.ts            # Caching service
    │   │   ├── electronService.ts         # Electron service
    │   │   ├── enhancedApiService.ts      # Enhanced API service
    │   │   ├── mockDataService.ts         # Mock data service
    │   │   └── mockKeyManager.ts          # Mock key manager
    │   ├── styles/         # CSS and style files
    │   ├── types/          # TypeScript type definitions
    │   ├── App.tsx         # Main App component
    │   └── main.tsx        # Entry point
    ├── public/             # Static assets
    │   └── images/         # Image assets
    ├── package.json        # Project configuration
    └── vite.config.ts      # Vite configuration
```

For more detailed information about the project structure, please see the [Project Structure Documentation](./documentation/architecture/project-structure.md).

## Development Principles

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

## Database Schema

The application uses the following tables in Supabase:

### api_keys

```sql
CREATE TABLE api_keys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  key TEXT NOT NULL,
  label TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_used TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, provider)
);

-- Row Level Security
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can only access their own API keys"
  ON api_keys
  FOR ALL
  USING (auth.uid() = user_id);
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
