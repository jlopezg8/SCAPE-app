import { createStackNavigator } from '@react-navigation/stack';
import Constants from 'expo-constants';
import React from 'react';
import { Menu } from 'react-native-paper';

import OverflowMenu from '../components/OverflowMenu';
import { useAuthContext } from '../hooks/useAuth';
import AdminHomeScreen from '../screens/AdminHomeScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { AdminStackParamList } from '../types';

const Stack = createStackNavigator<AdminStackParamList>();

/**
 * @requires ../hooks/useAuth.AuthContext.Provider
 */
export default function AdminNavigator() {
  const { logout } = useAuthContext();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={AdminHomeScreen}
        options={({ navigation }) => ({
          headerTitle: Constants.manifest.name,
          headerRight: () => (
            <OverflowMenu navigation={navigation}>
              <OverflowMenu.Item label="Configuración" linkTo="Settings" />
              <Menu.Item onPress={logout} title="Cerrar sesión" />
            </OverflowMenu>
          ),
        })}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ headerTitle: 'Configuración' }}
      />
    </Stack.Navigator>
  );
}
