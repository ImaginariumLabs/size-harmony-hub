
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Ruler } from 'lucide-react';
import { useSizeLookup } from '@/hooks/useSizeLookup';
import SizeLookupForm from './lookup/SizeLookupForm';
import SizeLookupResults from './lookup/SizeLookupResults';

const ReverseSizeLookup: React.FC = () => {
  const { sizeInfo, error, isLoading, lookupSize } = useSizeLookup();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Ruler className="h-5 w-5" />
          Reverse Size Lookup
        </CardTitle>
        <CardDescription>
          Enter a clothing size to find equivalent sizes and measurements
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <SizeLookupForm onLookupSize={lookupSize} />
          
          {error && (
            <p className="text-red-500 text-sm mt-2">{error}</p>
          )}
          
          {isLoading && (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          )}
          
          {sizeInfo && <SizeLookupResults sizeInfo={sizeInfo} />}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReverseSizeLookup;
