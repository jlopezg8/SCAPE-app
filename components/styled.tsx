import * as React from 'react';
import { Platform, ScrollView, StyleSheet } from 'react-native';
import {
  Button as DefaultButton,
  FAB as DefaultFAB,
  HelperText,
  Snackbar as DefaultSnackbar,
  Surface as DefaultSurface,
  TextInput,
} from 'react-native-paper';

import Layout from '../constants/layout';

export type ButtonProps =
  Omit<React.ComponentProps<typeof DefaultButton>, 'children'>
  & { label: string; };

export function Button({ style, label, ...otherProps }: ButtonProps) {
  return (
    <DefaultButton
      mode="contained"
      style={[styles.button, style]}
      {...otherProps}
    >
      {label}
    </DefaultButton>
  );
}

export function FAB(props: React.ComponentProps<typeof DefaultFAB>) {
  const { style, ...otherProps } = props;
  return <DefaultFAB style={[styles.fab, style]} {...otherProps} />;
}

export function ScrollingSurface(props: React.ComponentProps<typeof DefaultSurface>) {
  const { style, children, ...otherProps } = props;
  return (
    <DefaultSurface style={{ flex: 1 }} {...otherProps}>
      <ScrollView contentContainerStyle={[{ padding: Layout.padding }, style]}>
        {children}
      </ScrollView>
    </DefaultSurface>
  );
}

export type SnackbarProps = {
  visible: boolean;
  onDismiss: () => void;
  message: string;
};

/**
 * @requires react-native-paper.Provider for the Material Design components
 */
export function Snackbar({ visible, onDismiss, message }: SnackbarProps) {
  return (
    <DefaultSnackbar
      visible={visible}
      onDismiss={onDismiss}
      action={{
        label: 'X',
        onPress: onDismiss,
      }}
      /*
       * Fixes a bug where the snackbar would have a width of 100% of the
       * parent's padding box (not the content box), and thus overflow.
       * 
       * Also, this style has to be a plain old JS object (can't come from
       * Stylesheet.create), so that it's defined as an inline style and
       * doesn't get overridden.
       * 
       * Also, we can't use `padding: 'inherit'` since that crashes on mobile,
       * so we have to recalculate it.
       */
      wrapperStyle={{
        alignSelf: 'center',
        paddingHorizontal: Platform.OS === 'web' ? Layout.padding : 0,
        paddingVertical: Layout.padding,
      }}
      style={{ margin: 0 }} // override its `margin: 8`
    >
      {message}
    </DefaultSnackbar>
  );
}

export function Surface(props: React.ComponentProps<typeof DefaultSurface>) {
  const { style, ...otherProps } = props;
  return <DefaultSurface style={[styles.container, style]} {...otherProps} />;
}

export type TextFieldProps =
  React.ComponentProps<typeof TextInput>
  & { helperText?: string; errorText?: string; };

/**
 * @requires react-native-paper.Provider for the Material Design components
 */
export function TextField({ label, error, errorText, helperText, ...otherProps }: TextFieldProps) {
  // Leave ' ' as is. '' makes the HelperText not take space
  helperText = helperText || (label?.endsWith('*') ? '*Requerido' : ' ');
  errorText = errorText || ' ';
  return (
    <>
      <TextInput
        label={label}
        mode="outlined"
        error={error}
        dense
        {...otherProps}
      />
      <HelperText type={error ? 'error' : 'info'} style={styles.helperText}>
        {error ? errorText : helperText}
      </HelperText>      
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    alignSelf: 'center',
    marginBottom: 16,
  },
  container: {
    flex: 1,
    padding: Layout.padding,
  },
  fab: {
    position: 'absolute',
    end: 16,
    bottom: 16,
  },
  helperText: {
    marginBottom: 8,
  },
});
