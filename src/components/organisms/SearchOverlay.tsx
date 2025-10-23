import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  TextInput,
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

interface SearchOverlayProps {
  visible: boolean;
  onClose: () => void;
  onSearch: (query: string) => void;
  placeholder?: string;
}

const { height } = Dimensions.get('window');

const SearchOverlay: React.FC<SearchOverlayProps> = ({
  visible,
  onClose,
  onSearch,
  placeholder = 'Search titles',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const slideAnim = useRef(new Animated.Value(height)).current;
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (visible) {
      // Slide up animation
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();

      // Focus input after animation
      setTimeout(() => {
        inputRef.current?.focus();
      }, 350);
    } else {
      // Slide down animation
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 250,
        useNativeDriver: true,
      }).start();

      // Clear search when closing
      setSearchQuery('');
    }
  }, [visible, slideAnim]);

  const handleSearch = () => {
    onSearch(searchQuery);
    onClose();
  };

  const handleClose = () => {
    onClose();
  };

  const handleClear = () => {
    setSearchQuery('');
    onSearch('');
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={handleClose}
    >
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <Animated.View
        style={[
          styles.overlay,
          {
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <SafeAreaView style={styles.container}>
          <View style={styles.searchContainer}>
            <TextInput
              ref={inputRef}
              style={styles.input}
              placeholder={placeholder}
              placeholderTextColor={COLORS.primary + '60'}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
              autoCapitalize="none"
              autoCorrect={false}
            />

            {searchQuery.length > 0 ? (
              <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
                <Ionicons name="close" size={24} color={COLORS.primary} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
                <Ionicons name="close" size={24} color={COLORS.primary} />
              </TouchableOpacity>
            )}
          </View>
        </SafeAreaView>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  container: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    marginHorizontal: SPACING.xl,
    marginTop: SPACING.lg,
    borderRadius: 25,
    paddingHorizontal: SPACING.lg,
    height: 50,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    flex: 1,
    fontSize: FONT_SIZES.medium,
    color: COLORS.primary,
    height: '100%',
  },
  clearButton: {
    padding: SPACING.xs,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    padding: SPACING.xs,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SearchOverlay;