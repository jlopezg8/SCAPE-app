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
import { AlternativeState, ScreenProgressBar } from '../components/misc';
import {
  useWorkplaceEditor,
  useWorkplaceGetter,
  WorkplaceNotFoundError,
} from '../hooks/useWorkplaces';
import Workplace, {
  WorkplaceToCreateOrEdit,
  workplaceToCreateOrEditSchema,
} from '../models/Workplace';
import { EmployerStackScreensProps } from '../types';

/**
 * @param route.params.id the workplace's ID
 * @requires `'react-native-paper'.Provider` for the Material Design components
 * @requires `'react-query'.QueryClientProvider` for queries and mutating data
 * `'../api/workplaces'.editWorkplace` can be mocked
 * `'../api/workplaces'.getWorkplace` can be mocked
 */
export default function EditWorkplaceScreen(
  { route }: EmployerStackScreensProps['EditWorkplace']
) {
  const { id: workplaceId } = route.params;
  const { isFetching, data: workplace, error } =
    useWorkplaceGetter(workplaceId);
  return (
    <SurfaceInStackNav>
      <ScreenProgressBar visible={isFetching} />
      {workplace &&
        <EditWorkplaceForm
          workplaceId={workplaceId}
          initialValues={workplace as WorkplaceToCreateOrEdit}
        />
      }
      {error &&
        <GetWorkplaceErrorState
          error={error as Error}
          workplaceId={workplaceId}
        />
      }
    </SurfaceInStackNav>
  );
}

const TextField: TextFieldType<WorkplaceToCreateOrEdit> = RawTextField;

type WorkplaceId = NonNullable<Workplace['id']>;

interface EditWorkplaceFormProps {
  workplaceId: WorkplaceId;
  initialValues: WorkplaceToCreateOrEdit;
}

function EditWorkplaceForm(
  { workplaceId, initialValues }: EditWorkplaceFormProps
) {
  const submit = useSubmit(workplaceId);
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={submit}
      validationSchema={workplaceToCreateOrEditSchema}
    >
      <>
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
      </>
    </Formik>
  );
}

function useSubmit(workplaceId: WorkplaceId) {
  const { mutateAsync: editWorkplace } = useWorkplaceEditor(workplaceId);
  return React.useCallback(
    async (
      workplace: WorkplaceToCreateOrEdit,
      { setStatus }: FormikHelpers<WorkplaceToCreateOrEdit>
    ) => {
      try {
        await editWorkplace(workplace);
        setStatus('Sitio de trabajo editado');
      } catch (err) {
        setStatus('No se pudo editar el sitio de trabajo. Ponte en contacto con Soporte.');
      }
    },
    [editWorkplace]
  );
}

function GetWorkplaceErrorState(
  { error, workplaceId }: { error: Error; workplaceId: WorkplaceId; }
) {
  if (error instanceof WorkplaceNotFoundError) {
    var icon = 'cloud-question';
    var title = 'Sitio de trabajo no encontrado';
    var tagline = `El sitio de trabajo con ID "${workplaceId}" no se encuentra.`
                  + ' Retrocede a la página anterior.';
  } else {
    var icon = 'cloud-alert';
    var title = 'Error';
    var tagline = 'No se pudo obtener el sitio de trabajo.'
                  + ' Ponte en contacto con Soporte.';
  }
  return (
    <AlternativeState
      wrapperStyle={{ justifyContent: 'center' }}
      icon={icon}
      title={title}
      tagline={tagline}
    />
  );
}
