import { Formik, FormikHelpers } from 'formik';
import * as React from 'react';

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

// TODO: move somewhere else, and maybe add types
function replaceEmptyValuesWithNull(obj: any) {
  const newObj = Object.assign({}, obj);
  for (const [key, val] of Object.entries(obj)) {
    newObj[key] = val || null;
  }
  return newObj;
}

function createSubmit(createEmployee: ReturnType<typeof useEmployeeCreator>) {
  return async function submit(
    employee: Employee,
    { resetForm, setStatus }: FormikHelpers<Employee>
  ) {
    try {
      const employeeWithoutEmptyValues = replaceEmptyValuesWithNull(employee);
      const response = await createEmployee(employeeWithoutEmptyValues);
      console.log(response);
      resetForm();
      setStatus('Empleado creado');
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
export default function NewEmployeeScreen() {
  const createEmployee = useEmployeeCreator();
  const submit = React.useCallback(
    createSubmit(createEmployee), [createEmployee]);
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
