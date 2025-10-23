import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Animated,
  Dimensions,
  StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONT_SIZES, SPACING } from '../../utils/constants';

interface SideMenuProps {
  visible: boolean;
  onClose: () => void;
  onSettings: () => void;
  onFeedback: () => void;
  onLogout: () => void;
}

const { width } = Dimensions.get('window');

const SideMenu: React.FC<SideMenuProps> = ({
  visible,
  onClose,
  onSettings,
  onFeedback,
  onLogout,
}) => {
  const slideAnim = useRef(new Animated.Value(-width)).current;

  useEffect(() => {
    if (visible) {
      // Slide in animation
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      // Slide out animation
      Animated.timing(slideAnim, {
        toValue: -width,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slideAnim]);

  const handleSettings = () => {
    onSettings();
    onClose();
  };

  const handleFeedback = () => {
    onFeedback();
    onClose();
  };

  const handleLogout = () => {
    onLogout();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <StatusBar barStyle="light-content" backgroundColor="rgba(0,0,0,0.5)" />

      {/* Backdrop */}
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={onClose}
      >
        <Animated.View
          style={[
            styles.menuContainer,
            {
              transform: [{ translateX: slideAnim }]
            }
          ]}
        >
          <TouchableOpacity activeOpacity={1} onPress={() => {}}>

            {/* Olive/Brown Left Section */}
            <View style={styles.leftSection} />

            {/* Navy Blue Right Section */}
            <View style={styles.rightSection}>
              <SafeAreaView style={styles.safeArea}>

                {/* Header with hamburger menu */}
                <View style={styles.header}>
                  <TouchableOpacity style={styles.menuButton} onPress={onClose}>
                    <Ionicons name="menu" size={24} color={COLORS.white} />
                  </TouchableOpacity>
                </View>

                {/* Menu Items */}
                <View style={styles.menuItems}>
                  <TouchableOpacity style={styles.menuItem} onPress={handleSettings}>
                    <Text style={styles.menuItemText}>SETTINGS</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.menuItem} onPress={handleFeedback}>
                    <Text style={styles.menuItemText}>FEEDBACK</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
                    <Text style={styles.menuItemText}>LOG OUT</Text>
                  </TouchableOpacity>
                </View>

              </SafeAreaView>
            </View>

          </TouchableOpacity>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  menuContainer: {
    flex: 1,
    flexDirection: 'row',
    width: width * 0.85, // 85% of screen width
  },
  leftSection: {
    width: '30%',
    backgroundColor: COLORS.primary, // Olive/brown color
  },
  rightSection: {
    width: '70%',
    backgroundColor: '#1a237e', // Navy blue color
  },
  safeArea: {
    flex: 1,
  },
  header: {
    alignItems: 'flex-end',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.white + '20',
  },
  menuButton: {
    padding: SPACING.sm,
  },
  menuItems: {
    paddingTop: SPACING.xl,
    paddingHorizontal: SPACING.md,
  },
  menuItem: {
    paddingVertical: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.white + '10',
  },
  menuItemText: {
    fontSize: FONT_SIZES.medium,
    fontWeight: '600',
    color: COLORS.white,
    letterSpacing: 1,
    textAlign: 'right',
  },
});

export default SideMenu;