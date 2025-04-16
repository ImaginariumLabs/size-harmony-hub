
import React from 'react';
import { motion } from 'framer-motion';

interface ResetButtonProps {
  onClick: () => void;
  visible?: boolean;
}

const ResetButton: React.FC<ResetButtonProps> = ({ onClick, visible = true }) => {
  if (!visible) return null;

  return (
    <motion.button
      onClick={onClick}
      className="text-sm text-muted-foreground hover:text-primary transition-colors"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      Try another brand or measurement
    </motion.button>
  );
};

export default ResetButton;
