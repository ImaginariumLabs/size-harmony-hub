# APIwidget UI/UX Design Guidelines 2025

## Design Philosophy

APIwidget follows a minimalist, function-first design philosophy that prioritizes clarity, efficiency, and user focus. The design aims to present complex API data in an intuitive, accessible manner while maintaining a modern aesthetic that feels current in 2025.

## Table of Contents

1. [2025 UI/UX Trends](#2025-uiux-trends)
2. [Core Design Principles](#core-design-principles)
3. [Visual Language](#visual-language)
4. [Interaction Design](#interaction-design)
5. [Dark Mode Design](#dark-mode-design)
6. [Responsive Breakpoints](#responsive-breakpoints)
7. [Accessibility Guidelines](#accessibility-guidelines)
8. [UI Patterns](#ui-patterns)
9. [Electron-Specific Considerations](#electron-specific-considerations)
10. [Implementation Notes](#implementation-notes)
11. [Resources and References](#resources-and-references)

## 2025 UI/UX Trends

Based on the latest design trends for 2025, APIwidget incorporates:

### 1. Minimalism with Purpose

- **Clean Interfaces**: Reduced visual clutter while maintaining functionality
- **Purposeful Elements**: Every UI element serves a clear purpose
- **Whitespace Utilization**: Strategic use of negative space to improve readability
- **Content Hierarchy**: Clear visual hierarchy to guide user attention

### 2. Glass Morphism Evolution

- **Refined Transparency**: Subtle transparency effects that don't compromise readability
- **Contextual Blur**: Blur effects that adapt to background complexity
- **Depth Indicators**: Using transparency to indicate layer hierarchy
- **Light Refraction**: Subtle light effects that mimic real glass properties

### 3. Micro-Interactions

- **Purposeful Animation**: Motion that enhances understanding and usability
- **Feedback Mechanisms**: Visual and tactile feedback for user actions
- **State Transitions**: Smooth transitions between UI states
- **Attention Guidance**: Using motion to direct user attention

### 4. Adaptive Typography

- **Variable Fonts**: Fonts that adapt to different contexts and screen sizes
- **Hierarchy Through Type**: Using font variations to establish clear hierarchy
- **Readability Focus**: Optimizing for reading comfort across devices
- **Personality Through Type**: Using typography to reinforce brand identity

### 5. Bento Grid Layouts

- **Modular Organization**: Content organized in distinct, modular containers
- **Visual Interest**: Creating visual rhythm through varied module sizes
- **Content Prioritization**: Using size and position to indicate importance
- **Responsive Adaptation**: Grid that adapts gracefully to different screen sizes

## Core Design Principles

### 1. Simplicity Over Complexity

- Prioritize essential information and actions
- Reduce cognitive load through progressive disclosure
- Eliminate unnecessary UI elements and decorations
- Use clear, concise language throughout the interface

### 2. Data-Focused Visualization

- Present API metrics in easily scannable formats
- Use appropriate visualizations for different data types
- Ensure all charts and graphs are immediately understandable
- Provide context and comparisons where helpful

### 3. Accessibility First

- Design for users with diverse abilities and needs
- Maintain WCAG 2.2 AA compliance throughout
- Ensure keyboard navigability for all interactions
- Support screen readers and assistive technologies

### 4. Responsive and Adaptive

- Create seamless experiences across devices and screen sizes
- Optimize layouts for different viewing contexts
- Maintain functionality regardless of device capabilities
- Prioritize performance on all platforms

## Visual Language

### Color Palette

#### Primary Colors

```css
--primary-color: #90caf9;
--primary-dark: #64b5f6;
--primary-light: #bbdefb;
```

#### Secondary Colors

```css
--secondary-color: #f48fb1;
--secondary-dark: #f06292;
--secondary-light: #f8bbd0;
```

#### Background Colors

```css
--background-dark: #121212;
--background-light: #f5f5f5;
--surface-dark: #1e1e1e;
--surface-light: #ffffff;
```

#### Text Colors

```css
--text-dark-high: rgba(255, 255, 255, 0.87);
--text-dark-medium: rgba(255, 255, 255, 0.6);
--text-dark-disabled: rgba(255, 255, 255, 0.38);
--text-light-high: rgba(0, 0, 0, 0.87);
--text-light-medium: rgba(0, 0, 0, 0.6);
--text-light-disabled: rgba(0, 0, 0, 0.38);
```

#### Semantic Colors

```css
--error-color: #f44336;
--warning-color: #ff9800;
--success-color: #4caf50;
--info-color: #2196f3;
```

### Typography

#### Font Family

```css
font-family: 'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif;
```

#### Type Scale

```css
h1: {
  fontSize: '2.5rem',
  fontWeight: 600,
},
h2: {
  fontSize: '2rem',
  fontWeight: 600,
},
h3: {
  fontSize: '1.5rem',
  fontWeight: 600,
},
h4: {
  fontSize: '1.25rem',
  fontWeight: 600,
},
h5: {
  fontSize: '1rem',
  fontWeight: 600,
},
h6: {
  fontSize: '0.875rem',
  fontWeight: 600,
},
```

#### Font Weights

- Light: 300
- Regular: 400
- Medium: 500
- Semi-Bold: 600
- Bold: 700

### Spacing System

```css
--spacing-xs: 4px;  /* Minimal spacing, tight elements */
--spacing-sm: 8px;  /* Default spacing between related elements */
--spacing-md: 16px; /* Standard spacing between components */
--spacing-lg: 24px; /* Generous spacing between sections */
--spacing-xl: 32px; /* Major section divisions */
```

### Border Radius

```css
--border-radius-sm: 4px;
--border-radius-md: 8px;
--border-radius-lg: 16px;
--border-radius-xl: 24px;
```

### Shadows

```css
--shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.1);
--shadow-md: 0 4px 8px rgba(0, 0, 0, 0.12);
--shadow-lg: 0 8px 16px rgba(0, 0, 0, 0.14);
--shadow-xl: 0 12px 24px rgba(0, 0, 0, 0.16);
```

### Component Design

#### Cards

- Rounded corners (16px radius)
- Glass morphism effect
- Background: rgba(30, 30, 30, 0.7)
- Backdrop filter: blur(10px)
- Border: 1px solid rgba(255, 255, 255, 0.1)
- Box shadow: 0 8px 32px rgba(0, 0, 0, 0.2)

#### Buttons

- Rounded corners (8px radius)
- No text transformation (preserve case)
- Medium weight (500) for text
- Gradient background for contained buttons
- Clear hover and active states
- Consistent height (40px for standard, 32px for small)

```css
background: linear-gradient(135deg, #64b5f6, #2196f3);
&:hover: {
  background: linear-gradient(135deg, #2196f3, #1976d2);
}
```

#### Forms

- Floating labels for text inputs
- Clear validation states with helpful error messages
- Grouped related fields with logical tab order
- Consistent spacing between form elements (16px)

#### Data Visualization

- Consistent color coding across all charts
- Clear labels and legends
- Tooltips for detailed information
- Responsive sizing based on container
- Appropriate chart types for different data

## Interaction Design

### Micro-interactions

- Subtle animations for state changes (300ms duration)
- Visual feedback for all user actions
- Loading states for asynchronous operations
- Transition effects between major UI states

### Navigation Patterns

- Clear, consistent navigation structure
- Breadcrumbs for deep navigation paths
- Back buttons where appropriate
- Persistent access to main navigation

### Gestures and Touch

- Support for standard touch gestures (tap, swipe, pinch)
- Drag and drop for widget positioning
- Touch targets minimum 44x44px
- Hover states with touch alternatives

### Transitions

```css
--transition-fast: 0.15s ease;
--transition-normal: 0.25s ease;
--transition-slow: 0.4s ease;
```

## Dark Mode Design

APIwidget is designed with a dark mode first approach, optimized for:

- Reduced eye strain during extended use
- Better contrast for data visualization
- Modern, professional appearance
- Energy efficiency on OLED displays

### Dark Mode Palette

```typescript
palette: {
  mode: 'dark',
  primary: {
    main: '#90caf9',
  },
  secondary: {
    main: '#f48fb1',
  },
  background: {
    default: '#121212',
    paper: '#1e1e1e',
  },
}
```

### Light Mode Support

While dark mode is the default, light mode is fully supported with appropriate color adjustments:

```css
body.light-theme {
  background-color: var(--background-light);
  color: var(--text-light-high);
}
```

## Responsive Breakpoints

APIwidget uses the following breakpoints for responsive design:

- **Small**: < 480px (Mobile)
- **Medium**: 480px - 768px (Tablet Portrait)
- **Large**: 768px - 1200px (Tablet Landscape / Small Desktop)
- **Extra Large**: > 1200px (Desktop)

### Responsive Grid

The Bento Grid layout adjusts based on screen size:

```css
/* Desktop */
.bento-grid {
  grid-template-columns: repeat(12, 1fr);
}

/* Tablet */
@media (max-width: 768px) {
  .bento-grid {
    grid-template-columns: repeat(6, 1fr);
  }
}

/* Mobile */
@media (max-width: 480px) {
  .bento-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
  }
}
```

## Accessibility Guidelines

APIwidget follows WCAG 2.2 AA guidelines, including:

- Minimum contrast ratio of 4.5:1 for all text
- Focus indicators for all interactive elements
- Alternative text for all images and icons
- Semantic HTML structure
- ARIA attributes where appropriate
- Keyboard shortcuts for common actions

### Keyboard Navigation

- Tab order follows visual layout
- Focus states are clearly visible
- All interactive elements are keyboard accessible
- Keyboard shortcuts for common actions

### Screen Reader Support

- Semantic HTML structure
- ARIA labels for non-standard controls
- Meaningful alt text for images
- Proper heading structure

## UI Patterns

### Dashboard Widgets

- Consistent card-based design
- Clear headers with action buttons
- Prominent display of primary metric
- Secondary metrics and trends below
- Optional chart or visualization
- Refresh button and last updated timestamp

### Bento Grid Layout

- Modular grid system for organizing content
- Varied card sizes based on content importance
- Consistent spacing and alignment
- Responsive adaptation for different screen sizes

### Glass Morphism

- Subtle transparency effects
- Backdrop blur for depth
- Light borders for definition
- Soft shadows for elevation

### Data Tables

- Sortable columns with clear indicators
- Pagination for large datasets
- Search and filter capabilities
- Row actions in consistent location
- Responsive strategies for narrow viewports

### API Key Management

- Secure display of sensitive information
- Clear copy and visibility toggle actions
- Consistent format for creation and editing
- Confirmation for destructive actions

## Electron-Specific Considerations

### Window Management

- Proper handling of window states (minimize, maximize, close)
- Consistent window chrome across platforms
- Support for multiple monitors
- Proper scaling on high-DPI displays

### System Integration

- System tray integration with context menu
- Native notifications
- Proper handling of platform-specific behaviors
- Support for system color schemes

### Floating Widget

- Always-on-top capability
- Draggable positioning
- Resizable dimensions
- Proper z-index management
- Transparency and blur effects

## Implementation Notes

### Material UI Integration

APIwidget uses Material UI as its component foundation with custom theming:

```typescript
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#f48fb1',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    // Typography scale...
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    // Component overrides...
  },
});
```

### CSS Variables

Global CSS variables are defined in `src/styles/global.css` for consistent styling:

```css
:root {
  /* Color variables */
  --primary-color: #90caf9;
  /* Additional variables... */
}
```

### Component Customization

Material UI components are customized through the theme:

```typescript
components: {
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        textTransform: 'none',
        fontWeight: 500,
      },
      contained: {
        background: 'linear-gradient(135deg, #64b5f6, #2196f3)',
        '&:hover': {
          background: 'linear-gradient(135deg, #2196f3, #1976d2)',
        },
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 16,
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
        background: 'rgba(30, 30, 30, 0.7)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
      },
    },
  },
  // Additional component overrides...
}
```

### Utility Classes

Utility classes are provided for common styling needs:

```css
.flex { display: flex; }
.flex-column { flex-direction: column; }
.items-center { align-items: center; }
.justify-center { justify-content: center; }
.justify-between { justify-content: space-between; }
.gap-sm { gap: var(--spacing-sm); }
.gap-md { gap: var(--spacing-md); }
.gap-lg { gap: var(--spacing-lg); }
.m-0 { margin: 0; }
.p-0 { padding: 0; }
.w-full { width: 100%; }
.h-full { height: 100%; }
```

## Resources and References

1. **Design Systems**
   - [Material Design 3](https://m3.material.io/)
   - [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
   - [Microsoft Fluent Design](https://www.microsoft.com/design/fluent/)

2. **Accessibility Guidelines**
   - [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
   - [Inclusive Design Principles](https://inclusivedesignprinciples.org/)

3. **Electron Best Practices**
   - [Electron Documentation](https://www.electronjs.org/docs/latest/)
   - [Electron Fiddle](https://www.electronjs.org/fiddle)
   - [Electron Builder](https://www.electron.build/)

4. **Typography**
   - [Inter Font](https://rsms.me/inter/)
   - [Type Scale](https://type-scale.com/)

5. **Color Tools**
   - [Material Color Tool](https://material.io/resources/color/)
   - [Coolors](https://coolors.co/)
   - [Contrast Checker](https://webaim.org/resources/contrastchecker/)
