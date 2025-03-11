
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import ImportSection from './import-export/ImportSection';
import ExportSection from './import-export/ExportSection';
import CsvFormatExample from './import-export/CsvFormatExample';
import ImportExportGuidelines from './import-export/ImportExportGuidelines';
import DataImporter from './DataImporter';

const ImportExportTab = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Import & Export</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs defaultValue="import">
            <TabsList className="mb-4">
              <TabsTrigger value="import">Import</TabsTrigger>
              <TabsTrigger value="export">Export</TabsTrigger>
              <TabsTrigger value="format">Format Guide</TabsTrigger>
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
          <ImportExportGuidelines />
        </div>
      </div>
    </div>
  );
};

export default ImportExportTab;
