import React from 'react';
import { List } from 'react-native-paper';

import { FAB, Surface } from '../components/styled';
import { EmployerStackScreensProps } from '../types';

/**
 * @param navigation.navigate can be mocked
 * @requires react-native-paper.Provider for the Material Design components
 */
export default function EmployerHomeScreen(
  { navigation }: EmployerStackScreensProps['Home']
) {
  return (
    <Surface>
      <List.Item
        title="Sitio de trabajo 1"
        description="Descripción del sitio de trabajo"
        left={props => <List.Icon {...props} icon="factory" />}
        onPress={() => navigation.navigate('Workplace', { id: 1 })}
      />
      <FAB
        icon="face-recognition"
        onPress={() => navigation.navigate('RecordAttendance')}
      />
    </Surface>
  );
}
