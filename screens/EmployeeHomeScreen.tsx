import React from 'react';
import { Headline } from 'react-native-paper';

import { SurfaceInStackNav } from '../components/containers';
import { FAB } from '../components/controls';
import { EmployeeStackScreensProps } from '../types';

/**
 * @requires react-native-paper.Provider for the Material Design components
 */
export default function EmployeeHomeScreen(
  { navigation }: EmployeeStackScreensProps['Home']
) {
  return (
    <SurfaceInStackNav style={{ justifyContent: 'center' }}>
      <Headline style={{ textAlign: 'center', fontSize: 32 }}>
        ¡Hola empleado!
      </Headline>
      <FAB
        icon="face-recognition"
        label="Registar asistencia"
        onPress={() => navigation.navigate('RecordAttendance')}
      />
    </SurfaceInStackNav>
  );
}
