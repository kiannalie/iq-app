# Project Structure

## Architecture Overview

### High-Level Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│                 │    │                 │    │                 │
│  React Native   │◄───┤    Supabase     │◄───┤   Podcast APIs  │
│   Frontend      │    │    Backend      │    │   (External)    │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Core Design Patterns
- **Component-Based Architecture** - Modular, reusable UI components
- **Feature-Driven Structure** - Organize code by functionality, not file type
- **Separation of Concerns** - Clear boundaries between UI, business logic, and data
- **Repository Pattern** - Abstract data access layer for flexibility

## Directory Structure

### Recommended React Native Project Structure
```
src/
├── components/           # Reusable UI components
│   ├── atoms/           # Basic building blocks (Button, Input, Text)
│   ├── molecules/       # Simple component combinations (SearchBar, AudioControls)
│   ├── organisms/       # Complex UI sections (PlayerInterface, PlaylistGrid)
│   └── templates/       # Page-level layout components
├── screens/             # Screen components and navigation
│   ├── auth/           # Authentication flow screens
│   │   ├── LoginScreen.tsx
│   │   ├── SignUpScreen.tsx
│   │   └── OnboardingScreen.tsx
│   ├── player/         # Audio player related screens
│   ├── playlists/      # Playlist management screens
│   └── profile/        # User profile screens
├── services/           # External API integrations and business logic
│   ├── api/           # API client configurations
│   ├── auth/          # Authentication services
│   ├── audio/         # Audio playback services
│   └── supabase/      # Supabase client and operations
├── hooks/             # Custom React hooks
│   ├── useAuth.ts     # Authentication state management
│   ├── useAudio.ts    # Audio playback state
│   └── useNotes.ts    # Note management operations
├── utils/             # Utility functions and helpers
│   ├── constants.ts   # App-wide constants
│   ├── helpers.ts     # General utility functions
│   └── types.ts       # TypeScript type definitions
├── navigation/        # Navigation configuration
│   ├── AppNavigator.tsx
│   ├── AuthNavigator.tsx
│   └── TabNavigator.tsx
├── context/           # React Context providers
│   ├── AuthContext.tsx
│   ├── AudioContext.tsx
│   └── ThemeContext.tsx
└── assets/           # Static assets
    ├── images/
    ├── icons/
    └── fonts/
```

## Component Organization

### Atomic Design System
- **Atoms** - Fundamental UI elements (buttons, inputs, text, icons)
- **Molecules** - Simple combinations of atoms (search bar, media controls)
- **Organisms** - Complex UI sections (navigation bar, playlist grid, player interface)
- **Templates** - Page layouts without specific content
- **Pages** - Specific screen implementations with real content

### Component Naming Conventions
- **PascalCase** for component names (`AudioPlayer`, `PlaylistCard`)
- **camelCase** for props and functions (`onPlayPress`, `isPlaying`)
- **SCREAMING_SNAKE_CASE** for constants (`API_ENDPOINTS`, `AUDIO_STATES`)

## State Management Strategy

### Context-Based State Management
```typescript
// Global state contexts
AuthContext     -> User authentication state
AudioContext    -> Audio playback state and controls
PlaylistContext -> Playlist management and organization
NotesContext    -> Timestamped notes and annotations
ThemeContext    -> UI theme and appearance settings
```

### Local State Guidelines
- Use `useState` for component-specific state
- Use `useReducer` for complex state logic
- Custom hooks for reusable stateful logic
- Context for app-wide state that needs sharing

## Data Flow Architecture

### Service Layer Pattern
```
Screen Components
       ↓
Custom Hooks (useAuth, useAudio, useNotes)
       ↓
Service Layer (AuthService, AudioService, NotesService)
       ↓
Data Layer (Supabase, External APIs)
```

### Key Services
- **AuthService** - Handle all authentication operations
- **AudioService** - Manage audio playback and timestamp tracking
- **NotesService** - Handle note creation, editing, and organization
- **PlaylistService** - Manage playlist operations and organization
- **ApiService** - Generic API client for external integrations

## Navigation Structure

### Screen Hierarchy
```
App
├── AuthNavigator (Stack)
│   ├── WelcomeScreen
│   ├── LoginScreen
│   ├── SignUpScreen
│   └── OnboardingFlow
└── MainNavigator (Tab)
    ├── PlayerTab (Stack)
    │   ├── PlayerScreen
    │   └── NowPlayingScreen
    ├── PlaylistsTab (Stack)
    │   ├── PlaylistsScreen
    │   ├── PlaylistDetailScreen
    │   └── CreatePlaylistScreen
    ├── DiscoverTab (Stack)
    │   ├── DiscoverScreen
    │   └── PodcastDetailScreen
    └── ProfileTab (Stack)
        ├── ProfileScreen
        └── SettingsScreen
```

## Data Models

### Core Entities
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  created_at: string;
}

interface AudioContent {
  id: string;
  title: string;
  description: string;
  audio_url: string;
  duration: number;
  podcast_id?: string;
  created_at: string;
}

interface TimestampedNote {
  id: string;
  user_id: string;
  audio_content_id: string;
  timestamp: number;
  note_text: string;
  playlist_ids: string[];
  created_at: string;
}

interface Playlist {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  color?: string;
  note_count: number;
  created_at: string;
}
```

## Configuration Management

### Environment Configuration
```typescript
// config/environments.ts
export const config = {
  development: {
    supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL_DEV,
    supabaseKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY_DEV,
  },
  production: {
    supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL_PROD,
    supabaseKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY_PROD,
  }
};
```

### Feature Flags
- Use environment variables for feature toggles
- Implement gradual rollout mechanisms
- A/B testing configuration support

## Testing Structure

### Test Organization
```
src/
├── __tests__/
│   ├── components/     # Component unit tests
│   ├── services/       # Service layer tests
│   ├── hooks/          # Custom hook tests
│   └── utils/          # Utility function tests
├── e2e/               # End-to-end tests
└── integration/       # Integration tests
```

### Testing Patterns
- **Unit Tests** - Individual component and function testing
- **Integration Tests** - Service integration and data flow testing
- **E2E Tests** - Critical user journey validation
- **Audio Tests** - Timestamp accuracy and playback reliability

## Development Workflow

### Code Organization Principles
1. **Feature-First** - Group related functionality together
2. **Consistent Naming** - Follow established conventions throughout
3. **Clear Dependencies** - Minimize coupling between modules
4. **Scalable Structure** - Support growth without major refactoring
5. **Type Safety** - Leverage TypeScript for reliability