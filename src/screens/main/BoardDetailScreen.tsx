import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LibraryStackParamList } from '../../navigation/LibraryNavigator';

type BoardDetailNavigationProp = StackNavigationProp<LibraryStackParamList, 'BoardDetail'>;
import SideMenu from '../../components/organisms/SideMenu';
import { boardService, Board } from '../../services/boardService';
import { COLORS, FONT_SIZES, SPACING } from '../../utils/constants';

// TODO - DATABASE MIGRATION:
// This will need to be stored in database
interface NoteSegment {
  id: string;
  title: string;
  thumbnailUrl: string;
  episodeId?: string;
  podcastId?: string;
  createdAt: string;
}

type RouteParams = {
  BoardDetail: {
    boardId: string;
  };
};

const BoardDetailScreen: React.FC = () => {
  const navigation = useNavigation<BoardDetailNavigationProp>();
  const route = useRoute<RouteProp<RouteParams, 'BoardDetail'>>();
  const { boardId } = route.params;

  const [board, setBoard] = useState<Board | null>(null);
  const [segments, setSegments] = useState<NoteSegment[]>([]);
  const [showSideMenu, setShowSideMenu] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBoardData();
  }, [boardId]);

  const loadBoardData = async () => {
    try {
      setLoading(true);
      const loadedBoard = await boardService.getBoardById(boardId);
      setBoard(loadedBoard);

      // TODO - DATABASE MIGRATION:
      // Load segments from database
      // For now, using mock data
      const mockSegments: NoteSegment[] = [
        {
          id: '1',
          title: 'NOTE TITLE',
          thumbnailUrl: 'https://via.placeholder.com/60x60/4169E1/ffffff?text=Gap',
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          title: 'NOTE TITLE',
          thumbnailUrl: 'https://via.placeholder.com/60x60/4169E1/ffffff?text=Gap',
          createdAt: new Date().toISOString(),
        },
      ];
      setSegments(mockSegments);
    } catch (error) {
      console.error('Error loading board:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayAll = () => {
    console.log('Play all segments');
    // TODO: Implement play all functionality
  };

  const handleSegmentPress = (segment: NoteSegment) => {
    navigation.navigate('SegmentDetail', { segmentId: segment.id });
  };

  const handleMenuPress = () => {
    setShowSideMenu(true);
  };

  const handleCloseSideMenu = () => {
    setShowSideMenu(false);
  };

  const handleSettings = () => {
    console.log('Settings pressed');
  };

  const handleFeedback = () => {
    console.log('Feedback pressed');
  };

  const handleLogout = () => {
    console.log('Logout pressed');
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" backgroundColor={COLORS.primary} />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!board) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" backgroundColor={COLORS.primary} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Board not found</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

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
        {/* Board Title with Play Button */}
        <View style={styles.titleContainer}>
          <Text style={styles.boardTitle}>{board.name.toUpperCase()}</Text>
          <TouchableOpacity style={styles.playButton} onPress={handlePlayAll}>
            <Ionicons name="play" size={28} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        {/* Segments List */}
        <View style={styles.segmentsContainer}>
          {segments.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No segments yet</Text>
              <Text style={styles.emptySubtext}>
                Add podcast episodes or notes to this board
              </Text>
            </View>
          ) : (
            segments.map((segment) => (
              <TouchableOpacity
                key={segment.id}
                style={styles.segmentCard}
                onPress={() => handleSegmentPress(segment)}
              >
                <Image
                  source={{ uri: segment.thumbnailUrl }}
                  style={styles.thumbnail}
                />
                <Text style={styles.segmentTitle}>{segment.title}</Text>
                <Ionicons
                  name="chevron-forward"
                  size={24}
                  color={COLORS.white}
                  style={styles.chevron}
                />
              </TouchableOpacity>
            ))
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
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.xl,
    marginTop: SPACING.md,
  },
  boardTitle: {
    fontSize: FONT_SIZES.xlarge,
    fontWeight: '700',
    color: COLORS.white,
    letterSpacing: 1.5,
    flex: 1,
  },
  playButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.white + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: SPACING.md,
  },
  segmentsContainer: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  segmentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white + '10',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.white + '60',
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: SPACING.md,
  },
  segmentTitle: {
    flex: 1,
    fontSize: FONT_SIZES.large,
    fontWeight: '600',
    color: COLORS.white,
    letterSpacing: 0.5,
  },
  chevron: {
    marginLeft: SPACING.sm,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.white,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  errorText: {
    fontSize: FONT_SIZES.large,
    fontWeight: '600',
    color: COLORS.white,
    marginBottom: SPACING.lg,
  },
  backButton: {
    backgroundColor: COLORS.white + '20',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: 8,
  },
  backButtonText: {
    fontSize: FONT_SIZES.medium,
    fontWeight: '600',
    color: COLORS.white,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.xxl * 2,
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
    textAlign: 'center',
  },
});

export default BoardDetailScreen;
