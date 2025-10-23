import React from 'react';
import { TouchableOpacity, Image, View, Text, StyleSheet, Dimensions } from 'react-native';
import { PodcastEpisode, Podcast } from '../../services/listenNotesApi';
import { COLORS, FONT_SIZES, SPACING } from '../../utils/constants';

interface PodcastCardProps {
  episode?: PodcastEpisode;
  podcast?: Podcast;
  onPress: () => void;
  size?: 'small' | 'medium' | 'large';
  showTitle?: boolean;
}

const { width: screenWidth } = Dimensions.get('window');

const PodcastCard: React.FC<PodcastCardProps> = ({
  episode,
  podcast,
  onPress,
  size = 'medium',
  showTitle = true,
}) => {
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          width: 80,
          height: 80,
          borderRadius: 8,
        };
      case 'medium':
        return {
          width: 120,
          height: 120,
          borderRadius: 12,
        };
      case 'large':
        return {
          width: 160,
          height: 160,
          borderRadius: 16,
        };
      default:
        return {
          width: 120,
          height: 120,
          borderRadius: 12,
        };
    }
  };

  const imageUrl = episode?.image || podcast?.image || 'https://via.placeholder.com/150x150/8b8f47/ffffff?text=IQ';
  const title = episode?.title || podcast?.title_original || 'Unknown';
  const subtitle = episode?.podcast?.title_original || podcast?.publisher_original || '';

  const cardSizes = getSizeStyles();

  return (
    <TouchableOpacity style={[styles.container, { width: cardSizes.width }]} onPress={onPress}>
      <View style={[styles.imageContainer, cardSizes]}>
        <Image
          source={{ uri: imageUrl }}
          style={[styles.image, cardSizes]}
          resizeMode="cover"
        />
      </View>

      {showTitle && (
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>
          {subtitle.length > 0 && (
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginRight: SPACING.md,
  },
  imageContainer: {
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  image: {
    backgroundColor: COLORS.secondary,
  },
  textContainer: {
    marginTop: SPACING.sm,
    width: '100%',
  },
  title: {
    fontSize: FONT_SIZES.small,
    fontWeight: '600',
    color: COLORS.white,
    lineHeight: 16,
  },
  subtitle: {
    fontSize: FONT_SIZES.small - 2,
    color: COLORS.white + '80',
    marginTop: 2,
  },
});

export default PodcastCard;