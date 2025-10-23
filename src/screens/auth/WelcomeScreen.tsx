import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import CircleBackground from '../../components/atoms/CircleBackground';
import CustomButton from '../../components/atoms/CustomButton';
import { COLORS, SPACING } from '../../utils/constants';

type WelcomeScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'Welcome'
>;

interface Props {
  navigation: WelcomeScreenNavigationProp;
}

const { width: screenWidth } = Dimensions.get('window');

const WelcomeScreen: React.FC<Props> = ({ navigation }) => {
  const handleLogin = () => {
    navigation.navigate('Login');
  };

  const handleSignUp = () => {
    navigation.navigate('SignUp');
  };

  return (
    <View style={styles.container}>
      <View style={styles.circleContainer}>
        <CircleBackground size={screenWidth * 0.7} />
      </View>

      <View style={styles.buttonContainer}>
        <CustomButton
          title="LOGIN"
          onPress={handleLogin}
          variant="outline"
          style={styles.button}
        />
        <CustomButton
          title="SIGN UP"
          onPress={handleSignUp}
          variant="secondary"
          style={styles.button}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.xxl * 2,
  },
  circleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: SPACING.xl,
    gap: SPACING.md,
  },
  button: {
    width: '100%',
  },
});

export default WelcomeScreen;