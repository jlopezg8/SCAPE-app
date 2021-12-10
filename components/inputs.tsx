import React from 'react';
import { View } from 'react-native';
import { TextInput } from 'react-native-paper';
import { DatePickerModal, TimePickerModal } from 'react-native-paper-dates';
import DefaultDropDown from 'react-native-paper-dropdown';

import { useVisible } from '../hooks';
import Time, { mapTimeToString } from '../models/Time';
import { HelperText } from './misc';

export interface DatePickerProps {
  label: string;
  value: Date;
  setValue: (date: Date) => void;
  error?: boolean;
  helperText?: string;
  errorText?: string;
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

export interface DayOfWeekDropDownProps {
  value: number;
  setValue: (dayOfWeek: number) => void;
  label: string;
  error?: boolean;
  helperText?: string;
  errorText?: string;
}

/**
 * @requires `'react-native-paper'.Provider` for the Material Design components
 */
export function DayOfWeekDropDown(
  { value, setValue, ...otherProps }: DayOfWeekDropDownProps
) {
  return (
    <DropDown
      value={value?.toString() ?? ''}
      setValue={value => setValue(Number(value))}
      options={daysOfTheWeek.map((dayOfTheWeek, index) => (
        { label: dayOfTheWeek, value: (index + 1).toString() }
      ))}
      {...otherProps}
    />
  );
}

const daysOfTheWeek = [
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
  'Domingo',
];

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
    <View style={{ flex: 1 }}>
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
    </View>
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

// On web this results in "export 'PhotoPickerProps' was not found in './PhotoPicker'":
//export { default as PhotoPicker, PhotoPickerProps } from './PhotoPicker';
export { default as PhotoPicker } from './PhotoPicker';
export type { PhotoPickerProps } from './PhotoPicker';

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

export interface TimePickerProps {
  label: string;
  value: Time;
  setValue: (time: Time) => void;
  error?: boolean;
  helperText?: string;
  errorText?: string;
  onBlur?: React.ComponentProps<typeof TextInput>['onBlur'];
}

/**
 * @requires `'react-native-paper'.Provider` for the Material Design components
 */
 export function TimePicker(
  {
    label,
    value,
    setValue,
    error,
    helperText,
    errorText,
    onBlur,
  }: TimePickerProps
) {
  const picker = useVisible();
  const onConfirmSingle = (time: Time) => {
    if (time) {
      const { hours, minutes } = time;
      setValue({
        // There's a bug with react-native-paper-dates, where using the 12-hour
        // clock results in (12 AM).hours = 12, and (12 PM).hours = 24:
        hours: hours % 12 === 0 ? hours - 12 : hours,
        minutes,
      });
    };
    picker.close();
  };
  return (
    <View style={{ flex: 1 }}>
      <TextInput
        value={value ? mapTimeToString(value) : ''}
        label={label}
        dense
        mode="outlined"
        onFocus={picker.open}
        right={<TextInput.Icon name="menu-down"/>}
        showSoftInputOnFocus={false}
        accessibilityLabel={label}
        onBlur={onBlur}
      />
     <HelperText
        label={label}
        error={error}
        helperText={helperText}
        errorText={errorText}
      />
      <TimePickerModal
        visible={picker.visible}
        onDismiss={picker.close}
        onConfirm={onConfirmSingle}
        hours={value?.hours}
        minutes={value?.minutes}        
        label={label}
        cancelLabel="Cancelar"
        confirmLabel="Aceptar"
        animationType="fade"
        locale="es-CO"
      />
    </View>
  );
}
