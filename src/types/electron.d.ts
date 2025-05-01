interface ElectronAPI {
  // Window management
  toggleMainWindow: () => Promise<void>;
  closeWidget: () => Promise<void>;
  toggleWidgetVisibility: () => Promise<boolean>;
  minimizeWindow: () => Promise<boolean>;
  maximizeWindow: () => Promise<boolean>;
  closeWindow: () => Promise<boolean>;
  isWindowMaximized: () => Promise<boolean>;

  // API key management
  getApiKey: (provider: string) => Promise<string | null>;
  saveApiKey: (provider: string, key: string) => Promise<boolean>;
  deleteApiKey: (provider: string) => Promise<boolean>;

  // API data
  getApiCost: (provider?: string) => Promise<{
    total: number;
    change: number;
    changeType: 'increase' | 'decrease';
    usagePercentage?: number;
  }>;
  getAllApiCosts: () => Promise<Record<string, {
    total: number;
    change: number;
    changeType: 'increase' | 'decrease';
    usagePercentage?: number;
  }>>;

  // Settings management
  getSettings: () => Promise<Record<string, unknown>>;
  saveSettings: (settings: Record<string, unknown>) => Promise<boolean>;
  getSetting: (key: string) => Promise<unknown>;
  setSetting: (key: string, value: unknown) => Promise<boolean>;

  // App management
  getAppSettings: () => Promise<Record<string, unknown>>;
  saveAppSettings: (settings: Record<string, unknown>) => Promise<boolean>;
  setStartWithSystem: (enabled: boolean) => Promise<boolean>;

  // System information
  getDisplays: () => Promise<DisplayInfo[]>;
  getCurrentDisplay: () => Promise<DisplayInfo>;

  // Floating widgets
  createFloatingWidget: (options: FloatingWidgetOptions) => Promise<number>;
  closeFloatingWidget: (id: number) => Promise<boolean>;
  updateFloatingWidget: (id: number, options: Partial<FloatingWidgetOptions>) => Promise<boolean>;
  getFloatingWidgets: () => Promise<FloatingWidget[]>;

  // Utility
  isElectron: boolean;
  getVersion: () => Promise<string>;
  openExternal: (url: string) => Promise<boolean>;

  // Debugging
  debug: (data: DebugData | unknown) => Promise<{ received: boolean; message: unknown }>;
}

// Display information interface
interface DisplayInfo {
  id: number;
  bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  workArea: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  scaleFactor: number;
  rotation: number;
  internal: boolean;
  touchSupport: string;
}

// Webkit app region type for Electron
type WebkitAppRegion = 'drag' | 'no-drag';

// Extend CSSProperties to include WebkitAppRegion
declare module '@mui/material/styles' {
  interface CSSProperties {
    WebkitAppRegion?: WebkitAppRegion;
  }
}

/**
 * Options for creating a floating widget
 */
interface FloatingWidgetOptions {
  /**
   * The title of the floating widget
   */
  title: string;

  /**
   * The URL or HTML content to display in the floating widget
   */
  content: string;

  /**
   * Whether the content is a URL or HTML
   */
  contentType: 'url' | 'html';

  /**
   * The width of the floating widget
   */
  width: number;

  /**
   * The height of the floating widget
   */
  height: number;

  /**
   * The x position of the floating widget
   */
  x?: number;

  /**
   * The y position of the floating widget
   */
  y?: number;

  /**
   * Whether the floating widget is always on top
   */
  alwaysOnTop?: boolean;

  /**
   * Whether the floating widget is resizable
   */
  resizable?: boolean;

  /**
   * Whether the floating widget has a frame
   */
  frame?: boolean;

  /**
   * Whether the floating widget is transparent
   */
  transparent?: boolean;

  /**
   * Whether the floating widget is visible
   */
  visible?: boolean;

  /**
   * The provider associated with the floating widget
   */
  provider?: string;
}

/**
 * A floating widget instance
 */
interface FloatingWidget extends FloatingWidgetOptions {
  /**
   * The ID of the floating widget
   */
  id: number;

  /**
   * The creation timestamp of the floating widget
   */
  createdAt: string;

  /**
   * The last update timestamp of the floating widget
   */
  updatedAt: string;
}

/**
 * Debug data for sending to the main process
 */
interface DebugData {
  /**
   * The component that is sending the debug information
   */
  component: string;

  /**
   * The event that triggered the debug information
   */
  event: string;

  /**
   * Additional data to include in the debug information
   */
  data?: Record<string, unknown>;

  /**
   * Allow for any additional properties
   */
  [key: string]: unknown;
}

interface Window {
  electronAPI?: ElectronAPI;
}
