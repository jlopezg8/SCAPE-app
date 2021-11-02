import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import {
  Avatar,
  Caption,
  Card,
  Divider,
  Headline,
  IconButton,
  Paragraph,
  Subheading,
} from 'react-native-paper';

import { AlertDialog } from '../components/dialogs';
import {
  AlternativeState,
  FAB,
  FABSize,
  ListItem,
  Menu,
  ScreenProgressBar,
  ScrollViewInSurfaceWithRefetch,
  Snackbar,
  Surface,
} from '../components/styled';
import Layout from '../constants/Layout';
import {
  useEmployeeDeleterByIdDoc,
  useLightHeader,
  useSnackbar,
  useVisible,
  useWorkplaceGetter,
  WorkplaceNotFoundError,
} from '../hooks';
import { Employee } from '../models/Employee';
import Workplace from '../models/Workplace';
import { EmployerStackScreensProps } from '../types';

/**
 * @param route.params.id workplace ID
 * @requires `navigator` better mock `'@react-navigation/native'`
 * @requires `'react-native-paper'.Provider` for the Material Design components
 * @requires `'react-native-safe-area-context'.SafeAreaProvider` for insets
 * @requires `'react-query'.QueryClientProvider` for queries
 * `'../api/workspace'.getWorkspace` can be mocked
 */
export default function WorkplaceScreen(
  { navigation, route }: EmployerStackScreensProps['Workplace']
) {
  const { id: workplaceId } = route.params;
  const { isFetching, data: workplace, refetch, error } =
    useWorkplaceGetter(workplaceId);
  const [isDeletingEmployee, setDeletingEmployee] = React.useState(false);
  // We use `Surface` instead of `SurfaceInStackNav` since that component
  // substracts the navbar height from the container height, but this screen
  // doesn't have a navbar:
  return (
    <Surface style={styles.container}>
      <ScreenProgressBar visible={isFetching || isDeletingEmployee} />
      {workplace &&
        <WorkplaceViewer
          workplace={Object.assign(workplace, { id: workplaceId })}
          navigation={navigation}
          setDeletingEmployee={setDeletingEmployee}
          refetch={refetch}
        />
      }
      {error &&
        <GetWorkspaceErrorState
          error={error as Error}
          workplaceId={workplaceId}
        />
      }
    </Surface>
  );
}

interface WorkplaceViewerProps {
  workplace: Workplace;
  navigation: EmployerStackScreensProps['Workplace']['navigation'];
  setDeletingEmployee: (isDeletingEmployee: boolean) => void;
  refetch: () => Promise<unknown>;
}

function WorkplaceViewer(
  { workplace, navigation, setDeletingEmployee, refetch }: WorkplaceViewerProps
) {
  useLightHeader();
  const snackbar = useSnackbar();
  const deleteEmployeeMutation =
    useEmployeeDeleterWithEffects(setDeletingEmployee, snackbar.setMessage);
  return <>
    <ScrollViewInSurfaceWithRefetch
      contentContainerStyle={styles.scrollViewContentContainer}
      refetch={refetch}
      progressViewOffset={Layout.padding}
    >
      <WorkplaceCard workplace={workplace} />
      <DeleteEmployeeMutationContext.Provider value={deleteEmployeeMutation}>
        <EmployeesSection employees={workplace.employees}/>
      </DeleteEmployeeMutationContext.Provider>
    </ScrollViewInSurfaceWithRefetch>
    <TheSnackbar self={snackbar} />
    <FAB
      icon="account-plus"
      label="Añadir empleado"
      onPress={() =>
        navigation.navigate('CreateEmployee', { workplaceId: workplace.id! })
      }
    />
  </>;
}

function useEmployeeDeleterWithEffects(
  setDeletingEmployee: (isDeletingEmployee: boolean) => void,
  setMessage: (status: string) => void
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

const DeleteEmployeeMutationContext =
  React.createContext<ReturnType<typeof useEmployeeDeleterByIdDoc>>(undefined!);

function EmployeesSection(
  { employees }: { employees: Employee[] | undefined }
) {
  return <>
    <Subheading style={styles.employeesHeading}>Empleados</Subheading>
    {employees &&
      (employees.length === 0
        ? <EmployeesEmptyState />
        : employees?.map(employee =>
            <EmployeeListItem key={employee.idDoc} employee={employee} />
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

function EmployeeListItem({ employee }: { employee: Employee }) {
  const { idDoc, firstName, lastName } = employee;
  const navigation =
    useNavigation<EmployerStackScreensProps['Workplace']['navigation']>();
  return (
    <ListItem
      title={`${firstName} ${lastName}`}
      description="Cargo"
      left={props => <EmployeeAvatar employee={employee} props={props} />}
      right={props =>
        <EmployeePopupMenu employeeIdDoc={idDoc} props={props} />
      }
      onPress={() => navigation.navigate('EditEmployee', { idDoc })}
    />
  );
}

function EmployeeAvatar<SidePropsType>(
  { employee, props }: { employee: Employee; props: SidePropsType }
) {
  const { photo, firstName, lastName } = employee;
  return photo
    ? <Avatar.Image
        source={{ uri: `data:image/jpg;base64,${photo}` }}
        size={48}
        {...props} 
      />
    : <Avatar.Text
        label={firstName[0] + lastName[0]}
        size={48}
        {...props}
        color="white"
      />;
}

interface EmployeePopupMenuProps<SidePropsType> {
  employeeIdDoc: Employee['idDoc'];
  props: SidePropsType;
}

function EmployeePopupMenu<SidePropsType>(
  { employeeIdDoc, props }: EmployeePopupMenuProps<SidePropsType>
) {
  const deleteEmployeeDialog = useVisible();
  return <>
    <Menu
      anchor={openMenu =>
        <IconButton
          icon="dots-vertical"
          onPress={openMenu}
          accessibilityLabel="Abrir menú emergente"
          {...props}
        />
      }
      items={closeMenuAfter =>
        <Menu.Item
          title="Borrar"
          onPress={closeMenuAfter(deleteEmployeeDialog.open)}
        />
      }
    />
    <DeleteEmployeeDialog
      self={deleteEmployeeDialog}
      employeeIdDoc={employeeIdDoc}
    />
  </>;
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

function GetWorkspaceErrorState(
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
      wrapperStyle={styles.getWorkspaceErrorState}
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
  getWorkspaceErrorState: {
    justifyContent: 'center'
  },
});
