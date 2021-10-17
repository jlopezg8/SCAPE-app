import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import {
  ActivityIndicator,
  Avatar,
  Card,
  Divider,
  Headline,
  IconButton,
  List,
  Paragraph,
  Subheading,
} from 'react-native-paper';

import { AlertDialog } from '../components/dialogs';
import {
  AlternativeState,
  FAB,
  FABSize,
  Menu,
  ScrollingSurface,
  Snackbar,
} from '../components/styled';
import Layout from '../constants/Layout';
import {
  useEmployeeDeleterByIdDoc,
  useEmployeesGetterByWorkplace,
  useLightStatusBar,
  useSnackbar,
  useVisible,
  WorkplaceNotFoundError,
} from '../hooks';
import { Employee } from '../models/Employee';
import { EmployerStackScreensProps } from '../types';

/**
 * @param navigation.navigate can be mocked
 * @param route.params.id workplace ID
 * @requires `navigator` better mock `'@react-navigation/native'`
 * @requires `'react-native-paper'.Provider` for the Material Design components
 * @requires `'react-native-safe-area-context'.SafeAreaProvider` for insets
 * @requires `'react-query'.QueryClientProvider` for queries
 * `'../api/employees'.getEmployeesByWorkplace` can be mocked
 */
export default function WorkplaceScreen(
  { navigation, route }: EmployerStackScreensProps['Workplace']
) {
  useLightStatusBar();
  const { id: workplaceId } = route.params;
  const snackbar = useSnackbar();
  return (
    <View style={styles.container}>
      {/* Defined inline so it overrides the default padding-bottom: */}
      <ScrollingSurface style={{ paddingBottom: Layout.padding + FABSize }}>
        <WorkplaceCard />
        <EmployeesSection
          workplaceId={workplaceId}
          setStatus={snackbar.setMessage}
        />
      </ScrollingSurface>
      <TheSnackbar snackbar={snackbar} />
      <FAB
        icon="account-plus"
        onPress={() => navigation.navigate('CreateEmployee', { workplaceId })}
      />
    </View>
  );
}

function WorkplaceCard() {
  return (
    <>
      <Card style={styles.card}>
        <Card.Cover source={{ uri: 'https://images.unsplash.com/photo-1501523460185-2aa5d2a0f981?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=640' }} />
        {/* Defined inline so it overrides the default padding-bottom: */}
        <Card.Content style={{ padding: Layout.padding }}>
          <Headline>Nombre del sitio de trabajo</Headline>
          <Paragraph>Descripción del sitio de trabajo</Paragraph>
        </Card.Content>
      </Card>
      <Divider style={styles.divider} />
    </>
  );
}

const DeleteEmployeeContext =
  React.createContext<ReturnType<typeof useEmployeeDeleterByIdDoc>>(undefined!);

interface EmployeesSectionProps {
  workplaceId: number;
  setStatus: (status: string) => void;
}

function EmployeesSection(props: EmployeesSectionProps) {
  const { isLoading: isLoadingEmployees, data: employees } =
    useEmployeesGetterByWorkplaceSettingErrors(props);
  const mutation = useEmployeeDeleterByIdDocSettingStatus(props);
  const { isLoading: isDeletingEmployee } = mutation;
  return (
    <DeleteEmployeeContext.Provider value={mutation}>
      <Subheading style={styles.employeesHeading}>Empleados</Subheading>
      {(isLoadingEmployees || isDeletingEmployee) &&
        <ActivityIndicator style={styles.employeesLoadingIndicator} />}
      <EmployeesList employees={employees} />
    </DeleteEmployeeContext.Provider>
  );
}

function useEmployeesGetterByWorkplaceSettingErrors(
  { workplaceId, setStatus }: EmployeesSectionProps
) {
  const query = useEmployeesGetterByWorkplace(workplaceId);
  const { isError, error } = query;
  React.useEffect(() => {
    if (isError) {
      if (error instanceof WorkplaceNotFoundError) {
        setStatus('Este sitio de trabajo no fue encontrado');
      } else {
        setStatus('No se pudieron consultar los empleados. Ponte en contacto con Soporte.');
        console.error(error);
      }
    }
  }, [isError, error]);
  return query;
}

function useEmployeeDeleterByIdDocSettingStatus(
  { setStatus }: EmployeesSectionProps
) {
  const mutation = useEmployeeDeleterByIdDoc();
  const { isSuccess, isError, error } = mutation;
  React.useEffect(() => {
    if (isSuccess) {
      setStatus('Empleado borrado');
    } else if (isError) {
      setStatus('No se pudo borrar el empleado. Ponte en contacto con Soporte.');
      console.error(error);
    }
  }, [isSuccess, isError, error]);
  return mutation;
}

function EmployeesList({ employees }: { employees: Employee[] | undefined }) {
  if (employees === undefined) {
    return null;
  } else if (employees.length === 0) {
    return <EmployeesEmptyState />;
  } else {
    return (
      <>
        {employees?.map(employee =>
          <EmployeeListItem key={employee.idDoc} employee={employee} />)
        }
      </>
    );
  }
}

function EmployeesEmptyState() {
  return (
    <AlternativeState
      wrapperStyle={{ marginTop: Layout.padding / 2 }}
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
    <List.Item
      key={idDoc}
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
  props: SidePropsType;
  employeeIdDoc: Employee['idDoc'];
}

function EmployeePopupMenu<SidePropsType>(
  { props, employeeIdDoc }: EmployeePopupMenuProps<SidePropsType>
) {
  const deleteEmployeeDialog = useVisible();
  return (
    <>
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
    </>
  );
}

interface DeleteEmployeeDialogProps {
  self: ReturnType<typeof useVisible>;
  employeeIdDoc: Employee['idDoc'];
}

function DeleteEmployeeDialog(
  { self, employeeIdDoc }: DeleteEmployeeDialogProps
) {
  const { mutate: deleteEmployee } = React.useContext(DeleteEmployeeContext);
  return (
    <AlertDialog
      self={self}
      supportingText="¿Borrar empleado?"
      confirmButtonLabel="Borrar"
      onConfirm={self.closeAfter(() => deleteEmployee(employeeIdDoc))}
    />
  );
}

function TheSnackbar(
  { snackbar }: { snackbar: ReturnType<typeof useSnackbar> }
) {
  return (
    <Snackbar
      visible={snackbar.visible}
      onDismiss={snackbar.close}
      message={snackbar.message}
      // Defined inline so it overrides the default style:
      // TODO: mid: shouldn't need to do this:
      wrapperStyle={{
        bottom: FABSize + Layout.padding / 2,
        paddingHorizontal: Layout.padding,
      }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    maxHeight: Platform.OS === 'web' ? Layout.window.height : undefined,
  },
  scrollingSurface: {
    paddingBottom: Layout.padding + FABSize,
  },
  card: {
    marginHorizontal: -Layout.padding,
    marginTop: -Layout.padding,
  },
  divider: {
    marginHorizontal: -Layout.padding,
  },
  employeesHeading: {
    marginVertical: Layout.padding / 2,
  },
  employeesLoadingIndicator: {
    marginTop: Layout.padding / 2,
  },
});
