import supabase from './supabaseClient';
import { UserRole } from '../utils/authUtils';

export { UserRole };

export interface User {
  id?: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Get all users
export const getUsers = async (): Promise<User[]> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*');

    if (error) {
      console.error('Error fetching users:', error);
      throw error;
    }

    // Transform the data to match our User interface
    return data.map(profile => ({
      id: profile.id,
      email: profile.email,
      firstName: profile.first_name || '',
      lastName: profile.last_name || '',
      role: profile.role,
      isActive: profile.status === 'active',
      lastLogin: profile.last_login,
      createdAt: profile.created_at,
      updatedAt: profile.updated_at
    }));
  } catch (error) {
    console.error('Error in getUsers:', error);
    return [];
  }
};

// Create a new user
export const createUser = async (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> => {
  try {
    // First create the auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: userData.email,
      password: Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10),
      email_confirm: true,
      user_metadata: {
        first_name: userData.firstName,
        last_name: userData.lastName,
        role: userData.role
      }
    });

    if (authError) {
      console.error('Error creating auth user:', authError);
      throw authError;
    }

    // Then create the profile
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        email: userData.email,
        first_name: userData.firstName,
        last_name: userData.lastName,
        role: userData.role,
        status: userData.isActive ? 'active' : 'inactive',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }

    return {
      id: data.id,
      email: data.email,
      firstName: data.first_name || '',
      lastName: data.last_name || '',
      role: data.role,
      isActive: data.status === 'active',
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  } catch (error) {
    console.error('Error in createUser:', error);
    throw error;
  }
};

// Update an existing user
export const updateUser = async (userId: string, userData: Partial<User>): Promise<User> => {
  try {
    // Update the profile
    const { data, error } = await supabase
      .from('profiles')
      .update({
        first_name: userData.firstName,
        last_name: userData.lastName,
        role: userData.role,
        status: userData.isActive ? 'active' : 'inactive',
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }

    return {
      id: data.id,
      email: data.email,
      firstName: data.first_name || '',
      lastName: data.last_name || '',
      role: data.role,
      isActive: data.status === 'active',
      lastLogin: data.last_login,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  } catch (error) {
    console.error('Error in updateUser:', error);
    throw error;
  }
};

// Delete a user
export const deleteUser = async (userId: string): Promise<void> => {
  try {
    // Delete the user from auth
    const { error: authError } = await supabase.auth.admin.deleteUser(userId);

    if (authError) {
      console.error('Error deleting auth user:', authError);
      throw authError;
    }

    // The profile should be deleted automatically via a trigger,
    // but we'll delete it explicitly just to be sure
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId);

    if (error) {
      console.error('Error deleting user profile:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in deleteUser:', error);
    throw error;
  }
};
