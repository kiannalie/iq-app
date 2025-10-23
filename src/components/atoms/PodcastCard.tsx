import React from 'react';
import { TouchableOpacity, View, StyleSheet, Dimensions } from 'react-native';
import { COLORS, SPACING } from '../../utils/constants';

interface PodcastCardProps {
  isSelected: boolean;
  onPress: () => void;
  backgroundColor?: string;
}

const { width: screenWidth } = Dimensions.get('window');
const cardSize = (screenWidth - SPACING.xl * 2 - SPACING.md * 2) / 3; // 3 cards per row with spacing

const PodcastCard: React.FC<PodcastCardProps> = ({
  isSelected,
  onPress,
  backgroundColor = COLORS.secondary,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor,
          borderColor: isSelected ? COLORS.white : COLORS.transparent,
        },
      ]}
      onPress={onPress}
    >
      <View style={styles.cardContent} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: cardSize,
    height: cardSize,
    borderRadius: cardSize / 2,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    margin: SPACING.xs,
  },
  cardContent: {
    // Placeholder for podcast image/logo
    width: '70%',
    height: '70%',
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    opacity: 0.3,
  },
});

export default PodcastCard;