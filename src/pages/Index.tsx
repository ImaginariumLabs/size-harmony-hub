import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SizeConverter from '@/components/SizeConverter';
import Footer from '@/components/Footer';
import UserGuide from '@/components/UserGuide';
import { fetchBrands } from '@/services/sizing';
import Navbar from '@/components/Navbar';
import Loader2 from '@/components/Loader2';
import FeaturedBrands from '@/components/FeaturedBrands';
import { ArrowRight, Sparkles, Ruler, Share2, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchBrands();
      } catch (error) {
        console.error('Error loading initial data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Create random sparkles for the background
  const sparkles = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    size: Math.random() * 3 + 2,
    delay: Math.random() * 10,
    duration: Math.random() * 5 + 3
  }));
  
  return (
    <div className="min-h-screen overflow-hidden relative">
      {/* Enhanced background with more visible gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-100 via-white to-blue-100 z-[-2]"></div>
      
      {/* More visible grid overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20 z-[-1]"></div>
      
      {/* More vibrant background circles */}
      <div className="absolute -top-[10%] -right-[5%] w-[40%] h-[40%] rounded-full bg-purple-200/40 filter blur-[70px] z-[-1] animate-float-slow"></div>
      <div className="absolute top-[30%] -left-[5%] w-[30%] h-[30%] rounded-full bg-blue-200/30 filter blur-[70px] z-[-1] animate-float"></div>
      <div className="absolute -bottom-[5%] right-[10%] w-[25%] h-[25%] rounded-full bg-pink-200/30 filter blur-[70px] z-[-1] animate-float-reverse"></div>
      
      {/* Sparkle effects with improved visibility */}
      {sparkles.map((sparkle) => (
        <div 
          key={sparkle.id}
          className="absolute sparkle"
          style={{
            top: sparkle.top,
            left: sparkle.left,
            width: `${sparkle.size}px`,
            height: `${sparkle.size}px`,
            animationDelay: `${sparkle.delay}s`,
            animationDuration: `${sparkle.duration}s`
          }}
        />
      ))}
      
      <Navbar />
      
      {/* Add additional top padding to account for fixed navbar */}
      <main className="container mx-auto px-4 pt-28 pb-12">
        <section className="flex flex-col items-center justify-center text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12 fade-in-up"
          >
            {/* App Logo */}
            <div className="flex justify-center mb-6">
              <motion.div 
                className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white text-2xl font-bold shadow-lg"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Sparkles className="absolute w-8 h-8 -top-2 -right-2 text-yellow-300" />
                <span>SHH</span>
              </motion.div>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
              Size Harmony Hub
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Find your perfect size across different brands with our advanced size converter.
              No more guessing or returns due to sizing issues.
            </p>
            
            <div className="flex flex-wrap gap-3 mt-6 justify-center">
              <Button 
                variant="gradient" 
                roundedness="pill"
                size="lg"
                onClick={() => document.getElementById('converter')?.scrollIntoView({ behavior: 'smooth' })}
                className="group"
              >
                Start Converting <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                variant="outline" 
                roundedness="pill"
                size="lg"
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Learn How It Works
              </Button>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="w-full"
            id="converter"
          >
            <SizeConverter />
          </motion.div>
        </section>
        
        {isLoading ? (
          <div className="flex justify-center my-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <section className="mb-16">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-display font-semibold inline-block relative">
                  Popular Brands
                  <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
                </h2>
              </div>
              <FeaturedBrands />
            </section>
            
            <div id="how-it-works" className="scroll-mt-20">
              <UserGuide />
            </div>
            
            <div className="max-w-4xl mx-auto mt-16 mb-8 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <h2 className="text-2xl md:text-3xl font-display font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
                  Why Use Size Harmony Hub?
                </h2>
                <p className="text-muted-foreground mb-8">
                  Our size converter helps you shop with confidence across different brands.
                </p>
                
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="staggered-item glass-card p-6 transform transition-all duration-500 hover:translate-y-[-5px] hover:shadow-lg">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/20 to-purple-300/20 flex items-center justify-center mx-auto mb-4">
                      <Ruler className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-medium mb-2">Accurate Sizing</h3>
                    <p className="text-sm text-muted-foreground">
                      Our database contains precise measurements from popular brands to ensure accurate size recommendations.
                    </p>
                  </div>
                  
                  <div className="staggered-item glass-card p-6 transform transition-all duration-500 hover:translate-y-[-5px] hover:shadow-lg">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/20 to-purple-300/20 flex items-center justify-center mx-auto mb-4">
                      <Share2 className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-medium mb-2">Save Time</h3>
                    <p className="text-sm text-muted-foreground">
                      No more wasting time with returns or exchanges due to incorrect sizing when shopping online.
                    </p>
                  </div>
                  
                  <div className="staggered-item glass-card p-6 transform transition-all duration-500 hover:translate-y-[-5px] hover:shadow-lg">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/20 to-purple-300/20 flex items-center justify-center mx-auto mb-4">
                      <ShoppingBag className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-medium mb-2">Shop Confidently</h3>
                    <p className="text-sm text-muted-foreground">
                      Know your size before you buy, even when shopping from brands you've never tried before.
                    </p>
                  </div>
                </div>
                
                <div className="mt-12">
                  <Button 
                    variant="glow" 
                    size="xl"
                    roundedness="pill"
                    onClick={() => document.getElementById('converter')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    Try The Size Converter Now <ArrowRight className="ml-1" />
                  </Button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
