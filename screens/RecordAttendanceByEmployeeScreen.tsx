// TODO: medium: refactor this screen

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Divider, Headline } from 'react-native-paper';

import { Surface, SurfaceInStackNav } from '../components/containers';
import { Button } from '../components/controls';
import { PhotoPicker } from '../components/inputs';
import { ListItem, ScreenProgressBar, Snackbar } from '../components/misc';
import {
  useClockIn,
  useClockOut,
  useEmployeeGetterByPhoto,
  usePhotoPicker,
  useWorkplacesNearLocationGetter,
} from '../hooks';
import { Employee, WorkplaceId } from '../models';

function useEmployeeGetterByPhotoSettingErrors(
  base64Photo: string | undefined, setStatus: (status: string) => void
) {
  const { isLoading: isLoadingEmployee, data: employee, isError, error } =
    useEmployeeGetterByPhoto(base64Photo);
  React.useEffect(() => {
    if (isError) {
      const theError = error as Error; // error is of type unknown
      console.error(theError.message);
      setStatus(theError.name === 'BadRequestError'
                  ? theError.message
                  : 'No se pudo reconocer al empleado. Ponte en contacto con Soporte');
    }
  }, [error]);
  return { employee, isLoadingEmployee };
}

/**
 * @param route.params.workplaceId the ID of the workplace in which to record
 *        the attendance
 * @requires react-native-paper.Provider for the Material Design components
 * @requires react-native-safe-area-context.SafeAreaProvider for safe area insets
 * @requires react-query.QueryClientProvider for queries and mutating data
 * expo-image-picker can be mocked
 * ../api/employees.getEmployeeByPhoto can be mocked
 * FIXME: high: pressing "Remover foto" crashes the app on mobile
 */
export default function RecordAttendanceByEmployeeScreen() {
  const { isLoading, data: workplaces } = useWorkplacesNearLocationGetter();
  return isLoading
    ? <SurfaceInStackNav style={{ justifyContent: 'center' }}>
        <Headline style={{ textAlign: 'center', fontSize: 32 }}>
          Buscando sitios de trabajo cercanos...
        </Headline>
      </SurfaceInStackNav>
    : <RecordAttendanceView workplaceId={workplaces![0].id!} />;
}

export function RecordAttendanceView(
  { workplaceId }: { workplaceId: WorkplaceId }
) {
  const {
    base64Photo,
    setBase64Photo,
    status,
    setStatus,
    hasStatus,
    clearStatus,
  } = usePhotoPicker();
  const { employee, isLoadingEmployee } =
    useEmployeeGetterByPhotoSettingErrors(base64Photo, setStatus);
  const [isRecordingAttendance, setRecordingAttendance] = React.useState(false);
  return (
    <Surface>
      <ScreenProgressBar visible={isLoadingEmployee || isRecordingAttendance} />
      <PhotoPicker setStatus={setStatus} setBase64Image={setBase64Photo} />
      {employee && <>
        <Divider />
        <AttendanceRecorder
          employeeIdDoc={employee.idDoc}
          workplaceId={workplaceId}
          setStatus={setStatus}
          isRecordingAttendance={isRecordingAttendance}
          setRecordingAttendance={setRecordingAttendance}
        />
        <Divider />
        <EmployeeViewer employee={employee} />
      </>}
      <Snackbar
        visible={hasStatus}
        onDismiss={clearStatus}
        message={status}
      />
    </Surface>
  );
}

type AttendanceRecorderProps = {
  employeeIdDoc: string;
  workplaceId: WorkplaceId,
  setStatus: (status: string) => void;
  isRecordingAttendance: boolean;
  setRecordingAttendance: (isRecordingAttendance: boolean) => void;
};

function useAttendanceRecorderSettingErrors(
  { employeeIdDoc, workplaceId, setStatus, setRecordingAttendance }
    : AttendanceRecorderProps
) {
  const clockIn = useClockIn(employeeIdDoc, workplaceId);
  const clockOut = useClockOut(employeeIdDoc, workplaceId);
  const submit = (type: 'clock-in' | 'clock-out') => async () => {
    setRecordingAttendance(true);
    const isClockIn = type === 'clock-in';
    try {
      await (isClockIn ? clockIn() : clockOut());
      setStatus(`Se ha registrado la ${isClockIn ? 'entrada' : 'salida'}`);
    } catch (error) {
      setStatus(
        `No se pudo registrar la ${isClockIn ? 'entrada' : 'salida'}.`
        + ' Ponte en contacto con Soporte.');
    } finally {
      setRecordingAttendance(false);
    }
  };
  return {
    submitClockIn: submit('clock-in'),
    submitClockOut: submit('clock-out'),
  };
}

function AttendanceRecorder(props: AttendanceRecorderProps) {
  const { isRecordingAttendance } = props;
  const {
    submitClockIn,
    submitClockOut,
  } = useAttendanceRecorderSettingErrors(props);
  return (
    <View style={styles.attendanceRecorderContainer}>
      <Button
        mode="text"
        disabled={isRecordingAttendance}
        label="Registrar entrada"
        onPress={submitClockIn}
        style={styles.attendanceRecorderButton}
      />
      <Button
        mode="text"
        disabled={isRecordingAttendance}
        label="Registrar salida"
        onPress={submitClockOut}
        style={styles.attendanceRecorderButton}
      />
    </View>
  );
}

function EmployeeViewer({ employee }: { employee: Employee }) {
  const Item = (label: string, value?: string) => (
    value && <ListItem title={value} description={label} />
  );
  const inSentenceCase = (s?: string) => s && (s[0].toUpperCase() + s.slice(1));
  return (
    <>
      {Item('Documento de identidad', employee.idDoc)}
      {Item('Nombre', employee.firstName)}
      {Item('Apellido', employee.lastName)}
      {Item('Correo electrónico', employee.email)}
      {Item('Sexo', inSentenceCase(employee.sex))}
      {Item('Fecha de nacimiento', employee.birthDate?.toLocaleDateString())}
    </>
  );
}

const styles = StyleSheet.create({
  attendanceRecorderContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  attendanceRecorderButton: {
    marginTop: 16,
  },
});
