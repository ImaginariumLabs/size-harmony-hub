# Widget Configuration Presets

This document explains the implementation of widget configuration presets in APIwidget.

## Overview

Widget configuration presets allow users to save and restore widget configurations, including positions, sizes, and provider information. This feature enables users to create different widget layouts for different monitoring scenarios and switch between them easily.

## Implementation Details

### Data Structure

Widget configuration presets are stored in localStorage with the following structure:

```typescript
export interface WidgetConfig {
  id: string;
  providerId: string;
  type: 'cost' | 'usage' | 'requests';
  size: 'small' | 'medium' | 'large';
  position: { x: number; y: number };
  isVisible: boolean;
  customSize?: { width: number; height: number };
}

export interface WidgetPreset {
  id: string;
  name: string;
  widgets: WidgetConfig[];
  layout: 'free' | 'grid' | 'line';
  createdAt: string;
}
```

### DashboardWidgetContext

The DashboardWidgetContext manages widget configurations and presets:

```typescript
export interface DashboardWidgetContextType {
  widgets: WidgetConfig[];
  addWidget: (config: Partial<WidgetConfig>) => void;
  removeWidget: (id: string) => void;
  updateWidget: (id: string, updates: Partial<WidgetConfig>) => void;
  getWidgetById: (id: string) => WidgetConfig | undefined;
  presets: WidgetPreset[];
  savePreset: (name: string) => void;
  loadPreset: (presetId: string) => void;
  deletePreset: (presetId: string) => void;
  currentLayout: 'free' | 'grid' | 'line';
  setCurrentLayout: (layout: 'free' | 'grid' | 'line') => void;
}
```

### Saving Presets

The `savePreset` function creates a new preset with the current widget configurations:

```typescript
const savePreset = (name: string) => {
  const newPreset: WidgetPreset = {
    id: uuidv4(),
    name,
    widgets: [...widgets],
    layout: currentLayout,
    createdAt: new Date().toISOString()
  };
  
  const updatedPresets = [...presets, newPreset];
  setPresets(updatedPresets);
  localStorage.setItem('widget_presets', JSON.stringify(updatedPresets));
};
```

### Loading Presets

The `loadPreset` function restores a saved preset:

```typescript
const loadPreset = (presetId: string) => {
  const preset = presets.find(p => p.id === presetId);
  if (!preset) return;
  
  setWidgets(preset.widgets);
  setCurrentLayout(preset.layout);
  localStorage.setItem('widget_configs', JSON.stringify(preset.widgets));
  localStorage.setItem('widget_layout', preset.layout);
};
```

### Deleting Presets

The `deletePreset` function removes a saved preset:

```typescript
const deletePreset = (presetId: string) => {
  const updatedPresets = presets.filter(p => p.id !== presetId);
  setPresets(updatedPresets);
  localStorage.setItem('widget_presets', JSON.stringify(updatedPresets));
};
```

## FloatingWidgetManager Component

The FloatingWidgetManager component provides the UI for managing presets:

```typescript
export const FloatingWidgetManager: React.FC = () => {
  const { 
    widgets, 
    addWidget, 
    presets, 
    savePreset, 
    loadPreset, 
    deletePreset,
    currentLayout,
    setCurrentLayout
  } = useContext(DashboardWidgetContext);
  
  const [presetName, setPresetName] = useState('');
  const [selectedPresetId, setSelectedPresetId] = useState('');
  
  const handleSavePreset = () => {
    if (!presetName) return;
    savePreset(presetName);
    setPresetName('');
  };
  
  const handleLoadPreset = () => {
    if (!selectedPresetId) return;
    loadPreset(selectedPresetId);
  };
  
  const handleDeletePreset = (id: string) => {
    deletePreset(id);
    if (selectedPresetId === id) {
      setSelectedPresetId('');
    }
  };
  
  // Render UI for managing presets
};
```

## User Interface

The preset management UI includes:

1. **Preset List**: Displays all saved presets with their names and creation dates
2. **Save Preset Form**: Allows users to enter a name and save the current configuration
3. **Load Preset Controls**: Allows users to select and load a saved preset
4. **Delete Preset Controls**: Allows users to delete saved presets
5. **Layout Controls**: Allows users to switch between different layout modes

## Layout Modes

The preset system supports three layout modes:

1. **Free Layout**: Widgets can be positioned anywhere on the screen
2. **Grid Layout**: Widgets are arranged in a grid pattern
3. **Line Layout**: Widgets are arranged in a horizontal line at the bottom of the screen

The layout mode is stored as part of the preset and is applied when the preset is loaded.

## Widget Positioning

Widget positions are calculated based on the selected layout mode:

```typescript
const calculateWidgetPosition = (index: number, layout: 'free' | 'grid' | 'line') => {
  if (layout === 'free') {
    // Use stored position for free layout
    return widget.position;
  } else if (layout === 'grid') {
    // Calculate grid position
    const columns = 3;
    const row = Math.floor(index / columns);
    const col = index % columns;
    return {
      x: col * (WIDGET_WIDTH + GRID_GAP) + GRID_MARGIN,
      y: row * (WIDGET_HEIGHT + GRID_GAP) + GRID_MARGIN
    };
  } else if (layout === 'line') {
    // Calculate line position
    return {
      x: index * (WIDGET_WIDTH + LINE_GAP) + LINE_MARGIN,
      y: window.innerHeight - WIDGET_HEIGHT - LINE_MARGIN
    };
  }
};
```

## Persistence

Widget configurations and presets are persisted in localStorage to ensure they are available across sessions:

- `widget_configs`: Stores the current widget configurations
- `widget_presets`: Stores all saved presets
- `widget_layout`: Stores the current layout mode

## Benefits

Widget configuration presets provide several benefits:

1. **Flexibility**: Users can create different layouts for different monitoring scenarios
2. **Efficiency**: Users can quickly switch between different configurations
3. **Customization**: Users can customize their monitoring experience
4. **Persistence**: Configurations are saved across sessions

## Future Improvements

1. **Cloud Sync**: Sync presets across devices
2. **Preset Sharing**: Share presets with other users
3. **Preset Templates**: Pre-defined templates for common monitoring scenarios
4. **Preset Categories**: Organize presets into categories
5. **Preset Scheduling**: Automatically switch presets based on time or events
