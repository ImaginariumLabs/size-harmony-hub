
import React, { useState, useRef } from 'react';
import { FileSpreadsheet, Download, Upload, AlertCircle, Check, Info, X } from 'lucide-react';
import { toast } from 'sonner';
import { exportSizeDataToCSV, importSizeDataFromCSV } from '../../services/sizingService';
import { Button } from '../ui/button';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Progress } from '../ui/progress';

const ImportExportTab: React.FC = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [brandFilter, setBrandFilter] = useState('');
  const [garmentFilter, setGarmentFilter] = useState('');
  const [importResults, setImportResults] = useState<{ total: number; success: number; errors: string[] } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      setImportResults(null);
    }
  };

  const resetFileInput = () => {
    setSelectedFile(null);
    setImportResults(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleImport = async () => {
    if (!selectedFile) {
      toast.error("No file selected", {
        description: "Please select a CSV file to import",
      });
      return;
    }
    
    try {
      setIsImporting(true);
      setImportProgress(10); // Start progress
      
      // Read the file
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const csvContent = e.target?.result as string;
          setImportProgress(30); // Reading complete
          
          // Import the data
          const results = await importSizeDataFromCSV(csvContent);
          setImportProgress(100); // Import complete
          setImportResults(results);
          
          if (results.errors.length === 0) {
            toast.success("Import successful", {
              description: `Successfully imported ${results.success} size records`,
            });
          } else {
            toast.warning("Import completed with errors", {
              description: `Imported ${results.success} of ${results.total} records`,
            });
          }
        } catch (error) {
          console.error('Error importing data:', error);
          toast.error("Import failed", {
            description: (error as Error).message || "An error occurred during import",
          });
        } finally {
          setTimeout(() => {
            setIsImporting(false);
            setImportProgress(0);
          }, 500);
        }
      };
      
      reader.onprogress = (e) => {
        if (e.lengthComputable) {
          const percentLoaded = Math.round((e.loaded / e.total) * 20) + 10; // 10-30% range for reading
          setImportProgress(percentLoaded);
        }
      };
      
      reader.readAsText(selectedFile);
    } catch (error) {
      console.error('Error reading file:', error);
      toast.error("Import failed", {
        description: (error as Error).message || "An error occurred reading the file",
      });
      setIsImporting(false);
      setImportProgress(0);
    }
  };

  const renderFileSize = (size: number) => {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
    return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Import & Export</h2>
      </div>
      
      <Alert className="bg-primary/5 border-primary/20">
        <Info className="h-4 w-4 text-primary" />
        <AlertTitle>CSV Import/Export Guidelines</AlertTitle>
        <AlertDescription className="text-sm">
          <p className="mb-2">
            The CSV file should include the following columns: brand, garment, region, sizeLabel, 
            measurementType, minValue, maxValue, and unit (optional, defaults to cm).
          </p>
          <p>
            Import will add new size data and update existing entries if the brand, garment, region, 
            size label, and measurement type combination already exists.
          </p>
        </AlertDescription>
      </Alert>
      
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
        
        {/* Import Section */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center mb-4">
            <Upload className="h-6 w-6 text-primary mr-2" />
            <h3 className="text-lg font-medium">Import Size Data</h3>
          </div>
          
          <div className="space-y-4 mb-6">
            <div className="relative">
              <div className={`border-2 border-dashed ${selectedFile ? 'border-primary' : 'border-gray-200'} rounded-md p-4 text-center transition-colors hover:bg-gray-50`}>
                <label className="block cursor-pointer">
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="hidden"
                    ref={fileInputRef}
                  />
                  <div className="flex flex-col items-center">
                    <FileSpreadsheet className={`h-10 w-10 ${selectedFile ? 'text-primary' : 'text-gray-400'} mb-2`} />
                    <span className="text-sm text-muted-foreground">
                      {selectedFile ? selectedFile.name : "Click to select a CSV file"}
                    </span>
                    {selectedFile && (
                      <span className="text-xs text-gray-500 mt-1">
                        {renderFileSize(selectedFile.size)}
                      </span>
                    )}
                  </div>
                </label>
              </div>
              
              {selectedFile && (
                <button 
                  className="absolute top-2 right-2 rounded-full p-1 bg-gray-100 hover:bg-gray-200 transition-colors"
                  onClick={resetFileInput}
                >
                  <X className="h-4 w-4 text-gray-500" />
                </button>
              )}
            </div>
            
            {isImporting && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Importing data...</span>
                  <span>{importProgress}%</span>
                </div>
                <Progress value={importProgress} className="h-2" />
              </div>
            )}
          </div>
          
          <Button
            onClick={handleImport}
            disabled={!selectedFile || isImporting}
            className="w-full"
            variant={!selectedFile ? "outline" : "default"}
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
          </Button>
          
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
      
      <div className="bg-white rounded-lg shadow-sm border p-4 mt-4">
        <h3 className="text-sm font-medium flex items-center mb-2">
          <Info className="h-4 w-4 mr-2 text-primary" />
          CSV Format Example
        </h3>
        <div className="bg-gray-50 p-3 rounded text-xs font-mono overflow-x-auto">
          brand,garment,region,sizeLabel,measurementType,minValue,maxValue,unit<br/>
          "H&M","tops","US","S","bust",84,88,"cm"<br/>
          "H&M","tops","US","S","waist",68,72,"cm"<br/>
          "Zara","dresses","UK","10","bust",90,94,"cm"
        </div>
      </div>
    </div>
  );
};

export default ImportExportTab;
