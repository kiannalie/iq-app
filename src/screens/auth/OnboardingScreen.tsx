import React, { useState } from 'react';
import { View, StyleSheet, Text, ScrollView, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { useAuth } from '../../context/AuthContext';
import CategoryChip from '../../components/atoms/CategoryChip';
import CustomButton from '../../components/atoms/CustomButton';
import { COLORS, FONT_SIZES, SPACING } from '../../utils/constants';

type OnboardingScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'Onboarding'
>;

interface Props {
  navigation: OnboardingScreenNavigationProp;
}

const categories = [
  'FITNESS & HEALTH',
  'EDUCATION',
  'SOCIETY & CULTURE',
  'BUSINESS',
  'TECHNOLOGY',
  'FAMILY & KIDS',
  'GOVERNMENT',
  'NEWS',
  'RELIGION',
];

const OnboardingScreen: React.FC<Props> = ({ navigation }) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const { refreshUserData } = useAuth();

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleContinue = async () => {
    try {
      // Store selected categories in async storage
      await AsyncStorage.setItem('selected_categories', JSON.stringify(selectedCategories));

      // Mark onboarding as complete
      await AsyncStorage.setItem('onboarding_complete', 'true');
      console.log('✅ Onboarding complete! Categories:', selectedCategories);

      // Force a refresh to trigger AppNavigator re-check
      await refreshUserData();

      // Small delay to ensure state updates, then force navigation
      setTimeout(() => {
        // The app should now navigate to Main automatically
        console.log('🔄 Onboarding refresh complete');
      }, 100);
    } catch (error) {
      console.error('Error completing onboarding:', error);
      Alert.alert('Error', 'Failed to complete onboarding. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>WHAT TYPE OF LISTENER ARE YOU?</Text>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.categoriesContainer}>
          {categories.map((category) => (
            <CategoryChip
              key={category}
              title={category}
              isSelected={selectedCategories.includes(category)}
              onPress={() => toggleCategory(category)}
            />
          ))}
        </View>
      </ScrollView>

      <Text style={styles.selectionText}>Select 3 Genres</Text>

      <View style={styles.buttonContainer}>
        <CustomButton
          title="Continue"
          onPress={handleContinue}
          variant="secondary"
          style={styles.continueButton}
          disabled={selectedCategories.length < 3}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xxl * 2,
  },
  headerText: {
    fontSize: FONT_SIZES.large,
    color: COLORS.white,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: SPACING.xl,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectionText: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  buttonContainer: {
    paddingBottom: SPACING.xl,
  },
  continueButton: {
    width: '100%',
  },
});

export default OnboardingScreen;