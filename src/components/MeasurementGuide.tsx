
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Ruler, X, ChevronDown, ChevronUp } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface MeasurementGuideProps {
  measurementType?: string;
}

const MeasurementGuide: React.FC<MeasurementGuideProps> = ({ measurementType = 'bust' }) => {
  const [isOpen, setIsOpen] = useState(false);

  const bustInstructions = [
    "Wear a well-fitted bra without padding.",
    "Stand straight with your arms relaxed at your sides.",
    "Wrap the measuring tape around the fullest part of your bust.",
    "Keep the tape parallel to the ground and snug but not tight.",
    "Take a deep breath and then measure while exhaling normally."
  ];

  const waistInstructions = [
    "Remove or lift clothing that might add bulk to your waist.",
    "Stand straight with your feet together.",
    "Find your natural waistline - the narrowest part of your torso.",
    "Wrap the measuring tape around your waist, keeping it parallel to the floor.",
    "Measure after exhaling normally, without sucking in your stomach."
  ];

  const hipsInstructions = [
    "Stand with your feet together.",
    "Wrap the tape around the fullest part of your hips and buttocks.",
    "Keep the tape level all the way around your body.",
    "The tape should be snug but not tight enough to cause indentation."
  ];

  const getInstructions = () => {
    switch (measurementType) {
      case 'bust': return bustInstructions;
      case 'waist': return waistInstructions;
      case 'hips': return hipsInstructions;
      default: return bustInstructions;
    }
  };

  const getTitle = () => {
    switch (measurementType) {
      case 'bust': return "How to Measure Your Bust";
      case 'waist': return "How to Measure Your Waist";
      case 'hips': return "How to Measure Your Hips";
      default: return "Measurement Guide";
    }
  };

  const getImageSrc = () => {
    switch (measurementType) {
      case 'bust': return "/measurement-bust.png";
      case 'waist': return "/measurement-waist.png";
      case 'hips': return "/measurement-hips.png";
      default: return "/measurement-bust.png";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-1 text-sm"
        >
          <Ruler className="h-3.5 w-3.5" />
          Guide
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Ruler className="h-5 w-5" />
            {getTitle()}
          </DialogTitle>
          <DialogDescription>
            Follow these steps for an accurate measurement
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue={measurementType || "bust"} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="bust">Bust</TabsTrigger>
            <TabsTrigger value="waist">Waist</TabsTrigger>
            <TabsTrigger value="hips">Hips</TabsTrigger>
          </TabsList>
          
          <TabsContent value="bust" className="space-y-4">
            <div className="rounded-md overflow-hidden bg-gray-50 p-4 text-center">
              <img 
                src="/measurement-bust.png" 
                alt="How to measure bust" 
                className="h-48 object-contain mx-auto"
                onError={(e) => {
                  e.currentTarget.src = "https://placehold.co/300x200/e6e6e6/7c3aed?text=Bust+Measurement&font=open-sans";
                }}
              />
            </div>
            <ol className="space-y-2">
              {bustInstructions.map((step, index) => (
                <motion.li 
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-medium">
                    {index + 1}
                  </div>
                  <span className="text-gray-700">{step}</span>
                </motion.li>
              ))}
            </ol>
          </TabsContent>
          
          <TabsContent value="waist" className="space-y-4">
            <div className="rounded-md overflow-hidden bg-gray-50 p-4 text-center">
              <img 
                src="/measurement-waist.png" 
                alt="How to measure waist" 
                className="h-48 object-contain mx-auto"
                onError={(e) => {
                  e.currentTarget.src = "https://placehold.co/300x200/e6e6e6/7c3aed?text=Waist+Measurement&font=open-sans";
                }}
              />
            </div>
            <ol className="space-y-2">
              {waistInstructions.map((step, index) => (
                <motion.li 
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-medium">
                    {index + 1}
                  </div>
                  <span className="text-gray-700">{step}</span>
                </motion.li>
              ))}
            </ol>
          </TabsContent>
          
          <TabsContent value="hips" className="space-y-4">
            <div className="rounded-md overflow-hidden bg-gray-50 p-4 text-center">
              <img 
                src="/measurement-hips.png" 
                alt="How to measure hips" 
                className="h-48 object-contain mx-auto"
                onError={(e) => {
                  e.currentTarget.src = "https://placehold.co/300x200/e6e6e6/7c3aed?text=Hips+Measurement&font=open-sans";
                }}
              />
            </div>
            <ol className="space-y-2">
              {hipsInstructions.map((step, index) => (
                <motion.li 
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-medium">
                    {index + 1}
                  </div>
                  <span className="text-gray-700">{step}</span>
                </motion.li>
              ))}
            </ol>
          </TabsContent>
        </Tabs>
        
        <div className="mt-4 bg-amber-50 p-3 rounded-md">
          <p className="text-sm text-amber-800">
            <strong>Tip:</strong> For the most accurate results, have someone else take your measurements if possible.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MeasurementGuide;
