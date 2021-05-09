import React from 'react';

import { FAB, Surface } from '../components/styled';
import Layout from '../constants/Layout';
import { MainStackScreensProps } from '../types';

/**
 * @param navigation can be mocked
 * @requires react-native-paper.Provider for the Material Design components
 */
export default function HomeScreen(
  { navigation }: MainStackScreensProps['Home']
) {
  return (
    <Surface>
      <FAB icon="plus" onPress={() => navigation.navigate('NewEmployee')} />
      <FAB
        icon="camera-account"
        onPress={() => navigation.navigate('RegisterAttendance')}
        // To offset from the first FAB (screen padding + FAB size + margin):
        style={{ bottom: Layout.padding + 56 + 16 }}
      />
    </Surface>
  );
}
