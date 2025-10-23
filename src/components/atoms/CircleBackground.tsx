import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '../../utils/constants';

interface CircleBackgroundProps {
  size?: number;
  color?: string;
  children?: React.ReactNode;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const CircleBackground: React.FC<CircleBackgroundProps> = ({
  size = screenWidth * 0.8,
  color = COLORS.secondary,
  children,
}) => {
  return (
    <View
      style={[
        styles.circle,
        {
          width: size,
          height: size,
          backgroundColor: color,
          borderRadius: size / 2,
        },
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  circle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CircleBackground;