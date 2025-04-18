
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ImportSection from './import-export/ImportSection';
import ExportSection from './import-export/ExportSection';
import CsvFormatExample from './import-export/CsvFormatExample';
import ImportExportGuidelines from './import-export/ImportExportGuidelines';
import DataImporter from './DataImporter';
import SyncFromStaticData from './import-export/SyncFromStaticData';
import { AlertTriangle, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const ImportExportTab = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Import & Export</h2>
      
      <Alert variant="default" className="bg-blue-50 border-blue-200 text-blue-800">
        <Info className="h-4 w-4 text-blue-500" />
        <AlertTitle>Data Management</AlertTitle>
        <AlertDescription className="text-blue-700">
          This section allows you to import and export size data, and sync with the built-in demo data.
          Use the tabs below to manage your size data.
        </AlertDescription>
      </Alert>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs defaultValue="import">
            <TabsList className="mb-4 w-full">
              <TabsTrigger value="import" className="flex-1">Import</TabsTrigger>
              <TabsTrigger value="export" className="flex-1">Export</TabsTrigger>
              <TabsTrigger value="format" className="flex-1">Format Guide</TabsTrigger>
            </TabsList>
          
            <TabsContent value="import">
              <ImportSection />
            </TabsContent>
            
            <TabsContent value="export">
              <ExportSection />
            </TabsContent>
            
            <TabsContent value="format">
              <CsvFormatExample />
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="space-y-6">
          <DataImporter />
          <SyncFromStaticData />
          <ImportExportGuidelines />
        </div>
      </div>
    </div>
  );
};

export default ImportExportTab;
