# Database Migration Checklist

This document tracks all features currently using local storage (AsyncStorage) that need to be migrated to Supabase database backend.

## Current Status: Local Storage (AsyncStorage)

All user data is currently stored locally on the device. Data will be lost if:
- User uninstalls the app
- User switches devices
- App data is cleared

---

## 🔴 PRIORITY 1: Boards System

**Current Implementation:**
- File: `src/services/boardService.ts`
- Storage: AsyncStorage with key `@iqapp:boards`
- Features:
  - Create board with name and multiple board types
  - Load all user's boards
  - Update board details
  - Delete boards

**Database Requirements:**

### Tables Needed:

```sql
-- Boards table
CREATE TABLE boards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Board types table (many-to-one with boards)
CREATE TABLE board_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  board_id UUID NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT NOT NULL, -- Hex color code
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_boards_user_id ON boards(user_id);
CREATE INDEX idx_board_types_board_id ON board_types(board_id);
```

### Row Level Security (RLS):

```sql
-- Enable RLS
ALTER TABLE boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE board_types ENABLE ROW LEVEL SECURITY;

-- Users can only see their own boards
CREATE POLICY "Users can view their own boards"
  ON boards FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own boards"
  ON boards FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own boards"
  ON boards FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own boards"
  ON boards FOR DELETE
  USING (auth.uid() = user_id);

-- Board types follow board permissions
CREATE POLICY "Users can view board types for their boards"
  ON board_types FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM boards
      WHERE boards.id = board_types.board_id
      AND boards.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert board types for their boards"
  ON board_types FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM boards
      WHERE boards.id = board_types.board_id
      AND boards.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update board types for their boards"
  ON board_types FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM boards
      WHERE boards.id = board_types.board_id
      AND boards.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete board types for their boards"
  ON board_types FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM boards
      WHERE boards.id = board_types.board_id
      AND boards.user_id = auth.uid()
    )
  );
```

### API Functions Needed:

Update `src/services/boardService.ts` to use Supabase:

```typescript
// Example migration for createBoard function:
async createBoard(name: string, types: BoardType[]): Promise<Board> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Insert board
  const { data: board, error: boardError } = await supabase
    .from('boards')
    .insert({ user_id: user.id, name })
    .select()
    .single();

  if (boardError) throw boardError;

  // Insert board types
  const boardTypesData = types.map((type, index) => ({
    board_id: board.id,
    name: type.name,
    color: type.color,
    display_order: index,
  }));

  const { error: typesError } = await supabase
    .from('board_types')
    .insert(boardTypesData);

  if (typesError) throw typesError;

  return {
    id: board.id,
    name: board.name,
    types,
    createdAt: board.created_at,
    updatedAt: board.updated_at,
  };
}
```

### Migration Steps:

1. ✅ Create Supabase tables (see SQL above)
2. ✅ Set up RLS policies
3. ✅ Update `boardService.ts` to use Supabase client
4. ✅ Test CRUD operations
5. ✅ Create data migration script to move existing AsyncStorage data to Supabase
6. ✅ Add offline support with local caching
7. ✅ Handle sync conflicts

---

## 🟡 FUTURE: User Preferences & Settings

**Will need migration when implemented:**
- User profile settings
- App preferences (theme, notifications, etc.)
- Tutorial/onboarding completion status

**Table Structure:**
```sql
CREATE TABLE user_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  preferences JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 🟡 FUTURE: Podcast/Episode Favorites

**Will need migration when implemented:**
- Saved podcasts
- Favorite episodes
- Listening history

**Table Structure:**
```sql
CREATE TABLE saved_podcasts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  podcast_id TEXT NOT NULL, -- From Listen Notes API
  board_id UUID REFERENCES boards(id) ON DELETE SET NULL,
  saved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE saved_episodes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  episode_id TEXT NOT NULL, -- From Listen Notes API
  board_id UUID REFERENCES boards(id) ON DELETE SET NULL,
  saved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE listening_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  episode_id TEXT NOT NULL,
  position INTEGER DEFAULT 0, -- Playback position in seconds
  completed BOOLEAN DEFAULT FALSE,
  last_played_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 🟢 Already Using Database

### Authentication
- Using Supabase Auth
- No migration needed
- Users table managed by Supabase

---

## Migration Strategy

### Phase 1: Board System (CURRENT PRIORITY)
1. Set up Supabase tables
2. Update boardService to use Supabase
3. Implement data sync
4. Add offline support

### Phase 2: User Preferences
1. Create preferences table
2. Migrate settings to database
3. Real-time preference sync

### Phase 3: Content Management
1. Create content tables
2. Link content to boards
3. Implement content sync

---

## Testing Checklist

Before migration:
- [ ] Export all test data from AsyncStorage
- [ ] Document current data structure
- [ ] Create backup mechanism

During migration:
- [ ] Test all CRUD operations with Supabase
- [ ] Verify RLS policies work correctly
- [ ] Test offline functionality
- [ ] Test sync after reconnection
- [ ] Test multi-device sync

After migration:
- [ ] Verify all existing data migrated correctly
- [ ] Monitor error logs
- [ ] Test data recovery process

---

## Files to Update During Migration

### Core Service Files:
- [ ] `src/services/boardService.ts` - Replace AsyncStorage with Supabase calls
- [ ] Create `src/services/supabaseClient.ts` if not exists
- [ ] Create `src/services/syncService.ts` for offline sync

### Screens:
- [ ] `src/screens/main/LibraryScreen.tsx` - Update error handling
- [ ] `src/screens/main/AddBoardScreen.tsx` - Update error handling

### Context:
- [ ] Consider creating `BoardContext` for state management

### Configuration:
- [ ] Update `.env` with Supabase credentials
- [ ] Update Supabase dashboard settings

---

## Rollback Plan

If migration fails:
1. Keep AsyncStorage code in a separate branch
2. Have feature flag to toggle between storage methods
3. Maintain data export functionality
4. Document rollback procedure

---

## Notes

- All TODO comments in `boardService.ts` mark locations that need database updates
- Keep the same interface (function signatures) to minimize screen changes
- Consider implementing optimistic updates for better UX
- Plan for data migration script to move existing user data
