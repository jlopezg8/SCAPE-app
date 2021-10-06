import React from 'react';
import { Headline } from 'react-native-paper';

import { Surface } from '../components/styled';

export default function EmployeeHomeScreen() {
  return (
    <Surface style={{ justifyContent: 'center' }}>
      <Headline style={{ textAlign: 'center', fontSize: 32 }}>
        ¡Hola empleado!
      </Headline>
    </Surface>
  );
}
