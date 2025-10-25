import React, { useState } from 'react';
import { View, StyleSheet, Text, Dimensions, TextInput, Alert } from 'react-native';
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
  const { signIn, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    try {
      setLoading(true);
      await signIn(email, password);
      // User will be redirected by AuthNavigator when auth state changes
    } catch (error: any) {
      console.error('Email Sign In failed:', error);
      Alert.alert('Login Failed', error.message || 'Please check your credentials and try again');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      await signInWithGoogle();
      // User will be redirected by AuthNavigator when auth state changes
    } catch (error: any) {
      console.error('Google Sign In failed:', error);
      Alert.alert('Login Failed', error.message || 'Google Sign In failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>LOGIN</Text>
      </View>

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#666666"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          editable={!loading}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#666666"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={!loading}
        />

        <CustomButton
          title={loading ? "Signing in..." : "Login"}
          onPress={handleEmailSignIn}
          variant="primary"
          style={styles.loginButton}
          disabled={loading}
        />

        <Text style={styles.orText}>OR</Text>

        <CustomButton
          title="Sign in with Google"
          onPress={handleGoogleSignIn}
          variant="google"
          style={styles.googleButton}
          disabled={loading}
        />

        <CustomButton
          title="Don't have an account? Sign Up"
          onPress={() => navigation.navigate('SignUp')}
          variant="secondary"
          style={styles.signUpButton}
          disabled={loading}
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
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: SPACING.xxl * 2,
  },
  input: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SPACING.md,
    fontSize: FONT_SIZES.medium,
    color: '#000000',
    marginBottom: SPACING.md,
  },
  loginButton: {
    width: '100%',
    marginTop: SPACING.sm,
  },
  orText: {
    color: COLORS.white,
    textAlign: 'center',
    fontSize: FONT_SIZES.medium,
    marginVertical: SPACING.md,
    fontWeight: '500',
  },
  googleButton: {
    width: '100%',
    marginBottom: SPACING.md,
  },
  signUpButton: {
    width: '100%',
  },
});

export default LoginScreen;