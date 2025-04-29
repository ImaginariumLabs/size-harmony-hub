import { isElectron } from '../services/electronService';

/**
 * Utility functions to detect the current platform
 */
export const isPlatform = {
  /**
   * Check if the application is running in Electron
   * @returns {boolean} True if running in Electron
   */
  electron: (): boolean => isElectron(),
  
  /**
   * Check if the application is running in a web browser (not Electron)
   * @returns {boolean} True if running in a web browser
   */
  web: (): boolean => !isElectron()
};
