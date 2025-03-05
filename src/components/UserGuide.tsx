
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp, Ruler, Sparkles, Info, ShoppingBag } from 'lucide-react';

const UserGuide: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="w-full max-w-2xl mx-auto mt-12">
      <motion.div 
        className="glass-card overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <div 
          className="p-4 cursor-pointer flex items-center justify-between"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center text-primary">
            <Info className="h-5 w-5 mr-2" />
            <h3 className="font-medium">How to Use the Size Converter</h3>
          </div>
          <button className="p-1 rounded-full hover:bg-gray-100">
            {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>
        </div>
        
        {isOpen && (
          <motion.div 
            className="p-6 pt-0 border-t border-gray-100"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex">
                  <div className="flex-shrink-0 h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-medium mr-3">1</div>
                  <div>
                    <h4 className="font-medium mb-1">Select Clothing Type</h4>
                    <p className="text-sm text-muted-foreground">Choose between tops, bottoms, or dresses to get started.</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0 h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-medium mr-3">2</div>
                  <div>
                    <h4 className="font-medium mb-1">Choose a Brand</h4>
                    <p className="text-sm text-muted-foreground">Select the brand you're shopping from. Each brand has its own unique sizing.</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0 h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-medium mr-3">3</div>
                  <div>
                    <h4 className="font-medium mb-1">Enter Your Measurement</h4>
                    <p className="text-sm text-muted-foreground">Input your body measurement (in inches or cm) to find your perfect size.</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0 h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-medium mr-3">4</div>
                  <div>
                    <h4 className="font-medium mb-1">Get Your Size</h4>
                    <p className="text-sm text-muted-foreground">See your size in US, UK, and EU standards instantly.</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="bg-amber-50 rounded-lg p-4">
                  <h4 className="font-medium flex items-center mb-2 text-amber-800">
                    <Ruler className="h-4 w-4 mr-2 text-amber-600" />
                    Measurement Tips
                  </h4>
                  <ul className="text-sm text-amber-700 space-y-2">
                    <li className="flex items-start">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 mr-2" /> Use a soft measuring tape for accuracy
                    </li>
                    <li className="flex items-start">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 mr-2" /> Measure directly against your body, not over clothes
                    </li>
                    <li className="flex items-start">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 mr-2" /> Keep the tape level and snug, but not tight
                    </li>
                    <li className="flex items-start">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 mr-2" /> For bust, measure at the fullest point
                    </li>
                    <li className="flex items-start">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 mr-2" /> For waist, measure at the narrowest point
                    </li>
                  </ul>
                </div>
                
                <div className="bg-primary/5 rounded-lg p-4">
                  <h4 className="font-medium flex items-center mb-2 text-primary">
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Shopping Confidence
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    With your perfect size, shop with confidence across different brands and reduce the likelihood of returns due to sizing issues.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default UserGuide;
