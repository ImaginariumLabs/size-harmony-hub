# APIwidget Organization Setup

This document outlines the organization structure for the APIwidget project, including Supabase and GitHub configurations.

## Project Overview

APIwidget is a desktop and web application for monitoring API costs in real-time. It features a modern glass morphism floating widget that provides at-a-glance information about API usage and costs across multiple providers.

## Supabase Configuration

### Project Details

- **Project Name**: apiwidget
- **Project ID**: cuvhqtyslazvbwlbhqcn
- **Region**: eu-central-1
- **Database URL**: https://cuvhqtyslazvbwlbhqcn.supabase.co

### Database Schema

The database includes the following tables:

1. **profiles**: User profile information
2. **api_providers**: Information about supported API providers
3. **api_keys**: Securely stored API keys for different providers
4. **api_usage**: API usage data and cost tracking
5. **user_settings**: User preferences and widget configuration

### Authentication

- Email authentication enabled
- Row Level Security (RLS) policies implemented for all tables
- Automatic user setup with database triggers

For detailed information, see [SUPABASE_SETUP.md](../development/SUPABASE_SETUP.md).

## GitHub Configuration

### Repository Details

- **Repository Name**: apiwidget
- **Organization**: ImaginariumLabs
- **Visibility**: Public

### Repository Structure

- Standard Git flow branching model
- Conventional Commits specification
- GitHub Actions for CI/CD
- Issue templates and project board

### Documentation

The repository includes:

- README.md with project overview and setup instructions
- CONTRIBUTING.md with contribution guidelines
- Comprehensive documentation in the docs directory

For detailed information, see [GITHUB_SETUP.md](../../.github/GITHUB_SETUP.md).

## Environment Configuration

### Environment Variables

The application uses the following environment variables:

```
VITE_SUPABASE_URL=https://cuvhqtyslazvbwlbhqcn.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_USE_MOCK_DATA=false
VITE_API_BASE_URL=http://localhost:3000/api
VITE_ENABLE_ANALYTICS=false
```

### Development Setup

1. Clone the repository
2. Copy `.env.example` to `.env` and configure environment variables
3. Install dependencies with `npm install`
4. Start the development server with `npm run dev`
5. For Electron development, use `npm run electron:dev`

## Project Integration

### Supabase Integration

The application uses Supabase for:

1. User authentication and management
2. Secure storage of API keys
3. Tracking API usage and costs
4. Storing user preferences and settings

### GitHub Integration

The project uses GitHub for:

1. Version control and collaboration
2. Issue tracking and project management
3. CI/CD with GitHub Actions
4. Documentation hosting

## Current Status

1. ✅ Implemented the glass morphism widget
2. ✅ Set up basic Supabase integration
3. ✅ Configured GitHub repository
4. 🔄 Implementing system tray integration and other Electron features

## Maintenance

### Supabase Maintenance

- Regularly backup the database
- Monitor usage and upgrade plan if necessary
- Keep authentication settings up to date
- Review and update RLS policies as needed

### GitHub Maintenance

- Keep dependencies up to date with Dependabot
- Review and merge pull requests
- Manage issues and project board
- Create releases for new versions

## Documentation Structure

The project documentation is organized into the following structure:

```
docs/
├── architecture/              # Technical architecture and design
│   ├── ARCHITECTURE.md        # System architecture overview
│   └── PROJECT_STRUCTURE.md   # Codebase organization and structure
├── development/               # Development guides and implementation details
│   ├── ELECTRON_DEVELOPMENT_GUIDE.md  # Guide for Electron development
│   ├── ELECTRON_IMPLEMENTATION.md     # Electron implementation details
│   ├── SUPABASE_SETUP.md              # Supabase configuration and setup
│   └── TESTING_STRATEGY.md            # Testing approach and procedures
├── design/                    # UI/UX design guidelines and principles
│   └── UI_UX_DESIGN.md        # UI/UX design guidelines
├── user-guides/               # End-user documentation
│   └── USER_GUIDE.md          # End-user guide for using the application
├── project-management/        # Project tracking and management documentation
│   ├── PROJECT_MANAGEMENT.md  # Project management and tracking
│   ├── PROJECT_OVERVIEW.md    # High-level project overview
│   ├── SPRINT_PLANNING.md     # Sprint planning and status
│   ├── ROADMAP.md             # Development roadmap
│   ├── MARKET_ANALYSIS.md     # Market analysis
│   ├── ORGANIZATION_SETUP.md  # Organization setup
│   └── CLEANUP_SUMMARY.md     # Code cleanup summary
├── archived/                  # Archived documentation
└── DOCUMENTATION_INDEX.md     # Documentation index
```
