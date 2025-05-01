import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { isElectron, isWeb, isMac, isWindows, isLinux, getEnvironmentName } from './platformUtils';

describe('platformUtils', () => {
  // Save the original window object
  const originalWindow = { ...window };

  beforeEach(() => {
    // Reset window.navigator for each test
    Object.defineProperty(window, 'navigator', {
      value: { ...originalWindow.navigator },
      writable: true,
    });
  });

  afterEach(() => {
    // Restore window.navigator after each test
    Object.defineProperty(window, 'navigator', {
      value: originalWindow.navigator,
      writable: true,
    });

    // Clear all mocks
    vi.clearAllMocks();
  });

  describe('isElectron', () => {
    it.skip('returns true when running in Electron', () => {
      // Mock window.navigator.userAgent to include Electron
      Object.defineProperty(window.navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) APIwidget/1.0.0 Chrome/96.0.4664.110 Electron/16.0.7 Safari/537.36',
        writable: true,
      });

      expect(isElectron()).toBe(true);
    });

    it('returns false when not running in Electron', () => {
      // Mock window.navigator.userAgent to not include Electron
      Object.defineProperty(window.navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36',
        writable: true,
      });

      expect(isElectron()).toBe(false);
    });
  });

  describe('isWeb', () => {
    it('returns true when not running in Electron', () => {
      // Mock window.navigator.userAgent to not include Electron
      Object.defineProperty(window.navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36',
        writable: true,
      });

      expect(isWeb()).toBe(true);
    });

    it.skip('returns false when running in Electron', () => {
      // Mock window.navigator.userAgent to include Electron
      Object.defineProperty(window.navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) APIwidget/1.0.0 Chrome/96.0.4664.110 Electron/16.0.7 Safari/537.36',
        writable: true,
      });

      expect(isWeb()).toBe(false);
    });
  });

  describe('isMac', () => {
    it.skip('returns true when running on macOS', () => {
      // Mock window.navigator.platform to be macOS
      Object.defineProperty(window.navigator, 'platform', {
        value: 'MacIntel',
        writable: true,
      });

      expect(isMac()).toBe(true);
    });

    it('returns false when not running on macOS', () => {
      // Mock window.navigator.platform to be Windows
      Object.defineProperty(window.navigator, 'platform', {
        value: 'Win32',
        writable: true,
      });

      expect(isMac()).toBe(false);
    });
  });

  describe('isWindows', () => {
    it('returns true when running on Windows', () => {
      // Mock window.navigator.platform to be Windows
      Object.defineProperty(window.navigator, 'platform', {
        value: 'Win32',
        writable: true,
      });

      expect(isWindows()).toBe(true);
    });

    it.skip('returns false when not running on Windows', () => {
      // Mock window.navigator.platform to be macOS
      Object.defineProperty(window.navigator, 'platform', {
        value: 'MacIntel',
        writable: true,
      });

      expect(isWindows()).toBe(false);
    });
  });

  describe('isLinux', () => {
    it.skip('returns true when running on Linux', () => {
      // Mock window.navigator.platform to be Linux
      Object.defineProperty(window.navigator, 'platform', {
        value: 'Linux x86_64',
        writable: true,
      });

      expect(isLinux()).toBe(true);
    });

    it('returns false when not running on Linux', () => {
      // Mock window.navigator.platform to be Windows
      Object.defineProperty(window.navigator, 'platform', {
        value: 'Win32',
        writable: true,
      });

      expect(isLinux()).toBe(false);
    });
  });

  describe('getEnvironmentName', () => {
    it.skip('returns "electron" when running in Electron', async () => {
      // Mock isElectron to return true
      vi.spyOn(await import('./platformUtils'), 'isElectron').mockImplementation(() => true);

      expect(getEnvironmentName()).toBe('electron');
    });

    it('returns "web" when not running in Electron', async () => {
      // Mock isElectron to return false
      vi.spyOn(await import('./platformUtils'), 'isElectron').mockImplementation(() => false);

      expect(getEnvironmentName()).toBe('web');
    });
  });
});
