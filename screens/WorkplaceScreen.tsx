import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import {
  Caption,
  Card,
  Divider,
  Headline,
  IconButton,
  Paragraph,
  Subheading,
} from 'react-native-paper';

import {
  ScrollViewInSurfaceWithRefetch,
  Surface,
} from '../components/containers';
import { FAB, FABSize, Menu } from '../components/controls';
import { AlertDialog } from '../components/dialogs';
import { EmployeeListItem } from '../components/employees';
import {
  AlternativeState,
  ScreenProgressBar,
  Snackbar,
} from '../components/misc';
import Layout from '../constants/Layout';
import {
  useEmployeeDeleterByIdDoc,
  useEmployeeRemoverFromWorkplace,
  useLightHeader,
  useSnackbar,
  useVisible,
  useWorkplaceGetter,
  WorkplaceNotFoundError,
} from '../hooks';
import { Employee, Workplace, WorkplaceId } from '../models';
import { EmployerStackScreensProps } from '../types';

/**
 * @param route.params.id the workplace ID
 * @requires `navigator` better mock `'@react-navigation/native'`
 * @requires `'react-native-paper'.Provider` for the Material Design components
 * @requires `'react-native-safe-area-context'.SafeAreaProvider` for insets
 * @requires `'react-query'.QueryClientProvider` for queries
 * `'../api/workplaces'.deleteEmployeeByIdDoc` can be mocked
 * `'../api/workplaces'.getWorkplace` can be mocked
 */
export default function WorkplaceScreen(
  props: EmployerStackScreensProps['Workplace']
) {
  const {
    isProcessing,
    workplaceReady,
    workplace,
    navigation,
    refetch,
    setRemovingEmployee,
    setDeletingEmployee,
    error,
  } = useWorkplaceScreenProps(props);
  // We use `Surface` instead of `SurfaceInStackNav` since that component
  // substracts the navbar height from the container height, but this screen
  // doesn't have a navbar:
  return (
    <Surface style={styles.container}>
      <ScreenProgressBar visible={isProcessing} />
      {workplaceReady &&
        <WorkplaceViewer
          workplace={workplace}
          navigation={navigation}
          refetch={refetch}
          setRemovingEmployee={setRemovingEmployee}
          setDeletingEmployee={setDeletingEmployee}
        />
      }
      {error &&
        <GetWorkplaceErrorState
          error={error as Error}
          workplaceId={workplace.id}
        />
      }
    </Surface>
  );
}

function useWorkplaceScreenProps(
  { navigation, route }: EmployerStackScreensProps['Workplace']
) {
  const { id: workplaceId } = route.params;
  const { isFetching, isSuccess, data: workplace, refetch, error } =
    useWorkplaceGetter(workplaceId);
  const [isRemovingEmployee, setRemovingEmployee] = React.useState(false);
  const [isDeletingEmployee, setDeletingEmployee] = React.useState(false);
  return {
    isProcessing: isFetching || isRemovingEmployee || isDeletingEmployee,
    workplaceReady: isSuccess,
    workplace: Object.assign({}, workplace, { id: workplaceId }),
    navigation,
    refetch,
    setRemovingEmployee,
    setDeletingEmployee,
    error,
  };
}

type Navigation = EmployerStackScreensProps['Workplace']['navigation'];

interface WorkplaceViewerProps {
  workplace: Workplace;
  navigation: Navigation;
  refetch: () => Promise<unknown>;
  setRemovingEmployee: (isRemovingEmployee: boolean) => void;
  setDeletingEmployee: (isDeletingEmployee: boolean) => void;
}

function WorkplaceViewer(
  {
    workplace,
    navigation,
    refetch,
    setRemovingEmployee,
    setDeletingEmployee,
  }: WorkplaceViewerProps
) {
  useLightHeader();
  const snackbar = useSnackbar();
  return <>
    <ScrollViewInSurfaceWithRefetch
      contentContainerStyle={styles.scrollViewContentContainer}
      refetch={refetch}
      progressViewOffset={Layout.padding}
    >
      <WorkplaceCard workplace={workplace} />
      <EmployeesSectionWithContext
        workplace={workplace}
        setRemovingEmployee={setRemovingEmployee}
        setDeletingEmployee={setDeletingEmployee}
        setMessage={snackbar.setMessage}
      />
    </ScrollViewInSurfaceWithRefetch>
    <TheSnackbar self={snackbar} />
    <FAB
      icon="account-plus"
      label="Añadir empleado"
      onPress={() => navigation.navigate(
        'AddEmployeeToWorkplace', { workplaceId: workplace.id! }
      )}
    />
  </>;
}

function WorkplaceCard({ workplace }: { workplace: Workplace }) {
  return <>
    <Card style={styles.workplaceCard}>
      {/* TODO: high: replace with map view */}
      <Card.Cover source={{ uri: 'https://images.unsplash.com/photo-1501523460185-2aa5d2a0f981?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=640' }} />
      <Card.Content
        // Defined inline so it overrides the default paddingHorizontal and
        // paddingBottom:
        style={{ paddingHorizontal: Layout.padding, paddingVertical: 16 }}
      >
        <Headline style={styles.workplaceHeading}>{workplace.name}</Headline>
        <Caption>{workplace.address}</Caption>
        {workplace.description &&
          <Paragraph style={styles.workplaceDescription}>
            {workplace.description}
          </Paragraph>
        }
      </Card.Content>
    </Card>
    <Divider style={styles.workplaceCardDivider} />
  </>;
}

interface EmployeesSectionWithContextProps {
  workplace: Workplace;
  setRemovingEmployee: (isRemovingEmployee: boolean) => void;
  setDeletingEmployee: (isDeletingEmployee: boolean) => void;
  setMessage: (message: string) => void,
};

function EmployeesSectionWithContext(
  {
    workplace,
    setRemovingEmployee,
    setDeletingEmployee,
    setMessage,
  }: EmployeesSectionWithContextProps
) {
  const removeEmployeeMutation = useEmployeeRemoverWithEffects(
    workplace.id!, setRemovingEmployee, setMessage
  );
  const deleteEmployeeMutation = useEmployeeDeleterWithEffects(
    setDeletingEmployee, setMessage
  );
  return (
    <WorkplaceIdContext.Provider value={workplace.id!}>
      <RemoveEmployeeMutationContext.Provider value={removeEmployeeMutation}>
        <DeleteEmployeeMutationContext.Provider value={deleteEmployeeMutation}>
          <EmployeesSection employees={workplace.employees}/>
        </DeleteEmployeeMutationContext.Provider>
      </RemoveEmployeeMutationContext.Provider>
    </WorkplaceIdContext.Provider>
  );
}

function useEmployeeRemoverWithEffects(
  workplaceId: number,
  setRemovingEmployee: (isRemovingEmployee: boolean) => void,
  setMessage: (message: string) => void,
) {
  const mutation = useEmployeeRemoverFromWorkplace(workplaceId);
  const { isLoading: isRemovingEmployee, isSuccess, error } = mutation;
  React.useEffect(() => {
    setRemovingEmployee(isRemovingEmployee);
  }, [isRemovingEmployee]);
  React.useEffect(() => {
    if (isSuccess) {
      setMessage('Empleado retirado del sitio de trabajo');
    } else if (error) {
      setMessage('No se pudo retirar al empleado del sitio de trabajo.'
                 + ' Ponte en contacto con Soporte.');
      console.error(error);
    }
  }, [isSuccess, error]);
  return mutation;
}

function useEmployeeDeleterWithEffects(
  setDeletingEmployee: (isDeletingEmployee: boolean) => void,
  setMessage: (message: string) => void
) {
  const mutation = useEmployeeDeleterByIdDoc();
  const { isLoading: isDeletingEmployee, isSuccess, error } = mutation;
  React.useEffect(() => {
    setDeletingEmployee(isDeletingEmployee);
  }, [isDeletingEmployee]);
  React.useEffect(() => {
    if (isSuccess) {
      setMessage('Empleado borrado');
    } else if (error) {
      setMessage('No se pudo borrar el empleado. Ponte en contacto con Soporte.');
      console.error(error);
    }
  }, [isSuccess, error]);
  return mutation;
}

const WorkplaceIdContext = React.createContext<WorkplaceId>(undefined!);

const RemoveEmployeeMutationContext =
  React.createContext<
    ReturnType<typeof useEmployeeRemoverFromWorkplace>
  >(undefined!);

const DeleteEmployeeMutationContext =
  React.createContext<
    ReturnType<typeof useEmployeeDeleterByIdDoc>
  >(undefined!);

function EmployeesSection(
  { employees }: { employees: Employee[] | undefined }
) {
  return <>
    <Subheading style={styles.employeesHeading}>Empleados</Subheading>
    {employees &&
      (employees.length === 0
        ? <EmployeesEmptyState />
        : employees?.map(employee =>
            <TheEmployeeListItem key={employee.idDoc} employee={employee} />
          )
      )
    }
  </>;
}

function EmployeesEmptyState() {
  return (
    <AlternativeState
      wrapperStyle={styles.employeesEmptyState}
      icon="account-multiple"
      title="No hay empleados"
      tagline="Añade a un empleado y aparecerá aquí"
    />
  );
}

function TheEmployeeListItem({ employee }: { employee: Employee }) {
  const { idDoc } = employee;
  const navigation = useNavigation<Navigation>();
  return (
    <EmployeeListItem
      employee={employee}
      right={sideProps =>
        <EmployeePopupMenu
          employeeIdDoc={idDoc}
          navigation={navigation}
          sideProps={sideProps}
        />
      }
      onPress={() => navigation.navigate('EditEmployee', { idDoc })}
      style={styles.employeeListItem}
    />
  );
}

interface EmployeePopupMenuProps<SidePropsType> {
  employeeIdDoc: Employee['idDoc'];
  navigation: Navigation;
  sideProps: SidePropsType;
}

function EmployeePopupMenu<SidePropsType>(
  props: EmployeePopupMenuProps<SidePropsType>
) {
  const {
    sideProps,
    navigateToEditEmployment,
    removeEmployeeFromWorkplaceDialog,
    deleteEmployeeDialog,
    employeeIdDoc,
  } = useEmployeePopupMenuProps(props);
  return <>
    <Menu
      anchor={openMenu =>
        <IconButton
          icon="dots-vertical"
          onPress={openMenu}
          accessibilityLabel="Abrir menú emergente"
          {...sideProps}
        />
      }
      items={closeMenuAfter => ([
        <Menu.Item
          key={0}
          title="Editar relación laboral"
          onPress={closeMenuAfter(navigateToEditEmployment)}
        />,
        <Menu.Item
          key={1}
          title="Retirar del sitio de trabajo"
          onPress={closeMenuAfter(removeEmployeeFromWorkplaceDialog.open)}
        />,
        <Menu.Item
          key={2}
          title="Borrar"
          onPress={closeMenuAfter(deleteEmployeeDialog.open)}
        />,
      ])}
    />
    <RemoveEmployeeFromWorkplaceDialog
      self={removeEmployeeFromWorkplaceDialog}
      employeeIdDoc={employeeIdDoc}
    />
    <DeleteEmployeeDialog
      self={deleteEmployeeDialog}
      employeeIdDoc={employeeIdDoc}
    />
  </>;
}

function useEmployeePopupMenuProps<SidePropsType>(
  {
    employeeIdDoc,
    navigation,
    sideProps,
  }: EmployeePopupMenuProps<SidePropsType>
) {
  const workplaceId = React.useContext(WorkplaceIdContext);
  const navigateToEditEmployment = () => navigation.navigate(
    'EditEmployeeEmploymentInWorkplace', { employeeIdDoc, workplaceId }
  );
  const removeEmployeeFromWorkplaceDialog = useVisible();
  const deleteEmployeeDialog = useVisible();
  return {
    sideProps,
    navigateToEditEmployment,
    removeEmployeeFromWorkplaceDialog,
    deleteEmployeeDialog,
    employeeIdDoc,
  };
}

interface RemoveEmployeeFromWorkplaceDialogProps {
  self: ReturnType<typeof useVisible>;
  employeeIdDoc: Employee['idDoc'];
}

function RemoveEmployeeFromWorkplaceDialog(
  { self, employeeIdDoc }: RemoveEmployeeFromWorkplaceDialogProps
) {
  const { mutate: removeEmployeeFromWorkplace } =
    React.useContext(RemoveEmployeeMutationContext);
  return (
    <AlertDialog
      self={self}
      supportingText="¿Retirar empleado del sitio de trabajo?"
      confirmButtonLabel="Retirar"
      onConfirm={self.closeAfter(
        () => removeEmployeeFromWorkplace(employeeIdDoc)
      )}
    />
  );
}

interface DeleteEmployeeDialogProps {
  self: ReturnType<typeof useVisible>;
  employeeIdDoc: Employee['idDoc'];
}

function DeleteEmployeeDialog(
  { self, employeeIdDoc }: DeleteEmployeeDialogProps
) {
  const { mutate: deleteEmployee } =
    React.useContext(DeleteEmployeeMutationContext);
  return (
    <AlertDialog
      self={self}
      supportingText="¿Borrar empleado?"
      confirmButtonLabel="Borrar"
      onConfirm={self.closeAfter(() => deleteEmployee(employeeIdDoc))}
    />
  );
}

function TheSnackbar({ self }: { self: ReturnType<typeof useSnackbar> }) {
  return (
    <Snackbar
      visible={self.visible}
      onDismiss={self.close}
      message={self.message}
      // Defined inline so it overrides the default style:
      wrapperStyle={{
        bottom: FABSize + Layout.padding / 2,
      }}
    />
  );
}

function GetWorkplaceErrorState(
  { error, workplaceId }: { error: Error; workplaceId: Workplace['id'] }
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
      wrapperStyle={styles.getWorkplaceErrorState}
      icon={icon}
      title={title}
      tagline={tagline}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    maxHeight: Platform.OS === 'web' ? Layout.window.height : undefined,
  },
  scrollViewContentContainer: {
    paddingBottom: 1.5 * Layout.padding + FABSize,
  },
  workplaceCard: {
    marginHorizontal: -Layout.padding,
    marginTop: -Layout.padding,
  },
  workplaceHeading: {
    lineHeight: 24, // same as its fontSize
  },
  workplaceDescription: {
    marginTop: 16,
  },
  workplaceCardDivider: {
    marginHorizontal: -Layout.padding,
  },
  employeesHeading: {
    marginVertical: Layout.padding / 2,
  },
  employeesEmptyState: {
    marginTop: Layout.padding / 2,
  },
  employeeListItem: {
    paddingHorizontal: 0, // override its `paddingHorizontal: 8`
  },
  getWorkplaceErrorState: {
    justifyContent: 'center'
  },
});
