import React from 'react';

import { FAB, Surface } from '../components/styled';
import Layout from '../constants/Layout';
import { EmployerStackScreensProps } from '../types';

/**
 * @param navigation can be mocked
 * @requires react-native-paper.Provider for the Material Design components
 */
export default function EmployerHomeScreen(
  { navigation }: EmployerStackScreensProps['Home']
) {
  return (
    <Surface>
      <FAB icon="plus" onPress={() => navigation.navigate('NewEmployee')} />
      <FAB
        icon="camera-account"
        onPress={() => navigation.navigate('RecordAttendance')}
        // To offset from the first FAB (screen padding + FAB size + margin):
        style={{ bottom: Layout.padding + 56 + 16 }}
      />
    </Surface>
  );
}
