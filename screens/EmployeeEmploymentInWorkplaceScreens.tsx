import { Formik, FormikHelpers } from 'formik';
import React from 'react';

import {
  ScrollViewInSurface,
  SurfaceInStackNav,
} from '../components/containers';
import {
  DatePicker,
  StatusSnackbar,
  SubmitButton,
} from '../components/formik';
import { AlternativeState, ScreenProgressBar } from '../components/misc';
import SchedulesPicker from '../components/SchedulesPicker';
import {
  EmployeeNotFoundError,
  useEmployeeEmploymentInWorkplaceGetter,
  useEmployeeEmploymentInWorkplaceEditor,
  WorkplaceNotFoundError,
} from '../hooks';
import Employment, {
  employmentSchema,
  getEmploymentInitialValues,
} from '../models/Employment';
import { EmployerStackScreensProps } from '../types';

/**
 * @param route.params.idDoc the employee's ID document
 * @param route.params.workplaceId the workplace ID
 * @requires `'react-native-paper'.Provider` for the Material Design components
 * @requires `'react-query'.QueryClientProvider` for queries and mutating data
 * `'@react-navigation/stack'` can be mocked
 * `'../api/employees'.putEmployeeEmploymentInWorkplace` can be mocked
 */
export function SetEmployeeEmploymentInWorkplaceScreen(
  { route }: EmployerStackScreensProps['SetEmployeeEmploymentInWorkplace']
) {
  const { employeeIdDoc, workplaceId } = route.params;
  const employment = getEmploymentInitialValues(employeeIdDoc, workplaceId);
  return (
    <SurfaceInStackNav>
      <EmployeeEmploymentInWorkplaceForm initialValues={employment} />
    </SurfaceInStackNav>
  );
}

/**
 * @param route.params.idDoc the employee's ID document
 * @param route.params.workplaceId the workplace ID
 * @requires `'react-native-paper'.Provider` for the Material Design components
 * @requires `'react-query'.QueryClientProvider` for queries and mutating data
 * `'@react-navigation/stack'` can be mocked
 * `'../api/employees'.getEmployeeEmploymentInWorkplace` can be mocked
 * `'../api/employees'.putEmployeeEmploymentInWorkplace` can be mocked
 */
export function EditEmployeeEmploymentInWorkplaceScreen(
  { route }: EmployerStackScreensProps['EditEmployeeEmploymentInWorkplace']
) {
  const { employeeIdDoc, workplaceId } = route.params;
  const { isFetching, data: employment, error } =
    useEmployeeEmploymentInWorkplaceGetter(employeeIdDoc, workplaceId);
  return (
    <SurfaceInStackNav>
      <ScreenProgressBar visible={isFetching} />
      {employment &&
        <EmployeeEmploymentInWorkplaceForm initialValues={employment} />
      }
      {error &&
        <GetEmploymentErrorState
          error={error as Error} 
          employeeIdDoc={employeeIdDoc}
          workplaceId={workplaceId}
        />
      }
    </SurfaceInStackNav>
  );
}

function EmployeeEmploymentInWorkplaceForm(
  { initialValues }: { initialValues: Employment }
) {
  const submit = useSubmit();
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={submit}
      validationSchema={employmentSchema}
    >
      <>
        <ScrollViewInSurface>
          <SchedulesPicker label="Horarios*" name="schedules" />
          <DatePicker label="Fecha de inicio" name="startDate" />
          <DatePicker label="Fecha de fin" name="endDate" />
          <SubmitButton label="Guardar" />
        </ScrollViewInSurface>
        <StatusSnackbar />
      </>
    </Formik>
  );
}

function useSubmit() {
  const { mutateAsync: putEmployeeEmploymentInWorkplace } =
    useEmployeeEmploymentInWorkplaceEditor();
  return React.useCallback(
    async (
      employment: Employment,
      { setStatus }: FormikHelpers<Employment>
    ) => {
      try {
        await putEmployeeEmploymentInWorkplace(employment);
        setStatus('Relación laboral almacenada');
      } catch (err) {
        setStatus('No se pudo almacenar la relacíon laboral.'
                  + ' Ponte en contacto con Soporte.');
      }
    },
    [putEmployeeEmploymentInWorkplace]
  );
}

interface GetEmploymentErrorStateProps {
  error: Error;
  employeeIdDoc: string;
  workplaceId: number;
}

function GetEmploymentErrorState(
  { error, employeeIdDoc, workplaceId }: GetEmploymentErrorStateProps
) {
  if (error instanceof EmployeeNotFoundError) {
    var icon = 'account-question';
    var title = 'Empleado no encontrado';
    var tagline = `El empleado con el documento de identidad "${employeeIdDoc}" no se encuentra.`
                  + ' Retrocede a la página anterior.';
  } if (error instanceof WorkplaceNotFoundError) {
    var icon = 'cloud-question';
    var title = 'Sitio de trabajo no encontrado';
    var tagline = `El sitio de trabajo con ID "${workplaceId}" no se encuentra.`
                  + ' Retrocede a la página anterior.';
  } else {
    var icon = 'account-alert';
    var title = 'Error';
    var tagline = 'No se pudo obtener la relación laboral del empleado.'
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
