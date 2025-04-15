
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { RefreshCw, Database, Check } from 'lucide-react';
import { syncSizeDataWithSupabase } from '@/services/sizing/syncService';

const SyncFromStaticData = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const handleSync = async () => {
    try {
      setIsLoading(true);
      setIsSuccess(false);
      
      const result = await syncSizeDataWithSupabase();
      
      if (result.success) {
        setIsSuccess(true);
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
        
        <p className="text-xs text-muted-foreground mt-4">
          This will populate the database with sample size data from the static file.
          Use this to quickly set up the application for testing.
        </p>
      </CardContent>
    </Card>
  );
};

export default SyncFromStaticData;
