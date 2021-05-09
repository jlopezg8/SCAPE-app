import { createStackNavigator } from '@react-navigation/stack';
import Constants from 'expo-constants';
import React from 'react';

import OverflowMenu from '../components/OverflowMenu';
import HomeScreen from '../screens/HomeScreen';
import NewEmployeeScreen from '../screens/NewEmployeeScreen';
import RegisterAttendanceScreen from '../screens/RegisterAttendanceScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { MainStackParamList } from '../types';

const Stack = createStackNavigator<MainStackParamList>();

export default function MainNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      // TODO: maybe: https://callstack.github.io/react-native-paper/integrate-app-bar-with-react-navigation.html
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={({ navigation }) => ({
          headerTitle: Constants.manifest.name,
          headerRight: () => (
            <OverflowMenu navigation={navigation}>
              <OverflowMenu.Item label="Configuración" linkTo="Settings" />
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
        name="RegisterAttendance"
        component={RegisterAttendanceScreen}
        options={{ headerTitle: 'Registrar asistencia' }}
      />
    </Stack.Navigator>
  );
}
