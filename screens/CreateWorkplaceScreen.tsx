import { Formik, FormikHelpers } from 'formik';
import React from 'react';

import {
  StatusSnackbar,
  SubmitButton,
  TextField as RawTextField,
  TextFieldType,
} from '../components/formik';
import { ScrollViewInSurface, SurfaceInStackNav } from '../components/styled';
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
  const submit = useSubmit();
  return (
    <Formik
      initialValues={workplaceToCreateInitialValues}
      onSubmit={submit}
      validationSchema={workplaceToCreateSchema}
      initialStatus="test"
    >
      <SurfaceInStackNav>
        <ScrollViewInSurface>
          <TextField label="Nombre*" name="name" />
          <TextField label="Descripción" name="description" />
          <TextField label="Dirección*" name="address" />
          <TextField label="Latitud*" name="latitude" />
          <TextField label="Longitud*" name="longitude" />
          <SubmitButton label="Guardar" />
        </ScrollViewInSurface>
        <StatusSnackbar />
      </SurfaceInStackNav>
    </Formik>
  );
}

function useSubmit() {
  const { mutateAsync: createWorkplace } = useWorkplaceCreator();
  return React.useCallback(
    async (
      workplace: WorkplaceToCreate,
      { resetForm, setStatus }: FormikHelpers<WorkplaceToCreate>
    ) => {
      try {
        await createWorkplace(workplace);
        resetForm();
        setStatus('Sitio de trabajo creado');
      } catch (err) {
        console.error(err);
        setStatus('No se pudo crear el sitio de trabajo. Ponte en contacto con Soporte.');
      }
    },
    [createWorkplace]
  );
}