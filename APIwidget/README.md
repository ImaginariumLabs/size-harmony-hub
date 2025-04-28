# APIwidget

A modern dashboard for managing and monitoring API usage across multiple providers.

## Features

- Track API usage and costs in real-time
- Manage API keys securely
- Monitor rate limits and quotas
- Visualize API performance metrics
- Set up alerts for unusual activity or approaching limits
- Modern glass morphism floating widget for at-a-glance cost monitoring
- Customizable widget with themes, sizes, and positioning
- Multiple API provider support with visual indicators
- Desktop application with Electron integration

## Supported API Providers

- OpenAI
- GitHub
- AWS (coming soon)
- Google Cloud (coming soon)
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
    ├── docs/               # Project documentation
    ├── electron/           # Electron-specific code
    │   ├── main.js         # Main process entry point
    │   ├── preload.js      # Preload script for secure IPC
    │   └── tests/          # Electron tests
    ├── src/
    │   ├── components/     # React components
    │   │   ├── app/        # App-specific components
    │   │   │   └── ElectronApp.tsx  # Electron app component
    │   │   ├── layout/     # Layout components
    │   │   └── widgets/    # Widget-related components
    │   │       └── GlassMorphismWidget.tsx  # Glass morphism widget component
    │   │       └── DashboardWidget.tsx      # Dashboard widget component
    │   ├── contexts/       # React contexts
    │   │   └── DashboardWidgetContext.tsx   # Dashboard widget context
    │   ├── pages/          # Page components
    │   │   └── Dashboard.tsx               # Dashboard page
    │   ├── services/       # Service modules
    │   │   ├── keyManager/  # API key management
    │   │   ├── electronService.ts  # Electron service
    │   │   ├── mockDataService.ts  # Mock data service
    │   │   └── settingsService.ts  # Settings service
    │   ├── styles/         # CSS and style files
    │   ├── App.tsx         # Main App component
    │   └── main.tsx        # Entry point
    ├── public/             # Static assets
    │   └── images/         # Image assets
    ├── package.json        # Project configuration
    └── vite.config.ts      # Vite configuration
```

For more detailed information about the project structure, please see the [Project Structure Documentation](./docs/project-structure.md).

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
