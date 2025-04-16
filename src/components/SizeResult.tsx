
import React, { useState } from 'react';
import { ShareIcon, UserCircle, Save, Check, LogIn, ArrowLeftRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useShare } from '@/contexts/converter/useShare';
import { SizeResultType } from '@/contexts/converter/types';
import SaveMeasurements from './SaveMeasurements';
import { motion } from 'framer-motion';

interface SizeResultProps {
  result: SizeResultType;
  brand: string;
  clothingType: string;
  bust: string;
  measurementType: string;
  units: string;
  onSaveToHistory?: () => Promise<void>;
  showLoginPrompt?: () => void;
  isLoggedIn?: boolean;
}

const SizeResult: React.FC<SizeResultProps> = ({ 
  result, 
  brand, 
  clothingType,
  bust,
  measurementType,
  units,
  onSaveToHistory,
  showLoginPrompt,
  isLoggedIn = false
}) => {
  const { shareResults } = useShare();
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  if (!result) return null;

  const handleSaveHistory = async () => {
    if (!isLoggedIn && showLoginPrompt) {
      showLoginPrompt();
      return;
    }

    setIsSaving(true);
    try {
      if (onSaveToHistory) {
        await onSaveToHistory();
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="p-4 bg-primary/5 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">Your Size in {brand}</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-white rounded-md shadow-sm">
            <div className="text-xs text-gray-500 mb-1">US</div>
            <div className="text-xl font-bold">{result.usSize}</div>
          </div>
          <div className="text-center p-3 bg-white rounded-md shadow-sm">
            <div className="text-xs text-gray-500 mb-1">UK</div>
            <div className="text-xl font-bold">{result.ukSize}</div>
          </div>
          <div className="text-center p-3 bg-white rounded-md shadow-sm">
            <div className="text-xs text-gray-500 mb-1">EU</div>
            <div className="text-xl font-bold">{result.euSize}</div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Button
          onClick={() => shareResults(result, brand, clothingType)}
          variant="outline"
          className="w-full flex items-center gap-2"
        >
          <ShareIcon className="h-4 w-4" />
          Share Result
        </Button>

        {!isLoggedIn ? (
          <Button 
            onClick={showLoginPrompt}
            variant="outline"
            className="w-full flex items-center gap-2"
          >
            <LogIn className="h-4 w-4" />
            Sign In to Save
          </Button>
        ) : (
          <>
            <Button 
              onClick={handleSaveHistory}
              variant={isSaved ? "outline" : "outline"}
              className={`w-full flex items-center gap-2 ${isSaved ? "bg-green-50 text-green-600" : "bg-primary/5 hover:bg-primary/10"}`}
            >
              {isSaved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
              {isSaved ? "Saved to History" : "Save to History"}
            </Button>

            <SaveMeasurements 
              bust={bust}
              measurementType={measurementType}
              units={units}
            />
          </>
        )}
      </div>

      <div className="text-xs text-gray-500 mt-2 italic text-center">
        Note: Sizes may vary slightly between different styles.
      </div>
    </div>
  );
};

export default SizeResult;
