import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS, FONT_SIZES, SPACING } from '../../utils/constants';

interface CategoryChipProps {
  title: string;
  isSelected: boolean;
  onPress: () => void;
}

const CategoryChip: React.FC<CategoryChipProps> = ({ title, isSelected, onPress }) => {
  return (
    <TouchableOpacity
      style={[
        styles.chip,
        isSelected ? styles.selectedChip : styles.unselectedChip,
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.chipText,
          isSelected ? styles.selectedText : styles.unselectedText,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
    marginRight: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  selectedChip: {
    backgroundColor: COLORS.secondary,
  },
  unselectedChip: {
    backgroundColor: COLORS.transparent,
    borderWidth: 1,
    borderColor: COLORS.white,
  },
  chipText: {
    fontSize: FONT_SIZES.small,
    fontWeight: '500',
  },
  selectedText: {
    color: COLORS.white,
  },
  unselectedText: {
    color: COLORS.white,
  },
});

export default CategoryChip;