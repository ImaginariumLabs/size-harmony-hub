import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { Session, User } from '@supabase/supabase-js';
import supabase from '../services/supabaseClient';
import { isPlatform } from '../utils/platformUtils';
import { UserRole } from '../utils/authUtils';
import { validateToken, securelyStoreToken, removeStoredToken } from '../utils/tokenUtils';
import {
  isSessionValid,
  shouldRefreshSession,
  refreshSession,
  setupSessionRefresh,
  setupSessionTimeout
} from '../utils/sessionUtils';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  sessionExpiresAt: number | null;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, username?: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  refreshSession: () => Promise<boolean>;
  validateSession: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sessionExpiresAt, setSessionExpiresAt] = useState<number | null>(null);

  // References for cleanup functions
  const sessionRefreshCleanupRef = useRef<(() => void) | null>(null);
  const sessionTimeoutCleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    // Get initial session with timeout protection
    const initializeAuth = async () => {
      // Create a timeout promise to prevent endless loading
      const timeout = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error('Authentication initialization timed out after 10 seconds'));
        }, 10000); // 10 second timeout
      });

      try {
        // Race the auth call against the timeout
        const authPromise = supabase.auth.getSession();

        const result = await Promise.race([
          authPromise,
          timeout
        ]);

        const { data, error } = result;

        if (error) {
          console.error('Error getting session:', error);
          setError(error.message);
        } else {
          setSession(data.session);
          setUser(data.session?.user ?? null);
          setIsAuthenticated(!!data.session);
        }
      } catch (err) {
        console.error('Unexpected error during auth initialization:', err);

        // Provide more specific error messages
        if (err instanceof Error && err.message.includes('timed out')) {
          console.warn('Authentication initialization timed out');
          setError('Authentication timed out. Please refresh the page.');
        } else {
          setError('Failed to initialize authentication');
        }
      } finally {
        // Always set loading to false to prevent endless loading state
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        setSession(session);
        setUser(session?.user ?? null);
        setIsAuthenticated(!!session);
        setLoading(false);

        // Set session expiration time if available
        if (session?.expires_at) {
          setSessionExpiresAt(session.expires_at * 1000); // Convert to milliseconds
        } else {
          setSessionExpiresAt(null);
        }

        // Setup session refresh if we have a valid session
        if (session) {
          // Clean up any existing refresh interval
          if (sessionRefreshCleanupRef.current) {
            sessionRefreshCleanupRef.current();
          }

          // Set up new refresh interval
          sessionRefreshCleanupRef.current = setupSessionRefresh(
            (refreshedSession) => {
              console.log('Session refreshed successfully');
              setSession(refreshedSession);
              setUser(refreshedSession.user);

              if (refreshedSession.expires_at) {
                setSessionExpiresAt(refreshedSession.expires_at * 1000);
              }
            },
            (error) => {
              console.error('Session refresh error:', error);
              // If we can't refresh, we should probably sign out
              if (error.message.includes('expired')) {
                void signOut();
              }
            }
          );

          // Clean up any existing timeout
          if (sessionTimeoutCleanupRef.current) {
            sessionTimeoutCleanupRef.current();
          }

          // Set up session timeout
          sessionTimeoutCleanupRef.current = setupSessionTimeout(
            () => {
              console.log('Session timed out due to inactivity');
              void signOut();
            },
            60 // 60 minutes of inactivity
          );
        }

        // If a user just signed in, fetch their profile data
        if (event === 'SIGNED_IN' && session?.user) {
          try {
            // Fetch user profile data from the profiles table
            const { data, error } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (error) {
              console.error('Error fetching user profile:', error);
            } else if (data) {
              // Update user metadata with profile information
              // This allows us to access role and other profile data directly from the user object
              const userWithMetadata = {
                ...session.user,
                role: data.role || UserRole.USER,
                username: data.username || session.user.email?.split('@')[0] || '',
                createdAt: data.created_at,
                status: data.status || 'active'
              };
              setUser(userWithMetadata as User);
            }
          } catch (err) {
            console.error('Error processing user profile:', err);
          }
        }
      }
    );

    return () => {
      // Clean up auth subscription
      subscription.unsubscribe();

      // Clean up session refresh interval
      if (sessionRefreshCleanupRef.current) {
        sessionRefreshCleanupRef.current();
        sessionRefreshCleanupRef.current = null;
      }

      // Clean up session timeout
      if (sessionTimeoutCleanupRef.current) {
        sessionTimeoutCleanupRef.current();
        sessionTimeoutCleanupRef.current = null;
      }
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    // Create a timeout promise to prevent endless loading
    const timeout = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new Error('Sign in timed out after 10 seconds'));
      }, 10000); // 10 second timeout
    });

    setLoading(true);
    setError(null);

    try {
      // Race the auth call against the timeout
      const authPromise = supabase.auth.signInWithPassword({
        email,
        password
      });

      const result = await Promise.race([
        authPromise,
        timeout
      ]);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { data, error } = result;

      if (error) {
        setError(error.message);
        return { error };
      }

      return { error: null };
    } catch (err) {
      const error = err as Error;

      // Provide more specific error messages
      if (error.message.includes('timed out')) {
        console.warn('Sign in timed out');
        setError('Sign in timed out. Please try again.');
      } else {
        setError(error.message);
      }

      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, username: string = '') => {
    setLoading(true);
    setError(null);

    try {
      // Check if we should create an admin user (for testing purposes)
      const isFirstUser = await checkIfFirstUser();
      const userRole = isFirstUser ? UserRole.ADMIN : UserRole.USER;

      console.log('Creating user with role:', userRole);

      // Sign up the user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username || email.split('@')[0],
            role: userRole
          }
        }
      });

      if (error) {
        console.error('Signup error:', error);
        setError(error.message);
        return { error };
      }

      // If sign up successful and we have a user, create a profile record
      if (data.user) {
        console.log('User created, creating profile for:', data.user.id);

        try {
          // First check if a profile already exists for this user
          const { data: existingProfile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

          if (existingProfile) {
            console.log('Profile already exists, skipping creation');
          } else {
            // Create a new profile
            const { error: profileError } = await supabase
              .from('profiles')
              .insert([
                {
                  id: data.user.id,
                  email: email,
                  username: username || email.split('@')[0],
                  role: userRole,
                  status: 'active',
                  created_at: new Date().toISOString()
                }
              ]);

            if (profileError) {
              console.error('Error creating user profile:', profileError);
              // Try to get more details about the error
              if (profileError.code === '23505') {
                console.log('Profile already exists (constraint violation)');
              } else if (profileError.code === '42P01') {
                console.error('Table "profiles" does not exist');
              } else if (profileError.code === '42703') {
                console.error('Column does not exist in profiles table:', profileError.message);
              } else {
                console.error('Unknown profile creation error:', profileError);
              }
            } else {
              console.log('Profile created successfully');
            }
          }
        } catch (profileErr) {
          console.error('Exception during profile creation:', profileErr);
        }
      }

      return { error: null };
    } catch (err) {
      const error = err as Error;
      console.error('Unexpected error during signup:', err);
      setError(error.message);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  // Helper function to check if this is the first user (to make them an admin)
  const checkIfFirstUser = async (): Promise<boolean> => {
    try {
      const { count, error } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.error('Error checking user count:', error);
        return false;
      }

      return count === 0;
    } catch (err) {
      console.error('Error in checkIfFirstUser:', err);
      return false;
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setIsAuthenticated(false);
    } catch (err) {
      console.error('Error signing out:', err);
      setError('Failed to sign out');
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        setError(error.message);
        return { error };
      }

      return { error: null };
    } catch (err) {
      const error = err as Error;
      setError(error.message);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    setLoading(true);
    setError(null);

    try {
      if (!user) {
        throw new Error('No user logged in');
      }

      // Update auth user data if needed
      if (userData.email) {
        const { error } = await supabase.auth.updateUser({
          email: userData.email
        });

        if (error) throw error;
      }

      // Update profile data
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          username: userData.username,
          role: userData.role,
          status: userData.status,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      // Update local user state
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);

    } catch (err) {
      const error = err as Error;
      setError(error.message);
      console.error('Error updating user:', error);
    } finally {
      setLoading(false);
    }
  };

  // Validate the current session
  const validateSession = useCallback((): boolean => {
    if (!session) return false;
    return isSessionValid(session);
  }, [session]);

  // Refresh the current session
  const refreshUserSession = useCallback(async (): Promise<boolean> => {
    try {
      const refreshedSession = await refreshSession();
      if (refreshedSession) {
        setSession(refreshedSession);
        setUser(refreshedSession.user);

        if (refreshedSession.expires_at) {
          setSessionExpiresAt(refreshedSession.expires_at * 1000);
        }

        return true;
      }
      return false;
    } catch (error) {
      console.error('Error refreshing session:', error);
      return false;
    }
  }, []);

  const value = {
    user,
    session,
    loading,
    error,
    isAuthenticated,
    sessionExpiresAt,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateUser,
    refreshSession: refreshUserSession,
    validateSession,
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
  const isWebPlatform = isPlatform.web();

  return {
    // Check if the user is an admin
    isAdmin: user?.role === UserRole.ADMIN,

    // Check if the user can access admin features (admin role + web platform)
    canAccessAdminFeatures: user?.role === UserRole.ADMIN && isWebPlatform
  };
}
