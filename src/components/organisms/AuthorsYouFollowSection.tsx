import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Podcast } from '../../services/listenNotesApi';
import { COLORS, FONT_SIZES, SPACING } from '../../utils/constants';

interface AuthorCardProps {
  podcast?: Podcast;
  onPress: () => void;
}

const AuthorCard: React.FC<AuthorCardProps> = ({ podcast, onPress }) => {
  return (
    <TouchableOpacity style={styles.authorCard} onPress={onPress}>
      <View style={styles.authorPlaceholder}>
        <Text style={styles.authorInitials}>
          {podcast?.publisher_original?.charAt(0) || '?'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

interface AuthorsYouFollowSectionProps {
  followedPodcasts: Podcast[];
  onAuthorPress: (podcast: Podcast) => void;
}

const AuthorsYouFollowSection: React.FC<AuthorsYouFollowSectionProps> = ({
  followedPodcasts,
  onAuthorPress,
}) => {
  // Create placeholder data if no followed podcasts
  const displayData = followedPodcasts.length > 0 ? followedPodcasts : [
    { id: 'placeholder-1', publisher_original: 'Author 1' } as Podcast,
    { id: 'placeholder-2', publisher_original: 'Author 2' } as Podcast,
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>AUTHORS YOU FOLLOW</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
      >
        {displayData.map((podcast) => (
          <AuthorCard
            key={podcast.id}
            podcast={podcast}
            onPress={() => onAuthorPress(podcast)}
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
  authorCard: {
    marginRight: SPACING.md,
  },
  authorPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  authorInitials: {
    fontSize: FONT_SIZES.large,
    fontWeight: '700',
    color: COLORS.primary,
  },
});

export default AuthorsYouFollowSection;