import React from 'react';
import { StyleSheet } from 'react-native';
import {
  ActivityIndicator,
  List,
  Searchbar,
  Surface,
  Paragraph,
} from 'react-native-paper';

import { SurfaceInStackNav } from '../components/containers';
import { Button } from '../components/controls';
import { EmployeeListItem } from '../components/employees';
import Layout from '../constants/Layout';
import {
  EmployeeNotFoundError,
  useEmployeeGetterByIdDoc,
} from '../hooks/useEmployees';
import { Employee, WorkplaceId } from '../models';
import { EmployerStackScreensProps } from '../types';

/**
 * @requires `navigator` better mock `'@react-navigation/stack'`
 * @requires `'react-native-paper'.Provider` for the Material Design components
 * @requires `'react-query'.QueryClientProvider` for queries
 * `'../api/employees'.getEmployeeByIdDoc` can be mocked
 */
export default function AddEmployeeToWorkplaceScreen(
  { navigation, route }: EmployerStackScreensProps['AddEmployeeToWorkplace']
) {
  const { workplaceId } = route.params;
  const [employeeIdDoc, setEmployeeIdDoc] =
    React.useState<Employee['idDoc'] | undefined>();
  // TODO: mid: exclude employees from `workplaceId`:
  const query = useEmployeeGetterByIdDoc(employeeIdDoc);
  return (
    <SurfaceInStackNav>
      <EmployeeSearchBar setEmployeeIdDoc={setEmployeeIdDoc} />
      <EmployeeSearchResult
        query={query}
        employeeIdDoc={employeeIdDoc}
        navigation={navigation}
        workplaceId={workplaceId}
      />
      <Button
        label="Crear empleado"
        onPress={() => navigation.navigate(
          'CreateEmployee', { workplaceId: workplaceId }
        )}
        mode="outlined"
      />
    </SurfaceInStackNav>
  );
}

interface EmployeeSearchBarProps {
  setEmployeeIdDoc: (employeeIdDoc: Employee['idDoc']) => void;
}

function EmployeeSearchBar(
  { setEmployeeIdDoc }: EmployeeSearchBarProps
) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const searchEmployee = () => setEmployeeIdDoc(searchQuery);
  return (
    <Searchbar
      placeholder={Layout.isSmallDevice
        ? 'Buscar por documento'
        : 'Buscar empleado por documento de identidad'
      }
      value={searchQuery}
      onChangeText={setSearchQuery}
      onIconPress={searchEmployee}
      onSubmitEditing={searchEmployee}
      style={styles.employeeSearchBar}
    />
  );
}

type Navigation =
  EmployerStackScreensProps['AddEmployeeToWorkplace']['navigation'];

interface EmployeeSearchResultsProps {
  query: ReturnType<typeof useEmployeeGetterByIdDoc>;
  employeeIdDoc: Employee['idDoc'] | undefined;
  navigation: Navigation;
  workplaceId: WorkplaceId;
}

function EmployeeSearchResult(
  { query, navigation, workplaceId, employeeIdDoc }: EmployeeSearchResultsProps
) {
  let content: JSX.Element;
  switch (query.status) {
    case 'idle':
      return null;
    case 'loading':
      content = <ActivityIndicator />;
      break;
    case 'success':
      content =
        <TheEmployeeListItem
          employee={query.data!}
          navigation={navigation}
          workplaceId={workplaceId}
        />;
      break;
    case 'error':
      content =
        <GetEmployeeErrorState
          error={query.error as Error}
          idDoc={employeeIdDoc!}
        />;
      break;
  }
  return (
    <Surface style={styles.employeeSearchResultContainer}>
      {content}
    </Surface>
  );
}

interface TheEmployeeListItemProps {
  employee: Employee;
  navigation: Navigation;
  workplaceId: number;
}

function TheEmployeeListItem(
  { employee, navigation, workplaceId }: TheEmployeeListItemProps
) {
  return (
    <EmployeeListItem
      employee={employee}
      right={props => <List.Icon icon="account-plus" {...props} />}
      onPress={() => navigation.navigate(
        'SetEmployeeEmploymentInWorkplace',
        { employeeIdDoc: employee.idDoc, workplaceId }
      )}
    />
  );
}

function GetEmployeeErrorState(
  { error, idDoc }: { error: Error; idDoc: string }
) {
  let text: string;
  if (error instanceof EmployeeNotFoundError) {
    text = `El empleado con el documento de identidad "${idDoc}" no se encuentra.`
           + ' Puedes crearlo para añadirlo al sitio de trabajo.';
  } else {
    text = 'No se pudo buscar al empleado. Ponte en contacto con Soporte.';
  }
  return (
    <Paragraph style={styles.getEmployeeErrorState}>
      {text}
    </Paragraph>
  );
}

const styles = StyleSheet.create({
  employeeSearchBar: {
    marginBottom: 24,
  },
  employeeSearchResultContainer: {
    minHeight: 72,
    borderRadius: 4,
    justifyContent: 'center',
    marginBottom: 24,
  },
  getEmployeeErrorState: {
    textAlign: 'center',
  },
});
