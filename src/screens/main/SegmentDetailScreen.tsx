import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import SideMenu from '../../components/organisms/SideMenu';
import { COLORS, FONT_SIZES, SPACING } from '../../utils/constants';

// TODO - DATABASE MIGRATION:
// Segment data will need to be stored in database
interface SegmentDetail {
  id: string;
  title: string;
  thumbnailUrl: string;
  audioUrl?: string;
  waveformData?: number[];
  notes: string;
  keyTakeaways: string[];
  episodeId?: string;
  podcastId?: string;
}

type RouteParams = {
  SegmentDetail: {
    segmentId: string;
  };
};

const SegmentDetailScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RouteParams, 'SegmentDetail'>>();
  const { segmentId } = route.params;

  const [showSideMenu, setShowSideMenu] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [notes, setNotes] = useState('text or audio transcribed notes from each podcast or audio book that a user generates that they can fill this text input with');
  const [keyTakeaways, setKeyTakeaways] = useState([
    'Take away one',
    'Take away one',
    'Take away one',
  ]);

  // Mock segment data
  // TODO: Load from database
  const segment: SegmentDetail = {
    id: segmentId,
    title: 'NOTE TITLE',
    thumbnailUrl: 'https://via.placeholder.com/60x60/4169E1/ffffff?text=Gap',
    notes,
    keyTakeaways,
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    // TODO: Implement audio playback
    console.log('Play/Pause audio');
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

  const handleNotesChange = (text: string) => {
    setNotes(text);
    // TODO: Save to database with debounce
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
        {/* Main Content Card */}
        <View style={styles.mainCard}>
          {/* Title Section with Thumbnail */}
          <View style={styles.titleSection}>
            <Image source={{ uri: segment.thumbnailUrl }} style={styles.thumbnail} />
            <Text style={styles.title}>{segment.title}</Text>
            <TouchableOpacity style={styles.dropdownButton}>
              <Ionicons name="chevron-down" size={24} color={COLORS.white} />
            </TouchableOpacity>
          </View>

          {/* Audio Player Section */}
          <View style={styles.audioSection}>
            <TouchableOpacity style={styles.playButton} onPress={handlePlayPause}>
              <Ionicons
                name={isPlaying ? 'pause' : 'play'}
                size={24}
                color={COLORS.white}
              />
            </TouchableOpacity>

            {/* Waveform Visualization */}
            <View style={styles.waveformContainer}>
              {Array.from({ length: 60 }).map((_, index) => {
                const height = Math.random() * 30 + 10;
                return (
                  <View
                    key={index}
                    style={[
                      styles.waveformBar,
                      { height },
                    ]}
                  />
                );
              })}
            </View>
          </View>

          {/* Notes Section */}
          <View style={styles.notesSection}>
            <Text style={styles.sectionLabel}>NOTES</Text>
            <TextInput
              style={styles.notesInput}
              multiline
              value={notes}
              onChangeText={handleNotesChange}
              placeholder="Enter your notes here..."
              placeholderTextColor={COLORS.white + '40'}
            />
          </View>

          {/* Key Takeaways Section */}
          <View style={styles.takeawaysSection}>
            <Text style={styles.sectionLabel}>KEY TAKE AWAYS</Text>
            <View style={styles.takeawaysList}>
              {keyTakeaways.map((takeaway, index) => (
                <View key={index} style={styles.takeawayItem}>
                  <View style={styles.bulletPoint} />
                  <Text style={styles.takeawayText}>{takeaway}</Text>
                </View>
              ))}
            </View>
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
  mainCard: {
    margin: SPACING.md,
    borderWidth: 2,
    borderColor: COLORS.white + '80',
    borderRadius: 16,
    padding: SPACING.lg,
    backgroundColor: COLORS.primary + 'DD',
  },
  titleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: SPACING.md,
  },
  title: {
    flex: 1,
    fontSize: FONT_SIZES.large,
    fontWeight: '700',
    color: COLORS.white,
    letterSpacing: 1,
  },
  dropdownButton: {
    padding: SPACING.xs,
  },
  audioSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xl,
    paddingVertical: SPACING.md,
  },
  playButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  waveformContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 40,
  },
  waveformBar: {
    width: 2,
    backgroundColor: COLORS.white,
    borderRadius: 1,
  },
  notesSection: {
    marginBottom: SPACING.xl,
  },
  sectionLabel: {
    fontSize: FONT_SIZES.medium,
    fontWeight: '700',
    color: COLORS.white,
    letterSpacing: 1,
    marginBottom: SPACING.md,
  },
  notesInput: {
    borderWidth: 2,
    borderColor: COLORS.white + '60',
    borderRadius: 12,
    padding: SPACING.md,
    fontSize: FONT_SIZES.medium,
    color: COLORS.white,
    minHeight: 180,
    textAlignVertical: 'top',
  },
  takeawaysSection: {
    marginBottom: SPACING.md,
  },
  takeawaysList: {
    borderWidth: 2,
    borderColor: COLORS.white + '60',
    borderRadius: 12,
    padding: SPACING.md,
  },
  takeawayItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  bulletPoint: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: COLORS.white,
    backgroundColor: '#4169E1',
    marginRight: SPACING.md,
  },
  takeawayText: {
    flex: 1,
    fontSize: FONT_SIZES.medium,
    color: COLORS.white,
  },
});

export default SegmentDetailScreen;
