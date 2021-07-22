import * as React from 'react';
import { Platform, ScrollView, StyleSheet } from 'react-native';
import {
  Button as DefaultButton,
  FAB as DefaultFAB,
  HelperText,
  List,
  ProgressBar,
  Snackbar as DefaultSnackbar,
  Surface as DefaultSurface,
  TextInput,
} from 'react-native-paper';
import { DatePickerModal } from 'react-native-paper-dates';
import DefaultDropDown from 'react-native-paper-dropdown';

import Layout from '../constants/Layout';
import useVisible from '../hooks/useVisible';

export type ButtonProps =
  Omit<React.ComponentProps<typeof DefaultButton>, 'children'>
  & { label: string; };

/**
 * @requires react-native-paper.Provider for the Material Design components
 */
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








export type DatePickerProps = {
  label: string;
  setISODate: (dateAsString: string) => void;
};

export function DatePicker({ label, setISODate }: DatePickerProps) {
  const picker = useVisible();
  const [localeDate, setLocaleDate] = React.useState('');
  const onConfirmSingle = ({ date }: { date: Date }) => {
    setISODate(date.toISOString());
    setLocaleDate(date.toLocaleDateString());
    picker.close();
  };

  return (
    <>
      <TextInput
        value={localeDate}
        //style={{ margin: 8, width: '100%' }}
        label={label}
        dense
        mode="outlined"
        onFocus={picker.open}
        //left={<TextInput.Icon name="calendar"/>}
        right={<TextInput.Icon name="menu-down"/>}
      />
      <DatePickerModal
        // locale={'en'} optional, default: automatic
        mode="single"
        visible={picker.visible}
        onDismiss={picker.close}
        onConfirm={onConfirmSingle}
        // validRange={{
        //   startDate: new Date(2021, 1, 2),  // optional
        //   endDate: new Date(), // optional
        // }}
        // onChange={} // same props as onConfirm but triggered without confirmed by user
        // saveLabel="Save" // optional
        // label="Select date" // optional
        // animationType="slide" // optional, default is 'slide' on ios/android and 'none' on web
      />
    </>
  );
}








export type DropDownProps = {
  value: string;
  setValue: (value: string) => void;
  label: string;
  options: { label: string; value: string }[];
};

export function DropDown({ value, setValue, label, options }: DropDownProps) {
  const dropDown = useVisible();
  const _setValue = (value: string | number) => setValue(value.toString());
  return (
    <DefaultDropDown
      visible={dropDown.visible}
      onDismiss={dropDown.close}
      showDropDown={dropDown.open}
      value={value}
      setValue={_setValue}
      label={label}
      mode="outlined"
      inputProps={{ right: <TextInput.Icon name="menu-down" /> }}
      list={options}
    />
  );
}

/**
 * @requires react-native-paper.Provider for the Material Design components
 */
export function FAB(props: React.ComponentProps<typeof DefaultFAB>) {
  const { style, ...otherProps } = props;
  return <DefaultFAB style={[styles.fab, style]} {...otherProps} />;
}

/**
 * @requires react-native-paper.Provider for the Material Design components
 */
export function ListItem(props: React.ComponentProps<typeof List.Item>) {
  const { style, ...otherProps } = props;
  return <List.Item style={[styles.listItem, style]} {...otherProps} />;
}

/**
 * @requires react-native-paper.Provider for the Material Design components
 */
export function ScreenProgressBar(
  props: React.ComponentProps<typeof ProgressBar>
) {
  const { indeterminate, visible, style, ...otherProps } = props;
  return (
    <ProgressBar
      indeterminate={indeterminate ?? true}
      visible={visible}
      style={[styles.screenProgressBar, style]}
      {...otherProps}
    />
  );
}

/**
 * @requires react-native-paper.Provider for the Material Design components
 */
export function ScrollingSurface(
  props: React.ComponentProps<typeof DefaultSurface>
) {
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

/**
 * @requires react-native-paper.Provider for the Material Design components
 */
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
export function TextField(props: TextFieldProps) {
  let { label, error, errorText, helperText, ...otherProps } = props;
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
    end: Layout.padding,
    bottom: Layout.padding,
  },
  helperText: {
    marginBottom: 8,
  },
  listItem: {
    paddingHorizontal: 0, // override its `paddingHorizontal: 8`
  },
  menu: {/*
    position: 'absolute',
    left: 16,
    right: 16,
    marginTop: 64,
    //width: '100%',
  */},
  screenProgressBar: {
    position: 'absolute',
    top: -Layout.padding,
    left: -Layout.padding,
    right: -Layout.padding,
  },
});
