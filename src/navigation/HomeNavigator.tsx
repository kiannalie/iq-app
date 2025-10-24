import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LandingScreen from '../screens/main/LandingScreen';
import SearchScreen from '../screens/main/SearchScreen';
import PodcastProfileScreen from '../screens/main/PodcastProfileScreen';
import PodcastPlayerScreen from '../screens/main/PodcastPlayerScreen';

export type HomeStackParamList = {
  HomeMain: undefined;
  Search: undefined;
  PodcastProfile: {
    podcastId: string;
  };
  PodcastPlayer: {
    podcastId: string;
    episodeId?: string;
  };
};

const Stack = createStackNavigator<HomeStackParamList>();

const HomeNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={LandingScreen} />
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen name="PodcastProfile" component={PodcastProfileScreen} />
      <Stack.Screen name="PodcastPlayer" component={PodcastPlayerScreen} />
    </Stack.Navigator>
  );
};

export default HomeNavigator;
