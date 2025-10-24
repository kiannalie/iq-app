import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import HomeNavigator from './HomeNavigator';
import LibraryNavigator from './LibraryNavigator';
import { COLORS, FONT_FAMILIES } from '../utils/constants';

// Placeholder screens for other tabs (will be implemented later)
const ListenScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.primary }}>
    <Text style={{ color: COLORS.white }}>Listen Screen</Text>
  </View>
);


export type MainTabParamList = {
  Home: undefined;
  Listen: undefined;
  Library: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

const MainNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: () => null, // Remove icons completely
        tabBarActiveTintColor: COLORS.white,
        tabBarInactiveTintColor: COLORS.white + '60',
        tabBarStyle: {
          backgroundColor: COLORS.secondary,
          borderTopWidth: 0,
          height: 85,
          paddingBottom: 25,
          paddingTop: 0,
        },
        tabBarLabelStyle: {
          fontSize: 14,
          fontFamily: FONT_FAMILIES.semiBold,
          marginTop: 0, // Remove top margin since no icons
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeNavigator} />
      <Tab.Screen name="Listen" component={ListenScreen} />
      <Tab.Screen name="Library" component={LibraryNavigator} />
    </Tab.Navigator>
  );
};

export default MainNavigator;