-- IQApp Database Schema for Supabase
-- Run this SQL in your Supabase SQL Editor to create all tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- PROFILES TABLE
-- Extends auth.users with additional user information
-- =====================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- =====================================================
-- FOLLOWED PODCASTS TABLE
-- Stores podcasts that users follow
-- =====================================================
CREATE TABLE IF NOT EXISTS public.followed_podcasts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    podcast_id TEXT NOT NULL,
    title TEXT NOT NULL,
    publisher TEXT,
    image_url TEXT,
    followed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, podcast_id)
);

ALTER TABLE public.followed_podcasts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own followed podcasts"
    ON public.followed_podcasts FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own followed podcasts"
    ON public.followed_podcasts FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own followed podcasts"
    ON public.followed_podcasts FOR DELETE
    USING (auth.uid() = user_id);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_followed_podcasts_user_id ON public.followed_podcasts(user_id);

-- =====================================================
-- BOARDS TABLE
-- User-created boards for organizing podcasts
-- =====================================================
CREATE TABLE IF NOT EXISTS public.boards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.boards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own boards"
    ON public.boards FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own boards"
    ON public.boards FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own boards"
    ON public.boards FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own boards"
    ON public.boards FOR DELETE
    USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_boards_user_id ON public.boards(user_id);

-- =====================================================
-- BOARD TYPES TABLE
-- Color-coded categories for boards
-- =====================================================
CREATE TABLE IF NOT EXISTS public.board_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    board_id UUID NOT NULL REFERENCES public.boards(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    color TEXT NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0
);

ALTER TABLE public.board_types ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view board types for their own boards"
    ON public.board_types FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.boards
            WHERE boards.id = board_types.board_id
            AND boards.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert board types for their own boards"
    ON public.board_types FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.boards
            WHERE boards.id = board_types.board_id
            AND boards.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update board types for their own boards"
    ON public.board_types FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.boards
            WHERE boards.id = board_types.board_id
            AND boards.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete board types for their own boards"
    ON public.board_types FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.boards
            WHERE boards.id = board_types.board_id
            AND boards.user_id = auth.uid()
        )
    );

CREATE INDEX IF NOT EXISTS idx_board_types_board_id ON public.board_types(board_id);

-- =====================================================
-- SAVED PODCASTS TABLE
-- Episodes/podcasts saved to boards
-- =====================================================
CREATE TABLE IF NOT EXISTS public.saved_podcasts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    board_id UUID REFERENCES public.boards(id) ON DELETE SET NULL,
    podcast_id TEXT NOT NULL,
    episode_id TEXT,
    title TEXT NOT NULL,
    image_url TEXT,
    saved_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, podcast_id, episode_id)
);

ALTER TABLE public.saved_podcasts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own saved podcasts"
    ON public.saved_podcasts FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own saved podcasts"
    ON public.saved_podcasts FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own saved podcasts"
    ON public.saved_podcasts FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved podcasts"
    ON public.saved_podcasts FOR DELETE
    USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_saved_podcasts_user_id ON public.saved_podcasts(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_podcasts_board_id ON public.saved_podcasts(board_id);

-- =====================================================
-- LISTENING HISTORY TABLE
-- Track user's listening activity and progress
-- =====================================================
CREATE TABLE IF NOT EXISTS public.listening_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    episode_id TEXT NOT NULL,
    podcast_id TEXT NOT NULL,
    title TEXT NOT NULL,
    image_url TEXT,
    progress DECIMAL(5,2) DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    duration INTEGER, -- in seconds
    last_played_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, episode_id)
);

ALTER TABLE public.listening_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own listening history"
    ON public.listening_history FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own listening history"
    ON public.listening_history FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own listening history"
    ON public.listening_history FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own listening history"
    ON public.listening_history FOR DELETE
    USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_listening_history_user_id ON public.listening_history(user_id);
CREATE INDEX IF NOT EXISTS idx_listening_history_last_played ON public.listening_history(last_played_at DESC);

-- =====================================================
-- USER PREFERENCES TABLE
-- Store user app preferences
-- =====================================================
CREATE TABLE IF NOT EXISTS public.user_preferences (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    auto_play BOOLEAN DEFAULT true,
    playback_speed DECIMAL(3,2) DEFAULT 1.0 CHECK (playback_speed >= 0.5 AND playback_speed <= 2.0),
    download_quality TEXT DEFAULT 'high' CHECK (download_quality IN ('high', 'medium', 'low')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own preferences"
    ON public.user_preferences FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences"
    ON public.user_preferences FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences"
    ON public.user_preferences FOR UPDATE
    USING (auth.uid() = user_id);

-- =====================================================
-- FUNCTIONS AND TRIGGERS
-- =====================================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for profiles table
CREATE TRIGGER set_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Trigger for boards table
CREATE TRIGGER set_boards_updated_at
    BEFORE UPDATE ON public.boards
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Trigger for user_preferences table
CREATE TRIGGER set_user_preferences_updated_at
    BEFORE UPDATE ON public.user_preferences
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'avatar_url'
    );

    INSERT INTO public.user_preferences (user_id)
    VALUES (NEW.id);

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile and preferences on signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- GRANT PERMISSIONS
-- =====================================================

-- Grant access to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
