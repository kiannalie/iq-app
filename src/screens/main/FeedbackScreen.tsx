import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import SideMenu from '../../components/organisms/SideMenu';
import { COLORS, FONT_SIZES, SPACING } from '../../utils/constants';

const FeedbackScreen: React.FC = () => {
  const navigation = useNavigation();
  const { signOut } = useAuth();
  const [showSideMenu, setShowSideMenu] = useState(false);
  const [comments, setComments] = useState('');

  const handleMenuPress = () => {
    setShowSideMenu(true);
  };

  const handleCloseSideMenu = () => {
    setShowSideMenu(false);
  };

  const handleSettings = () => {
    console.log('Settings pressed');
  };

  const handleFeedback = () => {
    console.log('Feedback pressed');
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
              // Navigation will be handled automatically by AuthContext
            } catch (error) {
              console.error('Error logging out:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleSubmitFeedback = () => {
    if (comments.trim()) {
      // TODO: Send feedback to backend
      Alert.alert(
        'Thank You!',
        'We appreciate your feedback and will review it soon.',
        [{ text: 'OK', onPress: () => setComments('') }]
      );
    } else {
      Alert.alert('Required', 'Please enter your feedback before submitting');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" backgroundColor={COLORS.primary} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.searchButton}>
          <Ionicons name="search" size={24} color={COLORS.white} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuButton} onPress={handleMenuPress}>
          <Ionicons name="menu" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Title */}
        <Text style={styles.title}>FEEDBACK</Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>
          We are building and would{'\n'}love any feedback!
        </Text>

        {/* Comments Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.commentsInput}
            value={comments}
            onChangeText={setComments}
            placeholder="comments:"
            placeholderTextColor={COLORS.white + '80'}
            multiline
            textAlignVertical="top"
          />
        </View>

        {/* Help us build section */}
        <Text style={styles.helpText}>Help us build ♥</Text>

        {/* Stripe Integration Box */}
        <View style={styles.stripeContainer}>
          <Text style={styles.stripeText}>*stripe integration soon</Text>
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmitFeedback}>
          <Text style={styles.submitButtonText}>Submit Feedback</Text>
        </TouchableOpacity>
      </ScrollView>

      <SideMenu
        visible={showSideMenu}
        onClose={handleCloseSideMenu}
        onSettings={handleSettings}
        onFeedback={handleFeedback}
        onLogout={handleLogout}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  searchButton: {
    padding: SPACING.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuButton: {
    padding: SPACING.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  title: {
    fontSize: FONT_SIZES.xlarge,
    fontWeight: '700',
    color: COLORS.white,
    textAlign: 'center',
    marginTop: SPACING.lg,
    marginBottom: SPACING.xl,
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    lineHeight: 24,
  },
  inputContainer: {
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.xl,
  },
  commentsInput: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.white,
    borderRadius: 12,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    fontSize: FONT_SIZES.medium,
    color: COLORS.white,
    minHeight: 150,
  },
  helpText: {
    fontSize: FONT_SIZES.large,
    fontWeight: '600',
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  stripeContainer: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.white,
    borderRadius: 12,
    marginHorizontal: SPACING.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xl * 2,
    marginBottom: SPACING.xl,
  },
  stripeText: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.white,
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    marginBottom: SPACING.xl,
  },
  submitButtonText: {
    fontSize: FONT_SIZES.large,
    fontWeight: '700',
    color: COLORS.primary,
    textAlign: 'center',
  },
});

export default FeedbackScreen;
