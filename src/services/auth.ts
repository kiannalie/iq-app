import { supabase } from './supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface AuthError {
  message: string;
  code?: string;
}

export class AuthService {
  static async signInWithEmail(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw new Error(error.message);
      }

      return data;
    } catch (error) {
      console.error('Email sign in error:', error);
      throw error;
    }
  }

  static async signUpWithEmail(email: string, password: string, name: string) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      return data;
    } catch (error) {
      console.error('Email sign up error:', error);
      throw error;
    }
  }

  static async signInWithGoogle() {
    try {
      // This will be implemented with @react-native-google-signin/google-signin
      // For now, return a mock response
      console.log('Google Sign In - To be implemented');

      // Mock successful response for development
      const mockUser = {
        id: 'mock-user-id',
        email: 'user@gmail.com',
        name: 'Test User',
      };

      // Store mock user data
      await AsyncStorage.setItem('user', JSON.stringify(mockUser));

      return { user: mockUser };
    } catch (error) {
      console.error('Google sign in error:', error);
      throw error;
    }
  }

  static async signInWithApple() {
    try {
      // This will be implemented with expo-apple-authentication
      console.log('Apple Sign In - To be implemented');

      // For iOS only - check platform before implementing
      const mockUser = {
        id: 'mock-user-id',
        email: 'user@icloud.com',
        name: 'Test User',
      };

      await AsyncStorage.setItem('user', JSON.stringify(mockUser));

      return { user: mockUser };
    } catch (error) {
      console.error('Apple sign in error:', error);
      throw error;
    }
  }

  static async signOut() {
    try {
      await supabase.auth.signOut();
      await AsyncStorage.removeItem('user');
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }

  static async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error) {
        // Fallback to AsyncStorage for development
        const storedUser = await AsyncStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
      }

      return user;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  static async getSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        console.error('Get session error:', error);
        return null;
      }

      return session;
    } catch (error) {
      console.error('Get session error:', error);
      return null;
    }
  }
}