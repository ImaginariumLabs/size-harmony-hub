# APIwidget Glass Morphism Widget Design

## Overview

The Glass Morphism Widget is a modern, floating UI component that displays API cost information in a visually appealing way. It follows the 2025 UI/UX trends, incorporating glass morphism, subtle animations, and adaptive design.

## Design Principles

### Glass Morphism

Glass morphism is a design trend that creates a frosted glass effect, giving UI elements a sense of depth and context. Our implementation includes:

- Semi-transparent background with blur effect
- Subtle border highlights
- Soft shadows for depth perception
- Layered elements that create a sense of hierarchy

### Minimalism with Personality

The widget maintains a clean, uncluttered interface while adding distinctive character through:

- Strategic use of color gradients
- Subtle animations and transitions
- Purposeful micro-interactions
- Visual feedback for user actions

### Adaptive Design

The widget adapts to different contexts and user preferences:

- Multiple size options (compact, small, medium, large)
- Theme variations (dark and light)
- Responsive to different screen sizes
- Customizable position

## Features

### Core Functionality

- Real-time display of API costs
- Cost change indicators with visual cues (increase/decrease)
- Provider switching between different API services
- Last update timestamp

### Interactive Elements

- Draggable positioning
- Resizable dimensions
- Theme toggling
- Provider selection
- Expand/collapse functionality

### Visual Feedback

- Animation for value changes
- Alert indicators for threshold breaches
- Visual differentiation between providers
- Hover states for interactive elements

## Implementation Details

### CSS Techniques

- `backdrop-filter` for the glass effect
- CSS variables for theme consistency
- CSS transitions for smooth animations
- CSS Grid and Flexbox for layout
- Linear gradients for modern color effects

### React Implementation

- Functional components with hooks
- State management for widget preferences
- Effect hooks for data fetching and persistence
- Ref hooks for DOM manipulation
- Custom event handlers for interactions

### Customization Options

- Size variations: compact, small, medium, large
- Theme options: dark, light
- Position: freely positionable
- Provider selection: switch between different API services

## Usage

```tsx
// Basic usage
<GlassMorphismWidget />

// With customization
<GlassMorphismWidget 
  initialSize="medium"
  initialTheme="dark"
  initialPosition={{ x: 20, y: 20 }}
  onToggleMainWindow={handleToggleMainWindow}
  onClose={handleCloseWidget}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| initialSize | 'compact' \| 'small' \| 'medium' \| 'large' | 'medium' | Initial size of the widget |
| initialTheme | 'dark' \| 'light' | 'dark' | Initial theme of the widget |
| initialPosition | { x: number, y: number } | { x: 20, y: 20 } | Initial position of the widget |
| onToggleMainWindow | () => void | undefined | Callback when the expand button is clicked |
| onClose | () => void | undefined | Callback when the close button is clicked |

## Persistence

The widget saves user preferences to localStorage (or Electron store in desktop mode):

- Position
- Size
- Theme
- Active provider

## Accessibility Considerations

- Color contrast ratios meet WCAG standards
- Interactive elements have appropriate focus states
- Semantic HTML structure
- Keyboard navigation support
- Screen reader friendly text alternatives

## Future Enhancements

- Additional theme options
- More customization settings
- Enhanced animations
- Data visualization options
- Multi-widget support
- Gesture controls for touch devices

## Design Inspiration

The Glass Morphism Widget design was inspired by modern UI trends for 2025, including:

- Apple's translucent UI elements
- Financial dashboard widgets
- Stock market trackers
- Modern weather applications
- Smart home control interfaces
