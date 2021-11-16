import { Formik, FormikHelpers } from 'formik';
import React from 'react';

import {
  ScrollViewInSurface,
  SurfaceInStackNav,
} from '../components/containers';
import {
  PlacePicker,
  StatusSnackbar,
  SubmitButton,
  TextField as RawTextField,
  TextFieldType,
} from '../components/formik';
import { useWorkplaceCreator } from '../hooks';
import {
  workplaceToCreateInitialValues,
  WorkplaceToCreateOrEdit,
  workplaceToCreateOrEditSchema,
} from '../models/Workplace';

const TextField: TextFieldType<WorkplaceToCreateOrEdit> = RawTextField;

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
      validationSchema={workplaceToCreateOrEditSchema}
    >
      <SurfaceInStackNav>
        <ScrollViewInSurface>
          <TextField label="Nombre*" name="name" />
          <TextField label="Descripción" name="description" />
          <PlacePicker
            addressLabel="Dirección*"
            addressName="address"
            coordinateName="location"
          />
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
      workplace: WorkplaceToCreateOrEdit,
      { resetForm, setStatus }: FormikHelpers<WorkplaceToCreateOrEdit>
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
