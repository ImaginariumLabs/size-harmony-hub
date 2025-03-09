
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SizeConverter from '@/components/SizeConverter';
import Footer from '@/components/Footer';
import UserGuide from '@/components/UserGuide';
import { fetchBrands } from '@/services/sizingService';
import Navbar from '@/components/Navbar';
import Loader2 from '@/components/Loader2';
import FeaturedBrands from '@/components/FeaturedBrands';

const Index = () => {
  const [brands, setBrands] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingBrands, setIsLoadingBrands] = useState(true);
  
  useEffect(() => {
    const loadBrands = async () => {
      try {
        const brandsData = await fetchBrands();
        setBrands(brandsData);
      } catch (error) {
        console.error('Error loading brands:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadBrands();
  }, []);
  
  return (
    <div className="min-h-screen overflow-hidden">
      <div className="fixed inset-0 bg-gradient-to-b from-purple-50 to-pink-50 -z-10" />
      
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        <section className="flex flex-col items-center justify-center text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
              Size Harmony Hub
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Find your perfect size across different brands with our advanced size converter.
              No more guessing or returns due to sizing issues.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            {/* Removed brands and isLoading props as they are not expected by SizeConverter */}
            <SizeConverter />
          </motion.div>
        </section>
        
        <section className="mb-16">
          <h2 className="text-2xl font-display font-semibold text-center mb-8">
            Popular Brands
          </h2>
          
          {isLoadingBrands ? (
            <div className="flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <FeaturedBrands />
          )}
        </section>
        
        <UserGuide />
        
        <div className="max-w-4xl mx-auto mt-16 mb-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <h2 className="text-2xl md:text-3xl font-display font-bold mb-4">
              Why Use Size Harmony Hub?
            </h2>
            <p className="text-muted-foreground mb-8">
              Our size converter helps you shop with confidence across different brands.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="glass-card p-6">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-medium mb-2">Accurate Sizing</h3>
                <p className="text-sm text-muted-foreground">
                  Our database contains precise measurements from popular brands to ensure accurate size recommendations.
                </p>
              </div>
              
              <div className="glass-card p-6">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-medium mb-2">Save Time</h3>
                <p className="text-sm text-muted-foreground">
                  No more wasting time with returns or exchanges due to incorrect sizing when shopping online.
                </p>
              </div>
              
              <div className="glass-card p-6">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                  </svg>
                </div>
                <h3 className="font-medium mb-2">Shop Confidently</h3>
                <p className="text-sm text-muted-foreground">
                  Know your size before you buy, even when shopping from brands you've never tried before.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
