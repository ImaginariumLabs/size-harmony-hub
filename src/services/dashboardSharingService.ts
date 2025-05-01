import { DashboardWidget } from '../contexts/DashboardWidgetContext';
import { AdvancedWidgetType, AdvancedWidgetConfig } from '../components/widgets/AdvancedWidgetFactory';

/**
 * Interface for dashboard configuration
 */
export interface DashboardConfig {
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  author?: string;
  widgets: DashboardWidget[];
  advancedWidgets: Array<{
    id: string;
    type: AdvancedWidgetType;
    config: AdvancedWidgetConfig;
  }>;
  layout?: 'standard' | 'draggable';
}

/**
 * Export dashboard configuration to JSON
 *
 * @param name Dashboard name
 * @param description Dashboard description
 * @param widgets Standard widgets
 * @param advancedWidgets Advanced widgets
 * @param layout Layout type
 * @returns Dashboard configuration as JSON string
 */
export const exportDashboardConfig = (
  name: string,
  description: string,
  widgets: DashboardWidget[],
  advancedWidgets: Array<{
    id: string;
    type: AdvancedWidgetType;
    config: AdvancedWidgetConfig;
  }>,
  layout: 'standard' | 'draggable' = 'standard'
): string => {
  const config: DashboardConfig = {
    name,
    description,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    widgets,
    advancedWidgets,
    layout,
  };

  return JSON.stringify(config, null, 2);
};

/**
 * Import dashboard configuration from JSON
 *
 * @param jsonConfig Dashboard configuration as JSON string
 * @returns Parsed dashboard configuration
 * @throws Error if JSON is invalid
 */
export const importDashboardConfig = (jsonConfig: string): DashboardConfig => {
  try {
    const config = JSON.parse(jsonConfig) as DashboardConfig;

    // Validate required fields
    if (!config.name || !Array.isArray(config.widgets)) {
      throw new Error('Invalid dashboard configuration: missing required fields');
    }

    // Ensure advancedWidgets is an array
    if (!Array.isArray(config.advancedWidgets)) {
      config.advancedWidgets = [];
    }

    // Update timestamps
    config.updatedAt = new Date().toISOString();

    return config;
  } catch (error) {
    throw new Error(`Failed to parse dashboard configuration: ${error instanceof Error ? error.message : String(error)}`);
  }
};

/**
 * Generate a file name for the exported dashboard configuration
 *
 * @param dashboardName Dashboard name
 * @returns File name
 */
export const generateExportFileName = (dashboardName: string): string => {
  const sanitizedName = dashboardName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  return `apiwidget_dashboard_${sanitizedName}_${timestamp}.json`;
};

/**
 * Download dashboard configuration as a JSON file
 *
 * @param config Dashboard configuration as JSON string
 * @param fileName File name
 */
export const downloadDashboardConfig = (config: string, fileName: string): void => {
  const blob = new Blob([config], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

/**
 * Read dashboard configuration from a file
 *
 * @param file File object
 * @returns Promise that resolves to the file content as string
 */
export const readDashboardConfigFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      if (event.target?.result) {
        resolve(event.target.result as string);
      } else {
        reject(new Error('Failed to read file'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };

    reader.readAsText(file);
  });
};
