
import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const features = [
  {
    title: "Accurate Conversions",
    description: "Our data-driven size converter uses real measurements to match your size across brands."
  },
  {
    title: "Save Your Sizes",
    description: "Create an account to save your measurements and quickly convert sizes for future shopping."
  },
  {
    title: "Brand Database",
    description: "We maintain size charts for hundreds of popular brands, updated regularly for accuracy."
  }
];

const FeaturesSection: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 container mx-auto"
    >
      {features.map((feature, index) => (
        <motion.div 
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 + 0.5 }}
          className="glass-card p-6"
        >
          <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
            <Check className="text-primary h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
          <p className="text-gray-600">{feature.description}</p>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default FeaturesSection;
