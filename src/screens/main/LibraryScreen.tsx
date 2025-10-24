import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, Modal, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAuth } from '../../context/AuthContext';
import SideMenu from '../../components/organisms/SideMenu';
import { LibraryStackParamList } from '../../navigation/LibraryNavigator';
import { boardService, Board } from '../../services/boardService';
import { COLORS, FONT_SIZES, SPACING } from '../../utils/constants';
import { CommonActions } from '@react-navigation/native';

type LibraryScreenNavigationProp = StackNavigationProp<LibraryStackParamList, 'LibraryMain'>;

interface CategoryCardProps {
  title: string;
  color: string;
  tag?: string;
  onPress: () => void;
  onLongPress: () => void;
  isFullWidth?: boolean;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ title, color, tag, onPress, onLongPress, isFullWidth = false }) => {
  return (
    <TouchableOpacity
      style={[
        styles.categoryCard,
        isFullWidth ? styles.categoryCardFullWidth : styles.categoryCardHalf
      ]}
      onPress={onPress}
      onLongPress={onLongPress}
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
  const navigation = useNavigation<LibraryScreenNavigationProp>();
  const { user, signOut } = useAuth();
  const [showSideMenu, setShowSideMenu] = useState(false);
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBoardMenu, setShowBoardMenu] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState<Board | null>(null);

  // Load boards when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadBoards();
    }, [])
  );

  const loadBoards = async () => {
    try {
      setLoading(true);
      const loadedBoards = await boardService.getBoards();
      setBoards(loadedBoards);
    } catch (error) {
      console.error('Error loading boards:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBoardPress = (boardId: string) => {
    navigation.navigate('BoardDetail', { boardId });
  };

  const handleBoardLongPress = (board: Board) => {
    setSelectedBoard(board);
    setShowBoardMenu(true);
  };

  const handleEditBoard = () => {
    setShowBoardMenu(false);
    // TODO: Navigate to edit screen with board data
    console.log('Edit board:', selectedBoard?.name);
    Alert.alert('Coming Soon', 'Edit board functionality will be added soon');
  };

  const handleDeleteBoard = async () => {
    if (!selectedBoard) return;

    Alert.alert(
      'Delete Board',
      `Are you sure you want to delete "${selectedBoard.name}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => setShowBoardMenu(false),
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await boardService.deleteBoard(selectedBoard.id);
              await loadBoards();
              setShowBoardMenu(false);
              setSelectedBoard(null);
            } catch (error) {
              console.error('Error deleting board:', error);
              Alert.alert('Error', 'Failed to delete board. Please try again.');
            }
          },
        },
      ]
    );
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
    navigation.navigate('Feedback');
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
              // Navigation will be handled automatically by AuthContext
            } catch (error) {
              console.error('Error logging out:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleAddPress = () => {
    navigation.navigate('AddBoard');
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

        {/* Boards Grid */}
        <View style={styles.categoriesContainer}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading boards...</Text>
            </View>
          ) : boards.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No boards yet</Text>
              <Text style={styles.emptySubtext}>Tap + to create your first board</Text>
            </View>
          ) : (
            <View style={styles.categoriesGrid}>
              {boards.map((board) => {
                // Get the first board type for display
                const displayType = board.types[0];
                return (
                  <CategoryCard
                    key={board.id}
                    title={board.name.toUpperCase()}
                    color={displayType?.color || '#4169E1'}
                    tag={displayType?.name || ''}
                    onPress={() => handleBoardPress(board.id)}
                    onLongPress={() => handleBoardLongPress(board)}
                    isFullWidth={false}
                  />
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>

      <SideMenu
        visible={showSideMenu}
        onClose={handleCloseSideMenu}
        onSettings={handleSettings}
        onFeedback={handleFeedback}
        onLogout={handleLogout}
      />

      {/* Board Options Menu */}
      <Modal
        visible={showBoardMenu}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowBoardMenu(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowBoardMenu(false)}
        >
          <View style={styles.boardMenuContainer}>
            <Text style={styles.boardMenuTitle}>{selectedBoard?.name}</Text>

            <TouchableOpacity
              style={styles.boardMenuItem}
              onPress={handleEditBoard}
            >
              <Ionicons name="pencil" size={24} color={COLORS.white} />
              <Text style={styles.boardMenuItemText}>Edit Board</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.boardMenuItem, styles.boardMenuItemDanger]}
              onPress={handleDeleteBoard}
            >
              <Ionicons name="trash" size={24} color="#E57373" />
              <Text style={[styles.boardMenuItemText, styles.boardMenuItemTextDanger]}>
                Delete Board
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.boardMenuCancel}
              onPress={() => setShowBoardMenu(false)}
            >
              <Text style={styles.boardMenuCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
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
    marginBottom: SPACING.xl,
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
    width: '47%',
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
  },
  loadingText: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.white,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
  },
  emptyText: {
    fontSize: FONT_SIZES.large,
    fontWeight: '600',
    color: COLORS.white,
    marginBottom: SPACING.sm,
  },
  emptySubtext: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.white + '80',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  boardMenuContainer: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: COLORS.white,
    width: '80%',
    padding: SPACING.lg,
  },
  boardMenuTitle: {
    fontSize: FONT_SIZES.large,
    fontWeight: '700',
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  boardMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderRadius: 8,
    marginBottom: SPACING.sm,
    gap: SPACING.md,
  },
  boardMenuItemDanger: {
    backgroundColor: 'rgba(229, 115, 115, 0.1)',
  },
  boardMenuItemText: {
    fontSize: FONT_SIZES.medium,
    fontWeight: '600',
    color: COLORS.white,
  },
  boardMenuItemTextDanger: {
    color: '#E57373',
  },
  boardMenuCancel: {
    marginTop: SPACING.md,
    paddingVertical: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.white + '30',
  },
  boardMenuCancelText: {
    fontSize: FONT_SIZES.medium,
    fontWeight: '600',
    color: COLORS.white,
    textAlign: 'center',
  },
});

export default LibraryScreen;