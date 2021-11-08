import React from 'react';
import { Headline } from 'react-native-paper';

import { Surface } from '../components/containers';

/**
 * @requires react-native-paper.Provider for the Material Design components
 */
export default function AdminHomeScreen() {
  return (
    <Surface style={{ justifyContent: 'center' }}>
      <Headline style={{ textAlign: 'center', fontSize: 32 }}>
        ¡Hola administrador!
      </Headline>
    </Surface>
  );
}
