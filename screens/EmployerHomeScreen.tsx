import React from 'react';
import { StyleSheet } from 'react-native';
import { IconButton, Portal } from 'react-native-paper';

import {
  ScrollViewInSurfaceWithRefetch,
  SurfaceInStackNav,
} from '../components/containers';
import { FAB, FABSize, Menu } from '../components/controls';
import { AlertDialog } from '../components/dialogs';
import {
  AlternativeState,
  ListItem,
  ScreenProgressBar,
  Snackbar,
} from '../components/misc';
import Layout from '../constants/Layout';
import {
  useFABGroup,
  useSnackbar,
  useVisible,
  useWorkplaceDeleter,
  useWorkplacesGetter,
} from '../hooks';
import Workplace from '../models/Workplace';
import { EmployerStackScreensProps } from '../types';

/**
 * @requires `navigator` better mock `'@react-navigation/native'` and
 *           `'@react-navigation/stack'`
 * @requires `'react-native-paper'.Provider` for the Material Design components
 * @requires `'react-native-safe-area-context'.SafeAreaProvider` for insets
 * @requires `'react-query'.QueryClientProvider` for queries
 * `'../api/workplaces'.deleteWorkplace` can be mocked
 * `'../api/workplaces'.getWorkplace` can be mocked
 */
export default function EmployerHomeScreen(
  { navigation }: EmployerStackScreensProps['Home']
) {
  const { isFetching, data: workplaces, refetch, error } =
    useWorkplacesGetter();
  const [isDeletingWorkplace, setDeletingWorkplace] = React.useState(false);
  return (
    <SurfaceInStackNav>
      <ScreenProgressBar visible={isFetching || isDeletingWorkplace} />
      {workplaces &&
        <WorkplacesViewer
          workplaces={workplaces}
          navigation={navigation}
          setDeletingWorkplace={setDeletingWorkplace}
          refetch={refetch}
        />
      }
      {error && <GetWorkplacesErrorState />}
    </SurfaceInStackNav>
  );
}

type Navigation = EmployerStackScreensProps['Home']['navigation'];

interface WorkplacesViewerProps {
  workplaces: Workplace[];
  navigation: Navigation;
  setDeletingWorkplace: (isDeletingWorkplace: boolean) => void;
  refetch: () => Promise<unknown>;
}

function WorkplacesViewer(
  {
    workplaces,
    navigation,
    setDeletingWorkplace,
    refetch,
  }: WorkplacesViewerProps
) {
  const snackbar = useSnackbar();
  const deleteWorkplaceMutation =
    useWorkplaceDeleterWithEffects(setDeletingWorkplace, snackbar.setMessage);
  return (
    <DeleteWorkplaceMutationContext.Provider value={deleteWorkplaceMutation}>
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
      <TheSnackbar self={snackbar} />
      <Actions navigation={navigation} />
    </DeleteWorkplaceMutationContext.Provider>
  );
}

function useWorkplaceDeleterWithEffects(
  setDeletingWorkplace: (isDeletingWorkplace: boolean) => void,
  setMessage: (status: string) => void
) {
  const mutation = useWorkplaceDeleter();
  const { isLoading: isDeletingWorkplace, isSuccess, error } = mutation;
  React.useEffect(() => {
    setDeletingWorkplace(isDeletingWorkplace);
  }, [isDeletingWorkplace]);
  React.useEffect(() => {
    if (isSuccess) {
      setMessage('Sitio de trabajo borrado');
    } else if (error) {
      setMessage('No se pudo borrar el sitio de trabajo. Ponte en contacto con Soporte.');
      console.error(error);
    }
  }, [isSuccess, error]);
  return mutation;
}

const DeleteWorkplaceMutationContext =
  React.createContext<ReturnType<typeof useWorkplaceDeleter>>(undefined!);

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
  navigation: Navigation;
}

function WorkplaceListItem({ workplace, navigation }: WorkplaceListItemProps) {
  return (
    <ListItem
      title={workplace.name}
      description={workplace.address}
      left={props => <ListItem.Icon {...props} icon="factory" />}
      right={props =>
        <WorkplacePopupMenu
          workplaceId={workplace.id!}
          navigation={navigation}
          props={props}
        />
      }
      onPress={() => navigation.navigate('Workplace', { id: workplace.id! })}
    />
  );
}

interface WorkplacePopupMenuProps<SidePropsType> {
  workplaceId: NonNullable<Workplace['id']>;
  navigation: Navigation;
  props: SidePropsType;
}

function WorkplacePopupMenu<SidePropsType>(
  { workplaceId, navigation, props }: WorkplacePopupMenuProps<SidePropsType>
) {
  const deleteWorkplaceDialog = useVisible();
  const navigateToEditWorkplace =
    () => navigation.navigate('EditWorkplace', { id: workplaceId });
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
      items={closeMenuAfter => ([
        <Menu.Item
          key="Borrar"
          title="Borrar"
          onPress={closeMenuAfter(deleteWorkplaceDialog.open)}
        />,
        <Menu.Item
          key="Editar"
          title="Editar"
          onPress={closeMenuAfter(navigateToEditWorkplace)}
        />
      ])}
    />
    <DeleteWorkplaceDialog
      self={deleteWorkplaceDialog}
      workplaceId={workplaceId}
    />
  </>;
}

interface DeleteWorkplaceDialogProps {
  self: ReturnType<typeof useVisible>;
  workplaceId: NonNullable<Workplace['id']>;
}

function DeleteWorkplaceDialog(
  { self, workplaceId }: DeleteWorkplaceDialogProps
) {
  const { mutate: deleteWorkplace } =
    React.useContext(DeleteWorkplaceMutationContext);
  return (
    <AlertDialog
      self={self}
      supportingText="¿Borrar sitio de trabajo?"
      confirmButtonLabel="Borrar"
      onConfirm={self.closeAfter(() => deleteWorkplace(workplaceId))}
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

function Actions({ navigation }: { navigation: Navigation }) {
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

function GetWorkplacesErrorState() {
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
