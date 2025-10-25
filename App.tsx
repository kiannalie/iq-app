import React, { useEffect } from 'react';
import { Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import ErrorBoundary from './src/components/ErrorBoundary';
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import { FONT_FAMILIES } from './src/utils/constants';

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      // Set Inter as the default font for all Text components
      const defaultFontFamily = { fontFamily: FONT_FAMILIES.regular };
      const TextRender = Text.render;
      const initialDefaultProps = Text.defaultProps;
      Text.defaultProps = {
        ...initialDefaultProps,
        style: [defaultFontFamily, initialDefaultProps?.style],
      };
      Text.render = function render(props: any) {
        const oldProps = props;
        props = { ...props, style: [defaultFontFamily, props.style] };
        try {
          return TextRender.apply(this, [props]);
        } finally {
          props = oldProps;
        }
      };
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ErrorBoundary>
      <AuthProvider>
        <NavigationContainer>
          <StatusBar style="light" backgroundColor="#1a1f3a" />
          <AppNavigator />
        </NavigationContainer>
      </AuthProvider>
    </ErrorBoundary>
  );
}