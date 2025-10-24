import React, { useState } from 'react';
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
import SideMenu from '../../components/organisms/SideMenu';
import { COLORS, FONT_SIZES, SPACING } from '../../utils/constants';

interface EpisodeData {
  id: string;
  title: string;
  thumbnailUrl: string;
  transcript: string;
}

type RouteParams = {
  PodcastPlayer: {
    podcastId: string;
    episodeId?: string;
  };
};

const PodcastPlayerScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RouteParams, 'PodcastPlayer'>>();
  const { podcastId, episodeId } = route.params;

  const [showSideMenu, setShowSideMenu] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // TODO: Load from Listen Notes API
  const episode: EpisodeData = {
    id: episodeId || '1',
    title: 'Title of Chapter or Podcast',
    thumbnailUrl: 'https://via.placeholder.com/300x200/4169E1/ffffff?text=Gap',
    transcript: 'the audio in text format. Transcript from the audio in text format that comes in a transcript. The highlighted part says in focus as the rest of the text goes grey. Transcript from the audio in text format. Transcript from the audio',
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

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleAIAssistant = () => {
    console.log('AI Assistant pressed');
  };

  const handleAddNote = () => {
    console.log('Add Note pressed');
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
        {/* Episode Title */}
        <Text style={styles.episodeTitle}>{episode.title}</Text>

        {/* Player Container */}
        <View style={styles.playerContainer}>
          {/* Waveform and Play Button */}
          <View style={styles.waveformSection}>
            <TouchableOpacity style={styles.playButton} onPress={handlePlayPause}>
              <Ionicons
                name={isPlaying ? 'pause' : 'play'}
                size={32}
                color={COLORS.white}
              />
            </TouchableOpacity>
            <View style={styles.waveformContainer}>
              {Array.from({ length: 60 }).map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.waveformBar,
                    { height: Math.random() * 30 + 10 }
                  ]}
                />
              ))}
            </View>
          </View>

          {/* Podcast Cover Image */}
          <Image source={{ uri: episode.thumbnailUrl }} style={styles.coverImage} />

          {/* Transcript Section */}
          <ScrollView style={styles.transcriptScroll} showsVerticalScrollIndicator={false}>
            <Text style={styles.transcriptTextGrey}>
              the audio in text format. Transcript from the audio in text format that comes in a transcript.{' '}
            </Text>
            <Text style={styles.transcriptTextHighlight}>
              The highlighted part says in focus as the rest of the text goes grey.{' '}
            </Text>
            <Text style={styles.transcriptTextGrey}>
              Transcript from the audio in text format. Transcript from the audio
            </Text>
          </ScrollView>

          {/* Scroll Down Arrow */}
          <View style={styles.scrollIndicator}>
            <Ionicons name="chevron-down" size={24} color={COLORS.white + '80'} />
          </View>

          {/* Bottom Actions */}
          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.actionButton} onPress={handleAIAssistant}>
              <Ionicons name="person-circle-outline" size={32} color="#1a237e" />
              <Text style={styles.actionText}>AI ASSISTANT{'\n'}LISTENING</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={handleAddNote}>
              <Ionicons name="add" size={32} color="#1a237e" />
              <Text style={styles.actionText}>ADD NOTE</Text>
            </TouchableOpacity>
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
  episodeTitle: {
    fontSize: FONT_SIZES.large,
    fontWeight: '600',
    color: COLORS.white,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.lg,
  },
  playerContainer: {
    backgroundColor: COLORS.white + '15',
    borderWidth: 2,
    borderColor: COLORS.white,
    borderRadius: 16,
    marginHorizontal: SPACING.md,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  waveformSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
    gap: SPACING.md,
  },
  playButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  waveformContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    gap: 2,
  },
  waveformBar: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 2,
  },
  coverImage: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginBottom: SPACING.lg,
  },
  transcriptScroll: {
    maxHeight: 200,
    marginBottom: SPACING.md,
  },
  transcriptTextGrey: {
    fontSize: FONT_SIZES.small,
    color: COLORS.white + '80',
    lineHeight: 22,
  },
  transcriptTextHighlight: {
    fontSize: FONT_SIZES.small,
    color: '#1a237e',
    fontWeight: '700',
    lineHeight: 22,
  },
  scrollIndicator: {
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.white + '30',
  },
  actionButton: {
    alignItems: 'center',
    gap: SPACING.xs,
  },
  actionText: {
    fontSize: FONT_SIZES.small,
    color: '#1a237e',
    fontWeight: '700',
    textAlign: 'center',
  },
});

export default PodcastPlayerScreen;
