import React, { useState, useEffect } from 'react';
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
import { StackNavigationProp } from '@react-navigation/stack';
import SideMenu from '../../components/organisms/SideMenu';
import { COLORS, FONT_SIZES, SPACING } from '../../utils/constants';
import { HomeStackParamList } from '../../navigation/HomeNavigator';
import { listenNotesApi, PodcastEpisode } from '../../services/listenNotesApi';
import { useAuth } from '../../context/AuthContext';
import { userDataService } from '../../services/userDataService';
import { shouldUseMockData } from '../../config/devConfig';

interface Episode {
  id: string;
  title: string;
  thumbnailUrl: string;
  duration: number; // in minutes
  publishDate: string; // ISO date string
}

interface PodcastProfile {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  genre: string;
}

type RouteParams = {
  PodcastProfile: {
    podcastId: string;
  };
};

type PodcastProfileScreenNavigationProp = StackNavigationProp<
  HomeStackParamList,
  'PodcastProfile'
>;

const PodcastProfileScreen: React.FC = () => {
  const navigation = useNavigation<PodcastProfileScreenNavigationProp>();
  const route = useRoute<RouteProp<RouteParams, 'PodcastProfile'>>();
  const { podcastId } = route.params;
  const { refreshUserData } = useAuth();

  const [showSideMenu, setShowSideMenu] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showSearchField, setShowSearchField] = useState(false);
  const [podcast, setPodcast] = useState<PodcastProfile | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [originalEpisodes, setOriginalEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilters, setSelectedFilters] = useState<{
    date: boolean;
    length: boolean;
  }>({ date: false, length: false });
  const [searchText, setSearchText] = useState('');
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    loadPodcastData();
    checkFollowStatus();
  }, [podcastId]);

  useEffect(() => {
    applyFilters();
  }, [selectedFilters, searchText]);

  const checkFollowStatus = async () => {
    const following = await userDataService.isFollowing(podcastId);
    setIsFollowing(following);
  };

  const loadPodcastData = async () => {
    setLoading(true);

    try {
      if (shouldUseMockData()) {
        // Dev mode - use mock data
        console.log('🔧 DEV MODE: Using mock podcast data');
        const mockPodcast: PodcastProfile = {
          id: podcastId,
          title: 'THE TIM FERRISS SHOW',
          description: 'Tim Ferriss is a self-experimenter and bestselling author, best known for The 4-Hour Workweek, which has been translated into 40+ languages.',
          thumbnailUrl: 'https://via.placeholder.com/150x150/ff9500/ffffff?text=TIM+F',
          genre: 'BUSINESS',
        };

        const mockEpisodes: Episode[] = [
          {
            id: '1',
            title: 'EPISODE 193: HOW TO BUILD A BILLION DOLLAR COMPANY',
            thumbnailUrl: 'https://via.placeholder.com/60x60/ff9500/ffffff?text=EP1',
            duration: 45,
            publishDate: new Date(Date.now() - 86400000).toISOString(),
          },
          {
            id: '2',
            title: 'EPISODE 192: PRODUCTIVITY SECRETS FROM TOP PERFORMERS',
            thumbnailUrl: 'https://via.placeholder.com/60x60/ff9500/ffffff?text=EP2',
            duration: 32,
            publishDate: new Date(Date.now() - 172800000).toISOString(),
          },
          {
            id: '3',
            title: 'EPISODE 191: MASTERING THE ART OF NEGOTIATION',
            thumbnailUrl: 'https://via.placeholder.com/60x60/ff9500/ffffff?text=EP3',
            duration: 58,
            publishDate: new Date(Date.now() - 259200000).toISOString(),
          },
        ];

        setPodcast(mockPodcast);
        setEpisodes(mockEpisodes);
        setOriginalEpisodes(mockEpisodes);
      } else {
        // Production mode - real API
        const [podcastData, episodesData] = await Promise.all([
          listenNotesApi.getPodcastById(podcastId),
          listenNotesApi.getPodcastEpisodes(podcastId),
        ]);

        const podcastProfile: PodcastProfile = {
          id: podcastData.id,
          title: (podcastData.title_original || podcastData.title || 'UNKNOWN PODCAST').toUpperCase(),
          description: podcastData.description_original || podcastData.description || 'No description available.',
          thumbnailUrl: podcastData.image || 'https://via.placeholder.com/150x150/4169E1/ffffff?text=Podcast',
          genre: podcastData.genre_ids && podcastData.genre_ids.length > 0
            ? `GENRE ${podcastData.genre_ids[0]}`
            : 'GENERAL',
        };

        const episodesList: Episode[] = (episodesData.episodes || []).map((ep: PodcastEpisode) => ({
          id: ep.id,
          title: (ep.title || 'Untitled Episode').toUpperCase(),
          thumbnailUrl: ep.image || podcastData.image || 'https://via.placeholder.com/60x60/4169E1/ffffff?text=Episode',
          duration: Math.floor((ep.audio_length_sec || 0) / 60),
          publishDate: new Date(ep.pub_date_ms || Date.now()).toISOString(),
        }));

        setPodcast(podcastProfile);
        setEpisodes(episodesList);
        setOriginalEpisodes(episodesList);
      }
    } catch (error) {
      console.error('Error loading podcast data:', error);
      // Fallback to mock data
      const mockPodcast: PodcastProfile = {
        id: podcastId,
        title: 'PODCAST TITLE',
        description: 'Unable to load podcast details. Please try again later.',
        thumbnailUrl: 'https://via.placeholder.com/150x150/4169E1/ffffff?text=Error',
        genre: 'UNKNOWN',
      };
      setPodcast(mockPodcast);
      setEpisodes([]);
      setOriginalEpisodes([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filteredEpisodes = [...originalEpisodes];

    // Apply search filter
    if (searchText.trim().length > 0) {
      filteredEpisodes = filteredEpisodes.filter((episode) =>
        episode.title.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Apply sorting filters
    if (selectedFilters.date && selectedFilters.length) {
      filteredEpisodes.sort((a, b) => {
        const dateCompare = new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
        if (dateCompare !== 0) return dateCompare;
        return b.duration - a.duration;
      });
    } else if (selectedFilters.date) {
      // Sort by date only (newest first)
      filteredEpisodes.sort((a, b) => {
        return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
      });
    } else if (selectedFilters.length) {
      // Sort by length only (longest first)
      filteredEpisodes.sort((a, b) => {
        return b.duration - a.duration;
      });
    }

    setEpisodes(filteredEpisodes);
  };

  const handleEpisodePress = (episode: Episode) => {
    navigation.navigate('PodcastPlayer', {
      podcastId: podcastId,
      episodeId: episode.id,
    });
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

  const handleFilter = () => {
    setShowFilterMenu(!showFilterMenu);
  };

  const handleFilterByDate = () => {
    setSelectedFilters((prev) => ({ ...prev, date: !prev.date }));
  };

  const handleFilterByLength = () => {
    setSelectedFilters((prev) => ({ ...prev, length: !prev.length }));
  };

  const handleSearch = () => {
    setShowSearchField(!showSearchField);
    // Clear search text when hiding search field
    if (showSearchField) {
      setSearchText('');
    }
  };

  const handleFollowToggle = async () => {
    if (!podcast) return;

    try {
      if (isFollowing) {
        // Unfollow
        await userDataService.unfollowPodcast(podcastId);
        setIsFollowing(false);
      } else {
        // Follow
        await userDataService.followPodcast({
          id: podcast.id,
          title: podcast.title,
          publisher: 'Podcast Publisher', // Would come from API
          image: podcast.thumbnailUrl,
        });
        setIsFollowing(true);
      }

      // Refresh user data in context
      await refreshUserData();
    } catch (error) {
      console.error('Error toggling follow:', error);
    }
  };

  if (loading || !podcast) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" backgroundColor={COLORS.primary} />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
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
        {/* Podcast Header */}
        <View style={styles.podcastHeader}>
          <Image source={{ uri: podcast.thumbnailUrl }} style={styles.podcastImage} />

          <Text style={styles.podcastTitle}>{podcast.title}</Text>
          <View style={styles.titleLine} />

          <Text style={styles.podcastDescription}>{podcast.description}</Text>

          {/* Genre, Follow Button, and Action Icons Row */}
          <View style={styles.genreActionsRow}>
            <View style={styles.genreFollowContainer}>
              <View style={styles.genreContainer}>
                <Text style={styles.genreText}>{podcast.genre}</Text>
              </View>

              <TouchableOpacity
                style={[styles.followButton, isFollowing && styles.followButtonActive]}
                onPress={handleFollowToggle}
              >
                <Ionicons
                  name={isFollowing ? 'heart' : 'heart-outline'}
                  size={16}
                  color={COLORS.white}
                />
                <Text style={styles.followButtonText}>
                  {isFollowing ? 'FOLLOWING' : 'FOLLOW'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.actionIcons}>
              <TouchableOpacity style={styles.iconButton} onPress={handleFilter}>
                <Ionicons name="options" size={20} color={COLORS.white} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton} onPress={handleSearch}>
                <Ionicons name="search" size={20} color={COLORS.white} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Search Text Field - Only show when search icon is clicked */}
          {showSearchField && (
            <View style={styles.searchFieldContainer}>
              <TextInput
                style={styles.searchField}
                value={searchText}
                onChangeText={setSearchText}
                placeholder="Search episodes..."
                placeholderTextColor={COLORS.white + '60'}
                autoFocus
              />
            </View>
          )}

          {/* Filter Dropdown */}
          {showFilterMenu && (
            <View style={styles.filterDropdown}>
              <TouchableOpacity
                style={[
                  styles.filterOption,
                  selectedFilters.date && styles.filterOptionActive,
                ]}
                onPress={handleFilterByDate}
              >
                <Text style={styles.filterOptionText}>PUBLISH DATE</Text>
                <View style={[styles.checkbox, selectedFilters.date && styles.checkboxActive]}>
                  {selectedFilters.date && (
                    <Ionicons name="checkmark" size={16} color={COLORS.white} />
                  )}
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.filterOption,
                  selectedFilters.length && styles.filterOptionActive,
                ]}
                onPress={handleFilterByLength}
              >
                <Text style={styles.filterOptionText}>EPISODE LENGTH</Text>
                <View style={[styles.checkbox, selectedFilters.length && styles.checkboxActive]}>
                  {selectedFilters.length && (
                    <Ionicons name="checkmark" size={16} color={COLORS.white} />
                  )}
                </View>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Episodes List */}
        <View style={styles.episodesContainer}>
          {episodes.map((episode) => (
            <TouchableOpacity
              key={episode.id}
              style={styles.episodeCard}
              onPress={() => handleEpisodePress(episode)}
            >
              <Image source={{ uri: episode.thumbnailUrl }} style={styles.episodeThumbnail} />
              <Text style={styles.episodeTitle}>{episode.title}</Text>
              <TouchableOpacity style={styles.playButton}>
                <Ionicons name="play-circle" size={32} color={COLORS.white} />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
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
  podcastHeader: {
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.xl,
  },
  podcastImage: {
    width: 150,
    height: 150,
    borderRadius: 12,
    marginBottom: SPACING.md,
  },
  podcastTitle: {
    fontSize: FONT_SIZES.xlarge,
    fontWeight: '700',
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  titleLine: {
    height: 1,
    backgroundColor: COLORS.white,
    width: '90%',
    marginBottom: SPACING.md,
  },
  genreLine: {
    height: 1,
    backgroundColor: COLORS.white,
    width: '90%',
    marginTop: SPACING.sm,
  },
  podcastDescription: {
    fontSize: FONT_SIZES.small,
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: SPACING.md,
    lineHeight: 20,
  },
  genreActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: SPACING.sm,
    marginBottom: SPACING.md,
  },
  genreFollowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  genreContainer: {
    borderWidth: 1,
    borderColor: COLORS.white,
    borderRadius: 20,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
  },
  genreText: {
    fontSize: FONT_SIZES.small,
    color: COLORS.white,
    fontWeight: '600',
  },
  followButton: {
    borderWidth: 1,
    borderColor: COLORS.white,
    borderRadius: 20,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  followButtonActive: {
    backgroundColor: COLORS.white + '20',
  },
  followButtonText: {
    fontSize: FONT_SIZES.small,
    color: COLORS.white,
    fontWeight: '600',
  },
  actionIcons: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  episodesContainer: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  episodeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white + '10',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.white + '60',
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  episodeThumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: SPACING.md,
  },
  episodeTitle: {
    flex: 1,
    fontSize: FONT_SIZES.medium,
    fontWeight: '600',
    color: COLORS.white,
    letterSpacing: 0.5,
  },
  playButton: {
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
  filterDropdown: {
    marginTop: SPACING.md,
    backgroundColor: '#1a237e',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.white + '60',
    overflow: 'hidden',
    width: '80%',
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
  },
  filterOptionActive: {
    backgroundColor: COLORS.white + '15',
  },
  filterOptionText: {
    fontSize: FONT_SIZES.medium,
    fontWeight: '600',
    color: COLORS.white,
    letterSpacing: 1,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxActive: {
    backgroundColor: COLORS.white + '30',
  },
  searchFieldContainer: {
    width: '100%',
    marginTop: SPACING.md,
    marginBottom: SPACING.md,
  },
  searchField: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.white,
    borderRadius: 8,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    fontSize: FONT_SIZES.medium,
    color: COLORS.white,
    minHeight: 45,
  },
});

export default PodcastProfileScreen;
