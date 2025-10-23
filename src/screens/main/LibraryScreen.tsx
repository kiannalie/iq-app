import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import SideMenu from '../../components/organisms/SideMenu';
import { COLORS, FONT_SIZES, SPACING } from '../../utils/constants';

interface CategoryCardProps {
  title: string;
  color: string;
  tag?: string;
  onPress: () => void;
  isFullWidth?: boolean;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ title, color, tag, onPress, isFullWidth = false }) => {
  return (
    <TouchableOpacity
      style={[
        styles.categoryCard,
        isFullWidth ? styles.categoryCardFullWidth : styles.categoryCardHalf
      ]}
      onPress={onPress}
    >
      <View style={styles.categoryContent}>
        <Text style={styles.categoryTitle}>{title}</Text>
        {tag && (
          <View style={[styles.categoryTag, { backgroundColor: color }]}>
            <Text style={styles.categoryTagText}>{tag}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const LibraryScreen: React.FC = () => {
  const { user } = useAuth();
  const [showSideMenu, setShowSideMenu] = useState(false);

  const categories = [
    { title: 'RECOVERY', color: '#4169E1', tag: 'WELLNESS' },
    { title: 'COMMUNICATION', color: '#8B0000', tag: 'FAMILY' },
    { title: 'NUTRITION', color: '#4169E1', tag: 'WELLNESS' },
    { title: 'TIME MGMT', color: '#B8860B', tag: 'PRODUCT' },
    { title: 'MINDSET', color: '#8B0000', tag: 'PERSONAL DEVELOPMENT', isFullWidth: true },
  ];

  const handleCategoryPress = (category: string) => {
    console.log('Category pressed:', category);
    // Navigate to category details
  };

  const handleMenuPress = () => {
    setShowSideMenu(true);
  };

  const handleCloseSideMenu = () => {
    setShowSideMenu(false);
  };

  const handleSettings = () => {
    console.log('Settings pressed');
    // Navigate to settings
  };

  const handleFeedback = () => {
    console.log('Feedback pressed');
    // Navigate to feedback
  };

  const handleLogout = () => {
    console.log('Logout pressed');
    // Handle logout
  };

  const handleAddPress = () => {
    console.log('Add pressed');
    // Add new content or category
  };

  const handleSearchPress = () => {
    console.log('Search pressed');
    // Open search
  };

  const handleFilterPress = () => {
    console.log('Filter pressed');
    // Open filter options
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" backgroundColor={COLORS.primary} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.searchButton}>
          <Ionicons name="search" size={24} color={COLORS.white} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuButton} onPress={handleMenuPress}>
          <Ionicons name="menu" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* User Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{
                uri: user?.profileImage || 'https://via.placeholder.com/80x80/4169E1/ffffff?text=U'
              }}
              style={styles.profileImage}
            />
          </View>
          <Text style={styles.userName}>{user?.name || 'User Name'}</Text>
        </View>

        {/* Action Bar */}
        <View style={styles.actionBarContainer}>
          <View style={styles.actionBar}>
            <TouchableOpacity style={styles.actionButton} onPress={handleAddPress}>
              <Ionicons name="add" size={20} color={COLORS.white} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={handleFilterPress}>
              <Ionicons name="options" size={20} color={COLORS.white} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={handleSearchPress}>
              <Ionicons name="search" size={20} color={COLORS.white} />
            </TouchableOpacity>
          </View>

          {/* Horizontal Line */}
          <View style={styles.actionBarLine} />
        </View>

        {/* Categories Grid */}
        <View style={styles.categoriesContainer}>
          <View style={styles.categoriesGrid}>
            {categories.map((category, index) => (
              <CategoryCard
                key={category.title}
                title={category.title}
                color={category.color}
                tag={category.tag}
                onPress={() => handleCategoryPress(category.title)}
                isFullWidth={category.isFullWidth}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      <SideMenu
        visible={showSideMenu}
        onClose={handleCloseSideMenu}
        onSettings={handleSettings}
        onFeedback={handleFeedback}
        onLogout={handleLogout}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  searchButton: {
    padding: SPACING.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuButton: {
    padding: SPACING.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  profileImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: SPACING.md,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  userName: {
    fontSize: FONT_SIZES.large,
    fontWeight: '600',
    color: COLORS.white,
  },
  actionBarContainer: {
    paddingHorizontal: SPACING.md,
  },
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    gap: SPACING.lg,
  },
  actionBarLine: {
    height: 1,
    backgroundColor: COLORS.white + '40',
    marginTop: SPACING.sm,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoriesContainer: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: SPACING.md,
  },
  categoryCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
    marginBottom: SPACING.md,
  },
  categoryCardHalf: {
    width: '48%',
    height: 120,
  },
  categoryCardFullWidth: {
    width: '100%',
    height: 120,
  },
  categoryContent: {
    flex: 1,
    padding: SPACING.md,
    position: 'relative',
  },
  categoryTitle: {
    fontSize: FONT_SIZES.large,
    fontWeight: '700',
    color: COLORS.primary,
    letterSpacing: 0.8,
    lineHeight: 24,
    marginTop: 4,
  },
  categoryTag: {
    position: 'absolute',
    top: 0,
    right: 0,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderTopRightRadius: 12,
    borderBottomLeftRadius: 8,
  },
  categoryTagText: {
    fontSize: FONT_SIZES.small - 2,
    fontWeight: '600',
    color: COLORS.white,
    letterSpacing: 0.3,
  },
});

export default LibraryScreen;