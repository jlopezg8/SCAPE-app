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
import { useEmployeeCreator } from '../hooks/useEmployees';
import {
  Employee,
  employeeInitialValues,
  employeeSchema,
} from '../models/Employee';
import { replaceEmptyValuesWithNull } from '../utils';

const TextField: TextFieldType<Employee> = RawTextField;

/**
 * @requires react-native-paper.Provider for the Material Design components
 * @requires react-native-safe-area-context.SafeAreaProvider for safe area insets
 * @requires react-query.QueryClientProvider for mutating data
 * expo-image-picker can be mocked
 * ../api/employees/createEmployee can be mocked
 */
export default function NewEmployeeScreen() {
  const createEmployee = useEmployeeCreator();
  const submit = React.useCallback(
    (employee: Employee, formikHelpers: FormikHelpers<Employee>) =>
      _submit(createEmployee, employee, formikHelpers),
    [createEmployee]
  );
  return (
    <Formik
      initialValues={employeeInitialValues}
      onSubmit={submit}
      validationSchema={employeeSchema}
    >
      <ScrollingSurface>
        <PhotoPicker name="photo" />
        {/* It seems react-native-paper.TextInput ignores the keyboardType prop */}
        <TextField label="Documento de identidad*" name="idDoc" keyboardType="number-pad" />
        <TextField label="Nombre*" name="firstName" />
        <TextField label="Apellido*" name="lastName" />
        <TextField label="Correo electrónico" name="email" keyboardType="email-address" />
        <DropDown label="Sexo" name="sex" options={[
          { label: 'Hombre', value: 'hombre' },
          { label: 'Mujer', value: 'mujer' },
          { label: 'Intersexo', value: 'intersexo' },
        ]} />
        <DatePicker label="Fecha de nacimiento" name="birthDate" />
        <SubmitButton label="Guardar" />
        <StatusSnackbar />
      </ScrollingSurface>
    </Formik>
  );
}

async function _submit(
  createEmployee: ReturnType<typeof useEmployeeCreator>,
  employee: Employee,
  { resetForm, setStatus }: FormikHelpers<Employee>
) {
  try {
    const response = await createEmployee(
      replaceEmptyValuesWithNull(employee));
    console.log(response);
    resetForm();
    setStatus('Empleado creado');
  } catch (err) {
    const error = err as Error;
    setStatus(error.name === 'BadRequestError'
                ? error.message
                : 'No se pudo crear el empleado. Ponte en contacto con Soporte.');
    console.error(error);
  }
}
