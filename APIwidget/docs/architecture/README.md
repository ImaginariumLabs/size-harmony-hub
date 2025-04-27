# Architecture Documentation

This folder contains documentation related to the technical architecture and design of the APIwidget application.

## Contents

| Document | Description | Last Updated |
|----------|-------------|--------------|
| [ARCHITECTURE.md](./ARCHITECTURE.md) | System architecture overview with component diagrams | 2025-04-27 |
| [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) | Codebase organization and structure | 2025-04-27 |

## Key Architecture Concepts

### Electron Architecture

APIwidget follows a standard Electron architecture with:

- **Main Process**: Handles system integration, window management, and secure storage
- **Renderer Process**: Contains the React application and UI components
- **IPC Communication**: Secure bridge between main and renderer processes
- **Preload Script**: Exposes a limited API to the renderer process

### React Architecture

The React application follows a component-based architecture with:

- **Component Hierarchy**: Modular components with clear responsibilities
- **Context API**: For global state management
- **Custom Hooks**: For reusable logic and data fetching
- **Service Layer**: For external API communication

### Data Flow

1. User interacts with the UI
2. React components update state
3. Services communicate with external APIs
4. Data is processed and displayed
5. Changes are persisted to Supabase or local storage

## Diagrams

The architecture documentation includes several diagrams:

- **Architecture Diagram**: Overall system architecture
- **Component Architecture**: React component relationships
- **Data Flow Diagram**: Sequence of interactions between components
- **Database Schema**: Supabase database structure

## Purpose

The architecture documentation provides a comprehensive overview of the technical design decisions, system components, and their interactions. It serves as a reference for developers to understand the overall structure of the application and how different parts work together.

## Audience

- Developers working on the project
- Technical leads and architects
- New team members onboarding to the project

## Maintenance

Architecture documentation should be updated whenever significant changes are made to the system design or when new components are added. All documents should be reviewed at least quarterly to ensure they remain accurate and up-to-date.
