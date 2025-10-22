# IQapp - Podcast & Audiobook Notes App

A React Native mobile application for capturing and organizing timestamped insights from podcasts and audiobooks.

## Features

- **Timestamped Note Capture**: Save precise moments while listening with notes
- **Playlist Organization**: Organize saved clips into themed playlists
- **In-App Audio Playback**: Listen to podcasts/audiobooks directly in the app
- **Multi-Platform Authentication**: Google, Apple, and email/password sign-in
- **Cross-Platform**: iOS and Android support

## Tech Stack

- **Frontend**: React Native with Expo
- **Backend**: Supabase (auth, database, storage)
- **Navigation**: React Navigation 6
- **Authentication**: Google Sign-In, Apple Sign-In, Email/Password

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (macOS) or Android Emulator

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd iqapp
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Configure your environment variables in `.env`:
- Supabase URL and API key
- Google OAuth client ID
- Apple OAuth client ID (for iOS)

### Running the App

```bash
# Start Expo development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── atoms/          # Basic building blocks
│   ├── molecules/      # Simple combinations
│   └── organisms/      # Complex UI sections
├── screens/            # Screen components
│   └── auth/          # Authentication flow screens
├── navigation/         # Navigation configuration
├── context/           # React Context providers
├── services/          # API and external services
├── utils/             # Utility functions and constants
└── assets/           # Static assets
```

## Authentication Flow

1. **Welcome Splash** - App introduction
2. **Welcome Screen** - Login/Signup options
3. **Login/Signup** - Authentication forms with social login
4. **Onboarding** - User preferences and podcast selection
5. **Main App** - Core application features

## Development Guidelines

- Follow the atomic design system for components
- Use TypeScript for type safety
- Implement proper error handling
- Write clean, maintainable code
- Follow React Native best practices

## Next Steps

- Implement Supabase authentication integration
- Add audio player functionality
- Create podcast API integrations
- Implement note-taking features
- Add playlist management
- Set up push notifications

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.