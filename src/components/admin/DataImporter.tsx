
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Database, Upload, Check, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { importAllSizeDataToSupabase } from '@/utils/sizeDataService';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

const DataImporter: React.FC = () => {
  const [isImporting, setIsImporting] = useState(false);
  const [importStats, setImportStats] = useState<{
    success?: boolean;
    brands?: number;
    sizeRanges?: number;
    message?: string;
  } | null>(null);

  const handleImport = async () => {
    setIsImporting(true);
    setImportStats(null);
    
    try {
      const result = await importAllSizeDataToSupabase();
      
      if (result.success) {
        toast.success("Brand data imported successfully");
        setImportStats({
          success: true,
          brands: result.details?.brands || 0,
          sizeRanges: result.details?.sizeRanges || 0,
          message: result.message
        });
      } else {
        toast.error(result.message);
        setImportStats({
          success: false,
          message: result.message
        });
      }
    } catch (error) {
      toast.error("Failed to import data");
      console.error("Import error:", error);
      setImportStats({
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" /> 
          Data Import Helper
        </CardTitle>
        <CardDescription>
          Populate Supabase with initial size data for brands like H&M, Zara, ASOS, and Mango
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {isImporting ? (
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        ) : importStats ? (
          <div className="space-y-3">
            <div className={`p-3 rounded-lg flex items-start gap-3 ${
              importStats.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}>
              {importStats.success ? (
                <Check className="h-5 w-5 mt-0.5" />
              ) : (
                <AlertCircle className="h-5 w-5 mt-0.5" />
              )}
              <div>
                <p className="font-medium">{importStats.success ? 'Import Successful' : 'Import Failed'}</p>
                <p className="text-sm mt-1">{importStats.message}</p>
                {importStats.success && (
                  <ul className="text-sm mt-2 space-y-1">
                    <li>• Brands: {importStats.brands}</li>
                    <li>• Size ranges: {importStats.sizeRanges}</li>
                  </ul>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              This utility will import standard size data from the built-in dataset to your Supabase database.
              This is useful when setting up the application for the first time.
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-700">
              Note: Existing data with the same name will be updated. This is a safe operation that won't duplicate data.
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={handleImport} 
          disabled={isImporting}
          className="w-full"
        >
          {isImporting ? (
            <>Importing Data...</>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" /> 
              Import Size Data to Supabase
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DataImporter;
