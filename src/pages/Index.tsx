
import React from 'react';
import { motion } from 'framer-motion';
import SizeConverter from '../components/SizeConverter';

const Index = () => {
  return (
    <div className="min-h-screen w-full grid-background">
      <div className="fixed top-0 left-0 w-full h-full bg-gradient-to-br from-blue-50 to-purple-50 opacity-70 -z-10" />
      
      <div className="container px-4 py-12 md:py-24">
        <SizeConverter />
        
        <motion.footer
          className="text-center text-sm text-muted-foreground mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p>Designed with precision. Built for clarity.</p>
        </motion.footer>
      </div>
    </div>
  );
};

export default Index;
