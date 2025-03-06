
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  onClick: () => void;
}

const BackButton: React.FC<BackButtonProps> = ({ onClick }) => {
  return (
    <motion.button
      onClick={onClick}
      className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <ArrowLeft className="h-4 w-4 mr-1" />
      Back
    </motion.button>
  );
};

export default BackButton;
