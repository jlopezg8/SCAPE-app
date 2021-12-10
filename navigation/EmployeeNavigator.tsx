import { createStackNavigator } from '@react-navigation/stack';
import Constants from 'expo-constants';
import React from 'react';
import { Menu } from 'react-native-paper';

import OverflowMenu from '../components/OverflowMenu';
import { useAuthContext } from '../hooks/useAuth';
import {
  EmployeeHomeScreen,
  RecordAttendanceByEmployeeScreen,
  SettingsScreen,
} from '../screens';
import { EmployeeStackParamList } from '../types';

const Stack = createStackNavigator<EmployeeStackParamList>();

/**
 * @requires ../hooks/useAuth.AuthContext.Provider for logout
 */
export default function EmployeeNavigator() {
  const { logout } = useAuthContext();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={EmployeeHomeScreen}
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
        name="RecordAttendance"
        component={RecordAttendanceByEmployeeScreen}
        options={{ headerTitle: 'Registrar asistencia' }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ headerTitle: 'Configuración' }}
      />
    </Stack.Navigator>
  );
}
