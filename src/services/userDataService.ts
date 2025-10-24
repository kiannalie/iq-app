import { supabase } from '../config/supabase';

// User data interfaces
export interface FollowedPodcast {
  id: string;
  title: string;
  publisher: string;
  image: string;
  followedAt: number; // timestamp
}

export interface SavedPodcast {
  podcastId: string;
  episodeId?: string;
  title: string;
  image: string;
  savedAt: number;
  boardId?: string; // Which board it's saved to
}

export interface ListeningHistory {
  episodeId: string;
  podcastId: string;
  title: string;
  image: string;
  lastPlayedAt: number;
  progress: number; // 0-100 percentage
  duration: number; // in seconds
}

export interface UserData {
  userId: string;
  followedPodcasts: FollowedPodcast[];
  savedPodcasts: SavedPodcast[];
  listeningHistory: ListeningHistory[];
  preferences: {
    autoPlay: boolean;
    playbackSpeed: number;
    downloadQuality: 'high' | 'medium' | 'low';
  };
}

// Helper to get current user ID
const getCurrentUserId = async (): Promise<string | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id || null;
};

class UserDataService {
  // ==================== FOLLOWED PODCASTS ====================

  async getFollowedPodcasts(): Promise<FollowedPodcast[]> {
    try {
      const userId = await getCurrentUserId();
      if (!userId) return [];

      const { data, error } = await supabase
        .from('followed_podcasts')
        .select('*')
        .eq('user_id', userId)
        .order('followed_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(row => ({
        id: row.podcast_id,
        title: row.title,
        publisher: row.publisher || '',
        image: row.image_url || '',
        followedAt: new Date(row.followed_at).getTime(),
      }));
    } catch (error) {
      console.error('Error getting followed podcasts:', error);
      return [];
    }
  }

  async followPodcast(podcast: Omit<FollowedPodcast, 'followedAt'>): Promise<void> {
    try {
      const userId = await getCurrentUserId();
      if (!userId) throw new Error('User not authenticated');

      // Supabase has a UNIQUE constraint, so this will fail if already following
      const { error } = await supabase
        .from('followed_podcasts')
        .insert({
          user_id: userId,
          podcast_id: podcast.id,
          title: podcast.title,
          publisher: podcast.publisher,
          image_url: podcast.image,
        });

      if (error) {
        // If duplicate key error, it's already followed
        if (error.code === '23505') {
          console.log('Already following this podcast');
          return;
        }
        throw error;
      }
    } catch (error) {
      console.error('Error following podcast:', error);
      throw error;
    }
  }

  async unfollowPodcast(podcastId: string): Promise<void> {
    try {
      const userId = await getCurrentUserId();
      if (!userId) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('followed_podcasts')
        .delete()
        .eq('user_id', userId)
        .eq('podcast_id', podcastId);

      if (error) throw error;
    } catch (error) {
      console.error('Error unfollowing podcast:', error);
      throw error;
    }
  }

  async isFollowing(podcastId: string): Promise<boolean> {
    try {
      const userId = await getCurrentUserId();
      if (!userId) return false;

      const { data, error } = await supabase
        .from('followed_podcasts')
        .select('id')
        .eq('user_id', userId)
        .eq('podcast_id', podcastId)
        .limit(1);

      if (error) throw error;

      return (data?.length || 0) > 0;
    } catch (error) {
      console.error('Error checking if following:', error);
      return false;
    }
  }

  // ==================== SAVED PODCASTS ====================

  async getSavedPodcasts(boardId?: string): Promise<SavedPodcast[]> {
    try {
      const userId = await getCurrentUserId();
      if (!userId) return [];

      let query = supabase
        .from('saved_podcasts')
        .select('*')
        .eq('user_id', userId);

      if (boardId) {
        query = query.eq('board_id', boardId);
      }

      const { data, error } = await query.order('saved_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(row => ({
        podcastId: row.podcast_id,
        episodeId: row.episode_id || undefined,
        title: row.title,
        image: row.image_url || '',
        savedAt: new Date(row.saved_at).getTime(),
        boardId: row.board_id || undefined,
      }));
    } catch (error) {
      console.error('Error getting saved podcasts:', error);
      return [];
    }
  }

  async savePodcast(podcast: Omit<SavedPodcast, 'savedAt'>): Promise<void> {
    try {
      const userId = await getCurrentUserId();
      if (!userId) throw new Error('User not authenticated');

      // Try to insert - if unique constraint fails, update instead
      const { error } = await supabase
        .from('saved_podcasts')
        .upsert({
          user_id: userId,
          podcast_id: podcast.podcastId,
          episode_id: podcast.episodeId || null,
          title: podcast.title,
          image_url: podcast.image,
          board_id: podcast.boardId || null,
        }, {
          onConflict: 'user_id,podcast_id,episode_id'
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error saving podcast:', error);
      throw error;
    }
  }

  async unsavePodcast(podcastId: string, episodeId?: string): Promise<void> {
    try {
      const userId = await getCurrentUserId();
      if (!userId) throw new Error('User not authenticated');

      let query = supabase
        .from('saved_podcasts')
        .delete()
        .eq('user_id', userId)
        .eq('podcast_id', podcastId);

      if (episodeId) {
        query = query.eq('episode_id', episodeId);
      }

      const { error } = await query;

      if (error) throw error;
    } catch (error) {
      console.error('Error unsaving podcast:', error);
      throw error;
    }
  }

  async isSaved(podcastId: string, episodeId?: string): Promise<boolean> {
    try {
      const userId = await getCurrentUserId();
      if (!userId) return false;

      let query = supabase
        .from('saved_podcasts')
        .select('id')
        .eq('user_id', userId)
        .eq('podcast_id', podcastId);

      if (episodeId) {
        query = query.eq('episode_id', episodeId);
      }

      const { data, error } = await query.limit(1);

      if (error) throw error;

      return (data?.length || 0) > 0;
    } catch (error) {
      console.error('Error checking if saved:', error);
      return false;
    }
  }

  // ==================== LISTENING HISTORY ====================

  async getListeningHistory(limit: number = 10): Promise<ListeningHistory[]> {
    try {
      const userId = await getCurrentUserId();
      if (!userId) return [];

      let query = supabase
        .from('listening_history')
        .select('*')
        .eq('user_id', userId)
        .order('last_played_at', { ascending: false });

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) throw error;

      return (data || []).map(row => ({
        episodeId: row.episode_id,
        podcastId: row.podcast_id,
        title: row.title,
        image: row.image_url || '',
        lastPlayedAt: new Date(row.last_played_at).getTime(),
        progress: parseFloat(row.progress) || 0,
        duration: row.duration || 0,
      }));
    } catch (error) {
      console.error('Error getting listening history:', error);
      return [];
    }
  }

  async addToListeningHistory(episode: Omit<ListeningHistory, 'lastPlayedAt'>): Promise<void> {
    try {
      const userId = await getCurrentUserId();
      if (!userId) throw new Error('User not authenticated');

      // Upsert will update if exists, insert if not
      const { error } = await supabase
        .from('listening_history')
        .upsert({
          user_id: userId,
          episode_id: episode.episodeId,
          podcast_id: episode.podcastId,
          title: episode.title,
          image_url: episode.image,
          progress: episode.progress,
          duration: episode.duration,
        }, {
          onConflict: 'user_id,episode_id'
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error adding to listening history:', error);
      throw error;
    }
  }

  async updatePlaybackProgress(episodeId: string, progress: number): Promise<void> {
    try {
      const userId = await getCurrentUserId();
      if (!userId) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('listening_history')
        .update({
          progress,
          last_played_at: new Date().toISOString(),
        })
        .eq('user_id', userId)
        .eq('episode_id', episodeId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating playback progress:', error);
      throw error;
    }
  }

  async clearListeningHistory(): Promise<void> {
    try {
      const userId = await getCurrentUserId();
      if (!userId) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('listening_history')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;
    } catch (error) {
      console.error('Error clearing listening history:', error);
      throw error;
    }
  }

  // ==================== USER PREFERENCES ====================

  async getUserPreferences(): Promise<UserData['preferences']> {
    try {
      const userId = await getCurrentUserId();
      if (!userId) {
        return {
          autoPlay: true,
          playbackSpeed: 1.0,
          downloadQuality: 'high',
        };
      }

      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', userId)
        .limit(1)
        .single();

      if (error) {
        // If no preferences found, return defaults
        if (error.code === 'PGRST116') {
          return {
            autoPlay: true,
            playbackSpeed: 1.0,
            downloadQuality: 'high',
          };
        }
        throw error;
      }

      return {
        autoPlay: data.auto_play ?? true,
        playbackSpeed: parseFloat(data.playback_speed) || 1.0,
        downloadQuality: data.download_quality || 'high',
      };
    } catch (error) {
      console.error('Error getting user preferences:', error);
      return {
        autoPlay: true,
        playbackSpeed: 1.0,
        downloadQuality: 'high',
      };
    }
  }

  async updateUserPreferences(preferences: Partial<UserData['preferences']>): Promise<void> {
    try {
      const userId = await getCurrentUserId();
      if (!userId) throw new Error('User not authenticated');

      const updateData: any = {};
      if (preferences.autoPlay !== undefined) updateData.auto_play = preferences.autoPlay;
      if (preferences.playbackSpeed !== undefined) updateData.playback_speed = preferences.playbackSpeed;
      if (preferences.downloadQuality !== undefined) updateData.download_quality = preferences.downloadQuality;

      const { error } = await supabase
        .from('user_preferences')
        .update(updateData)
        .eq('user_id', userId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating user preferences:', error);
      throw error;
    }
  }

  // ==================== UTILITY METHODS ====================

  async getAllUserData(userId: string): Promise<UserData> {
    try {
      const [followedPodcasts, savedPodcasts, listeningHistory, preferences] = await Promise.all([
        this.getFollowedPodcasts(),
        this.getSavedPodcasts(),
        this.getListeningHistory(),
        this.getUserPreferences(),
      ]);

      return {
        userId,
        followedPodcasts,
        savedPodcasts,
        listeningHistory,
        preferences,
      };
    } catch (error) {
      console.error('Error getting all user data:', error);
      throw error;
    }
  }

  async clearAllUserData(): Promise<void> {
    try {
      const userId = await getCurrentUserId();
      if (!userId) throw new Error('User not authenticated');

      // Delete all user data from Supabase
      await Promise.all([
        supabase.from('followed_podcasts').delete().eq('user_id', userId),
        supabase.from('saved_podcasts').delete().eq('user_id', userId),
        supabase.from('listening_history').delete().eq('user_id', userId),
        // Note: We don't delete user_preferences as they're created on signup
      ]);
    } catch (error) {
      console.error('Error clearing all user data:', error);
      throw error;
    }
  }

  // Export user data for backup
  async exportUserData(userId: string): Promise<string> {
    try {
      const userData = await this.getAllUserData(userId);
      return JSON.stringify(userData, null, 2);
    } catch (error) {
      console.error('Error exporting user data:', error);
      throw error;
    }
  }

  // Import user data from backup
  async importUserData(jsonData: string): Promise<void> {
    try {
      const userId = await getCurrentUserId();
      if (!userId) throw new Error('User not authenticated');

      const userData: UserData = JSON.parse(jsonData);

      // Import followed podcasts
      const followedInserts = userData.followedPodcasts.map(p => ({
        user_id: userId,
        podcast_id: p.id,
        title: p.title,
        publisher: p.publisher,
        image_url: p.image,
      }));

      // Import saved podcasts
      const savedInserts = userData.savedPodcasts.map(p => ({
        user_id: userId,
        podcast_id: p.podcastId,
        episode_id: p.episodeId || null,
        title: p.title,
        image_url: p.image,
        board_id: p.boardId || null,
      }));

      // Import listening history
      const historyInserts = userData.listeningHistory.map(h => ({
        user_id: userId,
        episode_id: h.episodeId,
        podcast_id: h.podcastId,
        title: h.title,
        image_url: h.image,
        progress: h.progress,
        duration: h.duration,
      }));

      // Perform all imports
      await Promise.all([
        followedInserts.length > 0
          ? supabase.from('followed_podcasts').insert(followedInserts)
          : Promise.resolve(),
        savedInserts.length > 0
          ? supabase.from('saved_podcasts').insert(savedInserts)
          : Promise.resolve(),
        historyInserts.length > 0
          ? supabase.from('listening_history').insert(historyInserts)
          : Promise.resolve(),
      ]);
    } catch (error) {
      console.error('Error importing user data:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const userDataService = new UserDataService();
