
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Database, RefreshCw } from 'lucide-react';
import { syncSizeDataWithSupabase } from '@/services/sizing/syncService';
import { toast } from 'sonner';

const SyncFromStaticData = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncResults, setSyncResults] = useState<{ 
    success: boolean; 
    brands?: number; 
    sizeRanges?: number; 
    errors?: string[] 
  } | null>(null);

  const handleSync = async () => {
    setIsSyncing(true);
    setSyncResults(null);
    
    try {
      const result = await syncSizeDataWithSupabase();
      
      if (result.success) {
        toast.success("Data synchronized successfully");
        setSyncResults({
          success: true,
          brands: result.details?.brands || 0,
          sizeRanges: result.details?.sizeRanges || 0,
          errors: result.details?.errors || []
        });
      } else {
        toast.error(result.message);
        setSyncResults({
          success: false,
          errors: [result.error || 'Unknown error']
        });
      }
    } catch (error) {
      toast.error("Failed to sync data");
      setSyncResults({
        success: false,
        errors: [error instanceof Error ? error.message : String(error)]
      });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center mb-4">
        <Database className="h-5 w-5 text-primary mr-2" />
        <h3 className="text-base font-medium">Sync Static Data</h3>
      </div>
      
      <div className="space-y-4 mb-6">
        <p className="text-sm text-gray-600">
          This tool will synchronize the built-in static size data to your Supabase database.
          It's useful for setting up initial size data quickly.
        </p>
        
        {syncResults && (
          <div className={`p-3 rounded-lg ${syncResults.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            <div className="font-medium mb-1">
              {syncResults.success ? 'Sync Successful' : 'Sync Failed'}
            </div>
            
            {syncResults.success && (
              <div className="text-sm">
                <p>Processed:</p>
                <ul className="list-disc pl-5 mt-1">
                  <li>Brands: {syncResults.brands}</li>
                  <li>Size Ranges: {syncResults.sizeRanges}</li>
                </ul>
              </div>
            )}
            
            {syncResults.errors && syncResults.errors.length > 0 && (
              <div className="mt-2">
                <div className="text-sm font-medium">Errors ({syncResults.errors.length}):</div>
                <div className="mt-1 max-h-32 overflow-y-auto text-xs">
                  {syncResults.errors.slice(0, 5).map((error, index) => (
                    <div key={index} className="mb-1">• {error}</div>
                  ))}
                  {syncResults.errors.length > 5 && (
                    <div className="italic">...and {syncResults.errors.length - 5} more errors</div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      <Button
        onClick={handleSync}
        disabled={isSyncing}
        variant="default"
        className="w-full"
      >
        {isSyncing ? (
          <>
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            Syncing Data...
          </>
        ) : (
          <>
            <RefreshCw className="mr-2 h-4 w-4" />
            Sync Static Data with Database
          </>
        )}
      </Button>
    </div>
  );
};

export default SyncFromStaticData;
