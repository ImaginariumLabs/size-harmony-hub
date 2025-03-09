
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Info, BookOpen, ShoppingBag, PenTool } from 'lucide-react';
import { useMedia } from '@/hooks/use-mobile';

const Navbar: React.FC = () => {
  const location = useLocation();
  const isMobile = useMedia('(max-width: 768px)');
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <nav className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <img src="/logo.png" alt="Size Harmony Hub" className="h-10 w-auto" />
            {!isMobile && (
              <span className="ml-2 text-xl font-display font-bold">Size Harmony Hub</span>
            )}
          </Link>
          
          <div className="flex space-x-1 md:space-x-2 text-sm">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md flex items-center transition-colors ${
                isActive('/') 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Home className="h-4 w-4 md:mr-1.5" />
              {!isMobile && <span>Home</span>}
            </Link>
            
            <Link
              to="/blog"
              className={`px-3 py-2 rounded-md flex items-center transition-colors ${
                isActive('/blog') || location.pathname.startsWith('/blog/') 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <PenTool className="h-4 w-4 md:mr-1.5" />
              {!isMobile && <span>Blog</span>}
            </Link>
            
            <Link
              to="/guide"
              className={`px-3 py-2 rounded-md flex items-center transition-colors ${
                isActive('/guide') 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <BookOpen className="h-4 w-4 md:mr-1.5" />
              {!isMobile && <span>Guide</span>}
            </Link>
            
            <Link
              to="/about"
              className={`px-3 py-2 rounded-md flex items-center transition-colors ${
                isActive('/about') 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Info className="h-4 w-4 md:mr-1.5" />
              {!isMobile && <span>About</span>}
            </Link>
            
            <Link
              to="/admin"
              className={`px-3 py-2 rounded-md flex items-center transition-colors ${
                isActive('/admin') 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <ShoppingBag className="h-4 w-4 md:mr-1.5" />
              {!isMobile && <span>Admin</span>}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
