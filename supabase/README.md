# Supabase Setup Guide for IQApp

This guide will walk you through setting up Supabase for the IQApp.

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up or log in
2. Click "New Project"
3. Fill in your project details:
   - **Name**: IQApp (or whatever you prefer)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose the closest region to your users
4. Click "Create new project"
5. Wait for the project to be provisioned (takes about 2 minutes)

## Step 2: Get Your API Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Find these two values:
   - **Project URL** (looks like: `https://xxxxxxxxxxxxx.supabase.co`)
   - **anon public** key (under "Project API keys")

## Step 3: Configure Environment Variables

1. In your IQApp project, create a `.env` file (if it doesn't exist)
2. Add your Supabase credentials:

```env
# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Listen Notes API
EXPO_PUBLIC_LISTEN_API_KEY=your_listen_notes_api_key
```

3. Make sure `.env` is in your `.gitignore` (it already is!)

## Step 4: Run the Database Schema

1. In your Supabase project dashboard, click the **SQL Editor** icon in the left sidebar
2. Click **New Query**
3. Copy the contents of `supabase/schema.sql` from this project
4. Paste it into the SQL editor
5. Click **Run** (or press Cmd/Ctrl + Enter)
6. Wait for the query to complete - you should see "Success. No rows returned"

## Step 5: Verify Tables Were Created

1. Click the **Table Editor** icon in the left sidebar
2. You should see these tables:
   - `profiles`
   - `followed_podcasts`
   - `boards`
   - `board_types`
   - `saved_podcasts`
   - `listening_history`
   - `user_preferences`

## Step 6: Enable Email Authentication

1. Go to **Authentication** → **Providers**
2. Make sure **Email** is enabled (it should be by default)
3. Configure email settings:
   - You can use the default Supabase email service for development
   - For production, configure your own SMTP settings

## Step 7: (Optional) Enable OAuth Providers

### Google Sign-In
1. Go to **Authentication** → **Providers**
2. Click on **Google**
3. Toggle it to **Enabled**
4. Follow the instructions to set up Google OAuth
5. Add your Google Client ID and Secret

### Apple Sign-In
1. Go to **Authentication** → **Providers**
2. Click on **Apple**
3. Toggle it to **Enabled**
4. Follow the instructions to set up Apple Sign-In
5. Add your Apple configuration

## Step 8: Test the Connection

1. Restart your Expo development server:
   ```bash
   npx expo start --clear
   ```

2. The app should now connect to Supabase
3. Check the console for any connection warnings

## Database Schema Overview

### Tables

**profiles**
- Extends `auth.users` with additional user information
- Automatically created when a user signs up

**followed_podcasts**
- Podcasts that users follow
- Appears in "Authors You Follow" section

**boards**
- User-created boards for organizing content
- Can have multiple types/categories

**board_types**
- Color-coded categories for boards
- Linked to specific boards

**saved_podcasts**
- Episodes/podcasts saved to boards
- Can be saved to specific boards or just to library

**listening_history**
- Tracks what users have listened to
- Stores playback progress for resume functionality

**user_preferences**
- App settings like auto-play, playback speed, etc.
- Automatically created with default values on signup

### Security

All tables use Row Level Security (RLS) to ensure:
- Users can only access their own data
- Automatic user_id association
- No accidental data leaks

### Automatic Features

**Auto-created on signup:**
- User profile in `profiles` table
- Default preferences in `user_preferences` table

**Auto-updated:**
- `updated_at` timestamps on profiles, boards, and preferences

## Troubleshooting

### "Supabase credentials not found" warning

- Make sure your `.env` file exists and has the correct values
- Restart the Expo dev server after adding credentials
- Check that variable names start with `EXPO_PUBLIC_`

### RLS Errors

- Make sure you're authenticated before trying to access data
- Check that the user's session is valid
- Review RLS policies in the Table Editor

### Migration Issues

- If you need to reset the database, you can drop all tables and re-run schema.sql
- Be careful - this will delete all data!

## Next Steps

After completing setup:
1. Test authentication flows (sign up, sign in, sign out)
2. Test data persistence (follow podcasts, create boards, etc.)
3. Monitor the Supabase logs for any errors
4. Set up production email templates in Authentication settings
