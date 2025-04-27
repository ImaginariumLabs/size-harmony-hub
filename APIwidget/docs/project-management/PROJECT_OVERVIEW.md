# APIwidget - API Management Dashboard

## Project Overview
APIwidget is a modern, lightweight dashboard for managing and monitoring API usage across multiple providers. It features a floating widget for Windows that displays API costs in real-time, similar to stock price trackers, using Electron with a glass morphism UI design.

### Key Features
- Track API usage and costs in real-time
- Floating desktop widget with glass morphism design
- Manage API keys securely
- Monitor rate limits and quotas
- Visualize API performance metrics
- Set up alerts for unusual activity or approaching limits

## Market Analysis
The API economy continues to grow rapidly, with organizations increasingly relying on third-party APIs for critical functionality. Key market trends include:

- Proliferation of AI and ML APIs (OpenAI, Anthropic, etc.)
- Increased focus on API security and governance
- Growing need for cost monitoring and optimization
- Rise of API-first development approaches

## Competitor Comparison

| Feature | APIwidget | Postman | Insomnia | RapidAPI |
|---------|-----------|---------|----------|----------|
| API Usage Tracking | ✅ | ✅ | ❌ | ✅ |
| Cost Monitoring | ✅ | ❌ | ❌ | ✅ |
| Key Management | ✅ | ✅ | ✅ | ✅ |
| Rate Limit Alerts | ✅ | ❌ | ❌ | ✅ |
| Open Source | ✅ | ❌ | ✅ | ❌ |
| Self-hosted Option | ✅ | ❌ | ❌ | ❌ |
| Lightweight | ✅ | ❌ | ✅ | ❌ |
| Desktop Widget | ✅ | ❌ | ❌ | ❌ |
| Glass Morphism UI | ✅ | ❌ | ❌ | ❌ |

## User Flow
1. **Onboarding**
   - Sign up/login
   - Add first API key
   - Select provider (OpenAI, GitHub, etc.)

2. **Dashboard View**
   - Overview of all connected APIs
   - Usage metrics and cost summaries
   - Quick access to detailed views
   - Widget customization options

3. **Widget Interaction**
   - View real-time API costs
   - Toggle between providers
   - Access quick settings
   - Receive visual alerts for thresholds

4. **API Detail View**
   - Detailed usage statistics
   - Cost breakdown
   - Historical trends
   - Rate limit status

5. **Settings**
   - API key management
   - Widget customization
   - Alert configuration
   - User preferences
   - Team management (for team accounts)

## UI/UX Principles (2025)
- Minimalist, distraction-free interface
- Glass morphism design for the widget
- Dark mode by default with light mode option
- Responsive design for all devices
- Micro-interactions for improved user experience
- AI-assisted features for proactive monitoring
- Customizable dashboard with drag-and-drop widgets
- Accessibility-first approach

## Technology Stack
- **Frontend**: React 19, TypeScript
- **UI Library**: Material UI 7
- **Build Tool**: Vite 6
- **Desktop Framework**: Electron 29
- **State Management**: React Context API
- **Styling**: Emotion/styled-components
- **Data Visualization**: Recharts
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL
- **API Integration**: Axios
- **Charts/Visualization**: Recharts

## Development Approach
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

## Project Timeline
The project is being developed in sprints, with each sprint focusing on specific aspects of the application:

1. **Sprint 1**: Core Setup - Basic Electron infrastructure
2. **Sprint 2**: Basic Desktop Integration - Secure storage, system tray, notifications
3. **Sprint 3**: Widget Core - Floating widget implementation
4. **Sprint 4**: Widget Enhancement - Customization, multiple providers, interactions
5. **Sprint 5**: Integration & Polish - Final integration, testing, and distribution

## Current Status
The project has successfully implemented the core floating widget with glass morphism design and is now focusing on enhancing the widget functionality and developing the main application interface.
