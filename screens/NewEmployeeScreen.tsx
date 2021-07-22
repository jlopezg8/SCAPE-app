import { Formik, FormikHelpers } from 'formik';
import React from 'react';

import {
  DatePicker,
  DropDown,
  PhotoPicker,
  StatusSnackbar,
  SubmitButton,
  TextField,
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
    setStatus('No se pudo crear el empleado');
    console.error(err);
  }
}

const EmployeeTextField: TextFieldType<Employee> = TextField;

/**
 * @requires react-native-paper.Provider for the Material Design components
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
        <EmployeeTextField label="Documento de identidad*" name="idDoc" keyboardType="number-pad" />
        <EmployeeTextField label="Nombre*" name="firstName" />
        <EmployeeTextField label="Apellido*" name="lastName" />
        <EmployeeTextField label="Correo electrónico" name="email" keyboardType="email-address" />
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
