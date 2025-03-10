
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Info, BookOpen, ShoppingBag, PenTool, Menu, X, ChevronDown } from 'lucide-react';
import { useMedia } from '@/hooks/use-mobile';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const NavLink = ({ to, icon, label, isActive }: { to: string, icon: React.ReactNode, label: string, isActive: boolean }) => (
  <Link
    to={to}
    className={cn(
      "px-3 py-2 rounded-full flex items-center transition-all duration-300",
      isActive 
        ? "bg-primary/10 text-primary font-medium" 
        : "text-gray-600 hover:bg-gray-100"
    )}
  >
    <div className="flex items-center gap-1.5">
      {icon}
      <span className={`transform transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-80'}`}>
        {label}
      </span>
    </div>
  </Link>
);

const Navbar: React.FC = () => {
  const location = useLocation();
  const isMobile = useMedia('(max-width: 768px)');
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const navLinks = [
    { path: '/', label: 'Home', icon: <Home className="h-4 w-4" /> },
    { path: '/blog', label: 'Blog', icon: <PenTool className="h-4 w-4" /> },
    { path: '/guide', label: 'Guide', icon: <BookOpen className="h-4 w-4" /> },
    { path: '/about', label: 'About', icon: <Info className="h-4 w-4" /> },
    { path: '/admin', label: 'Admin', icon: <ShoppingBag className="h-4 w-4" /> },
  ];
  
  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      isScrolled 
        ? "bg-white/90 backdrop-blur-md shadow-sm" 
        : "bg-white/70 backdrop-blur-sm"
    )}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <motion.div 
              className="h-10 w-10 bg-gradient-to-br from-primary to-purple-400 rounded-lg flex items-center justify-center text-white font-bold"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              SHH
            </motion.div>
            
            {!isMobile && (
              <span className="text-xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
                Size Harmony Hub
              </span>
            )}
          </Link>
          
          {isMobile ? (
            <>
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-primary transition-colors"
              >
                {mobileMenuOpen ? <X /> : <Menu />}
              </button>
              
              <AnimatePresence>
                {mobileMenuOpen && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute top-full left-0 right-0 bg-white shadow-lg z-50 overflow-hidden"
                  >
                    <div className="py-3 px-4 flex flex-col space-y-2">
                      {navLinks.map((link) => (
                        <Link
                          key={link.path}
                          to={link.path}
                          className={`p-3 rounded-md flex items-center ${
                            isActive(link.path) 
                              ? 'bg-primary/10 text-primary' 
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {link.icon}
                          <span className="ml-3">{link.label}</span>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          ) : (
            <div className="flex space-x-1 md:space-x-2 bg-gray-100/80 p-1 rounded-full">
              {navLinks.map((link) => (
                <NavLink 
                  key={link.path}
                  to={link.path}
                  icon={link.icon}
                  label={link.label}
                  isActive={isActive(link.path) || (link.path === '/blog' && location.pathname.startsWith('/blog/'))}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
