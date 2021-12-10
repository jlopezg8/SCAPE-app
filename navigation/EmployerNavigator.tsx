import { createStackNavigator } from '@react-navigation/stack';
import Constants from 'expo-constants';
import React from 'react';
import { Menu } from 'react-native-paper';

import OverflowMenu from '../components/OverflowMenu';
import { useAuthContext } from '../hooks/useAuth';
import {
  AddEmployeeToWorkplaceScreen,
  CreateEmployeeScreen,
  CreateWorkplaceScreen,
  EditEmployeeEmploymentInWorkplaceScreen,
  EditEmployeeScreen,
  EditWorkplaceScreen,
  EmployerHomeScreen,
  RecordAttendanceScreen,
  SetEmployeeEmploymentInWorkplaceScreen,
  SettingsScreen,
  WorkplaceScreen,
} from '../screens';
import { EmployerStackParamList } from '../types';

const Stack = createStackNavigator<EmployerStackParamList>();

/**
 * @requires ../hooks/useAuth.AuthContext.Provider for logout
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
          title: Constants.manifest.name,
          headerRight: () => (
            <OverflowMenu navigation={navigation}>
              <OverflowMenu.Item label="Configuración" linkTo="Settings" />
              <Menu.Item onPress={logout} title="Cerrar sesión" />
            </OverflowMenu>
          ),
        })}
      />
      <Stack.Screen
        name="CreateWorkplace"
        component={CreateWorkplaceScreen}
        options={{ title: 'Crear sitio de trabajo' }}
      />
      <Stack.Screen
        name="Workplace"
        component={WorkplaceScreen}
        options={{
          title: '',
          headerTransparent: true,
        }}
      />
      <Stack.Screen
        name="AddEmployeeToWorkplace"
        component={AddEmployeeToWorkplaceScreen}
        options={{ title: 'Añadir empleado al sitio de trabajo' }}
      />
      <Stack.Screen
        name="CreateEmployee"
        component={CreateEmployeeScreen}
        options={{ title: 'Crear empleado' }}
      />
      <Stack.Screen
        name="SetEmployeeEmploymentInWorkplace"
        component={SetEmployeeEmploymentInWorkplaceScreen}
        options={{ title: 'Establecer relación laboral' }}
      />
      <Stack.Screen
        name="RecordAttendance"
        component={RecordAttendanceScreen}
        options={{ title: 'Registrar asistencia' }}
      />
      <Stack.Screen
        name="EditWorkplace"
        component={EditWorkplaceScreen}
        options={{ title: 'Editar sitio de trabajo' }}
      />
      <Stack.Screen
        name="EditEmployee"
        component={EditEmployeeScreen}
        options={{ title: 'Editar empleado' }}
      />
      <Stack.Screen
        name="EditEmployeeEmploymentInWorkplace"
        component={EditEmployeeEmploymentInWorkplaceScreen}
        options={{ title: 'Editar relación laboral' }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: 'Configuración' }}
      />
    </Stack.Navigator>
  );
}
