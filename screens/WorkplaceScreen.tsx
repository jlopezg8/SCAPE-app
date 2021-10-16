import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import {
  ActivityIndicator,
  Avatar,
  Card,
  Divider,
  Headline,
  List,
  Paragraph,
  Subheading,
} from 'react-native-paper';

import {
  AlternativeState,
  FAB,
  FABSize,
  ScrollingSurface,
  Snackbar,
} from '../components/styled';
import Layout from '../constants/Layout';
import {
  useEmployeesGetterByWorkplace,
  useLightStatusBar,
  useSnackbar,
} from '../hooks';
import { WorkplaceNotFoundError } from '../hooks/useEmployees';
import { Employee } from '../models/Employee';
import { EmployerStackScreensProps } from '../types';

/**
 * @param navigation.navigate can be mocked
 * @param route.params.id workplace ID
 * @requires `navigator` better mock `'@react-navigation/native'`
 * @requires `'react-native-paper'.Provider` for the Material Design components
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
      <ScrollingSurface>
        <WorkplaceCard />
        <EmployeesSection
          workplaceId={workplaceId}
          setErrorMessage={snackbar.setMessage}
        />
      </ScrollingSurface>
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

interface EmployeesSectionProps {
  workplaceId: number;
  setErrorMessage: (message: string) => void;
}

function EmployeesSection(props: EmployeesSectionProps) {
  const { isLoading, data: employees } =
    useEmployeesGetterByWorkplaceSettingErrors(props);
  return (
    <>
      <Subheading style={styles.employeesHeading}>Empleados</Subheading>
      {isLoading &&
        <ActivityIndicator style={styles.employeesLoadingIndicator} />}
      <EmployeesList employees={employees} />
    </>
  );
}

function useEmployeesGetterByWorkplaceSettingErrors(
  { workplaceId, setErrorMessage }: EmployeesSectionProps
) {
  const query = useEmployeesGetterByWorkplace(workplaceId);
  const { isError, error } = query;
  React.useEffect(() => {
    if (isError) {
      if (error instanceof WorkplaceNotFoundError) {
        setErrorMessage('Este sitio de trabajo no fue encontrado');
      } else {
        setErrorMessage('No se pudieron consultar los empleados. Ponte en contacto con Soporte.');
        console.error(error);
      }
    }
  }, [isError, error]);
  return query;
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
          <EmployeeListItem key={employee.idDoc} employee={employee} />)}
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
  const { idDoc, firstName, lastName, photo } = employee;
  const navigation =
    useNavigation<EmployerStackScreensProps['Workplace']['navigation']>();
  return (
    <List.Item
      key={idDoc}
      title={`${firstName} ${lastName}`}
      description="Cargo"
      left={props => photo
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
          />
      }
      onPress={() => navigation.navigate('EditEmployee', { idDoc })}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    maxHeight: Platform.OS === 'web' ? Layout.window.height : undefined,
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
