import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import SizeConverter from '@/components/SizeConverter';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FeaturedBrands from '@/components/FeaturedBrands';
import { motion } from 'framer-motion';
import { Ruler, Check, UserCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { user, signOut } = useAuth();
  
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

  return (
    <div className="min-h-screen flex flex-col">
      {/* Background effects */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-animated-gradient opacity-40"></div>
        <div className="absolute inset-0 grid-background"></div>
        <div className="floating-circle floating-circle-1"></div>
        <div className="floating-circle floating-circle-2"></div>
        <div className="floating-circle floating-circle-3"></div>
      </div>
      
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section with Integrated Converter */}
        <section className="pt-24 md:pt-32 pb-16 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 leading-tight">
                  Find Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">Perfect Size</span> in Any Brand
                </h1>
                <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-xl mx-auto">
                  Shop with confidence using our size converter that translates your measurements across different brands and regions.
                </p>
              </motion.div>
            </div>
            
            {/* Size Converter moved up */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="max-w-4xl mx-auto mb-16"
            >
              <SizeConverter />
            </motion.div>

            {/* Features Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16"
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
          </div>
        </section>
        
        {/* Featured Brands Section */}
        <section className="py-16 px-4 bg-white/80 backdrop-blur-sm">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-display font-bold mb-4">Brands We Support</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Our size converter works with hundreds of fashion brands worldwide.
              </p>
            </div>
            
            <FeaturedBrands />
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
