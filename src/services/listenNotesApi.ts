// Listen Notes API Service
// Documentation: https://www.listennotes.com/api/docs/

const LISTEN_NOTES_BASE_URL = 'https://listen-api.listennotes.com/api/v2';

// TypeScript interfaces based on Listen Notes API
export interface PodcastEpisode {
  id: string;
  title: string;
  description_original: string;
  pub_date_ms: number;
  audio: string;
  audio_length_sec: number;
  image: string;
  podcast: {
    id: string;
    title_original: string;
    publisher_original: string;
    image: string;
    listen_score: number;
  };
}

export interface Podcast {
  id: string;
  title_original: string;
  description_original: string;
  publisher_original: string;
  image: string;
  listen_score: number;
  genre_ids: number[];
  total_episodes: number;
}

export interface SearchResponse {
  results: PodcastEpisode[];
  total: number;
  next_offset: number;
}

export interface PodcastSearchResponse {
  results: Podcast[];
  total: number;
  next_offset: number;
}

class ListenNotesAPI {
  private apiKey: string;

  constructor(apiKey: string = 'DEMO_API_KEY') {
    this.apiKey = apiKey;
  }

  private async makeRequest(endpoint: string, params: Record<string, any> = {}) {
    const url = new URL(`${LISTEN_NOTES_BASE_URL}${endpoint}`);

    // Add query parameters
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value.toString());
      }
    });

    try {
      const response = await fetch(url.toString(), {
        headers: {
          'X-ListenAPI-Key': this.apiKey,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Listen Notes API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Listen Notes API request failed:', error);
      throw error;
    }
  }

  // Search for episodes
  async searchEpisodes(query: string, offset: number = 0): Promise<SearchResponse> {
    return this.makeRequest('/search', {
      q: query,
      type: 'episode',
      offset,
      len_min: 10, // Minimum 10 minutes
      sort_by_date: 0, // Sort by relevance
    });
  }

  // Search for podcasts
  async searchPodcasts(query: string, offset: number = 0): Promise<PodcastSearchResponse> {
    return this.makeRequest('/search', {
      q: query,
      type: 'podcast',
      offset,
      sort_by_date: 0,
    });
  }

  // Get podcast details by ID
  async getPodcastById(id: string): Promise<Podcast> {
    return this.makeRequest(`/podcasts/${id}`);
  }

  // Get episode details by ID
  async getEpisodeById(id: string): Promise<PodcastEpisode> {
    return this.makeRequest(`/episodes/${id}`);
  }

  // Get trending/best podcasts (curated lists)
  async getBestPodcasts(genre_id?: number): Promise<PodcastSearchResponse> {
    return this.makeRequest('/best_podcasts', {
      genre_id,
      region: 'us',
      sort: 'listen_score',
    });
  }

  // Get recent episodes from a specific podcast
  async getPodcastEpisodes(podcastId: string, sort: string = 'recent_first'): Promise<{episodes: PodcastEpisode[]}> {
    return this.makeRequest(`/podcasts/${podcastId}`, {
      sort,
    });
  }

  // Mock data for development (when using demo API key)
  getMockRecentListens(): PodcastEpisode[] {
    return [
      {
        id: 'mock-1',
        title: 'Gap Gain Episode',
        description_original: 'Mock episode description',
        pub_date_ms: Date.now() - 86400000, // 1 day ago
        audio: '',
        audio_length_sec: 3600,
        image: 'https://via.placeholder.com/150x150/4a90e2/ffffff?text=GAP+GAIN',
        podcast: {
          id: 'mock-podcast-1',
          title_original: 'Gap Gain Podcast',
          publisher_original: 'Mock Publisher',
          image: 'https://via.placeholder.com/150x150/4a90e2/ffffff?text=GAP+GAIN',
          listen_score: 85,
        },
      },
      {
        id: 'mock-2',
        title: 'The Complete Show',
        description_original: 'Another mock episode',
        pub_date_ms: Date.now() - 172800000, // 2 days ago
        audio: '',
        audio_length_sec: 2400,
        image: 'https://via.placeholder.com/150x150/50c878/ffffff?text=COMPLETE',
        podcast: {
          id: 'mock-podcast-2',
          title_original: 'The Complete Show',
          publisher_original: 'Complete Media',
          image: 'https://via.placeholder.com/150x150/50c878/ffffff?text=COMPLETE',
          listen_score: 78,
        },
      },
    ];
  }

  getMockRecommendations(): Podcast[] {
    return [
      {
        id: 'mock-rec-1',
        title_original: 'Nail It & Scale It',
        description_original: 'Business growth podcast',
        publisher_original: 'Business Publishers',
        image: 'https://via.placeholder.com/150x150/ff6b6b/ffffff?text=NAIL+IT',
        listen_score: 92,
        genre_ids: [93, 111], // Business
        total_episodes: 150,
      },
      {
        id: 'mock-rec-2',
        title_original: 'Huberman Lab',
        description_original: 'Science and health podcast',
        publisher_original: 'Andrew Huberman',
        image: 'https://via.placeholder.com/150x150/4ecdc4/ffffff?text=HUBERMAN',
        listen_score: 95,
        genre_ids: [107], // Science
        total_episodes: 200,
      },
    ];
  }

  getMockBusinessPodcasts(): Podcast[] {
    return [
      {
        id: 'bus-1',
        title_original: 'The Tim Ferriss Show',
        description_original: 'Deconstructing world-class performers to find the tools and tactics you can use.',
        publisher_original: 'Tim Ferriss',
        image: 'https://via.placeholder.com/150x150/ff9500/ffffff?text=TIM+F',
        listen_score: 94,
        genre_ids: [93], // Business
        total_episodes: 600,
      },
      {
        id: 'bus-2',
        title_original: 'How I Built This',
        description_original: 'Stories behind some of the worlds best known companies.',
        publisher_original: 'NPR',
        image: 'https://via.placeholder.com/150x150/007acc/ffffff?text=HIBT',
        listen_score: 91,
        genre_ids: [93, 111], // Business, Entrepreneurship
        total_episodes: 400,
      },
      {
        id: 'bus-3',
        title_original: 'Masters of Scale',
        description_original: 'How companies grow from zero to a gazillion.',
        publisher_original: 'WaitWhat',
        image: 'https://via.placeholder.com/150x150/8e44ad/ffffff?text=SCALE',
        listen_score: 89,
        genre_ids: [93], // Business
        total_episodes: 200,
      },
      {
        id: 'bus-4',
        title_original: 'StartUp Podcast',
        description_original: 'A series about what its really like to get a business off the ground.',
        publisher_original: 'Gimlet',
        image: 'https://via.placeholder.com/150x150/27ae60/ffffff?text=START',
        listen_score: 87,
        genre_ids: [93, 111], // Business, Entrepreneurship
        total_episodes: 50,
      },
    ];
  }

  getMockHealthPodcasts(): Podcast[] {
    return [
      {
        id: 'health-1',
        title_original: 'The Peter Attia Drive',
        description_original: 'A deep dive into longevity, performance, and optimal health.',
        publisher_original: 'Peter Attia MD',
        image: 'https://via.placeholder.com/150x150/e74c3c/ffffff?text=ATTIA',
        listen_score: 93,
        genre_ids: [122], // Health & Fitness
        total_episodes: 250,
      },
      {
        id: 'health-2',
        title_original: 'The Model Health Show',
        description_original: 'Taking your health to the next level with practical tips.',
        publisher_original: 'Shawn Stevenson',
        image: 'https://via.placeholder.com/150x150/2ecc71/ffffff?text=MODEL',
        listen_score: 90,
        genre_ids: [122], // Health & Fitness
        total_episodes: 500,
      },
      {
        id: 'health-3',
        title_original: 'Ben Greenfield Life',
        description_original: 'Biohacking, fat loss, anti-aging, and cutting-edge health.',
        publisher_original: 'Ben Greenfield',
        image: 'https://via.placeholder.com/150x150/3498db/ffffff?text=BEN+G',
        listen_score: 88,
        genre_ids: [122], // Health & Fitness
        total_episodes: 800,
      },
      {
        id: 'health-4',
        title_original: 'Mind Pump',
        description_original: 'Raw fitness truth about fat loss, muscle building, and health.',
        publisher_original: 'Mind Pump Media',
        image: 'https://via.placeholder.com/150x150/f39c12/ffffff?text=MIND',
        listen_score: 86,
        genre_ids: [122], // Health & Fitness
        total_episodes: 2000,
      },
    ];
  }
}

// Export singleton instance
export const listenNotesApi = new ListenNotesAPI();

// Export types for use in components
export type { PodcastEpisode, Podcast, SearchResponse, PodcastSearchResponse };