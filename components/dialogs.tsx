import React from 'react';
import { StyleSheet } from 'react-native';
import {
  Button,
  Dialog,
  Paragraph,
  Portal,
} from 'react-native-paper';

import Layout from '../constants/Layout';
import { useVisible } from '../hooks';
import { TextField } from './styled';

export interface AlertDialogProps {
  self: ReturnType<typeof useVisible>;
  title?: string;
  supportingText: string;
  dismissButtonLabel?: string;
  confirmButtonLabel?: string;
  onConfirm: () => void;
}

/**
 * @requires react-native-paper.Provider for the Material Design components
 */
export function AlertDialog(
  {
    self,
    title,
    supportingText,
    dismissButtonLabel = 'Cancelar',
    confirmButtonLabel = 'OK',
    onConfirm,
  }: AlertDialogProps
) {
  return (
    <Portal>
      <Dialog
        visible={self.visible}
        onDismiss={self.close}
        style={styles.dialog}
      >
        {title && <Dialog.Title>{title}</Dialog.Title>}
        <Dialog.Content>
          <Paragraph>{supportingText}</Paragraph>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={self.close}>{dismissButtonLabel}</Button>
          <Button onPress={self.closeAfter(onConfirm)}>
            {confirmButtonLabel}
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

export interface PromptDialogProps {
  self: ReturnType<typeof useVisible>;
  label: string;
  initialValue: string;
  dismissButtonLabel?: string;
  confirmButtonLabel?: string;
  submit: (value: string) => void;
  validate?: (value: string) => string | undefined;
}

/**
 * @requires react-native-paper.Provider for the Material Design components
 */
export function PromptDialog(props: PromptDialogProps) {
  const {
    self,
    label,
    value,
    setValue,
    errorText,
    dismissButtonLabel = 'Cancelar',
    handleConfirm,
    confirmButtonLabel = 'OK',
  } = usePromptDialog(props);
  return (
    <Dialog
      visible={self.visible}
      onDismiss={self.close}
      style={styles.dialog}
    >
      <Dialog.Content>
        <TextField
          label={label}
          value={value}
          onChangeText={setValue}
          error={Boolean(errorText)}
          errorText={errorText}
        />
      </Dialog.Content>
      <Dialog.Actions>
        <Button onPress={self.close}>{dismissButtonLabel}</Button>
        <Button onPress={handleConfirm}>{confirmButtonLabel}</Button>
      </Dialog.Actions>
    </Dialog>
  );
}

function usePromptDialog(props: PromptDialogProps) {
  const { initialValue, self, validate, submit } = props;
  const [value, setValue] = React.useState(initialValue);
  const [errorText, setErrorText] = React.useState('');
  React.useEffect(() => {
    setValue(initialValue);
    setErrorText('');
  }, [self.visible, initialValue]);
  const handleConfirm = () => {
    let errorMessage: string | undefined;
    if (validate && (errorMessage = validate(value))) {
      setErrorText(errorMessage);
    } else {
      submit(value);
      self.close();
    }
  };
  return Object.assign({
    value,
    setValue,
    errorText,
    handleConfirm,
  }, props);
}

/** See https://material.io/components/dialogs#specs */
const styles = StyleSheet.create({
  dialog: {
    alignSelf: 'center',
    width: Layout.isSmallDevice ? 280 : 560,
  },
});
