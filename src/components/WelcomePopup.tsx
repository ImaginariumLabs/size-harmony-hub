
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, LogIn, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const WelcomePopup: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { user } = useAuth();
  
  useEffect(() => {
    // Don't show popup if user is already logged in
    if (user) return;
    
    // Check if the popup has been shown before
    const hasSeenPopup = localStorage.getItem('hasSeenWelcomePopup');
    
    if (!hasSeenPopup) {
      // Show popup after a short delay
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [user]);
  
  const handleClose = () => {
    setIsVisible(false);
    // Remember that the user has seen the popup
    localStorage.setItem('hasSeenWelcomePopup', 'true');
  };
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div 
            className="w-full max-w-md glass-card p-8 m-4 relative"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors"
              onClick={handleClose}
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
            
            <div className="text-center mb-6">
              <h2 className="text-2xl font-display font-bold">Welcome to Size Harmony Hub!</h2>
              <p className="text-gray-600 mt-2">
                Create an account to save your measurements and get personalized size recommendations across all your favorite brands.
              </p>
            </div>
            
            <div className="space-y-4">
              <Link to="/auth?mode=signup" className="w-full">
                <Button 
                  className="w-full py-6 text-base font-medium" 
                  onClick={handleClose}
                >
                  <UserPlus className="mr-2 h-5 w-5" />
                  Create an Account
                </Button>
              </Link>
              
              <div className="text-center text-sm text-gray-500">
                Already have an account?
              </div>
              
              <Link to="/auth?mode=signin" className="w-full">
                <Button 
                  variant="outline" 
                  className="w-full py-6 text-base font-medium"
                  onClick={handleClose}
                >
                  <LogIn className="mr-2 h-5 w-5" />
                  Sign In
                </Button>
              </Link>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200 text-center text-xs text-gray-400">
              By signing up, you agree to our Terms of Service and Privacy Policy.
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WelcomePopup;
