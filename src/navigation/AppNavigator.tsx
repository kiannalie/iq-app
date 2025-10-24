import React, { useState, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../context/AuthContext';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  const { user, loading } = useAuth();
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);

  useEffect(() => {
    checkOnboarding();
  }, [user]);

  const checkOnboarding = async () => {
    try {
      const completed = await AsyncStorage.getItem('onboarding_complete');
      console.log('📋 AppNavigator - Checking onboarding status:', completed);
      console.log('👤 AppNavigator - Current user:', user);
      setOnboardingComplete(completed === 'true');
    } catch (error) {
      console.error('Error checking onboarding status:', error);
    } finally {
      setCheckingOnboarding(false);
    }
  };

  if (loading || checkingOnboarding) {
    // You can add a loading screen component here
    return null;
  }

  // Show Main if user is authenticated AND onboarding is complete
  const showMain = user && onboardingComplete;

  console.log('🚦 AppNavigator - Rendering decision:');
  console.log('  - user exists:', !!user);
  console.log('  - onboardingComplete:', onboardingComplete);
  console.log('  - showMain:', showMain);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {showMain ? (
        <Stack.Screen name="Main" component={MainNavigator} />
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;