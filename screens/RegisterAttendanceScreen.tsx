import React from 'react';

import { PhotoPicker } from '../components/PhotoPicker';
import {
  ListItem,
  ScreenProgressBar,
  Snackbar,
  Surface,
} from '../components/styled';
import { useAttendanceRegister } from '../hooks/useEmployees';
import usePhotoPicker from '../hooks/usePhotoPicker';
import { Employee } from '../models/Employee';

function useAttendanceRegisterSettingErrors(
  base64Photo: string | undefined, setStatus: (status: string) => void
) {
  const { isLoading, data: employee, isError, error } =
    useAttendanceRegister(base64Photo);
  React.useEffect(() => {
    if (isError) {
      console.error((error as Error).message);
      setStatus('No se pudo registrar la asistencia');
    }
  }, [error]);
  return { employee, isLoading };
}

/**
 * @requires react-native-paper.Provider for the Material Design components
 * @requires react-query.QueryClientProvider for queries
 * expo-image-picker can be mocked
 * ../api/employees/getEmployeeByPhoto can be mocked
 * FIXME: high: pressing "Remover foto" crashes the app on mobile
 */
export default function RegisterAttendanceScreen() {
  const {
    base64Photo,
    setBase64Photo,
    status,
    setStatus,
    hasStatus,
    clearStatus,
  } = usePhotoPicker();
  const { employee, isLoading } =
    useAttendanceRegisterSettingErrors(base64Photo, setStatus);
  return (
    <Surface>
      <ScreenProgressBar visible={isLoading} />
      <PhotoPicker setStatus={setStatus} setBase64Image={setBase64Photo} />
      {employee && <EmployeeViewer employee={employee} />}
      <Snackbar
        visible={hasStatus}
        onDismiss={clearStatus}
        message={status}
      />
    </Surface>
  );
}

function EmployeeViewer({ employee }: { employee: Employee }) {
  const Item = (label: string, value?: string) => (
    value && <ListItem title={value} description={label} />
  );
  return (
    <>
      {Item('Documento de identidad', employee.idDoc)}
      {Item('Nombre', employee.firstName)}
      {Item('Apellido', employee.lastName)}
      {Item('Correo electrónico', employee.email)}
      {Item('Sexo', employee.sex)}
      {Item('Fecha de nacimiento', employee.birthDate?.toLocaleDateString())}
    </>
  );
}
