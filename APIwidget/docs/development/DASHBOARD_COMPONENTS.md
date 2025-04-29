# Dashboard Components

This document explains the dashboard components and layout system used in APIwidget.

## Overview

The APIwidget dashboard provides a modern, responsive interface for monitoring API usage and costs. It uses a "Bento Grid" layout system inspired by 2025 UI/UX trends, with glass morphism effects for a modern look and feel.

## Dashboard Structure

The main dashboard is implemented in `src/pages/ModernDashboard.tsx` and consists of several key sections:

1. **Header Section**: Contains the dashboard title, refresh button, and action buttons
2. **Bento Grid Layout**: A responsive grid layout for displaying dashboard components
3. **Widget Section**: Displays user-configured widgets
4. **Multiview Display**: Optional section for displaying multiple API providers in a unified view
5. **Floating Action Button**: For quickly adding new widgets

## Bento Grid Layout

The Bento Grid is a modern, responsive grid layout system implemented in `src/styles/components/layout/BentoGrid.css`. It provides a flexible way to arrange dashboard components in a visually appealing manner.

### Grid Structure

```css
.bento-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-auto-rows: minmax(100px, auto);
  gap: 16px;
  width: 100%;
  margin-bottom: 24px;
}
```

### Grid Item Sizes

The grid supports different item sizes:

- **Small**: Spans 3 columns (4 on medium screens, full width on small screens)
- **Medium**: Spans 6 columns (6 on medium screens, full width on small screens)
- **Large**: Spans 9 columns (full width on medium and small screens)
- **Full**: Spans all 12 columns
- **Tall**: Spans 2 rows vertically

```css
.bento-item.small {
  grid-column: span 3;
  grid-row: span 1;
}

.bento-item.medium {
  grid-column: span 6;
  grid-row: span 1;
}

.bento-item.large {
  grid-column: span 9;
  grid-row: span 1;
}

.bento-item.full {
  grid-column: span 12;
  grid-row: span 1;
}

.bento-item.tall {
  grid-row: span 2;
}
```

### Responsive Behavior

The grid is fully responsive and adjusts based on screen size:

- **Desktop** (>1200px): Full 12-column grid
- **Tablet** (768px-1200px): Adjusted column spans
- **Mobile** (<768px): Reduced to 6 columns
- **Small Mobile** (<480px): Reduced to 4 columns with all items spanning full width

## Dashboard Components

### 1. ApiCostSummary

Displays the total API cost for the current month, including budget information and change from the previous period.

```typescript
interface ApiCostSummaryProps {
  totalCost: number;
  budget: number;
  changePercentage?: number;
  changeDirection?: 'increase' | 'decrease';
}
```

**Visual Features**:
- Large cost display with gradient text
- Change indicator (increase/decrease)
- Budget information
- Progress bar showing percentage of budget used

### 2. ApiRequestsSummary

Shows the total number of API requests made today, with comparison to the previous day.

```typescript
interface ApiRequestsSummaryProps {
  totalRequests: number;
  changePercentage?: number;
  changeDirection?: 'increase' | 'decrease';
}
```

**Visual Features**:
- Large request count display
- Change indicator (increase/decrease)
- Trend visualization

### 3. ApiStatusSummary

Displays the status of all configured API providers.

```typescript
interface ApiStatusSummaryProps {
  providers: Array<{
    id: string;
    name: string;
    status: 'healthy' | 'warning' | 'error';
    value?: string;
  }>;
}
```

**Visual Features**:
- Status indicators (green/yellow/red)
- Provider names
- Status values (e.g., response time, availability)

### 4. ActiveProvidersSummary

Shows the number of active API providers and provides a link to manage them.

```typescript
interface ActiveProvidersSummaryProps {
  providerCount: number;
  onManageClick: () => void;
}
```

**Visual Features**:
- Provider count display
- Management button
- Provider icons

### 5. AlertsSummary

Displays recent alerts and notifications related to API usage.

```typescript
interface AlertsSummaryProps {
  alerts: Array<{
    id: string;
    type: 'warning' | 'error' | 'info';
    message: string;
    timestamp: string;
  }>;
}
```

**Visual Features**:
- Alert type indicators
- Alert messages
- Timestamp information
- Dismissal options

### 6. RecentActivitySummary

Shows recent API activity in a chronological feed.

```typescript
interface RecentActivitySummaryProps {
  activities: ApiActivityItem[];
}

interface ApiActivityItem {
  id: string;
  description: string;
  timestamp: string;
  provider: string;
}
```

**Visual Features**:
- Activity feed with timestamps
- Provider indicators
- Activity descriptions

### 7. RealTimeApiUsage

Displays real-time API usage information for a specific provider or all providers.

```typescript
interface RealTimeApiUsageProps {
  provider?: string;
  refreshInterval?: number;
}
```

**Visual Features**:
- Real-time cost display
- Usage percentage
- Change indicators
- Auto-refresh functionality

## Dashboard Widgets

The dashboard supports user-configurable widgets that can be added, removed, and resized.

### DashboardWidget Component

The `DashboardWidget` component (`src/components/widgets/DashboardWidget.tsx`) is a container for displaying different types of widget content.

```typescript
interface DashboardWidgetProps {
  widget: DashboardWidgetType;
  onRemove: (id: string) => void;
  onSizeChange: (id: string, size: 'small' | 'medium' | 'large') => void;
  onToggleVisibility: (id: string) => void;
}

interface DashboardWidgetType {
  id: string;
  providerId: string;
  type: 'cost' | 'usage' | 'quota' | 'history';
  size: 'small' | 'medium' | 'large';
  position: { x: number; y: number };
  isVisible: boolean;
  customSize?: { width: number; height: number };
}
```

**Widget Types**:

1. **Cost Widget**: Displays the total cost for a specific API provider
   ```typescript
   <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
     <Typography variant="h3" component="div" sx={{ mb: 1 }}>
       ${providerData.total.toFixed(2)}
     </Typography>
     <Typography 
       variant="body1" 
       color={providerData.changeType === 'increase' ? 'error.main' : 'success.main'}
       sx={{ display: 'flex', alignItems: 'center' }}
     >
       {providerData.changeType === 'increase' ? '↑' : '↓'} ${providerData.change.toFixed(2)} ({(providerData.change / providerData.total * 100).toFixed(1)}%)
     </Typography>
     <Typography variant="caption" color="text.secondary" sx={{ mt: 2 }}>
       Updated just now
     </Typography>
   </Box>
   ```

2. **Usage Widget**: Displays the usage percentage for a specific API provider
   ```typescript
   <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
     <Typography variant="h3" component="div" sx={{ mb: 1 }}>
       65%
     </Typography>
     <Typography variant="body1" color="text.secondary">
       of monthly quota used
     </Typography>
     <Box sx={{ width: '80%', mt: 2, bgcolor: 'background.paper', borderRadius: 1, overflow: 'hidden' }}>
       <Box 
         sx={{ 
           height: 8, 
           width: '65%', 
           bgcolor: getProviderColor(widget.providerId),
           borderRadius: 1
         }} 
       />
     </Box>
   </Box>
   ```

3. **Quota Widget**: Displays the remaining quota for a specific API provider
4. **History Widget**: Displays historical usage data for a specific API provider

### Widget Management

Widgets are managed through the `DashboardWidgetContext` (`src/contexts/DashboardWidgetContext.tsx`), which provides the following functionality:

- **addWidget**: Adds a new widget to the dashboard
- **updateWidget**: Updates an existing widget's properties
- **removeWidget**: Removes a widget from the dashboard
- **toggleWidgetVisibility**: Toggles a widget's visibility

Widgets are stored in localStorage to persist between sessions:

```typescript
// Save widgets to storage whenever they change
useEffect(() => {
  if (!loading) {
    localStorage.setItem(DASHBOARD_WIDGETS_KEY, JSON.stringify(widgets));
  }
}, [widgets, loading]);
```

## Multiview Display

The `MultiviewDisplay` component provides a unified view of multiple API providers, allowing users to compare usage and costs across different providers.

```typescript
interface MultiviewDisplayProps {
  providers: string[];
  onClose: () => void;
}
```

## Styling and Theming

### Glass Morphism Effect

The dashboard uses a glass morphism effect for its components, creating a modern, translucent appearance:

```css
.bento-item {
  background: rgba(30, 30, 30, 0.7);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  overflow: hidden;
  position: relative;
}
```

### Animation Effects

The dashboard includes subtle animations to enhance the user experience:

```css
/* Animation for new items */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.bento-item {
  animation: fadeIn 0.5s ease forwards;
}

/* Staggered animation delay for grid items */
.bento-item:nth-child(1) { animation-delay: 0.1s; }
.bento-item:nth-child(2) { animation-delay: 0.2s; }
.bento-item:nth-child(3) { animation-delay: 0.3s; }
.bento-item:nth-child(4) { animation-delay: 0.4s; }
.bento-item:nth-child(5) { animation-delay: 0.5s; }
.bento-item:nth-child(6) { animation-delay: 0.6s; }
```

### Material UI Theme Customization

The dashboard uses a customized Material UI theme with the following overrides:

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
  // Additional overrides...
}
```

## Empty State

When no API providers are configured, the dashboard displays an empty state with a call to action:

```typescript
<Card sx={{ mb: 4, p: 2, textAlign: 'center', borderRadius: '16px', background: 'rgba(30, 30, 30, 0.7)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
  <CardContent>
    <Typography variant="h5" component="div" sx={{ mb: 2, fontWeight: 600 }}>
      Welcome to APIwidget!
    </Typography>
    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
      Get started by adding your first API key to monitor usage and costs.
    </Typography>
    <Button
      variant="contained"
      color="primary"
      size="large"
      onClick={() => handleNavigation('/settings/api-keys/new')}
      startIcon={<ApiIcon />}
    >
      Add Your First API Key
    </Button>
  </CardContent>
</Card>
```

## Loading State

When data is being loaded, the dashboard displays a loading indicator:

```typescript
<Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
  <CircularProgress />
</Box>
```

## Future Improvements

1. **Customizable Dashboard**: Allow users to customize the dashboard layout by dragging and dropping components
2. **Additional Widget Types**: Add more widget types for different metrics and visualizations
3. **Real-time Updates**: Implement WebSocket or Server-Sent Events for real-time updates
4. **Dashboard Presets**: Allow users to save and load dashboard configurations
5. **Advanced Filtering**: Add filtering options for time periods and specific metrics
6. **Export Functionality**: Allow users to export dashboard data in various formats

## References

- [Material UI Documentation](https://mui.com/material-ui/getting-started/)
- [CSS Grid Layout](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout)
- [Glass Morphism Design Trend](https://uxdesign.cc/glassmorphism-in-user-interfaces-1f39bb1308c9)
