
import React, { useState, useEffect } from 'react';
import { FileSpreadsheet, Download } from 'lucide-react';
import { toast } from 'sonner';
import { exportSizeDataToCSV, isSupabaseConnectedWithRetry } from '../../../services/sizingService';
import { Button } from '../../ui/button';

const ExportSection: React.FC = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [brandFilter, setBrandFilter] = useState('');
  const [garmentFilter, setGarmentFilter] = useState('');
  const [isOfflineMode, setIsOfflineMode] = useState(false);

  // Check connection status on component mount
  useEffect(() => {
    const checkConnection = async () => {
      const connected = await isSupabaseConnectedWithRetry();
      setIsOfflineMode(!connected);
    };
    checkConnection();
  }, []);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      
      // Mock data for offline mode
      if (isOfflineMode) {
        // Simulate progress
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Create a download link with sample data
        const sampleData = 
          "brand,garment,region,sizeLabel,measurementType,minValue,maxValue,unit\n" +
          "\"H&M\",\"tops\",\"US\",\"XS\",\"bust\",\"30\",\"32\",\"inches\"\n" +
          "\"H&M\",\"tops\",\"US\",\"S\",\"bust\",\"32\",\"34\",\"inches\"\n" +
          "\"H&M\",\"tops\",\"US\",\"M\",\"bust\",\"34\",\"36\",\"inches\"\n" +
          "\"Zara\",\"dresses\",\"UK\",\"8\",\"waist\",\"24\",\"26\",\"inches\"\n" +
          "\"Zara\",\"dresses\",\"UK\",\"10\",\"waist\",\"26\",\"28\",\"inches\"\n" +
          "\"Nike\",\"tops\",\"EU\",\"38\",\"bust\",\"33\",\"35\",\"inches\"\n" +
          "\"Nike\",\"tops\",\"EU\",\"40\",\"bust\",\"35\",\"37\",\"inches\"";
          
        const blob = new Blob([sampleData], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        
        // Create filename with date for better organization
        const date = new Date().toISOString().split('T')[0];
        const filename = `size_data_sample_${date}.csv`;
        
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast.info("Demo Mode Export", {
          description: "Sample data exported. Connect to database for actual data.",
        });
        
        setIsExporting(false);
        return;
      }
      
      // Real export for online mode
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
      
      {isOfflineMode && (
        <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mb-4 text-sm text-amber-800">
          <div className="flex items-start">
            <svg className="h-5 w-5 mr-2 mt-0.5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="font-medium">Demo Mode Active</p>
              <p className="mt-1">Sample data will be exported. Connect to database for actual data.</p>
            </div>
          </div>
        </div>
      )}
      
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
            <span>{isOfflineMode ? "Export Sample Data" : "Export to CSV"}</span>
          </>
        )}
      </Button>
    </div>
  );
};

export default ExportSection;
