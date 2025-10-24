import React from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { useAuth } from '../../context/AuthContext';
import CircleBackground from '../../components/atoms/CircleBackground';
import CustomButton from '../../components/atoms/CustomButton';
import { COLORS, FONT_SIZES, SPACING } from '../../utils/constants';

type LoginScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'Login'
>;

interface Props {
  navigation: LoginScreenNavigationProp;
}

const { width: screenWidth } = Dimensions.get('window');

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const { signInWithGoogle } = useAuth();

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      // User will be redirected by AuthNavigator when auth state changes
    } catch (error) {
      console.error('Google Sign In failed:', error);
      // Handle error (show alert, etc.)
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>LOGIN</Text>
      </View>

      <View style={styles.circleContainer}>
        <CircleBackground size={screenWidth * 0.6} />
      </View>

      <View style={styles.buttonContainer}>
        <CustomButton
          title="Sign in with Google"
          onPress={handleGoogleSignIn}
          variant="google"
          style={styles.googleButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000751',
    paddingHorizontal: SPACING.xl,
  },
  header: {
    paddingTop: SPACING.xxl * 2,
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  headerText: {
    fontSize: FONT_SIZES.large,
    color: COLORS.white,
    fontWeight: '600',
  },
  circleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    paddingBottom: SPACING.xxl * 2,
    width: '100%',
  },
  googleButton: {
    width: '100%',
  },
});

export default LoginScreen;