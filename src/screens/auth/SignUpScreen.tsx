import React, { useState } from 'react';
import { View, StyleSheet, Text, Dimensions, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { useAuth } from '../../context/AuthContext';
import CircleBackground from '../../components/atoms/CircleBackground';
import CustomButton from '../../components/atoms/CustomButton';
import CustomTextInput from '../../components/atoms/CustomTextInput';
import { COLORS, FONT_SIZES, SPACING } from '../../utils/constants';

type SignUpScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'SignUp'
>;

interface Props {
  navigation: SignUpScreenNavigationProp;
}

const { width: screenWidth } = Dimensions.get('window');

const SignUpScreen: React.FC<Props> = ({ navigation }) => {
  const { signUp, signInWithGoogle } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!username.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await signUp(email, password, username);
      navigation.navigate('Onboarding');
    } catch (error) {
      console.error('Sign up failed:', error);
      Alert.alert('Error', 'Sign up failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      navigation.navigate('Onboarding');
    } catch (error) {
      console.error('Google Sign In failed:', error);
      Alert.alert('Error', 'Google Sign In failed. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
      <View style={styles.contentContainer}>
        <Text style={styles.headerText}>SIGN UP</Text>

        <View style={styles.circleContainer}>
          <CircleBackground size={screenWidth * 0.4} />
        </View>

        <View style={styles.formContainer}>
          <CustomTextInput
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            style={styles.input}
            autoCapitalize="none"
          />

          <CustomTextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <CustomTextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            secureTextEntry
          />

          <CustomButton
            title="Create your account"
            onPress={handleSignUp}
            variant="secondary"
            style={styles.createButton}
            disabled={loading}
          />

          <CustomButton
            title="Sign in with Google"
            onPress={handleGoogleSignIn}
            variant="google"
            style={styles.googleButton}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xxl,
    paddingBottom: SPACING.md,
  },
  headerText: {
    fontSize: FONT_SIZES.large,
    color: COLORS.white,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  circleContainer: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  formContainer: {
    gap: SPACING.md,
    marginTop: 'auto',
  },
  input: {
    marginBottom: SPACING.sm,
  },
  createButton: {
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  googleButton: {
    marginBottom: SPACING.md,
  },
});

export default SignUpScreen;