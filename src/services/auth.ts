import { supabase } from './supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

export interface AuthError {
  message: string;
  code?: string;
}

// Configure Google Sign-In
GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID, // From Google Cloud Console
  iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID, // Optional: iOS specific client ID
  offlineAccess: true,
});

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
      // Check if device supports Google Play Services (Android)
      await GoogleSignin.hasPlayServices();

      // Sign in with Google
      const result = await GoogleSignin.signIn();

      // Check if sign-in was successful
      if (result.type === 'cancelled') {
        throw new Error('Google Sign-In was cancelled');
      }

      const { idToken } = result.data;

      if (!idToken) {
        throw new Error('No ID token received from Google');
      }

      // Sign in to Supabase with the Google ID token
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: idToken,
      });

      if (error) {
        throw new Error(error.message);
      }

      return data;
    } catch (error: any) {
      console.error('Google sign in error:', error);

      // Handle specific error cases
      if (error.code === 'SIGN_IN_CANCELLED') {
        throw new Error('Google Sign-In was cancelled');
      } else if (error.code === 'IN_PROGRESS') {
        throw new Error('Google Sign-In is already in progress');
      } else if (error.code === 'PLAY_SERVICES_NOT_AVAILABLE') {
        throw new Error('Google Play Services not available');
      }

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
      // Sign out from Supabase
      await supabase.auth.signOut();

      // Sign out from Google if signed in
      const isSignedIn = await GoogleSignin.isSignedIn();
      if (isSignedIn) {
        await GoogleSignin.signOut();
      }

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