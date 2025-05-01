import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock window.electronAPI for tests
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'electronAPI', {
    value: {
      debug: vi.fn(),
      sendNotification: vi.fn(),
      openExternal: vi.fn(),
      getAppVersion: vi.fn().mockReturnValue('1.0.0'),
      getAppPath: vi.fn().mockReturnValue('/app/path'),
      getSystemInfo: vi.fn().mockReturnValue({
        platform: 'win32',
        arch: 'x64',
        version: '10.0.0',
      }),
      storeData: vi.fn(),
      getData: vi.fn(),
      clearData: vi.fn(),
      createFloatingWidget: vi.fn(),
      closeFloatingWidget: vi.fn(),
      updateFloatingWidget: vi.fn(),
      getFloatingWidgets: vi.fn().mockReturnValue([]),
      isElectron: vi.fn().mockReturnValue(true),
    },
    writable: true,
  });
}

// Mock environment detection
vi.mock('../utils/platformUtils', () => ({
  isElectron: vi.fn().mockReturnValue(false),
  isWeb: vi.fn().mockReturnValue(true),
  isMac: vi.fn().mockReturnValue(false),
  isWindows: vi.fn().mockReturnValue(true),
  isLinux: vi.fn().mockReturnValue(false),
  getEnvironmentName: vi.fn().mockReturnValue('web'),
}));

// Mock localStorage
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'localStorage', {
    value: {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    },
    writable: true,
  });
}

// Mock console methods to avoid cluttering test output
vi.spyOn(console, 'error').mockImplementation(() => {});
vi.spyOn(console, 'warn').mockImplementation(() => {});

// Cleanup after each test
afterEach(() => {
  vi.clearAllMocks();
});
