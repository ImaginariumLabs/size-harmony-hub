
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Book, Info } from 'lucide-react';

const Navbar: React.FC = () => {
  const location = useLocation();
  
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <img src="/logo.png" alt="Size Harmony Hub" className="h-8" />
            <span className="font-display text-lg font-semibold text-primary">Size Harmony Hub</span>
          </Link>
          
          <nav className="flex items-center space-x-6">
            <Link 
              to="/guide"
              className={`flex items-center text-sm ${location.pathname === '/guide' ? 'text-primary font-medium' : 'text-muted-foreground hover:text-primary'}`}
            >
              <Book className="h-4 w-4 mr-1" />
              Guide
            </Link>
            <Link 
              to="/about"
              className={`flex items-center text-sm ${location.pathname === '/about' ? 'text-primary font-medium' : 'text-muted-foreground hover:text-primary'}`}
            >
              <Info className="h-4 w-4 mr-1" />
              About
            </Link>
            <Link
              to="/admin"
              className="text-sm bg-primary/10 text-primary px-3 py-1.5 rounded-md hover:bg-primary/20 transition-colors"
            >
              Admin
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
