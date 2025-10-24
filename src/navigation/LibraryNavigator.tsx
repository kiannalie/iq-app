import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LibraryScreen from '../screens/main/LibraryScreen';
import AddBoardScreen from '../screens/main/AddBoardScreen';
import BoardDetailScreen from '../screens/main/BoardDetailScreen';
import SegmentDetailScreen from '../screens/main/SegmentDetailScreen';
import FeedbackScreen from '../screens/main/FeedbackScreen';

export type LibraryStackParamList = {
  LibraryMain: undefined;
  AddBoard: undefined;
  BoardDetail: {
    boardId: string;
  };
  SegmentDetail: {
    segmentId: string;
  };
  Feedback: undefined;
};

const Stack = createStackNavigator<LibraryStackParamList>();

const LibraryNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LibraryMain" component={LibraryScreen} />
      <Stack.Screen name="AddBoard" component={AddBoardScreen} />
      <Stack.Screen name="BoardDetail" component={BoardDetailScreen} />
      <Stack.Screen name="SegmentDetail" component={SegmentDetailScreen} />
      <Stack.Screen name="Feedback" component={FeedbackScreen} />
    </Stack.Navigator>
  );
};

export default LibraryNavigator;
