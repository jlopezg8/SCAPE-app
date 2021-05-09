/**
 * If you are not familiar with React Navigation, check out the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 */
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import LinkingConfiguration from './LinkingConfiguration';
import MainNavigator from './MainNavigator';
import NotFoundScreen from '../screens/NotFoundScreen';
import useTheme from '../hooks/useTheme';

/**
 * @requires react-native-paper.Provider for theming
 */
export default function Navigation() {
  const theme = useTheme();
  return (
    <NavigationContainer theme={theme} linking={LinkingConfiguration}>
      <RootNavigator />
    </NavigationContainer>
  );
}

// A root stack navigator is often used for displaying modals on top of all other content
// Read more here: https://reactnavigation.org/docs/modal
const Stack = createStackNavigator();

function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Root" component={MainNavigator} />
      <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
    </Stack.Navigator>
  );
}
/*
 * With react-native-paper there's no need of a root stack navigator for
 * displaying modals. However, we may turn this into a BottomTabNavigator, so
 * we'll keep it for now.
 */
