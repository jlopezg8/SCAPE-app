import React from 'react';
import { Headline } from 'react-native-paper';

import { Surface } from '../components/styled';

export default function AdminHomeScreen() {
  return (
    <Surface style={{ justifyContent: 'center' }}>
      <Headline style={{ textAlign: 'center', fontSize: 32 }}>
        ¡Hola administrador!
      </Headline>
    </Surface>
  );
}
