
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface StepContentProps {
  visible: boolean;
  children: React.ReactNode;
}

const StepContent: React.FC<StepContentProps> = ({ visible, children }) => {
  return (
    <AnimatePresence mode="wait">
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StepContent;
