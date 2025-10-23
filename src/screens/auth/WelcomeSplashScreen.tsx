import React, { useEffect } from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import CircleBackground from '../../components/atoms/CircleBackground';
import { COLORS, FONT_SIZES, SPACING } from '../../utils/constants';

type WelcomeSplashScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'WelcomeSplash'
>;

interface Props {
  navigation: WelcomeSplashScreenNavigationProp;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const WelcomeSplashScreen: React.FC<Props> = ({ navigation }) => {
  useEffect(() => {
    // Auto-navigate to Welcome screen after 2 seconds
    const timer = setTimeout(() => {
      navigation.replace('Welcome');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.circleContainer}>
        <CircleBackground size={screenWidth * 0.7}>
          <Text style={styles.welcomeText}>welcome to IQ</Text>
        </CircleBackground>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: FONT_SIZES.large,
    color: COLORS.primary,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default WelcomeSplashScreen;