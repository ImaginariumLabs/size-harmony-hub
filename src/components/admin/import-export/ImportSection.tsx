
import React, { useState, useRef } from 'react';
import { FileSpreadsheet, Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import { importSizeDataFromCSV, isSupabaseConnectedWithRetry } from '../../../services/sizingService';
import { Button } from '../../ui/button';
import { Progress } from '../../ui/progress';
import ImportResults from './ImportResults';

const ImportSection: React.FC = () => {
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importResults, setImportResults] = useState<{ total: number; success: number; errors: string[] } | null>(null);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check connection status on component mount
  React.useEffect(() => {
    const checkConnection = async () => {
      const connected = await isSupabaseConnectedWithRetry();
      setIsOfflineMode(!connected);
    };
    checkConnection();
  }, []);

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

  const renderFileSize = (size: number) => {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
    return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handleImport = async () => {
    if (!selectedFile) {
      toast.error("No file selected", {
        description: "Please select a CSV file to import",
      });
      return;
    }
    
    if (isOfflineMode) {
      toast.warning("Demo Mode Active", {
        description: "Import is simulated in demo mode. Connect to database for actual imports.",
      });
      setIsImporting(true);
      setImportProgress(20);
      
      // Simulate progress in offline mode
      const progressInterval = setInterval(() => {
        setImportProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 300);
      
      // Simulate completion after 2 seconds
      setTimeout(() => {
        clearInterval(progressInterval);
        setImportProgress(100);
        
        // Mock results
        setImportResults({
          total: 10,
          success: 8,
          errors: [
            "Row 3: Demo mode - actual import not available",
            "Row 7: Demo mode - actual import not available"
          ]
        });
        
        toast.info("Demo Mode Import", {
          description: "Import simulation complete. Connect to database for actual imports."
        });
        
        setTimeout(() => {
          setIsImporting(false);
        }, 500);
      }, 2000);
      
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

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center mb-4">
        <Upload className="h-6 w-6 text-primary mr-2" />
        <h3 className="text-lg font-medium">Import Size Data</h3>
      </div>
      
      {isOfflineMode && (
        <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mb-4 text-sm text-amber-800">
          <div className="flex items-start">
            <svg className="h-5 w-5 mr-2 mt-0.5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="font-medium">Demo Mode Active</p>
              <p className="mt-1">Import is simulated in demo mode. Connect to database for actual imports.</p>
            </div>
          </div>
        </div>
      )}
      
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
            <span>{isOfflineMode ? "Simulate Import" : "Import from CSV"}</span>
          </>
        )}
      </Button>
      
      <ImportResults results={importResults} />
    </div>
  );
};

export default ImportSection;
