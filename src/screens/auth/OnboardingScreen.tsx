import React, { useState } from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
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

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleContinue = () => {
    // Store selected categories in context or async storage
    navigation.navigate('PodcastSelection');
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