/**
 * Platform utilities for the APIwidget application
 * 
 * These utilities help determine the current platform (Electron, web, etc.)
 * and provide platform-specific functionality.
 */

import { isElectron } from '../services/electronService';

/**
 * Platform detection utilities
 */
export const isPlatform = {
  /**
   * Check if the application is running in Electron
   * @returns True if running in Electron
   */
  electron: (): boolean => {
    return isElectron();
  },

  /**
   * Check if the application is running in a web browser
   * @returns True if running in a web browser
   */
  web: (): boolean => {
    return !isElectron();
  },

  /**
   * Check if the application is running on Windows
   * @returns True if running on Windows
   */
  windows: (): boolean => {
    return navigator.userAgent.indexOf('Windows') !== -1;
  },

  /**
   * Check if the application is running on macOS
   * @returns True if running on macOS
   */
  mac: (): boolean => {
    return navigator.userAgent.indexOf('Mac') !== -1;
  },

  /**
   * Check if the application is running on Linux
   * @returns True if running on Linux
   */
  linux: (): boolean => {
    return navigator.userAgent.indexOf('Linux') !== -1;
  },

  /**
   * Check if the application is running in development mode
   * @returns True if running in development mode
   */
  development: (): boolean => {
    return import.meta.env.DEV;
  },

  /**
   * Check if the application is running in production mode
   * @returns True if running in production mode
   */
  production: (): boolean => {
    return import.meta.env.PROD;
  }
};

/**
 * Get the current platform name
 * @returns The platform name (electron, web)
 */
export const getPlatformName = (): string => {
  if (isPlatform.electron()) {
    return 'electron';
  }
  return 'web';
};

/**
 * Get the current operating system name
 * @returns The OS name (windows, mac, linux, unknown)
 */
export const getOSName = (): string => {
  if (isPlatform.windows()) {
    return 'windows';
  }
  if (isPlatform.mac()) {
    return 'mac';
  }
  if (isPlatform.linux()) {
    return 'linux';
  }
  return 'unknown';
};
