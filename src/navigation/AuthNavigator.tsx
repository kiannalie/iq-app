import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeSplashScreen from '../screens/auth/WelcomeSplashScreen';
import WelcomeScreen from '../screens/auth/WelcomeScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import SignUpScreen from '../screens/auth/SignUpScreen';
import OnboardingScreen from '../screens/auth/OnboardingScreen';
import PodcastSelectionScreen from '../screens/auth/PodcastSelectionScreen';

export type AuthStackParamList = {
  WelcomeSplash: undefined;
  Welcome: undefined;
  Login: undefined;
  SignUp: undefined;
  Onboarding: undefined;
  PodcastSelection: undefined;
};

const Stack = createStackNavigator<AuthStackParamList>();

const AuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="WelcomeSplash"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="WelcomeSplash" component={WelcomeSplashScreen} />
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="PodcastSelection" component={PodcastSelectionScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;