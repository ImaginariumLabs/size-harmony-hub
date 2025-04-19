
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { MenuIcon } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
    } catch (error) {
      console.error("Sign out failed:", error);
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Get user display information safely
  const userProfile = user?.profile as { avatar_url?: string; full_name?: string } | undefined;
  const userAvatar = userProfile?.avatar_url || "";
  const userName = userProfile?.full_name || user?.email || "";
  const userInitial = userName ? userName.charAt(0).toUpperCase() : "U";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img src="/logo.png" alt="Size Harmony Logo" className="h-8 w-auto" />
              <span className="ml-2 font-bold text-lg hidden sm:inline-block">Size Harmony</span>
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              <Link to="/" className="nav-link">
                Home
              </Link>
              <Link to="/reverse-lookup" className="nav-link">
                Reverse Lookup
              </Link>
              <Link to="/about" className="nav-link">
                About
              </Link>
              <Link to="/guide" className="nav-link">
                Guide
              </Link>
              <Link to="/blog" className="nav-link">
                Blog
              </Link>
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={userAvatar} alt={userName} />
                        <AvatarFallback>{userInitial}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => navigate('/profile')}>
                      Profile
                    </DropdownMenuItem>
                    {user.role === 'admin' && (
                      <DropdownMenuItem onClick={() => navigate('/admin')}>
                        Admin Panel
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link to="/auth" className="nav-link">
                  Sign In
                </Link>
              )}
            </div>
          </div>
          
          <div className="md:hidden">
            <Button variant="ghost" onClick={toggleMobileMenu}>
              <MenuIcon className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
      
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-md py-2">
          <div className="container mx-auto px-4 flex flex-col space-y-2">
            <Link to="/" className="block py-2 px-4 text-gray-800 hover:bg-gray-100" onClick={toggleMobileMenu}>
              Home
            </Link>
            <Link to="/reverse-lookup" className="block py-2 px-4 text-gray-800 hover:bg-gray-100" onClick={toggleMobileMenu}>
              Reverse Lookup
            </Link>
            <Link to="/about" className="block py-2 px-4 text-gray-800 hover:bg-gray-100" onClick={toggleMobileMenu}>
              About
            </Link>
            <Link to="/guide" className="block py-2 px-4 text-gray-800 hover:bg-gray-100" onClick={toggleMobileMenu}>
              Guide
            </Link>
            <Link to="/blog" className="block py-2 px-4 text-gray-800 hover:bg-gray-100" onClick={toggleMobileMenu}>
              Blog
            </Link>
            {user ? (
              <>
                <Link to="/profile" className="block py-2 px-4 text-gray-800 hover:bg-gray-100" onClick={toggleMobileMenu}>
                  Profile
                </Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="block py-2 px-4 text-gray-800 hover:bg-gray-100" onClick={toggleMobileMenu}>
                    Admin Panel
                  </Link>
                )}
                <Button variant="ghost" className="block py-2 px-4 text-gray-800 hover:bg-gray-100" onClick={() => { toggleMobileMenu(); handleSignOut(); }}>
                  Sign Out
                </Button>
              </>
            ) : (
              <Link to="/auth" className="block py-2 px-4 text-gray-800 hover:bg-gray-100" onClick={toggleMobileMenu}>
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
