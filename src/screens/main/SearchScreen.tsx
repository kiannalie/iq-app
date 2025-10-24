import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import SideMenu from '../../components/organisms/SideMenu';
import { HomeStackParamList } from '../../navigation/HomeNavigator';
import { COLORS, FONT_SIZES, SPACING } from '../../utils/constants';
import { listenNotesApi, Podcast } from '../../services/listenNotesApi';
import { shouldUseMockData } from '../../config/devConfig';

interface SearchResult {
  id: string;
  title: string;
  thumbnailUrl: string;
  podcastId: string;
}

type SearchScreenNavigationProp = StackNavigationProp<HomeStackParamList, 'Search'>;

const SearchScreen: React.FC = () => {
  const navigation = useNavigation<SearchScreenNavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showSideMenu, setShowSideMenu] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);

    if (query.trim().length === 0) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    setIsSearching(true);

    // Debounce search by 500ms to reduce API calls
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        if (shouldUseMockData()) {
          // Dev mode - use mock search results
          console.log('🔧 DEV MODE: Using mock search results');
          const mockPodcasts = listenNotesApi.getMockBusinessPodcasts();
          const filtered = mockPodcasts.filter(p =>
            p.title_original.toLowerCase().includes(query.toLowerCase())
          );

          const results: SearchResult[] = filtered.map((podcast: Podcast) => ({
            id: podcast.id,
            title: (podcast.title_original || 'Untitled').toUpperCase(),
            thumbnailUrl: podcast.image || 'https://via.placeholder.com/60x60/4169E1/ffffff?text=P',
            podcastId: podcast.id,
          }));

          setSearchResults(results);
        } else {
          // Production mode - real API search
          const response = await listenNotesApi.searchPodcasts(query);

          const results: SearchResult[] = response.results.map((podcast: Podcast) => ({
            id: podcast.id,
            title: (podcast.title_original || 'Untitled').toUpperCase(),
            thumbnailUrl: podcast.image || 'https://via.placeholder.com/60x60/4169E1/ffffff?text=P',
            podcastId: podcast.id,
          }));

          setSearchResults(results);
        }
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 500);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleResultPress = (result: SearchResult) => {
    navigation.navigate('PodcastProfile', { podcastId: result.podcastId });
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" backgroundColor={COLORS.primary} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.searchButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuButton} onPress={handleMenuPress}>
          <Ionicons name="menu" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={handleSearch}
          placeholder="Search titles"
          placeholderTextColor={COLORS.primary + '80'}
          autoFocus
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity style={styles.clearButton} onPress={handleClearSearch}>
            <Ionicons name="close" size={20} color={COLORS.primary} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Search Results */}
        {isSearching ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Searching...</Text>
          </View>
        ) : searchResults.length > 0 ? (
          <View style={styles.resultsContainer}>
            {searchResults.map((result) => (
              <TouchableOpacity
                key={result.id}
                style={styles.resultCard}
                onPress={() => handleResultPress(result)}
              >
                <Image source={{ uri: result.thumbnailUrl }} style={styles.thumbnail} />
                <Text style={styles.resultTitle}>{result.title}</Text>
                <Ionicons name="chevron-forward" size={24} color={COLORS.white} />
              </TouchableOpacity>
            ))}
          </View>
        ) : searchQuery.length > 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No results found</Text>
          </View>
        ) : null}
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 25,
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.lg,
    paddingHorizontal: SPACING.md,
  },
  searchInput: {
    flex: 1,
    fontSize: FONT_SIZES.medium,
    color: COLORS.primary,
    paddingVertical: SPACING.sm,
  },
  clearButton: {
    padding: SPACING.xs,
  },
  scrollView: {
    flex: 1,
  },
  resultsContainer: {
    paddingHorizontal: SPACING.md,
  },
  resultCard: {
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
  resultTitle: {
    flex: 1,
    fontSize: FONT_SIZES.large,
    fontWeight: '600',
    color: COLORS.white,
    letterSpacing: 0.5,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
  },
  loadingText: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.white,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
  },
  emptyText: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.white + '80',
  },
});

export default SearchScreen;
