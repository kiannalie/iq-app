import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../config/supabase';
import { Session } from '@supabase/supabase-js';
import { userDataService, UserData } from '../services/userDataService';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';

WebBrowser.maybeCompleteAuthSession();

interface User {
  id: string;
  email: string;
  name: string;
  profileImage?: string;
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // Initialize auth state and listen for changes
    checkAuthState();

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        setSession(session);

        if (session?.user) {
          const mappedUser: User = {
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
            profileImage: session.user.user_metadata?.avatar_url,
          };
          setUser(mappedUser);
          await loadUserData(session.user.id);
        } else {
          setUser(null);
          setUserData(null);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const checkAuthState = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);

      if (session?.user) {
        const mappedUser: User = {
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
          profileImage: session.user.user_metadata?.avatar_url,
        };
        setUser(mappedUser);
        await loadUserData(session.user.id);
      }
      setLoading(false);
    } catch (error) {
      console.error('Auth state check error:', error);
      setLoading(false);
    }
  };

  const loadUserData = async (userId: string) => {
    try {
      const data = await userDataService.getAllUserData(userId);
      setUserData(data);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const refreshUserData = async () => {
    if (user) {
      await loadUserData(user.id);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      console.log('Sign in successful:', data.user?.email);
    } catch (error: any) {
      console.error('Sign in error:', error.message);
      throw new Error(error.message || 'Failed to sign in');
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });

      if (error) throw error;

      console.log('Sign up successful:', data.user?.email);

      // Automatically sign in after successful sign-up
      if (data.user) {
        console.log('Auto-signing in user after sign-up...');
        await signIn(email, password);
      }
    } catch (error: any) {
      console.error('Sign up error:', error.message);
      throw new Error(error.message || 'Failed to sign up');
    }
  };

  const signInWithGoogle = async () => {
    try {
      // Use Expo's auth redirect URL which works with Google OAuth
      const redirectUrl = makeRedirectUri({
        scheme: 'iqapp',
        path: 'auth/callback',
      });

      console.log('Redirect URL:', redirectUrl);

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          skipBrowserRedirect: true,
        },
      });

      if (error) throw error;

      if (data.url) {
        console.log('Opening OAuth URL:', data.url);
        const result = await WebBrowser.openAuthSessionAsync(
          data.url,
          redirectUrl
        );

        console.log('OAuth result:', result);

        if (result.type === 'success') {
          const url = result.url;
          // Extract the session from the URL
          const hashParams = url.split('#')[1];
          if (hashParams) {
            const params = new URLSearchParams(hashParams);
            const accessToken = params.get('access_token');
            const refreshToken = params.get('refresh_token');

            if (accessToken && refreshToken) {
              await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken,
              });
              console.log('Session set successfully');
            }
          }
        }
      }

      console.log('Google Sign In initiated');
    } catch (error: any) {
      console.error('Google sign in error:', error.message);
      throw new Error(error.message || 'Failed to sign in with Google');
    }
  };

  const signInWithApple = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
      });

      if (error) throw error;

      console.log('Apple Sign In initiated');
    } catch (error: any) {
      console.error('Apple sign in error:', error.message);
      throw new Error(error.message || 'Failed to sign in with Apple');
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setUser(null);
      setUserData(null);
      setSession(null);

      console.log('User signed out successfully');
    } catch (error: any) {
      console.error('Sign out error:', error.message);
      throw new Error(error.message || 'Failed to sign out');
    }
  };

  const value: AuthContextType = {
    user,
    userData,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signInWithApple,
    signOut,
    refreshUserData,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};