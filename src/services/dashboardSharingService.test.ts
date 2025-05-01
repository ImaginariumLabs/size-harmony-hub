import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  exportDashboardConfig,
  importDashboardConfig,
  generateExportFileName,
  downloadDashboardConfig,
  readDashboardConfigFile,
} from './dashboardSharingService';

describe('dashboardSharingService', () => {
  // Mock data
  const mockWidgets = [
    {
      id: 'widget-1',
      providerId: 'openai',
      type: 'usage',
      size: 'small',
      isVisible: true,
    },
  ];
  
  const mockAdvancedWidgets = [
    {
      id: 'advanced-widget-1',
      type: 'comparison',
      config: {
        title: 'API Comparison',
        providers: ['openai', 'claude'],
      },
    },
  ];

  // Mock global objects
  beforeEach(() => {
    // Mock URL.createObjectURL and URL.revokeObjectURL
    global.URL.createObjectURL = vi.fn(() => 'mock-url');
    global.URL.revokeObjectURL = vi.fn();
    
    // Mock document.createElement and related methods
    const mockAnchor = {
      href: '',
      download: '',
      click: vi.fn(),
    };
    
    global.document.createElement = vi.fn(() => mockAnchor as any);
    global.document.body.appendChild = vi.fn();
    global.document.body.removeChild = vi.fn();
  });

  describe('exportDashboardConfig', () => {
    it('exports dashboard config as JSON string', () => {
      const result = exportDashboardConfig(
        'Test Dashboard',
        'Test Description',
        mockWidgets,
        mockAdvancedWidgets,
        'standard'
      );
      
      const parsed = JSON.parse(result);
      
      expect(parsed.name).toBe('Test Dashboard');
      expect(parsed.description).toBe('Test Description');
      expect(parsed.widgets).toEqual(mockWidgets);
      expect(parsed.advancedWidgets).toEqual(mockAdvancedWidgets);
      expect(parsed.layout).toBe('standard');
      expect(parsed.createdAt).toBeDefined();
      expect(parsed.updatedAt).toBeDefined();
    });
  });

  describe('importDashboardConfig', () => {
    it('imports valid dashboard config', () => {
      const jsonConfig = JSON.stringify({
        name: 'Imported Dashboard',
        description: 'Imported Description',
        widgets: mockWidgets,
        advancedWidgets: mockAdvancedWidgets,
        layout: 'draggable',
        createdAt: '2025-06-01T00:00:00.000Z',
      });
      
      const result = importDashboardConfig(jsonConfig);
      
      expect(result.name).toBe('Imported Dashboard');
      expect(result.description).toBe('Imported Description');
      expect(result.widgets).toEqual(mockWidgets);
      expect(result.advancedWidgets).toEqual(mockAdvancedWidgets);
      expect(result.layout).toBe('draggable');
      expect(result.createdAt).toBe('2025-06-01T00:00:00.000Z');
      expect(result.updatedAt).toBeDefined(); // Should be updated
    });

    it('throws error for invalid JSON', () => {
      expect(() => importDashboardConfig('invalid-json')).toThrow();
    });

    it('throws error for missing required fields', () => {
      expect(() => importDashboardConfig('{}')).toThrow();
    });

    it('initializes advancedWidgets as empty array if missing', () => {
      const jsonConfig = JSON.stringify({
        name: 'Minimal Dashboard',
        widgets: mockWidgets,
      });
      
      const result = importDashboardConfig(jsonConfig);
      
      expect(result.advancedWidgets).toEqual([]);
    });
  });

  describe('generateExportFileName', () => {
    it('generates file name with sanitized dashboard name', () => {
      const result = generateExportFileName('My Test Dashboard!');
      
      expect(result).toMatch(/apiwidget_dashboard_my_test_dashboard_.*\.json/);
    });
  });

  describe('downloadDashboardConfig', () => {
    it('creates and clicks a download link', () => {
      downloadDashboardConfig('{"name":"Test"}', 'test.json');
      
      expect(global.URL.createObjectURL).toHaveBeenCalled();
      expect(document.createElement).toHaveBeenCalledWith('a');
      expect(document.body.appendChild).toHaveBeenCalled();
      expect(document.body.removeChild).toHaveBeenCalled();
      expect(global.URL.revokeObjectURL).toHaveBeenCalled();
    });
  });

  describe('readDashboardConfigFile', () => {
    it('reads file content as text', async () => {
      const mockFile = new File(['{"name":"Test"}'], 'test.json', {
        type: 'application/json',
      });
      
      const mockFileReader = {
        onload: null,
        onerror: null,
        readAsText: vi.fn(function(this: any) {
          this.result = '{"name":"Test"}';
          this.onload({ target: this });
        }),
      };
      
      global.FileReader = vi.fn(() => mockFileReader) as any;
      
      const result = await readDashboardConfigFile(mockFile);
      
      expect(result).toBe('{"name":"Test"}');
      expect(mockFileReader.readAsText).toHaveBeenCalledWith(mockFile);
    });

    it('rejects when file reading fails', async () => {
      const mockFile = new File([''], 'test.json');
      
      const mockFileReader = {
        onload: null,
        onerror: null,
        readAsText: vi.fn(function(this: any) {
          this.onerror(new Error('Read error'));
        }),
      };
      
      global.FileReader = vi.fn(() => mockFileReader) as any;
      
      await expect(readDashboardConfigFile(mockFile)).rejects.toThrow();
    });
  });
});
