import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import PodcastCard from '../molecules/PodcastCard';
import { PodcastEpisode } from '../../services/listenNotesApi';
import { COLORS, FONT_SIZES, SPACING } from '../../utils/constants';

interface RecentListenSectionProps {
  episodes: PodcastEpisode[];
  onEpisodePress: (episode: PodcastEpisode) => void;
}

const RecentListenSection: React.FC<RecentListenSectionProps> = ({
  episodes,
  onEpisodePress,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>RECENT LISTEN</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
      >
        {episodes.map((episode) => (
          <PodcastCard
            key={episode.id}
            episode={episode}
            onPress={() => onEpisodePress(episode)}
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

export default RecentListenSection;