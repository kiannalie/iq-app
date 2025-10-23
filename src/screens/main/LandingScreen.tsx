import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import SearchOverlay from '../../components/organisms/SearchOverlay';
import SideMenu from '../../components/organisms/SideMenu';
import RecentListenSection from '../../components/organisms/RecentListenSection';
import AuthorsYouFollowSection from '../../components/organisms/AuthorsYouFollowSection';
import RecommendationsSection from '../../components/organisms/RecommendationsSection';
import PopularInBusinessSection from '../../components/organisms/PopularInBusinessSection';
import PopularInHealthSection from '../../components/organisms/PopularInHealthSection';
import { listenNotesApi, PodcastEpisode, Podcast } from '../../services/listenNotesApi';
import { COLORS, SPACING } from '../../utils/constants';

const LandingScreen: React.FC = () => {
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

  const loadInitialData = async () => {
    try {
      // For now, using mock data. Replace with real API calls when you have API key
      const mockRecentEpisodes = listenNotesApi.getMockRecentListens();
      const mockRecommendations = listenNotesApi.getMockRecommendations();
      const mockBusinessPodcasts = listenNotesApi.getMockBusinessPodcasts();
      const mockHealthPodcasts = listenNotesApi.getMockHealthPodcasts();

      setRecentEpisodes(mockRecentEpisodes);
      setRecommendations(mockRecommendations);
      setBusinessPodcasts(mockBusinessPodcasts);
      setHealthPodcasts(mockHealthPodcasts);

      // Load followed podcasts from user preferences (implement later)
      setFollowedPodcasts([]);
    } catch (error) {
      console.error('Error loading initial data:', error);
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
    setShowSearchOverlay(true);
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
    console.log('Author pressed:', podcast.publisher_original);
    // Navigate to author/publisher page
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