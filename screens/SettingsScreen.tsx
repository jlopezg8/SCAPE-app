import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, List, Modal, Portal, TextInput } from 'react-native-paper';

import serverURL, { setServerBaseURL } from '../api/serverURL';
// TODO: decide what surface to use
import { Surface, TextField } from '../components/styled';

/**
 * @requires react-native-paper.Provider for the Material Design components
 */
export default function SettingsScreen() {
  const [serverURLPromptVisible, setServerURLPromptVisible] =
    React.useState(false);
  return (
    <Surface>
      <Portal>
        <SetAddr
          label="Dirección del servidor"
          val={serverURL}
          onChange={setServerBaseURL}
          visible={serverURLPromptVisible}
          hideModal={() => setServerURLPromptVisible(false)}
        />
      </Portal>
      <List.Item
        title="Dirección del servidor"
        description={serverURL}
        onPress={() => setServerURLPromptVisible(true)}
      />
    </Surface>
  );
}

type SetAddrProps = {
  val: string,
  onChange: (newVal: string) => void;
  visible: boolean,
  hideModal: () => void;
  label: string,
};

function SetAddr({ val, onChange, visible, hideModal, label }: SetAddrProps) {
  const [text, setText] = React.useState('');
  React.useEffect(() => setText(val), [val]);
  return (
    <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.container}>
      <TextField
        label={label}
        value={text}
        onChangeText={setText}
      />
      <View style={styles.buttonContainer}>
        <Button onPress={hideModal}>Cancelar</Button>
        <Button onPress={() => {onChange(text); hideModal();}}>Aceptar</Button>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  input: {
    width: 600,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  container: {
    backgroundColor: 'white',
    padding: 20,
    alignSelf: 'center' as const,
  }
});
