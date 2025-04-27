# APIwidget Technical Documentation

## Architecture Overview

APIwidget follows a modern React application architecture with the following key components:

### Frontend Architecture
- **Component Structure**: Follows atomic design principles
- **State Management**: React Context API for global state
- **Routing**: React Router for navigation
- **API Communication**: Custom hooks for API interactions
- **Styling**: Emotion/styled-components with Material UI

### Backend Services
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL
- **API Key Storage**: Encrypted storage with secure access patterns

## Core Components

### API Key Manager
The API Key Manager handles secure storage and retrieval of API keys:

```typescript
// src/services/keyManager.ts
export interface ApiKeyEntry {
  provider: string;
  key: string;
  label?: string;
  createdAt: Date;
  lastUsed?: Date;
}

// Functions for secure key management
export const saveApiKey = async (provider: string, key: string, label?: string): Promise<void>;
export const getApiKey = async (provider: string): Promise<string | null>;
export const listApiKeys = async (): Promise<ApiKeyEntry[]>;
export const deleteApiKey = async (provider: string): Promise<void>;
```

### Usage Tracking
The Usage Tracking module fetches and processes API usage data:

```typescript
// src/hooks/useApiUsage.ts
export interface UsageData {
  provider: string;
  totalRequests: number;
  totalCost: number;
  quotaUsed: number;
  quotaTotal: number;
  lastUpdated: Date;
}

export const useApiUsage = (provider: string): {
  usage: UsageData | null;
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
};
```

### Dashboard Widgets
Customizable widgets for displaying API metrics:

```typescript
// src/components/widgets/Widget.tsx
export interface WidgetProps {
  title: string;
  provider: string;
  type: 'usage' | 'cost' | 'quota' | 'history';
  refreshInterval?: number;
  size?: 'small' | 'medium' | 'large';
}
```

## Data Flow

1. **API Key Storage**:
   - Keys are encrypted before storage
   - Only decrypted when needed for API calls
   - Never exposed in client-side code

2. **Usage Data Retrieval**:
   - Periodic background fetching
   - On-demand refresh
   - Cached for performance

3. **Alert System**:
   - Regular checks against thresholds
   - Push notifications via service workers
   - Email alerts for critical events

## Security Considerations

- **API Key Protection**: Keys are encrypted at rest and in transit
- **Authentication**: JWT-based auth with Supabase
- **Authorization**: Row-level security in Supabase
- **Data Privacy**: No usage data stored on servers without explicit consent

## Performance Optimizations

- **Code Splitting**: Lazy loading of components
- **Memoization**: React.memo and useMemo for expensive calculations
- **Caching**: Local storage for non-sensitive data
- **Debouncing**: For search and filter operations

## Deployment

- **CI/CD**: GitHub Actions for automated testing and deployment
- **Environments**: Development, Staging, Production
- **Monitoring**: Error tracking with Sentry
- **Analytics**: Anonymous usage tracking with Plausible

## Contributing Guidelines

- **Code Style**: ESLint and Prettier
- **Commit Messages**: Conventional Commits format
- **Pull Requests**: Required reviews and passing tests
- **Testing**: Jest for unit tests, React Testing Library for component tests
