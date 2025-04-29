import React, { createContext, useContext, useState } from 'react';
import { User as AuthUser, AuthContextType } from '../types/auth';
import { UserRole } from '../utils/authUtils';

interface Session {
  user: AuthUser;
}

// Create mock users for demo purposes
const mockAdminUser: AuthUser = {
  id: 'admin-user-id',
  email: 'admin@example.com',
  username: 'admin',
  role: UserRole.ADMIN,
  createdAt: '2025-01-01',
  status: 'active'
};

const mockRegularUser: AuthUser = {
  id: 'regular-user-id',
  email: 'user@example.com',
  username: 'user',
  role: UserRole.USER,
  createdAt: '2025-01-15',
  status: 'active'
};

const mockSession: Session = {
  user: mockAdminUser
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(mockAdminUser);
  const [session, setSession] = useState<Session | null>(mockSession);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    if (email && password) {
      // Determine which user to return based on email
      const userToReturn = email.includes('admin') ? mockAdminUser : mockRegularUser;
      setUser(userToReturn);
      setSession({ user: userToReturn });
      setIsAuthenticated(true);
      setLoading(false);
      return { error: null };
    }

    setError('Invalid credentials');
    setLoading(false);
    return { error: new Error('Invalid credentials') };
  };

  const signUp = async (email: string, password: string, username: string = '') => {
    setLoading(true);
    setError(null);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    if (email && password) {
      // Create a new user with regular user role
      const newUser: AuthUser = {
        id: `user-${Math.random().toString(36).substring(2, 9)}`,
        email,
        username: username || email.split('@')[0],
        role: UserRole.USER,
        createdAt: new Date().toISOString(),
        status: 'active'
      };

      setUser(newUser);
      setSession({ user: newUser });
      setIsAuthenticated(true);
      setLoading(false);
      return { error: null };
    }

    setError('Invalid credentials');
    setLoading(false);
    return { error: new Error('Invalid credentials') };
  };

  const signOut = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    setUser(null);
    setSession(null);
    setIsAuthenticated(false);
    setLoading(false);
  };

  const resetPassword = async (email: string) => {
    setLoading(true);
    setError(null);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    if (email) {
      setLoading(false);
      return { error: null };
    }

    setError('Email is required');
    setLoading(false);
    return { error: new Error('Email is required') };
  };

  const updateUser = async (userData: Partial<AuthUser>) => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      setSession({ user: updatedUser });
    }

    setLoading(false);
  };

  const value = {
    user,
    session,
    loading,
    error,
    isAuthenticated,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Helper function to check if a user can access admin features
export function useAdminAccess() {
  const { user } = useAuth();
  const isWebPlatform = !window.electronAPI; // Simple check for web platform

  return {
    // Check if the user is an admin
    isAdmin: user?.role === UserRole.ADMIN,

    // Check if the user can access admin features (admin role + web platform)
    canAccessAdminFeatures: user?.role === UserRole.ADMIN && isWebPlatform
  };
}
