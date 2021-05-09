import { Formik, FormikHelpers } from 'formik';
import React from 'react';

import {
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
        <EmployeeTextField label="Documento de identidad*" name="idDoc" />
        <EmployeeTextField label="Nombre*" name="firstName" />
        <EmployeeTextField label="Apellido*" name="lastName" />
        <EmployeeTextField label="Correo electrónico" name="email" />
        <EmployeeTextField label="Sexo" name="sex" />
        <EmployeeTextField label="Fecha de nacimiento" name="birthDate" />
        <SubmitButton label="Guardar" />
        <StatusSnackbar />
      </ScrollingSurface>
    </Formik>
  );
}
