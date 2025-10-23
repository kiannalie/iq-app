import React from 'react';
import { TextInput, StyleSheet, TextInputProps } from 'react-native';
import { COLORS, FONT_SIZES, SPACING, BUTTON_HEIGHT } from '../../utils/constants';

interface CustomTextInputProps extends TextInputProps {
  placeholder: string;
}

const CustomTextInput: React.FC<CustomTextInputProps> = ({
  placeholder,
  style,
  ...props
}) => {
  return (
    <TextInput
      style={[styles.input, style]}
      placeholder={placeholder}
      placeholderTextColor={COLORS.gray}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    height: BUTTON_HEIGHT,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    paddingHorizontal: SPACING.md,
    fontSize: FONT_SIZES.medium,
    color: COLORS.black,
  },
});

export default CustomTextInput;