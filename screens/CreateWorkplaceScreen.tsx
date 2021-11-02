import { Formik, FormikHelpers } from 'formik';
import React from 'react';

import {
  StatusSnackbar,
  SubmitButton,
  TextField as RawTextField,
  TextFieldType,
} from '../components/formik';
import { Surface } from '../components/styled';
import { useWorkplaceCreator } from '../hooks';
import {
  WorkplaceToCreate,
  workplaceToCreateInitialValues,
  workplaceToCreateSchema,
} from '../models/Workplace';

const TextField: TextFieldType<WorkplaceToCreate> = RawTextField;

/**
 * @requires `'react-native-paper'.Provider` for the Material Design components
 * @requires `'react-query'.QueryClientProvider` for mutating data
 * `'../api/workplaces'.createWorkplace` can be mocked
 */
export default function CreateWorkplaceScreen() {
  const { mutateAsync: createWorkplace } = useWorkplaceCreator();
  const submit = React.useCallback(
    (
      workplace: WorkplaceToCreate,
      formikHelpers: FormikHelpers<WorkplaceToCreate>
    ) => _submit(createWorkplace, workplace, formikHelpers),
    [createWorkplace]
  );
  return (
    <Formik
      initialValues={workplaceToCreateInitialValues}
      onSubmit={submit}
      validationSchema={workplaceToCreateSchema}
    >
      <Surface>
        <TextField label="Nombre*" name="name" />
        <TextField label="Descripción" name="description" />
        <TextField label="Dirección*" name="address" />
        <TextField label="Latitud*" name="latitude" />
        <TextField label="Longitud*" name="longitude" />
        <SubmitButton label="Guardar" />
        <StatusSnackbar />
      </Surface>
    </Formik>
  );
}

async function _submit(
  createWorkplace: (workplace: WorkplaceToCreate) => Promise<void>,
  employee: WorkplaceToCreate,
  { resetForm, setStatus }: FormikHelpers<WorkplaceToCreate>
) {
  try {
    await createWorkplace(employee);
    resetForm();
    setStatus('Sitio de trabajo creado');
  } catch (err) {
    console.error(err);
    setStatus('No se pudo crear el empleado. Ponte en contacto con Soporte.');
  }
}
