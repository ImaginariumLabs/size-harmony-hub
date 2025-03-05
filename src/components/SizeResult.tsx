
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SizeResultProps {
  result: {
    usSize: string;
    ukSize: string;
  } | null;
  brandName: string;
}

const SizeResult: React.FC<SizeResultProps> = ({ result, brandName }) => {
  if (!result) return null;

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
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-lg font-semibold">Your Size at {brandName}</h3>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm"
              >
                <div className="text-sm text-muted-foreground mb-1">US Size</div>
                <div className="text-4xl font-display">{result.usSize}</div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm"
              >
                <div className="text-sm text-muted-foreground mb-1">UK Size</div>
                <div className="text-4xl font-display">{result.ukSize}</div>
              </motion.div>
            </div>
            
            <motion.p 
              className="mt-6 text-sm text-center text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
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
