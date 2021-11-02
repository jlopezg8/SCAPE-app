import React from 'react';
import { StyleSheet } from 'react-native';
import { FAB, Portal } from 'react-native-paper';

import {
  AlternativeState,
  FABSize,
  ListItem,
  ScreenProgressBar,
  ScrollViewInSurfaceWithRefetch,
  SurfaceInStackNav,
} from '../components/styled';
import Layout from '../constants/Layout';
import { useFABGroup, useWorkplacesGetter } from '../hooks';
import Workplace from '../models/Workplace';
import { EmployerStackScreensProps } from '../types';

/**
 * @requires `navigator` better mock `'@react-navigation/stack'`
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
    <SurfaceInStackNav>
      <ScreenProgressBar visible={isFetching} />
      {workplaces &&
        <WorkplacesViewer
          workplaces={workplaces}
          navigation={navigation}
          refetch={refetch}
        />
      }
      {error && <GetWorkspacesErrorState />}
    </SurfaceInStackNav>
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
    <ScrollViewInSurfaceWithRefetch
      contentContainerStyle={styles.scrollViewContentContainer}
      refetch={refetch}
    >
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
    </ScrollViewInSurfaceWithRefetch>
    <Actions navigation={navigation} />
  </>;
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

interface ActionsProps {
  navigation: EmployerStackScreensProps['Home']['navigation'];
}

function Actions({ navigation }: ActionsProps) {
  const { visible, open, setOpen } = useFABGroup();
  return (
    <Portal>
      <FAB.Group
        visible={visible}
        icon={open ? 'close' : 'plus'}
        accessibilityLabel="Abrir acciones"
        open={open}
        onStateChange={({ open }) => setOpen(open)}
        style={styles.fabGroup}
        actions={[          
          {
            icon: 'face-recognition',
            label: 'Registar asistencia',
            onPress: () => navigation.navigate('RecordAttendance'),
          },
          {
            icon: 'map-marker-plus',
            label: 'Añadir sitio de trabajo',
            onPress: () => navigation.navigate('CreateWorkplace'),
          },
        ]}
      />
    </Portal>
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
  scrollViewContentContainer: {
    paddingBottom: 1.5 * Layout.padding + FABSize,
  },
  centeredAlternativeState: {
    justifyContent: 'center'
  },
  fabGroup: {
    padding: Layout.padding - 16, // additional padding to the 16px default
  }
});
