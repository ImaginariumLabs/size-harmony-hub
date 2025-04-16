
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface LoadingIndicatorProps {
  loading?: boolean;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ loading = true }) => {
  if (!loading) return null;
  
  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full flex justify-center my-6"
      >
        <div className="relative">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
          <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-4 w-4 text-primary/70" />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LoadingIndicator;
