import React from 'react';
import { TextInput } from 'react-native-paper';
import { DatePickerModal } from 'react-native-paper-dates';
import DefaultDropDown from 'react-native-paper-dropdown';

import { useVisible } from '../hooks';
import { HelperText } from './misc';

export interface DatePickerProps {
  label: string;
  value: Date;
  setValue: (date: Date) => void;
  error?: boolean;
  helperText?: string;
  errorText?: string;
  accessibilityLabel?: string;
}

/**
 * @requires `'react-native-paper'.Provider` for the Material Design components
 */
export function DatePicker(
  { label, value, setValue, error, helperText, errorText }: DatePickerProps
) {
  const picker = useVisible();
  const onConfirmSingle = ({ date }: { date: Date }) => {
    if (date) setValue(date);
    picker.close();
  };
  return (
    <>
      <TextInput
        value={value ? value.toLocaleDateString() : ''}
        label={label}
        dense
        mode="outlined"
        onFocus={picker.open}
        right={<TextInput.Icon name="menu-down"/>}
        showSoftInputOnFocus={false}
      />
     <HelperText
        label={label}
        error={error}
        helperText={helperText}
        errorText={errorText}
      />
      <DatePickerModal
        locale="es"
        mode="single"
        visible={picker.visible}
        onDismiss={picker.close}
        date={value}
        // @ts-ignore: This prop should only expect a function that handles
        // single dates, but its type is wrong and ends up expecting a function
        // that also handles data ranges:
        onConfirm={onConfirmSingle}
        saveLabel="Aceptar"
        label={label}
      />
    </>
  );
}

export interface DropDownProps {
  value: string;
  setValue: (value: string) => void;
  label: string;
  options: { label: string; value: string }[];
  error?: boolean;
  helperText?: string;
  errorText?: string;
}

/**
 * @requires `'react-native-paper'.Provider` for the Material Design components
 */
export function DropDown(
  {
    value,
    setValue,
    label,
    options,
    error,
    helperText,
    errorText,
  }: DropDownProps
) {
  const dropDown = useVisible();
  const _setValue = (value: string | number) => setValue(value.toString());
  return (
    <>
      <DefaultDropDown
        visible={dropDown.visible}
        onDismiss={dropDown.close}
        showDropDown={dropDown.open}
        value={value ?? ''}
        setValue={_setValue}
        label={label}
        mode="outlined"
        inputProps={{ right: <TextInput.Icon name="menu-down" />, dense: true }}
        list={options}
        accessibilityLabel={label}
      />
      <HelperText
        label={label}
        error={error}
        helperText={helperText}
        errorText={errorText}
      />
    </>
  );
}

/**
 * @requires `'react-native-paper'.Provider` for the Material Design components
 */
export function PasswordField(props: TextFieldProps) {
  const [hidden, setHidden] = React.useState(true);
  return (
    <TextField
      secureTextEntry={hidden}
      right={
        <TextInput.Icon
          name={hidden ? 'eye' : 'eye-off'}
          onPress={() => setHidden(!hidden)}
          forceTextInputFocus={false}
        />
      }
      {...props}
    />
  );
}

export { default as PhotoPicker, PhotoPickerProps } from './PhotoPicker';

// Sadly this would result in a circular dependency, since PlacePicker imports
// some stuff from here:
//export { default as PlacePicker, PlacePickerProps } from './PlacePicker';

export type TextFieldProps =
  React.ComponentProps<typeof TextInput>
  & { helperText?: string; errorText?: string; };

/**
 * @requires `'react-native-paper'.Provider` for the Material Design components
 */
export function TextField(props: TextFieldProps) {
  const { label, value, error, errorText, helperText, ...otherProps } = props;
  return (
    <>
      <TextInput
        label={label}
        value={value ?? ''}
        mode="outlined"
        error={error}
        dense
        accessibilityLabel={label}
        {...otherProps}
      />
      <HelperText
        label={label}
        error={error}
        helperText={helperText}
        errorText={errorText}
      />
    </>
  );
}

TextField.Icon = TextInput.Icon;
