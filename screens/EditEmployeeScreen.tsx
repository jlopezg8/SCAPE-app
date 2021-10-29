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
import {
  AlternativeState,
  ScreenProgressBar,
  ScrollingSurface,
  Surface,
} from '../components/styled';
import Layout from '../constants/Layout';
import {
  EmployeeNotFoundError,
  EmployeeWithEmailAlreadyExistsError,
  EmployeeWithIdDocAlreadyExistsError,
  MultipleFacesInPhotoError,
  PhotoOfAnotherEmployeeError,
  useEmployeeEditor,
  useEmployeeGetterByIdDoc,
} from '../hooks/useEmployees';
import { EmployeeToEdit, employeeToEditSchema } from '../models/Employee';
import { EmployerStackScreensProps } from '../types';

/**
 * @param route.params.idDoc the employee's ID document
 * @requires react-native-paper.Provider for the Material Design components
 * @requires react-native-safe-area-context.SafeAreaProvider for safe area insets
 * @requires react-query.QueryClientProvider for queries and mutating data
 * expo-image-picker can be mocked
 * ../api/employees.getEmployeeByIdDoc can be mocked
 * ../api/employees.editEmployee can be mocked
 */
export default function EditEmployeeScreen(
  { route }: EmployerStackScreensProps['EditEmployee']
) {
  const { idDoc } = route.params;
  const { status, data: employee, error } = useEmployeeGetterByIdDoc(idDoc);
  switch (status) {
    case 'loading':
      return (
        <Surface>
          <ScreenProgressBar />
        </Surface>
      );
    case 'success':
      return <EditEmployeeForm initialValues={employee!} />;
    case 'error':
      return (
        <Surface>
          <GetEmployeeErrorState error={error as Error} idDoc={idDoc} />
        </Surface>
      );
    default:
      return null;
  }
}

const TextField: TextFieldType<EmployeeToEdit> = RawTextField;

function EditEmployeeForm(
  { initialValues }: { initialValues: EmployeeToEdit }
) {
  const editEmployee = useEmployeeEditor(initialValues);
  const submit = React.useCallback(
    (employee: EmployeeToEdit, formikHelpers: FormikHelpers<EmployeeToEdit>) =>
      _submit(editEmployee, employee, formikHelpers),
    [editEmployee]
  );
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={submit}
      validationSchema={employeeToEditSchema}
    >
      <>
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
            label="Contraseña"
            name="password"
            secureTextEntry
          />
          <SubmitButton label="Guardar" />
        </ScrollingSurface>
        <StatusSnackbar
          // TODO: mid: shouldn't need to do this:
          wrapperStyle={{ paddingHorizontal: Layout.padding }}
        />
      </>
    </Formik>
  );
}

async function _submit(
  editEmployee: ReturnType<typeof useEmployeeEditor>,
  employee: EmployeeToEdit,
  { setStatus }: FormikHelpers<EmployeeToEdit>
) {
  try {
    await editEmployee(employee);
    setStatus('Empleado editado');
  } catch (err) {
    setStatus(getEditEmployeeErrorMessage(err as Error));
  }
}

function getEditEmployeeErrorMessage(error: Error): string {
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
    return 'No se pudo editar el empleado. Ponte en contacto con Soporte.';
  }
}

function GetEmployeeErrorState(
  { error, idDoc }: { error: Error; idDoc: string }
) {
  if (error instanceof EmployeeNotFoundError) {
    var icon = 'account-question';
    var title = 'Empleado no encontrado';
    var tagline = `El empleado con el documento de identidad "${idDoc}" no se encuentra.`
                  + ' Retrocede a la página anterior.';
  } else {
    var icon = 'account-alert';
    var title = 'Error';
    var tagline = 'No se pudo obtener el empleado. Ponte en contacto con Soporte.';
  }
  console.log(title);
  return (
    <AlternativeState
      wrapperStyle={{ justifyContent: 'center' }}
      icon={icon}
      title={title}
      tagline={tagline}
    />
  );
}
