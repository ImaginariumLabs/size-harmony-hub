/**
 * User object representing an authenticated user
 */
export interface User {
  id: string;
  email: string;
  username: string;
  role: string;
  createdAt: string;
  lastLogin?: string;
  status: 'active' | 'inactive' | 'suspended';
}

/**
 * Authentication context state
 */
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

/**
 * Authentication context methods
 */
export interface AuthMethods {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, username: string) => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

/**
 * Combined authentication context
 */
export type AuthContextType = AuthState & AuthMethods;
