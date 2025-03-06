
import React from 'react';
import { motion } from 'framer-motion';

interface ResetButtonProps {
  onClick: () => void;
}

const ResetButton: React.FC<ResetButtonProps> = ({ onClick }) => {
  return (
    <motion.div 
      className="mt-4 flex justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      <button
        onClick={onClick}
        className="text-sm text-muted-foreground hover:text-primary transition-colors"
      >
        Try another brand or measurement
      </button>
    </motion.div>
  );
};

export default ResetButton;
