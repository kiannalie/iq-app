import React, { useState } from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { CommonActions } from '@react-navigation/native';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { useAuth } from '../../context/AuthContext';
import PodcastCard from '../../components/atoms/PodcastCard';
import CustomButton from '../../components/atoms/CustomButton';
import { COLORS, FONT_SIZES, SPACING } from '../../utils/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

type PodcastSelectionScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'PodcastSelection'
>;

interface Props {
  navigation: PodcastSelectionScreenNavigationProp;
}

// Mock podcast data with different colors
const podcasts = [
  { id: '1', color: '#ff6b6b' },
  { id: '2', color: '#4ecdc4' },
  { id: '3', color: '#45b7d1' },
  { id: '4', color: '#96ceb4' },
  { id: '5', color: '#ffeaa7' },
  { id: '6', color: '#dda0dd' },
  { id: '7', color: COLORS.secondary },
  { id: '8', color: '#ff9ff3' },
  { id: '9', color: '#54a0ff' },
];

const PodcastSelectionScreen: React.FC<Props> = ({ navigation }) => {
  const [selectedPodcasts, setSelectedPodcasts] = useState<string[]>([]);
  const { user } = useAuth();

  const togglePodcast = (podcastId: string) => {
    setSelectedPodcasts(prev =>
      prev.includes(podcastId)
        ? prev.filter(id => id !== podcastId)
        : [...prev, podcastId]
    );
  };

  const handleFinish = async () => {
    try {
      console.log('🎯 Finish button pressed!');
      console.log('Selected podcasts:', selectedPodcasts);
      console.log('Current user:', user);

      // Save that onboarding is complete
      await AsyncStorage.setItem('onboarding_complete', 'true');
      console.log('✅ Saved onboarding_complete to AsyncStorage');

      // Verify it was saved
      const saved = await AsyncStorage.getItem('onboarding_complete');
      console.log('Verification - onboarding_complete value:', saved);

      // Force a small delay to ensure state updates
      setTimeout(() => {
        console.log('Navigation should update now...');
      }, 100);
    } catch (error) {
      console.error('❌ Error completing onboarding:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>FOLLOW YOUR FAVORITE PODCASTS</Text>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.podcastGrid}>
          {podcasts.map((podcast) => (
            <PodcastCard
              key={podcast.id}
              isSelected={selectedPodcasts.includes(podcast.id)}
              onPress={() => togglePodcast(podcast.id)}
              backgroundColor={podcast.color}
            />
          ))}
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <CustomButton
          title="Finish"
          onPress={handleFinish}
          variant="secondary"
          style={styles.finishButton}
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
  podcastGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
  },
  buttonContainer: {
    paddingBottom: SPACING.xl,
  },
  finishButton: {
    width: '100%',
  },
});

export default PodcastSelectionScreen;