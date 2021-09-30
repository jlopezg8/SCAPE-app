import { createStackNavigator } from '@react-navigation/stack';
import Constants from 'expo-constants';
import React from 'react';
import { Menu } from 'react-native-paper';

import OverflowMenu from '../components/OverflowMenu';
import { useAuthContext } from '../hooks/useAuth';
import EmployerHomeScreen from '../screens/EmployerHomeScreen';
import NewEmployeeScreen from '../screens/NewEmployeeScreen';
import RecordAttendanceScreen from '../screens/RecordAttendanceScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { EmployerStackParamList } from '../types';

const Stack = createStackNavigator<EmployerStackParamList>();

/**
 * @requires ../hooks/useAuth.AuthContext.Provider
 */
export default function EmployerNavigator() {
  const { logout } = useAuthContext();
  return (
    <Stack.Navigator
      initialRouteName="Home"
      // TODO: maybe: https://callstack.github.io/react-native-paper/integrate-app-bar-with-react-navigation.html
    >
      <Stack.Screen
        name="Home"
        component={EmployerHomeScreen}
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
      <Stack.Screen
        name="NewEmployee"
        component={NewEmployeeScreen}
        options={{ headerTitle: 'Crear empleado' }}
      />
      <Stack.Screen
        name="RecordAttendance"
        component={RecordAttendanceScreen}
        options={{ headerTitle: 'Registrar asistencia' }}
      />
    </Stack.Navigator>
  );
}
