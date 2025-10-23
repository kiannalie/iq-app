import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { COLORS, FONT_SIZES, BUTTON_HEIGHT, BORDER_RADIUS } from '../../utils/constants';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'google';
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  style,
  textStyle,
}) => {
  const getButtonStyle = () => {
    switch (variant) {
      case 'primary':
        return [styles.button, styles.primaryButton, style];
      case 'secondary':
        return [styles.button, styles.secondaryButton, style];
      case 'outline':
        return [styles.button, styles.outlineButton, style];
      case 'google':
        return [styles.button, styles.googleButton, style];
      default:
        return [styles.button, styles.primaryButton, style];
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'primary':
        return [styles.text, styles.primaryText, textStyle];
      case 'secondary':
        return [styles.text, styles.secondaryText, textStyle];
      case 'outline':
        return [styles.text, styles.outlineText, textStyle];
      case 'google':
        return [styles.text, styles.googleText, textStyle];
      default:
        return [styles.text, styles.primaryText, textStyle];
    }
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={getTextStyle()}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: BUTTON_HEIGHT,
    borderRadius: BORDER_RADIUS,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  text: {
    fontSize: FONT_SIZES.medium,
    fontWeight: '600',
  },
  primaryButton: {
    backgroundColor: COLORS.secondary,
  },
  primaryText: {
    color: COLORS.white,
  },
  secondaryButton: {
    backgroundColor: COLORS.white,
  },
  secondaryText: {
    color: COLORS.primary,
  },
  outlineButton: {
    backgroundColor: COLORS.transparent,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  outlineText: {
    color: COLORS.white,
  },
  googleButton: {
    backgroundColor: COLORS.white,
    flexDirection: 'row',
  },
  googleText: {
    color: COLORS.black,
  },
  disabled: {
    opacity: 0.6,
  },
});

export default CustomButton;