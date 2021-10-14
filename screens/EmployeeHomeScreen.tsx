import React from 'react';
import { Headline } from 'react-native-paper';

import { Surface } from '../components/styled';

/**
 * @requires react-native-paper.Provider for the Material Design components
 */
export default function EmployeeHomeScreen() {
  return (
    <Surface style={{ justifyContent: 'center' }}>
      <Headline style={{ textAlign: 'center', fontSize: 32 }}>
        ¡Hola empleado!
      </Headline>
    </Surface>
  );
}
