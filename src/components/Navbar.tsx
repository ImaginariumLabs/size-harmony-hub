
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from './ui/button';
import { LogOut, User, Shield } from 'lucide-react';

const Navbar = () => {
  const { user, signOut, isAdmin } = useAuth();
  
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-b z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="font-display text-xl text-primary">
          Size Harmony Hub
        </Link>
        
        <div className="flex items-center space-x-6">
          <Link to="/" className="text-gray-600 hover:text-gray-900">
            Size Calculator
          </Link>
          <Link to="/guide" className="text-gray-600 hover:text-gray-900">
            Guide
          </Link>
          <Link to="/blog" className="text-gray-600 hover:text-gray-900">
            Blog
          </Link>
          <Link to="/about" className="text-gray-600 hover:text-gray-900">
            About
          </Link>
          
          {user ? (
            <div className="flex items-center space-x-4">
              <Link to="/profile" className="text-gray-600 hover:text-gray-900 flex items-center gap-1">
                <User className="h-4 w-4" />
                Profile
              </Link>
              <Button 
                variant="ghost" 
                onClick={signOut}
                className="flex items-center"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
              {isAdmin && (
                <Link 
                  to="/admin" 
                  className="text-primary hover:text-primary/80 flex items-center gap-1"
                >
                  <Shield className="h-4 w-4" />
                  Admin
                </Link>
              )}
            </div>
          ) : (
            <Link to="/auth">
              <Button variant="default">Sign In</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
