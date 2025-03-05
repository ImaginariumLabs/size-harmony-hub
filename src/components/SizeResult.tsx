
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2 } from 'lucide-react';

interface SizeResultProps {
  result: {
    usSize: string;
    ukSize: string;
    euSize: string;
  } | null;
  brandName: string;
  onShare: () => void;
}

const SizeResult: React.FC<SizeResultProps> = ({ result, brandName, onShare }) => {
  if (!result) return null;

  // Helper to determine if a size is a match or not
  const isSizeMatch = (size: string) => !size.includes('No exact match') && !size.includes('Not available');

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.5, ease: [0.19, 1.0, 0.22, 1.0] }}
        className="w-full mt-6"
      >
        <div className="glass-card overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-lg font-semibold">Your Size at {brandName}</h3>
            <button 
              onClick={onShare}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Share results"
            >
              <Share2 className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-3 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className={`rounded-xl p-4 border shadow-sm ${
                  isSizeMatch(result.usSize) 
                    ? 'bg-white border-gray-100' 
                    : 'bg-yellow-50 border-yellow-100'
                }`}
              >
                <div className="text-sm text-muted-foreground mb-1">US Size</div>
                <div className="text-3xl font-display">{result.usSize}</div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className={`rounded-xl p-4 border shadow-sm ${
                  isSizeMatch(result.ukSize) 
                    ? 'bg-white border-gray-100' 
                    : 'bg-yellow-50 border-yellow-100'
                }`}
              >
                <div className="text-sm text-muted-foreground mb-1">UK Size</div>
                <div className="text-3xl font-display">{result.ukSize}</div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className={`rounded-xl p-4 border shadow-sm ${
                  isSizeMatch(result.euSize) 
                    ? 'bg-white border-gray-100' 
                    : 'bg-yellow-50 border-yellow-100'
                }`}
              >
                <div className="text-sm text-muted-foreground mb-1">EU Size</div>
                <div className="text-3xl font-display">{result.euSize}</div>
              </motion.div>
            </div>
            
            <motion.p 
              className="mt-6 text-sm text-center text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Sizes are approximate and may vary based on the specific garment and fit.
            </motion.p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SizeResult;
