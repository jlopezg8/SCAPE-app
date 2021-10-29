import React from 'react';
import {
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
} from 'react-native';

import {
  AlternativeState,
  FAB,
  FABSize,
  ListItem,
  ScreenProgressBar,
  Surface,
} from '../components/styled';
import Layout from '../constants/Layout';
import { useRefreshControl, useWorkplacesGetter } from '../hooks';
import Workplace from '../models/Workplace';
import { EmployerStackScreensProps } from '../types';

/**
 * @requires `'react-native-paper'.Provider` for the Material Design components
 * @requires `'react-query'.QueryClientProvider` for queries
 * `'../api/workspace'.getWorkspaces` can be mocked
 */
export default function EmployerHomeScreen(
  { navigation }: EmployerStackScreensProps['Home']
) {
  const { isFetching, data: workplaces, refetch, error } =
    useWorkplacesGetter();
  return (
    <Surface style={styles.container}>
      <ScreenProgressBar visible={isFetching} />
      {workplaces &&
        <WorkplacesViewer
          workplaces={workplaces}
          navigation={navigation}
          refetch={refetch}
        />
      }
      {error && <GetWorkspacesErrorState />}
    </Surface>
  );
}

interface WorkplacesViewerProps {
  workplaces: Workplace[];
  navigation: EmployerStackScreensProps['Home']['navigation'];
  refetch: () => Promise<unknown>;
}

function WorkplacesViewer(
  { workplaces, navigation, refetch }: WorkplacesViewerProps
) {
  return <>
    <WorkplacesScrollView refetch={refetch}>
      {workplaces &&
        (workplaces.length === 0
          ? <WorkplacesEmptyState />
          : workplaces?.map(workplace =>
              <WorkplaceListItem
                key={workplace.id}
                workplace={workplace}
                navigation={navigation}
              />
            )
        )
      }
    </WorkplacesScrollView>
    <FAB
      icon="face-recognition"
      label="Registar asistencia"
      onPress={() => navigation.navigate('RecordAttendance')}
    />
  </>;
}

interface WorkplacesScrollViewProps {
  refetch: () => Promise<unknown>;
  children: React.ReactNode;
}

function WorkplacesScrollView(
  { refetch, children }: WorkplacesScrollViewProps
) {
  const [refreshing, onRefresh] = useRefreshControl(refetch);
  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollViewContentContainer}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      }
    >
      {children}
    </ScrollView>
  );
}

interface WorkplaceListItemProps {
  workplace: Workplace;
  navigation: EmployerStackScreensProps['Home']['navigation'];
}

function WorkplaceListItem({ workplace, navigation }: WorkplaceListItemProps) {
  return (
    <ListItem
      title={workplace.name}
      description={workplace.address}
      left={props => <ListItem.Icon {...props} icon="factory" />}
      onPress={() => navigation.navigate('Workplace', { id: workplace.id! })}
    />
  );
}

function WorkplacesEmptyState() {
  return (
    <AlternativeState
      wrapperStyle={styles.centeredAlternativeState}
      icon="map-marker-multiple"
      title="No hay sitios de trabajo"
      tagline="Añade un sitio de trabajo y aparecerá aquí"
    />
  );
}

function GetWorkspacesErrorState() {
  return (
    <AlternativeState
      wrapperStyle={styles.centeredAlternativeState}
      icon="cloud-alert"
      title="Error"
      tagline="No se pudieron obtener los sitios de trabajo. Ponte en contacto con Soporte."
    />
  );
}

const styles = StyleSheet.create({
  container: {
    maxHeight: Platform.OS === 'web' ? Layout.window.height : undefined,
  },
  scrollView: {
    margin: -Layout.padding,
  },
  scrollViewContentContainer: {
    padding: Layout.padding,
    paddingBottom: 1.5 * Layout.padding + FABSize,
  },
  centeredAlternativeState: {
    justifyContent: 'center'
  },
});
