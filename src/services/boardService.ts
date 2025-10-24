import { supabase } from '../config/supabase';

/**
 * BoardService - Supabase backend implementation
 * Manages user boards and board types using Supabase database
 */

export interface BoardType {
  name: string;
  color: string;
}

export interface Board {
  id: string;
  name: string;
  types: BoardType[];
  createdAt: string;
  updatedAt: string;
}

// Helper to get current user ID
const getCurrentUserId = async (): Promise<string | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id || null;
};

class BoardService {
  /**
   * Get all boards for the current user with their types
   */
  async getBoards(): Promise<Board[]> {
    try {
      const userId = await getCurrentUserId();
      if (!userId) return [];

      // Get boards
      const { data: boardsData, error: boardsError } = await supabase
        .from('boards')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (boardsError) throw boardsError;
      if (!boardsData) return [];

      // Get board types for all boards
      const boardIds = boardsData.map(b => b.id);
      const { data: typesData, error: typesError } = await supabase
        .from('board_types')
        .select('*')
        .in('board_id', boardIds)
        .order('display_order', { ascending: true });

      if (typesError) throw typesError;

      // Map boards with their types
      return boardsData.map(board => ({
        id: board.id,
        name: board.name,
        types: (typesData || [])
          .filter(type => type.board_id === board.id)
          .map(type => ({
            name: type.name,
            color: type.color,
          })),
        createdAt: board.created_at,
        updatedAt: board.updated_at,
      }));
    } catch (error) {
      console.error('Error loading boards:', error);
      return [];
    }
  }

  /**
   * Create a new board with types
   */
  async createBoard(name: string, types: BoardType[]): Promise<Board> {
    try {
      const userId = await getCurrentUserId();
      if (!userId) throw new Error('User not authenticated');

      // Insert board
      const { data: boardData, error: boardError } = await supabase
        .from('boards')
        .insert({
          user_id: userId,
          name,
        })
        .select()
        .single();

      if (boardError) throw boardError;
      if (!boardData) throw new Error('Failed to create board');

      // Insert board types
      if (types.length > 0) {
        const typesInserts = types.map((type, index) => ({
          board_id: boardData.id,
          name: type.name,
          color: type.color,
          display_order: index,
        }));

        const { error: typesError } = await supabase
          .from('board_types')
          .insert(typesInserts);

        if (typesError) throw typesError;
      }

      return {
        id: boardData.id,
        name: boardData.name,
        types,
        createdAt: boardData.created_at,
        updatedAt: boardData.updated_at,
      };
    } catch (error) {
      console.error('Error creating board:', error);
      throw error;
    }
  }

  /**
   * Update an existing board
   */
  async updateBoard(id: string, updates: Partial<Omit<Board, 'id' | 'createdAt'>>): Promise<Board> {
    try {
      const userId = await getCurrentUserId();
      if (!userId) throw new Error('User not authenticated');

      // Update board name if provided
      if (updates.name) {
        const { error: boardError } = await supabase
          .from('boards')
          .update({ name: updates.name })
          .eq('id', id)
          .eq('user_id', userId);

        if (boardError) throw boardError;
      }

      // Update board types if provided
      if (updates.types) {
        // Delete existing types
        await supabase
          .from('board_types')
          .delete()
          .eq('board_id', id);

        // Insert new types
        if (updates.types.length > 0) {
          const typesInserts = updates.types.map((type, index) => ({
            board_id: id,
            name: type.name,
            color: type.color,
            display_order: index,
          }));

          const { error: typesError } = await supabase
            .from('board_types')
            .insert(typesInserts);

          if (typesError) throw typesError;
        }
      }

      // Fetch and return updated board
      const updatedBoard = await this.getBoardById(id);
      if (!updatedBoard) throw new Error('Board not found');

      return updatedBoard;
    } catch (error) {
      console.error('Error updating board:', error);
      throw error;
    }
  }

  /**
   * Delete a board (cascade deletes board_types and saved_podcasts)
   */
  async deleteBoard(id: string): Promise<void> {
    try {
      const userId = await getCurrentUserId();
      if (!userId) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('boards')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting board:', error);
      throw error;
    }
  }

  /**
   * Get a single board by ID with its types
   */
  async getBoardById(id: string): Promise<Board | null> {
    try {
      const userId = await getCurrentUserId();
      if (!userId) return null;

      // Get board
      const { data: boardData, error: boardError } = await supabase
        .from('boards')
        .select('*')
        .eq('id', id)
        .eq('user_id', userId)
        .single();

      if (boardError || !boardData) return null;

      // Get board types
      const { data: typesData, error: typesError } = await supabase
        .from('board_types')
        .select('*')
        .eq('board_id', id)
        .order('display_order', { ascending: true });

      if (typesError) throw typesError;

      return {
        id: boardData.id,
        name: boardData.name,
        types: (typesData || []).map(type => ({
          name: type.name,
          color: type.color,
        })),
        createdAt: boardData.created_at,
        updatedAt: boardData.updated_at,
      };
    } catch (error) {
      console.error('Error getting board:', error);
      return null;
    }
  }

  /**
   * Clear all boards for current user (for testing/development)
   */
  async clearAllBoards(): Promise<void> {
    try {
      const userId = await getCurrentUserId();
      if (!userId) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('boards')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;
    } catch (error) {
      console.error('Error clearing boards:', error);
      throw error;
    }
  }
}

export const boardService = new BoardService();
