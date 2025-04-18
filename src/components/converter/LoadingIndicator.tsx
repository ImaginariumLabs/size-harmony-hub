
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface LoadingIndicatorProps {
  loading?: boolean;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ loading = true }) => {
  // Add a small delay before showing the loading indicator to prevent flickering
  const [showLoader, setShowLoader] = useState(false);
  
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (loading) {
      // Show loader after a small delay to prevent flickering
      timer = setTimeout(() => {
        setShowLoader(true);
      }, 400); // Slightly longer delay to prevent rapid loading states
    } else {
      // Immediately hide when loading is finished
      setShowLoader(false);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [loading]);
  
  return (
    <AnimatePresence>
      {showLoader && (
        <motion.div 
          key="loader"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className="w-full flex justify-center my-6"
        >
          <div className="relative">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary/70 border-t-transparent"></div>
            <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-4 w-4 text-primary/60" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingIndicator;
