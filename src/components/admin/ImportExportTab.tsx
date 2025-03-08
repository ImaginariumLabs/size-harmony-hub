
import React, { useState } from 'react';
import { FileSpreadsheet, Download, Upload, AlertCircle, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { exportSizeDataToCSV, importSizeDataFromCSV } from '../../services/sizingService';

const ImportExportTab: React.FC = () => {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [brandFilter, setBrandFilter] = useState('');
  const [garmentFilter, setGarmentFilter] = useState('');
  const [importResults, setImportResults] = useState<{ total: number; success: number; errors: string[] } | null>(null);

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
      link.setAttribute('download', 'size_data.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Export successful",
        description: "Size data has been exported to CSV",
        variant: "default"
      });
    } catch (error) {
      console.error('Error exporting data:', error);
      toast({
        title: "Export failed",
        description: (error as Error).message || "An error occurred during export",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      setImportResults(null);
    }
  };

  const handleImport = async () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a CSV file to import",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsImporting(true);
      
      // Read the file
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const csvContent = e.target?.result as string;
          
          // Import the data
          const results = await importSizeDataFromCSV(csvContent);
          setImportResults(results);
          
          if (results.errors.length === 0) {
            toast({
              title: "Import successful",
              description: `Successfully imported ${results.success} size records`,
              variant: "default"
            });
          } else {
            toast({
              title: "Import completed with errors",
              description: `Imported ${results.success} of ${results.total} records`,
              variant: "default"
            });
          }
        } catch (error) {
          console.error('Error importing data:', error);
          toast({
            title: "Import failed",
            description: (error as Error).message || "An error occurred during import",
            variant: "destructive"
          });
        } finally {
          setIsImporting(false);
        }
      };
      
      reader.readAsText(selectedFile);
    } catch (error) {
      console.error('Error reading file:', error);
      toast({
        title: "Import failed",
        description: (error as Error).message || "An error occurred reading the file",
        variant: "destructive"
      });
      setIsImporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Import & Export</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Export Section */}
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
          
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center justify-center w-full py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
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
          </button>
        </div>
        
        {/* Import Section */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center mb-4">
            <Upload className="h-6 w-6 text-primary mr-2" />
            <h3 className="text-lg font-medium">Import Size Data</h3>
          </div>
          
          <div className="space-y-4 mb-6">
            <div className="border-2 border-dashed border-gray-200 rounded-md p-4 text-center">
              <label className="block cursor-pointer">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="flex flex-col items-center">
                  <FileSpreadsheet className="h-10 w-10 text-gray-400 mb-2" />
                  <span className="text-sm text-muted-foreground">
                    {selectedFile ? selectedFile.name : "Click to select a CSV file"}
                  </span>
                  {selectedFile && (
                    <span className="text-xs text-gray-500 mt-1">
                      {(selectedFile.size / 1024).toFixed(2)} KB
                    </span>
                  )}
                </div>
              </label>
            </div>
          </div>
          
          <button
            onClick={handleImport}
            disabled={!selectedFile || isImporting}
            className={`flex items-center justify-center w-full py-2 rounded-md transition-colors ${
              !selectedFile
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-primary text-white hover:bg-primary/90'
            }`}
          >
            {isImporting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-t-transparent mr-2"></div>
                <span>Importing...</span>
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                <span>Import from CSV</span>
              </>
            )}
          </button>
          
          {/* Import Results */}
          {importResults && (
            <div className="mt-4 p-4 bg-gray-50 rounded-md">
              <div className="flex items-center mb-2">
                {importResults.errors.length === 0 ? (
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-yellow-500 mr-2" />
                )}
                <h4 className="font-medium">Import Results</h4>
              </div>
              
              <p className="text-sm text-muted-foreground mb-2">
                Successfully imported {importResults.success} of {importResults.total} records.
              </p>
              
              {importResults.errors.length > 0 && (
                <div className="mt-2">
                  <div className="text-sm font-medium text-red-500 mb-1">Errors:</div>
                  <div className="max-h-32 overflow-y-auto text-xs bg-white p-2 rounded border">
                    {importResults.errors.map((error, index) => (
                      <div key={index} className="mb-1 text-red-500">{error}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImportExportTab;
