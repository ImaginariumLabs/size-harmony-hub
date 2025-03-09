
import React from 'react';
import ImportExportGuidelines from './import-export/ImportExportGuidelines';
import ExportSection from './import-export/ExportSection';
import ImportSection from './import-export/ImportSection';
import CsvFormatExample from './import-export/CsvFormatExample';

const ImportExportTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Import & Export</h2>
      </div>
      
      <ImportExportGuidelines />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ExportSection />
        <ImportSection />
      </div>
      
      <CsvFormatExample />
    </div>
  );
};

export default ImportExportTab;
