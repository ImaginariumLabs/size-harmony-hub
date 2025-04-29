# Multiple Floating Widgets

This document explains the implementation of multiple floating widgets in APIwidget.

## Overview

APIwidget now supports multiple floating widgets that can be displayed simultaneously. These widgets provide real-time monitoring of API usage and costs for different providers. The widgets are highly customizable, with features like resizing, repositioning, and layout presets.

## Key Features

### Resizable Widgets

- Widgets can be freely resized by dragging the resize handle in the bottom-right corner
- Custom sizes are saved and restored
- Smooth animations during resizing
- Visual feedback during resize operations

### Multiple Layout Options

- **Free Layout**: Widgets can be positioned anywhere on the screen
- **Grid Layout**: Widgets are arranged in a grid pattern
- **Line Layout**: Widgets are arranged in a horizontal line at the bottom of the screen

### Widget Configuration Presets

- Save current widget configurations as presets
- Restore widget configurations from saved presets
- Delete saved presets
- Each preset stores widget positions, sizes, and provider information

### Improved Drag-and-Drop

- Enhanced drag-and-drop functionality for smoother widget movement
- Visual feedback during dragging
- Boundary detection to keep widgets on screen
- Touch support for mobile/tablet devices

## Implementation Details

### Components

- **FloatingWidgetManager**: Manages multiple widgets, layouts, and presets
- **EnhancedGlassMorphismWidget**: Individual widget component with resize and drag functionality
- **WidgetSettingsDialog**: Dialog for configuring widget settings

### State Management

Widget state is managed through the DashboardWidgetContext, which stores:

- Widget positions
- Widget sizes (including custom sizes)
- Widget visibility
- Provider information

### Layout Management

The layout system calculates widget positions based on the selected layout:

- **Free Layout**: Uses the stored position for each widget
- **Grid Layout**: Calculates positions based on a grid pattern
- **Line Layout**: Arranges widgets in a horizontal line

### Widget Presets

Widget presets are stored in localStorage and include:

- Preset ID
- Preset name
- Widget configurations (position, size, provider, etc.)

## Usage

To use multiple floating widgets:

1. Navigate to the Floating Widgets page
2. Add widgets for different API providers
3. Arrange and resize widgets as needed
4. Save the configuration as a preset for future use
5. Switch between different layouts (free, grid, line)

## Future Improvements

1. **Widget Templates**: Pre-defined widget templates for common monitoring scenarios
2. **Widget Groups**: Group related widgets together
3. **Advanced Layouts**: More layout options (vertical, cascading, etc.)
4. **Widget Themes**: Additional themes and customization options
5. **Widget Sharing**: Share widget configurations between users

## Technical Notes

- Widgets use CSS glassmorphism for a modern, translucent appearance
- Resize functionality uses custom resize handlers
- Layout calculations account for screen boundaries
- Widget state is persisted in localStorage
- Touch events are supported for mobile devices
