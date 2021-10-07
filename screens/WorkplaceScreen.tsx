import React from 'react';
import { StyleSheet, View } from 'react-native';
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
import { EmployerStackScreensProps } from '../types';

/**
 * @param navigation.navigate can be mocked
 * @param route.id workplace ID
 * @requires react-native-paper.Provider for the Material Design components
 * @requires react-query.QueryClientProvider for queries
 * ../api/employees.getEmployeesByWorkplace can be mocked
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
        wrapperStyle={{
          bottom: FABSize + Layout.padding / 2,
          paddingHorizontal: Layout.padding,
        }}
      />
      <FAB
        icon="account-plus"
        onPress={() => navigation.navigate('NewEmployee')}
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
      {employees?.map(({ idDoc, firstName, lastName, photo }) =>
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
        />
      )}
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
      setErrorMessage('No se pudieron consultar los empleados. Ponte en contacto con Soporte.');
      console.error(error);
    }
  }, [isError, error]);
  return query;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
