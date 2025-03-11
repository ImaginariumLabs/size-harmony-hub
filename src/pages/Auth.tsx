
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, User, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate('/');
      }
    };
    
    checkSession();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
          },
        });
        
        if (error) throw error;
        
        toast.success('Account created successfully! Please check your email for confirmation.');
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;
        
        toast.success('Logged in successfully!');
        navigate('/');
      }
    } catch (error: any) {
      toast.error(error.message || 'An error occurred during authentication');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-50 to-blue-50 opacity-70"></div>
        <div className="absolute top-0 left-0 w-full h-full grid-background"></div>
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-200 rounded-full filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-blue-200 rounded-full filter blur-3xl opacity-20 animate-float-reverse"></div>
      </div>
      
      <Link to="/" className="absolute top-6 left-6 p-3 rounded-full bg-white/80 shadow-sm hover:bg-white transition-colors">
        <ArrowLeft className="h-5 w-5 text-gray-700" />
      </Link>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md glass-card p-8 relative z-10"
      >
        <div className="flex items-center justify-center mb-6">
          <Lock className="h-8 w-8 text-primary mr-2" />
          <h1 className="text-2xl font-display">{isSignUp ? 'Create Account' : 'Welcome Back'}</h1>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-sm text-muted-foreground mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full p-3 pl-10 rounded-lg border focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="John Doe"
                  required={isSignUp}
                />
              </div>
            </div>
          )}
          
          <div>
            <label className="block text-sm text-muted-foreground mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 pl-10 rounded-lg border focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="email@example.com"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm text-muted-foreground mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 pl-10 rounded-lg border focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Processing...' : isSignUp ? 'Create Account' : 'Sign In'}
          </button>
        </form>
        
        <div className="mt-6 text-center text-sm">
          {isSignUp ? (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setIsSignUp(false)}
                className="text-primary hover:underline font-medium"
              >
                Sign In
              </button>
            </p>
          ) : (
            <p>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => setIsSignUp(true)}
                className="text-primary hover:underline font-medium"
              >
                Create Account
              </button>
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
