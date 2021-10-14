import { useField, useFormikContext } from "formik";
import React from 'react';

import { PhotoPicker as DefaultPhotoPicker } from './PhotoPicker';
import {
  Button,
  DatePicker as StyledDatePicker,
  DropDown as StyledDropDown,
  DropDownProps as StyledDropDownProps,
  PasswordField as StyledPasswordField,
  Snackbar,
  TextField as StyledTextField,
  TextFieldProps as StyledTextFieldProps,
} from './styled';

/**
 * @requires formik.Formik for Formik state and helpers
 * @requires react-native-paper.Provider for the Material Design components
 */
export function DatePicker(
  { label, name }: { label: string; name: string; }
) {
  const [field, meta] = useField(name);
  const hasError = Boolean(meta.touched && meta.error);
  return (
    <StyledDatePicker
      label={label}
      setISODate={field.onChange(name)}
      error={hasError}
      errorText={meta.error}
    />
  );
}

export type DropDownProps = {
  label: string;
  name: string;
  options: StyledDropDownProps['options'];
};

/**
 * @requires formik.Formik for Formik state and helpers
 * @requires react-native-paper.Provider for the Material Design components
 */
export function DropDown({ label, name, options }: DropDownProps) {
  const [field, meta] = useField(name);
  const hasError = Boolean(meta.touched && meta.error);
  return (
    <StyledDropDown
      value={field.value}
      setValue={field.onChange(name)}
      label={label}
      options={options}
      error={hasError}
      errorText={meta.error}
    />
  );
}

/**
 * @requires formik.Formik for Formik state and helpers
 * @requires react-native-paper.Provider for the Material Design components
 * @requires react-native-safe-area-context.SafeAreaProvider for safe area insets
 * expo-image-picker can be mocked
 */
 export function PhotoPicker({ name } : { name: string }) {
  const { setStatus } = useFormikContext();
  const [{ onChange }] = useField(name);
  return (
    <DefaultPhotoPicker
      setStatus={setStatus}
      setBase64Image={onChange(name)}
    />
  );
}

// TODO: medium: make a PhotoPickerWithHelperText?

/**
 * @requires formik.Formik for Formik state and helpers
 * @requires react-native-paper.Provider for the Material Design components
 */
export function StatusSnackbar() {
  const { status, setStatus } = useFormikContext();
  const hasError = Boolean(status);
  const onDismiss = () => setStatus(undefined);
  return (
    <Snackbar visible={hasError} onDismiss={onDismiss} message={status} />
  );
}

/**
 * @requires formik.Formik for Formik state and helpers
 * @requires react-native-paper.Provider for the Material Design components
 */
export function SubmitButton({ label }: { label: string }) {
  const { submitForm, isSubmitting } = useFormikContext();
  return (
    <Button
      onPress={submitForm}
      loading={isSubmitting}
      disabled={isSubmitting}
      label={label}
    />
  );
}

export type TextFieldProps<Model> = StyledTextFieldProps & {
  label: string;
  name: keyof Model & string;
};

/**
 * We don't use <formik.Field as={react-native.TextInput} />, since it injects
 * onChange, onBlur, name, and value into the TextInput, and that can't handle
 * name and needs onChangeText instead of onChange.
 * @requires formik.Formik for Formik state and helpers
 * @requires react-native-paper.Provider for the Material Design components
 */
export function TextField<Model>(
  { secureTextEntry, label, name, ...otherProps }: TextFieldProps<Model>
) {
  const TheTextField = secureTextEntry ? StyledPasswordField : StyledTextField;
  const [field, meta] = useField(name);
  const hasError = Boolean(meta.touched && meta.error);
  return (
    <TheTextField
      label={label}
      value={field.value}
      onChangeText={field.onChange(name)}
      onBlur={field.onBlur(name)}
      error={hasError}
      errorText={meta.error}
      {...otherProps}
    />
  );
}

export interface TextFieldType<Model> {
  (props: TextFieldProps<Model>): ReturnType<typeof TextField>
}
