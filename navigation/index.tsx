/**
 * If you are not familiar with React Navigation, check out the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 */
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import { useAuthContext } from '../hooks/useAuth';
import useTheme from '../hooks/useTheme';
import Role, { InvalidRoleError } from '../models/Role';
import LoginScreen from '../screens/LoginScreen';
import NotFoundScreen from '../screens/NotFoundScreen';
import { RootStackParamList } from '../types';
import LinkingConfiguration from './LinkingConfiguration';
import AdminNavigator from './AdminNavigator';
import EmployeeNavigator from './EmployeeNavigator';
import EmployerNavigator from './EmployerNavigator';

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

/*
 * A root stack navigator is often used for displaying modals on top of all
 * other content. Read more here: https://reactnavigation.org/docs/modal
 * However, with react-native-paper we don't need one for that.
 */
const Stack = createStackNavigator<RootStackParamList>();

/**
 * @requires ../hooks/useAuth.AuthContext.Provider
 */
function RootNavigator() {
  const { role, isLogout } = useAuthContext();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {getNavigatorForRole(role, isLogout)}
      <Stack.Screen
        name="NotFound"
        component={NotFoundScreen}
        options={{ title: 'Oops!' }}
      />
    </Stack.Navigator>
  );
}

function getNavigatorForRole(role: Role | undefined, isLogout: boolean) {
  switch (role) {
    case undefined:
      return (
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            // When logging out, a pop animation feels intuitive
            // You can remove this if you want the default 'push' animation
            animationTypeForReplace: isLogout ? 'pop' : 'push',
          }}
        />
      );
    case 'admin':
      return <Stack.Screen name="Admin" component={AdminNavigator} />;
    case 'employer':
      return <Stack.Screen name="Employer" component={EmployerNavigator} />;
    case 'employee':
      return <Stack.Screen name="Employee" component={EmployeeNavigator} />;
    default:
      throw new InvalidRoleError(role);
  }
}
