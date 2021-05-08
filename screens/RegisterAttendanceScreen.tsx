import { Formik, FormikHelpers } from 'formik';
import * as React from 'react';
import { Image, KeyboardAvoidingView, Platform, StyleSheet, Text } from 'react-native';
import { ActivityIndicator, List } from 'react-native-paper';

import {
  StatusSnackbar,
  SubmitButton,
  TextField,
  TextFieldType,
} from '../components/formik';
import { PhotoPicker } from '../components/PhotoPicker';
// TODO: decide what surface to use
import { Surface } from '../components/styled';
import { useAttendanceRegister, useEmployeeCreator } from '../hooks/useEmployees';
import {
  Employee,
  employeeInitialValues,
  employeeSchema,
} from '../models/Employee';

// TODO: move somewhere else, and maybe add types
function replaceEmptyValuesWithNull(obj: any) {
  const newObj = Object.assign({}, obj);
  for (const [key, val] of Object.entries(obj)) {
    newObj[key] = val || null;
  }
  return newObj;
}

function createSubmit(createEmployee: ReturnType<typeof useEmployeeCreator>) {
  return async function (
    employee: Employee,
    { resetForm, setStatus }: FormikHelpers<Employee>
  ) {
    try {
      const employeeWithoutEmptyValues = replaceEmptyValuesWithNull(employee);
      const response = await createEmployee(employeeWithoutEmptyValues);
      console.log(response);
      setStatus('Empleado creado');
      resetForm();
    } catch (err) {
      setStatus('No se pudo crear el empleado');
      console.error(err);
    }
  }
}

const EmployeeTextField: TextFieldType<Employee> = TextField;

/**
 * @requires react-native-paper.Provider for the Material Design components
 */
export default function RegisterAttendanceScreen() {
  return <Surface><RealRegisterAttendanceScreen /></Surface>;;
}

function RealRegisterAttendanceScreen() {
  const [photo, setPhoto] = React.useState<string | undefined>(undefined);
  const { status, data: employee, error } = useAttendanceRegister(photo);
  switch (status) {
    case 'idle':
      return <PhotoPicker setStatus={() => void(0)} setBase64Image={setPhoto} />
    case 'loading':
      return <ActivityIndicator />;
    case 'error':
      return (
        <>
          <PhotoPicker setStatus={() => void(0)} setBase64Image={setPhoto} />
          <Text>{error.message}</Text>
        </>
      );
    case 'success':
      return <EmployeeViewer employee={employee} />;
    default:
      console.error(`WTF? status === ${status}`);
      return null;
  }
}

function EmployeeViewer({ employee }: { employee: Employee }) {
  return (
    <>
      {employee.photo && <Image style={styles.photo} source={{ uri: `data:image/jpeg;base64,${employee.photo}` }} />}
      {employee.idDoc && <List.Item title={employee.idDoc} description="Documento de identidad" />}
      {employee.firstName && <List.Item title={employee.firstName} description="Nombre" />}
      {employee.lastName && <List.Item title={employee.lastName} description="Apellido" />}
      {employee.email && <List.Item title={employee.email} description="Correo electrónico" />}
      {employee.sex && <List.Item title={employee.sex} description="Sexo" />}
      {employee.birthDate && <List.Item title={employee.birthDate} description="Fecha de nacimiento" />}
    </>
  );
}

const styles = StyleSheet.create({
  photo: {
    width: '100%',
    height: 500,
  },
});
