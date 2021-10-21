import { Formik, FormikHelpers } from 'formik';
import React from 'react';

import {
  DatePicker,
  DropDown,
  PhotoPicker,
  StatusSnackbar,
  SubmitButton,
  TextField as RawTextField,
  TextFieldType,
} from '../components/formik';
import { ScrollingSurface } from '../components/styled';
import {
  EmployeeWithEmailAlreadyExistsError,
  EmployeeWithIdDocAlreadyExistsError,
  MultipleFacesInPhotoError,
  PhotoOfAnotherEmployeeError,
  useEmployeeCreator,
} from '../hooks/useEmployees';
import {
  EmployeeToCreate,
  employeeToCreateInitialValues,
  employeeToCreateSchema,
} from '../models/Employee';
import { EmployerStackScreensProps } from '../types';

const TextField: TextFieldType<EmployeeToCreate> = RawTextField;

/**
 * @param route.params.workplaceId
 * @requires react-native-paper.Provider for the Material Design components
 * @requires react-native-safe-area-context.SafeAreaProvider for safe area insets
 * @requires react-query.QueryClientProvider for mutating data
 * expo-image-picker can be mocked
 * ../api/employees.createEmployee can be mocked
 */
export default function CreateEmployeeScreen(
  { route }: EmployerStackScreensProps['CreateEmployee']
) {
  const { workplaceId } = route.params;
  const createEmployee = useEmployeeCreator(workplaceId);
  const submit = React.useCallback(
    (
      employee: EmployeeToCreate,
      formikHelpers: FormikHelpers<EmployeeToCreate>
    ) => _submit(createEmployee, employee, formikHelpers),
    [createEmployee]
  );
  return (
    <Formik
      initialValues={employeeToCreateInitialValues}
      onSubmit={submit}
      validationSchema={employeeToCreateSchema}
    >
      <ScrollingSurface>
        <PhotoPicker name="photo" />
        <TextField
          label="Documento de identidad*"
          name="idDoc"
          keyboardType="number-pad"
        />
        <TextField label="Nombre*" name="firstName" />
        <TextField label="Apellido*" name="lastName" />
        <TextField
          label="Correo electrónico*"
          name="email"
          keyboardType="email-address"
        />
        <DropDown label="Sexo" name="sex" options={[
          { label: 'Hombre', value: 'hombre' },
          { label: 'Mujer', value: 'mujer' },
          { label: 'Intersexo', value: 'intersexo' },
        ]} />
        <DatePicker label="Fecha de nacimiento" name="birthDate" />
        <TextField
          label="Contraseña*"
          name="password"
          secureTextEntry
        />
        <SubmitButton label="Guardar" />
        <StatusSnackbar />
      </ScrollingSurface>
    </Formik>
  );
}

async function _submit(
  createEmployee: ReturnType<typeof useEmployeeCreator>,
  employee: EmployeeToCreate,
  { resetForm, setStatus }: FormikHelpers<EmployeeToCreate>
) {
  try {
    await createEmployee(employee);
    resetForm();
    setStatus('Empleado creado');
  } catch (err) {
    setStatus(getCreateEmployeeErrorMessage(err as Error));
  }
}

function getCreateEmployeeErrorMessage(error: Error): string {
  if (error instanceof EmployeeWithIdDocAlreadyExistsError) {
    return 'Ya se ha registrado un empleado con ese documento de identidad';
  } else if (error instanceof EmployeeWithEmailAlreadyExistsError) {
    return 'Ese correo ya está en uso. Prueba con otro.';
  } else if (error instanceof MultipleFacesInPhotoError) {
    return 'Usa una foto que contenga una, y sólo una, cara';
  } else if (error instanceof PhotoOfAnotherEmployeeError) {
    return 'Esa foto corresponde a un empleado ya registrado';
  } else {
    console.error(error);
    return 'No se pudo crear el empleado. Ponte en contacto con Soporte.';
  }
}
