
import React from 'react';
import { motion } from 'framer-motion';
import SizeConverter from '../components/SizeConverter';
import { Sparkles } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen w-full">
      <div className="fixed top-0 left-0 w-full h-full bg-fashion-pattern opacity-20 -z-10" />
      <div className="fixed top-0 left-0 w-full h-full bg-gradient-to-br from-purple-50/80 to-pink-50/80 -z-10" />
      
      <div className="container px-4 py-12 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <motion.div 
            className="inline-flex items-center px-4 py-1 bg-primary/10 rounded-full text-primary text-sm font-medium mb-3"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Fashion Size Harmony
          </motion.div>
        </motion.div>
        
        <SizeConverter />
        
        <motion.footer
          className="text-center text-sm text-muted-foreground mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p>Designed with precision. Built for clarity.</p>
          
          {/* Ad Space */}
          <div className="mt-8 p-4 bg-white/50 rounded-lg border border-gray-200 shadow-sm">
            <p className="text-xs text-muted-foreground mb-1">ADVERTISEMENT</p>
            <div className="h-[90px] bg-gray-100 rounded flex items-center justify-center">
              <p className="text-sm text-gray-400">Ad Space (728x90)</p>
            </div>
          </div>
        </motion.footer>
      </div>
    </div>
  );
};

export default Index;
