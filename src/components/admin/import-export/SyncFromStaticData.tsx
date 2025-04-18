
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { RefreshCw, Database, Check, AlertCircle } from 'lucide-react';
import { syncSizeDataWithSupabase } from '@/services/sizing/syncService';

const SyncFromStaticData = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [syncResult, setSyncResult] = useState<{
    brands?: number;
    sizeRanges?: number;
    errors?: string[];
  } | null>(null);
  
  const handleSync = async () => {
    try {
      setIsLoading(true);
      setIsSuccess(false);
      setSyncResult(null);
      
      const result = await syncSizeDataWithSupabase();
      
      if (result.success) {
        setIsSuccess(true);
        setSyncResult({
          brands: result.details?.brands || 0,
          sizeRanges: result.details?.sizeRanges || 0,
          errors: result.details?.errors || []
        });
        
        toast.success("Size data synchronized successfully", {
          description: `Synced ${result.details?.brands} brands and ${result.details?.sizeRanges} size ranges`
        });
      } else {
        toast.error("Failed to synchronize size data", {
          description: result.message || "Unknown error occurred"
        });
      }
    } catch (error) {
      console.error("Error syncing data:", error);
      toast.error("Error syncing data", {
        description: error instanceof Error ? error.message : "Unknown error occurred"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold mb-1">Sync Demo Data</h3>
            <p className="text-sm text-muted-foreground">
              Populate the database with sample size data for testing
            </p>
          </div>
          
          {isSuccess && (
            <div className="bg-green-100 text-green-700 p-1 rounded-full">
              <Check className="h-5 w-5" />
            </div>
          )}
        </div>
        
        <Button 
          className="w-full mt-2 flex gap-2 items-center"
          variant="outline"
          disabled={isLoading}
          onClick={handleSync}
        >
          {isLoading ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <Database className="h-4 w-4" />
          )}
          {isLoading ? "Synchronizing..." : "Sync Size Data"}
        </Button>
        
        {syncResult && syncResult.errors && syncResult.errors.length > 0 && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
            <div className="flex items-start">
              <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 mr-2" />
              <div className="text-sm text-amber-800">
                <p className="font-medium mb-1">Sync completed with warnings</p>
                <details className="mt-1">
                  <summary className="cursor-pointer text-amber-600">
                    {syncResult.errors.length} issue{syncResult.errors.length > 1 ? 's' : ''} found
                  </summary>
                  <ul className="mt-2 pl-4 list-disc text-xs space-y-1">
                    {syncResult.errors.slice(0, 5).map((error, i) => (
                      <li key={i}>{error}</li>
                    ))}
                    {syncResult.errors.length > 5 && (
                      <li>...and {syncResult.errors.length - 5} more</li>
                    )}
                  </ul>
                </details>
              </div>
            </div>
          </div>
        )}
        
        <p className="text-xs text-muted-foreground mt-4">
          This will populate the database with sample size data from the static file.
          Use this to quickly set up the application for testing.
        </p>
      </CardContent>
    </Card>
  );
};

export default SyncFromStaticData;
