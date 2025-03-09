
import React from 'react';
import { Check, AlertCircle } from 'lucide-react';

interface ImportResultsProps {
  results: {
    total: number;
    success: number;
    errors: string[];
  } | null;
}

const ImportResults: React.FC<ImportResultsProps> = ({ results }) => {
  if (!results) return null;

  return (
    <div className="mt-4 p-4 bg-gray-50 rounded-md">
      <div className="flex items-center mb-2">
        {results.errors.length === 0 ? (
          <Check className="h-5 w-5 text-green-500 mr-2" />
        ) : (
          <AlertCircle className="h-5 w-5 text-yellow-500 mr-2" />
        )}
        <h4 className="font-medium">Import Results</h4>
      </div>
      
      <p className="text-sm text-muted-foreground mb-2">
        Successfully imported {results.success} of {results.total} records.
      </p>
      
      {results.errors.length > 0 && (
        <div className="mt-2">
          <div className="text-sm font-medium text-red-500 mb-1">Errors:</div>
          <div className="max-h-32 overflow-y-auto text-xs bg-white p-2 rounded border">
            {results.errors.map((error, index) => (
              <div key={index} className="mb-1 text-red-500">{error}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImportResults;
