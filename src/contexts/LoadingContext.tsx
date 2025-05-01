import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface LoadingContextType {
  /**
   * Show the global loading indicator
   * @param message Optional message to display
   * @param type Type of loading indicator to display
   */
  showLoading: (message?: string, type?: 'circular' | 'linear' | 'backdrop') => void;
  
  /**
   * Hide the global loading indicator
   */
  hideLoading: () => void;
  
  /**
   * Current loading state
   */
  isLoading: boolean;
  
  /**
   * Current loading message
   */
  message: string;
  
  /**
   * Current loading indicator type
   */
  type: 'circular' | 'linear' | 'backdrop';
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

interface LoadingProviderProps {
  children: ReactNode;
}

/**
 * Provider component for the LoadingContext
 * 
 * This context provides a way to show and hide a global loading indicator
 * from anywhere in the application.
 */
export const LoadingProvider: React.FC<LoadingProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('Loading...');
  const [type, setType] = useState<'circular' | 'linear' | 'backdrop'>('circular');
  
  const showLoading = useCallback((
    newMessage: string = 'Loading...',
    newType: 'circular' | 'linear' | 'backdrop' = 'circular'
  ) => {
    setMessage(newMessage);
    setType(newType);
    setIsLoading(true);
  }, []);
  
  const hideLoading = useCallback(() => {
    setIsLoading(false);
  }, []);
  
  const value = {
    showLoading,
    hideLoading,
    isLoading,
    message,
    type
  };
  
  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  );
};

/**
 * Hook to use the LoadingContext
 * 
 * @returns The LoadingContext
 * @throws Error if used outside of a LoadingProvider
 */
export const useLoading = (): LoadingContextType => {
  const context = useContext(LoadingContext);
  
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  
  return context;
};

export default LoadingContext;
