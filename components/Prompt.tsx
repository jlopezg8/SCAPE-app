import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Modal, Surface } from 'react-native-paper';

import { Button, TextField } from './styled';
import Layout from '../constants/Layout';

type PromptProps = {
  visible: boolean;
  hideModal: () => void;
  label: string;
  initialValue: string;
  onSubmit: (value: string) => void;
  validate?: (value: string) => string | undefined;
};

/**
 * @requires react-native-paper.Provider for the Material Design components
 */
export default function Prompt(
  { visible, hideModal, label, initialValue, onSubmit, validate }: PromptProps
) {
  const [value, setValue] = React.useState(initialValue);
  const [errorText, setErrorText] = React.useState('');
  const handleCancel = () => {
    setValue(initialValue);
    setErrorText('');
    hideModal();
  };
  const handleAccept = () => {
    let errorMessage;
    if (validate && (errorMessage = validate(value))) {
      setErrorText(errorMessage);
    } else {
      setErrorText('');
      onSubmit(value);
      hideModal();
    }
  };
  return (
    <Modal
      visible={visible}
      onDismiss={hideModal}
      contentContainerStyle={styles.container}
    >
      <Surface style={styles.contentContainer}>
        <TextField
          label={label}
          value={value}
          onChangeText={setValue}
          error={Boolean(errorText)}
          errorText={errorText}
        />
        <View style={styles.buttonGroup}>
          <PromptButton label="Cancelar" onPress={handleCancel} />
          <PromptButton label="Aceptar" onPress={handleAccept} />
        </View>
      </Surface>
    </Modal>
  );
}

function PromptButton(
  { mode, style, ...otherProps }: React.ComponentProps<typeof Button>
) {
  return (
    <Button
      mode="text"
      compact
      style={[styles.button, style]}
      {...otherProps}
    />
  );
}

const padding = 24;

/** See https://material.io/components/dialogs#specs */
const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    width: Layout.isSmallDevice ? 280 : 560,
  },
  contentContainer: {
    /** See https://material.io/components/dialogs#anatomy */
    elevation: 24,
    padding: padding,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    bottom: -padding,
    right: -padding,
  },
  button: {
    marginBottom: 8, // override its `marginBottom: 16`
    marginRight: 8,
  },
});
