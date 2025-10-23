import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import PodcastCard from '../molecules/PodcastCard';
import { Podcast } from '../../services/listenNotesApi';
import { COLORS, FONT_SIZES, SPACING } from '../../utils/constants';

interface PopularInHealthSectionProps {
  healthPodcasts: Podcast[];
  onPodcastPress: (podcast: Podcast) => void;
}

const PopularInHealthSection: React.FC<PopularInHealthSectionProps> = ({
  healthPodcasts,
  onPodcastPress,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>POPULAR IN HEALTH</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
      >
        {healthPodcasts.map((podcast) => (
          <PodcastCard
            key={podcast.id}
            podcast={podcast}
            onPress={() => onPodcastPress(podcast)}
            size="medium"
            showTitle={true}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.medium,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: SPACING.md,
    marginHorizontal: SPACING.md,
    letterSpacing: 0.5,
  },
  scrollView: {
    paddingLeft: SPACING.md,
  },
  scrollContent: {
    paddingRight: SPACING.md,
  },
});

export default PopularInHealthSection;