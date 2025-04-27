# APIwidget Architecture

## Overview

APIwidget follows a modern React application architecture with a focus on maintainability, performance, and security. The application is built using React with TypeScript and follows a component-based architecture.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        React Frontend                        │
├─────────────┬─────────────┬─────────────┬─────────────┬─────┘
│   Pages     │  Components │   Contexts  │    Hooks    │ Services
├─────────────┼─────────────┼─────────────┼─────────────┼─────┐
│ Dashboard   │   Layout    │    Auth     │  useApiUsage│ keyManager
│ Login       │   Widgets   │  ApiProvider│ useOpenAI   │ 
│ Settings    │   Forms     │             │ useGitHub   │ 
│ Provider    │   Charts    │             │             │ 
└─────────────┴─────────────┴─────────────┴─────────────┴─────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                      Supabase Backend                        │
├─────────────┬─────────────┬─────────────┬─────────────┬─────┘
│    Auth     │  Database   │   Storage   │  Functions  │
├─────────────┼─────────────┼─────────────┼─────────────┼─────┐
│ User Auth   │  api_keys   │  User Files │ Scheduled   │
│ JWT         │  usage_hist │             │ Tasks       │
│ Social Auth │  alerts     │             │             │
│             │  settings   │             │             │
└─────────────┴─────────────┴─────────────┴─────────────┴─────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                      External API Services                   │
├─────────────┬─────────────┬─────────────┬─────────────┬─────┘
│   OpenAI    │   GitHub    │    AWS      │   Google    │ Azure
└─────────────┴─────────────┴─────────────┴─────────────┴─────┘
```

## Key Components

### Frontend

1. **Pages**: Top-level components that represent different routes in the application.
   - Dashboard: Main overview of all API usage
   - Login: Authentication page
   - Settings: User and API key management
   - ProviderDetail: Detailed view of a specific API provider

2. **Components**: Reusable UI elements
   - Layout: App layout components (Header, Sidebar)
   - Widgets: Dashboard widgets for displaying API metrics
   - Forms: Input forms for user data
   - Charts: Data visualization components

3. **Contexts**: Global state management
   - AuthContext: User authentication state
   - ApiProviderContext: API provider configuration

4. **Hooks**: Custom React hooks for data fetching and business logic
   - useApiUsage: Generic hook for API usage data
   - useOpenAIUsage: OpenAI-specific usage data
   - useGitHubUsage: GitHub-specific usage data

5. **Services**: Utility functions and API clients
   - keyManager: API key management service

### Backend (Supabase)

1. **Authentication**: User management and authentication
   - JWT-based authentication
   - Social login options
   - Password reset functionality

2. **Database**: PostgreSQL database with the following tables
   - api_keys: Stores user API keys
   - usage_history: Historical API usage data
   - alerts: User-configured alerts
   - user_settings: User preferences

3. **Row-Level Security**: Ensures users can only access their own data
   - Policies on all tables to restrict access based on user_id

## Data Flow

1. **Authentication Flow**:
   - User logs in via Supabase Auth
   - JWT token is stored in local storage
   - AuthContext provides user state to the application

2. **API Key Management Flow**:
   - User adds API key through the UI
   - Key is encrypted and stored in Supabase
   - Row-level security ensures only the user can access their keys

3. **Usage Data Flow**:
   - Application fetches API keys from Supabase
   - Makes requests to external APIs (OpenAI, GitHub, etc.)
   - Processes and displays usage data
   - Optionally stores historical data in Supabase

## Security Considerations

1. **API Key Security**:
   - Keys are encrypted before storage
   - Keys are never exposed in client-side code
   - Row-level security ensures users can only access their own keys

2. **Authentication**:
   - JWT-based authentication with Supabase
   - Secure password policies
   - Session management

3. **Data Privacy**:
   - No usage data stored without explicit consent
   - Data minimization principles applied

## Performance Optimizations

1. **Code Splitting**:
   - React.lazy and Suspense for component loading
   - Dynamic imports for routes

2. **Caching**:
   - API response caching
   - Local storage for non-sensitive data

3. **Rendering Optimizations**:
   - React.memo for expensive components
   - useMemo and useCallback for optimized renders

## Deployment Architecture

The application is deployed using a modern CI/CD pipeline:

1. **Development**: Local development environment
2. **Staging**: Preview environment for testing
3. **Production**: Live environment for end users

Each environment has its own Supabase instance to ensure isolation.
