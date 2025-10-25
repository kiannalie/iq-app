import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import SearchOverlay from '../../components/organisms/SearchOverlay';
import SideMenu from '../../components/organisms/SideMenu';
import RecentListenSection from '../../components/organisms/RecentListenSection';
import AuthorsYouFollowSection from '../../components/organisms/AuthorsYouFollowSection';
import RecommendationsSection from '../../components/organisms/RecommendationsSection';
import PopularInBusinessSection from '../../components/organisms/PopularInBusinessSection';
import PopularInHealthSection from '../../components/organisms/PopularInHealthSection';
import { listenNotesApi, PodcastEpisode, Podcast } from '../../services/listenNotesApi';
import { HomeStackParamList } from '../../navigation/HomeNavigator';
import { COLORS, SPACING } from '../../utils/constants';
import { useAuth } from '../../context/AuthContext';
import { shouldUseMockData } from '../../config/devConfig';

type LandingScreenNavigationProp = StackNavigationProp<HomeStackParamList, 'HomeMain'>;

const LandingScreen: React.FC = () => {
  const navigation = useNavigation<LandingScreenNavigationProp>();
  const { userData, signOut } = useAuth();
  const [recentEpisodes, setRecentEpisodes] = useState<PodcastEpisode[]>([]);
  const [followedPodcasts, setFollowedPodcasts] = useState<Podcast[]>([]);
  const [recommendations, setRecommendations] = useState<Podcast[]>([]);
  const [businessPodcasts, setBusinessPodcasts] = useState<Podcast[]>([]);
  const [healthPodcasts, setHealthPodcasts] = useState<Podcast[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchOverlay, setShowSearchOverlay] = useState(false);
  const [showSideMenu, setShowSideMenu] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    // Update followed podcasts when userData changes
    if (userData?.followedPodcasts) {
      // Convert FollowedPodcast to Podcast format
      const followed: Podcast[] = userData.followedPodcasts.map(fp => ({
        id: fp.id,
        title_original: fp.title,
        description_original: '',
        publisher_original: fp.publisher,
        image: fp.image,
        listen_score: 0,
        genre_ids: [],
        total_episodes: 0,
      }));
      setFollowedPodcasts(followed);
    }
  }, [userData]);

  const loadInitialData = async () => {
    try {
      if (shouldUseMockData()) {
        // Use mock data in dev mode - NO API CALLS
        console.log('🔧 DEV MODE: Using mock data (no API calls)');
        const mockRecentEpisodes = listenNotesApi.getMockRecentListens();
        const mockRecommendations = listenNotesApi.getMockRecommendations();
        const mockBusinessPodcasts = listenNotesApi.getMockBusinessPodcasts();
        const mockHealthPodcasts = listenNotesApi.getMockHealthPodcasts();

        setRecentEpisodes(mockRecentEpisodes);
        setRecommendations(mockRecommendations);
        setBusinessPodcasts(mockBusinessPodcasts);
        setHealthPodcasts(mockHealthPodcasts);
      } else {
        // Production mode - use real API
        console.log('🌐 PRODUCTION MODE: Making API calls');
        const [businessResponse, healthResponse] = await Promise.all([
          listenNotesApi.getBestPodcasts(93), // Business podcasts
          listenNotesApi.getBestPodcasts(122), // Health & Fitness podcasts
        ]);

        setRecentEpisodes(listenNotesApi.getMockRecentListens()); // Keep mock for now since we need user history
        setRecommendations(businessResponse?.results?.slice(0, 2) || []);
        setBusinessPodcasts(businessResponse?.results?.slice(0, 4) || []);
        setHealthPodcasts(healthResponse?.results?.slice(0, 4) || []);
      }
    } catch (error) {
      console.error('Error loading initial data:', error);
      // Fallback to mock data if API fails
      const mockRecentEpisodes = listenNotesApi.getMockRecentListens();
      const mockRecommendations = listenNotesApi.getMockRecommendations();
      const mockBusinessPodcasts = listenNotesApi.getMockBusinessPodcasts();
      const mockHealthPodcasts = listenNotesApi.getMockHealthPodcasts();

      setRecentEpisodes(mockRecentEpisodes);
      setRecommendations(mockRecommendations);
      setBusinessPodcasts(mockBusinessPodcasts);
      setHealthPodcasts(mockHealthPodcasts);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim().length > 0) {
      try {
        // Implement search functionality
        console.log('Searching for:', query);
        // const searchResults = await listenNotesApi.searchEpisodes(query);
        // Handle search results
      } catch (error) {
        console.error('Search error:', error);
      }
    }
  };

  const handleSearchIconPress = () => {
    navigation.navigate('Search');
  };

  const handleCloseSearchOverlay = () => {
    setShowSearchOverlay(false);
  };

  const handleEpisodePress = (episode: PodcastEpisode) => {
    console.log('Episode pressed:', episode.title);
    // Navigate to episode player
  };

  const handlePodcastPress = (podcast: Podcast) => {
    console.log('Podcast pressed:', podcast.title_original);
    // Navigate to podcast details
  };

  const handleAuthorPress = (podcast: Podcast) => {
    // Navigate to podcast profile
    navigation.navigate('PodcastProfile', { podcastId: podcast.id });
  };

  const handleMenuPress = () => {
    setShowSideMenu(true);
  };

  const handleCloseSideMenu = () => {
    setShowSideMenu(false);
  };

  const handleSettings = () => {
    console.log('Settings pressed');
    setShowSideMenu(false);
    // TODO: Navigate to settings when screen is created
  };

  const handleFeedback = () => {
    setShowSideMenu(false);
    // Navigate to Library tab and then to Feedback screen
    (navigation as any).navigate('Library', {
      screen: 'Feedback',
    });
  };

  const handleLogout = async () => {
    try {
      await signOut();
      setShowSideMenu(false);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" backgroundColor={COLORS.primary} />

      <View style={styles.header}>
        <TouchableOpacity style={styles.searchButton} onPress={handleSearchIconPress}>
          <Ionicons name="search" size={24} color={COLORS.white} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuButton} onPress={handleMenuPress}>
          <Ionicons name="menu" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <RecentListenSection
          episodes={recentEpisodes}
          onEpisodePress={handleEpisodePress}
        />

        <AuthorsYouFollowSection
          followedPodcasts={followedPodcasts}
          onAuthorPress={handleAuthorPress}
        />

        <RecommendationsSection
          recommendations={recommendations}
          onPodcastPress={handlePodcastPress}
        />

        <PopularInBusinessSection
          businessPodcasts={businessPodcasts}
          onPodcastPress={handlePodcastPress}
        />

        <PopularInHealthSection
          healthPodcasts={healthPodcasts}
          onPodcastPress={handlePodcastPress}
        />

        {/* Add some bottom padding for better scrolling */}
        <View style={styles.bottomPadding} />
      </ScrollView>

      <SearchOverlay
        visible={showSearchOverlay}
        onClose={handleCloseSearchOverlay}
        onSearch={handleSearch}
        placeholder="Search titles"
      />

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
  scrollContent: {
    paddingBottom: SPACING.xl,
  },
  bottomPadding: {
    height: SPACING.xxl,
  },
});

export default LandingScreen;