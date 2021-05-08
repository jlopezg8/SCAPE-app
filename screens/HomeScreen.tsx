import * as React from 'react';

import { FAB, Surface } from '../components/styled';
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
        style={{ bottom: 16*2+56 }}
      />
    </Surface>
  );
}
