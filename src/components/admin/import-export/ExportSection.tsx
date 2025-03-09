
import React, { useState } from 'react';
import { FileSpreadsheet, Download } from 'lucide-react';
import { toast } from 'sonner';
import { exportSizeDataToCSV } from '../../../services/sizingService';
import { Button } from '../../ui/button';

const ExportSection: React.FC = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [brandFilter, setBrandFilter] = useState('');
  const [garmentFilter, setGarmentFilter] = useState('');

  const handleExport = async () => {
    try {
      setIsExporting(true);
      
      const csvContent = await exportSizeDataToCSV(
        brandFilter || undefined, 
        garmentFilter || undefined
      );
      
      // Create a download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Create filename with date for better organization
      const date = new Date().toISOString().split('T')[0];
      const filename = `size_data_${brandFilter || 'all'}_${date}.csv`;
      
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Export successful", {
        description: "Size data has been exported to CSV",
      });
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error("Export failed", {
        description: (error as Error).message || "An error occurred during export",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center mb-4">
        <FileSpreadsheet className="h-6 w-6 text-primary mr-2" />
        <h3 className="text-lg font-medium">Export Size Data</h3>
      </div>
      
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm text-muted-foreground mb-1">Brand Filter (Optional)</label>
          <input
            type="text"
            value={brandFilter}
            onChange={(e) => setBrandFilter(e.target.value)}
            className="w-full p-2 border rounded-md"
            placeholder="Enter brand name to filter"
          />
        </div>
        
        <div>
          <label className="block text-sm text-muted-foreground mb-1">Garment Filter (Optional)</label>
          <input
            type="text"
            value={garmentFilter}
            onChange={(e) => setGarmentFilter(e.target.value)}
            className="w-full p-2 border rounded-md"
            placeholder="Enter garment type to filter"
          />
        </div>
      </div>
      
      <Button
        onClick={handleExport}
        disabled={isExporting}
        className="w-full"
        variant="default"
      >
        {isExporting ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-t-transparent mr-2"></div>
            <span>Exporting...</span>
          </>
        ) : (
          <>
            <Download className="h-4 w-4 mr-2" />
            <span>Export to CSV</span>
          </>
        )}
      </Button>
    </div>
  );
};

export default ExportSection;
