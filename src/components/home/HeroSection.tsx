
import React from 'react';
import { motion } from 'framer-motion';
import SizeConverter from '@/components/SizeConverter';

const HeroSection: React.FC = () => {
  return (
    <section className="pt-20 md:pt-24 pb-16 px-4">
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4 leading-tight">
              Find Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">Perfect Size</span> in Any Brand
            </h1>
            <p className="text-base md:text-lg text-gray-600 max-w-xl mx-auto">
              Shop with confidence using our size converter that translates your measurements across different brands and regions.
            </p>
          </motion.div>
          
          {/* Size Converter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg p-6 mb-16"
          >
            <SizeConverter />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
