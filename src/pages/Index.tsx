
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import SizeConverter from '../components/SizeConverter';
import UserGuide from '../components/UserGuide';
import Footer from '../components/Footer';
import { Sparkles, InfoIcon, GithubIcon, BookOpenIcon } from 'lucide-react';

const Index = () => {
  const orbsRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const orbs = orbsRef.current;
    if (!orbs) return;
    
    // Start animation only if we're not on a mobile device
    if (window.innerWidth >= 768) {
      const handleMouseMove = (e: MouseEvent) => {
        const { clientX, clientY } = e;
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        
        const moveX = (clientX - centerX) / centerX * 15;
        const moveY = (clientY - centerY) / centerY * 15;
        
        // Add some depth with a small delay for a parallax effect
        Array.from(orbs.children).forEach((orb, index) => {
          const factor = (index + 1) * 0.2;
          (orb as HTMLElement).style.transform = `translate(${moveX * factor}px, ${moveY * factor}px)`;
        });
      };
      
      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);
  
  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* Background layers */}
      <div className="fixed inset-0 z-0 bg-gray-50 overflow-hidden">
        {/* Fashion pattern with reduced opacity */}
        <div className="absolute inset-0 bg-fashion-pattern opacity-10"></div>
        
        {/* Animated gradient orbs */}
        <div ref={orbsRef} className="absolute inset-0 overflow-hidden">
          <div className="absolute top-[15%] -left-[10%] w-[35%] h-[35%] rounded-full bg-gradient-to-br from-purple-200 to-pink-200 blur-3xl opacity-40 transition-transform duration-[2000ms]"></div>
          <div className="absolute bottom-[20%] left-[20%] w-[25%] h-[25%] rounded-full bg-gradient-to-br from-blue-200 to-indigo-200 blur-3xl opacity-30 transition-transform duration-[2000ms]"></div>
          <div className="absolute top-[30%] right-[10%] w-[30%] h-[30%] rounded-full bg-gradient-to-br from-pink-200 to-red-200 blur-3xl opacity-30 transition-transform duration-[2000ms]"></div>
        </div>
        
        {/* Light mesh gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/80 via-white/60 to-pink-50/80"></div>
        
        {/* Grid pattern for depth */}
        <div className="absolute inset-0 grid-background opacity-20"></div>
      </div>
      
      {/* Top Navigation Bar */}
      <nav className="w-full py-3 px-4 glass backdrop-blur-sm fixed top-0 z-10">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <Sparkles className="h-5 w-5 text-primary mr-2" />
            <span className="font-semibold text-foreground">Fashion Size Harmony</span>
          </div>
          
          <div className="flex space-x-4">
            <a href="#guide" className="text-sm flex items-center text-muted-foreground hover:text-primary transition-colors">
              <InfoIcon className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">About</span>
            </a>
            <a href="#guide" className="text-sm flex items-center text-muted-foreground hover:text-primary transition-colors">
              <BookOpenIcon className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Guide</span>
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-sm flex items-center text-muted-foreground hover:text-primary transition-colors">
              <GithubIcon className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">GitHub</span>
            </a>
          </div>
        </div>
      </nav>
      
      <div className="container px-4 py-12 md:py-24 pt-20 relative z-1">
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
          <h1 className="text-3xl md:text-4xl font-display mb-2">Find Your Perfect Fit</h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Select your clothing type and measurements to discover your perfect size across different brands.
          </p>
        </motion.div>
        
        <SizeConverter />
        
        <div id="guide">
          <UserGuide />
        </div>
        
        <motion.div
          className="text-center text-sm text-muted-foreground mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {/* Ad Space */}
          <div className="mt-8 p-4 bg-white/50 rounded-lg border border-gray-200 shadow-sm">
            <p className="text-xs text-muted-foreground mb-1">ADVERTISEMENT</p>
            <div className="h-[90px] bg-gray-100 rounded flex items-center justify-center">
              <p className="text-sm text-gray-400">Ad Space (728x90)</p>
            </div>
          </div>
        </motion.div>
        
        <Footer />
      </div>
    </div>
  );
};

export default Index;
