
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info } from 'lucide-react';

interface OfflineModeIndicatorProps {
  isOfflineMode?: boolean;
}

const OfflineModeIndicator: React.FC<OfflineModeIndicatorProps> = ({ isOfflineMode = true }) => {
  if (!isOfflineMode) return null;
  
  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="mb-4 p-2 bg-amber-50 border border-amber-200 text-amber-700 rounded-md text-sm flex items-center"
      >
        <Info className="h-5 w-5 mr-2" />
        <span>Offline Mode: Using estimated sizes</span>
      </motion.div>
    </AnimatePresence>
  );
};

export default OfflineModeIndicator;
