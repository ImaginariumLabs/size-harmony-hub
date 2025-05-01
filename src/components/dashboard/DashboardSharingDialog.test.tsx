import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import DashboardSharingDialog from './DashboardSharingDialog';
import * as dashboardSharingService from '../../services/dashboardSharingService';

// Mock the dashboard sharing service
vi.mock('../../services/dashboardSharingService', () => ({
  exportDashboardConfig: vi.fn(() => '{"name":"Test Dashboard"}'),
  importDashboardConfig: vi.fn(() => ({
    name: 'Imported Dashboard',
    widgets: [],
    advancedWidgets: [],
  })),
  generateExportFileName: vi.fn(() => 'test-dashboard.json'),
  downloadDashboardConfig: vi.fn(),
  readDashboardConfigFile: vi.fn(() => Promise.resolve('{"name":"Imported Dashboard"}')),
}));

describe('DashboardSharingDialog', () => {
  const mockProps = {
    open: true,
    onClose: vi.fn(),
    widgets: [
      {
        id: 'widget-1',
        providerId: 'openai',
        type: 'usage',
        size: 'small',
        isVisible: true,
      },
    ],
    advancedWidgets: [
      {
        id: 'advanced-widget-1',
        type: 'comparison',
        config: {
          title: 'API Comparison',
          providers: ['openai', 'claude'],
        },
      },
    ],
    layout: 'standard' as const,
    onImport: vi.fn(),
  };

  it('renders export tab by default', () => {
    render(<DashboardSharingDialog {...mockProps} />);
    
    expect(screen.getByText('Export Dashboard Configuration')).toBeInTheDocument();
    expect(screen.getByLabelText('Dashboard Name')).toBeInTheDocument();
  });

  it('switches to import tab when clicked', () => {
    render(<DashboardSharingDialog {...mockProps} />);
    
    fireEvent.click(screen.getByText('Import'));
    
    expect(screen.getByText('Import Dashboard Configuration')).toBeInTheDocument();
  });

  it('generates export when button is clicked', () => {
    render(<DashboardSharingDialog {...mockProps} />);
    
    fireEvent.change(screen.getByLabelText('Dashboard Name'), {
      target: { value: 'Test Dashboard' },
    });
    
    fireEvent.click(screen.getByText('Generate Export'));
    
    expect(dashboardSharingService.exportDashboardConfig).toHaveBeenCalled();
    expect(screen.getByText('Exported Configuration')).toBeInTheDocument();
  });

  it('downloads JSON when button is clicked', () => {
    render(<DashboardSharingDialog {...mockProps} />);
    
    fireEvent.click(screen.getByText('Download JSON'));
    
    expect(dashboardSharingService.exportDashboardConfig).toHaveBeenCalled();
    expect(dashboardSharingService.downloadDashboardConfig).toHaveBeenCalled();
  });

  it('shows dashboard summary with widget counts', () => {
    render(<DashboardSharingDialog {...mockProps} />);
    
    expect(screen.getByText('1 Standard Widgets')).toBeInTheDocument();
    expect(screen.getByText('1 Advanced Widgets')).toBeInTheDocument();
    expect(screen.getByText('Standard Layout')).toBeInTheDocument();
  });

  it('calls onImport when a file is imported successfully', async () => {
    render(<DashboardSharingDialog {...mockProps} />);
    
    fireEvent.click(screen.getByText('Import'));
    
    const fileInput = screen.getByLabelText(/Drag & drop a JSON file/i);
    const file = new File(['{"name":"Imported Dashboard"}'], 'dashboard.json', {
      type: 'application/json',
    });
    
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    // Wait for the import to complete
    await screen.findByText('Dashboard configuration imported successfully!');
    
    expect(dashboardSharingService.readDashboardConfigFile).toHaveBeenCalled();
    expect(dashboardSharingService.importDashboardConfig).toHaveBeenCalled();
    expect(mockProps.onImport).toHaveBeenCalled();
  });
});
