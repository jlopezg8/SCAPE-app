import { useField, useFormikContext } from "formik";
import React from 'react';

import { Button } from './controls';
import {
  DatePicker as StyledDatePicker,
  DropDown as StyledDropDown,
  DropDownProps as StyledDropDownProps,
  PasswordField as StyledPasswordField,
  PhotoPicker as DefaultPhotoPicker,
  TextField as StyledTextField,
  TextFieldProps as StyledTextFieldProps,
} from './inputs';
import { Snackbar, SnackbarProps } from './misc';
import {
  Coordinate,
  default as DefaultPlacePicker,
  PlacePickerProps as DefaultPlacePickerProps,
} from './PlacePicker';

/**
 * @requires formik.Formik for Formik state and helpers
 * @requires react-native-paper.Provider for the Material Design components
 */
export function DatePicker(
  { label, name }: { label: string; name: string; }
) {
  const [{ value }, { touched, error }, { setValue }] = useField<Date>(name);
  const hasError = Boolean(touched && error);
  return (
    <StyledDatePicker
      label={label}
      value={value}
      setValue={setValue}
      error={hasError}
      errorText={error}
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
  const [{ value, onChange }] = useField(name);
  return (
    <DefaultPhotoPicker
      base64Image={value}
      setBase64Image={onChange(name)}
      setStatus={setStatus}
    />
  );
}

// TODO: medium: make a PhotoPickerWithHelperText?

export interface PlacePickerProps {
  addressLabel: string;
  addressName: string;
  coordinateName: string;
}

/**
 * @requires `'formik'.Formik` for Formik state and helpers
 * @requires `'react-native-paper'.Provider` for the Material Design components
 *
 * `'expo-location'.requestForegroundPermissionsAsync:
 *   () => Promise<{ status: 'granted' | 'denied' | 'undetermined' }>` can be
 *   mocked
 *
 * `'expo-location'.getCurrentPositionAsync:
 *   (options: { accuracy: 1..6 }) => Promise<{ coords: LatLng }>` can be
 *   mocked
 *
 * `'expo-location'.geocodeAsync: (address: string) => Promise<LatLng>` can be
 *   mocked
 * 
 * "No setup required for use within the Expo Go app. [...] Web is
 * experimental! We do not recommend using this library on web yet."
 * (https://docs.expo.dev/versions/v41.0.0/sdk/map-view/)
 */
export function PlacePicker(props: PlacePickerProps) {
  const addressTextFieldProps = useAddressTextFieldProps(props);
  const coordinateProps = useCoordinateProps(props);
  const { setStatus } = useFormikContext();
  return (
    <DefaultPlacePicker
      addressTextFieldProps={addressTextFieldProps}
      coordinateProps={coordinateProps}
      setMessage={setStatus}
    />
  );
}

function useAddressTextFieldProps(
  { addressLabel, addressName }: PlacePickerProps
): DefaultPlacePickerProps['addressTextFieldProps'] {
  const [field, meta] = useField<string>(addressName);
  return {
    label: addressLabel,
    value: field.value,
    onChangeText: field.onChange(addressName),
    onBlur: field.onBlur(addressName),
    error: Boolean(meta.touched && meta.error),
    errorText: meta.error,
  };
}

function useCoordinateProps(
  { coordinateName }: PlacePickerProps
): DefaultPlacePickerProps['coordinateProps'] {
  const [field, meta, helpers] = useField<Coordinate>(coordinateName);
  return {
    coordinate: field.value,
    setCoordinate: helpers.setValue,
    error: Boolean(meta.touched && meta.error),
    errorText: getCoordinateErrorText(meta.error),
  };
}

function getCoordinateErrorText(error: string | undefined) {
  if (error === undefined) {
    return undefined;
  }
  const theError = error as unknown as { [field in keyof Coordinate]: string };
  const { latitude: latitudeError, longitude: longitudeError } = theError;
  if (latitudeError === longitudeError) {
    return latitudeError;
  }
  const errors: string[] = [];
  if (latitudeError) {
    errors.push(`Latitud: ${latitudeError}`);
  }
  if (longitudeError) {
    errors.push(`Longitud: ${longitudeError}`);
  }
  return errors.join(', ');
}

/**
 * @requires formik.Formik for Formik state and helpers
 * @requires react-native-paper.Provider for the Material Design components
 */
export function StatusSnackbar(
  { wrapperStyle }: { wrapperStyle?: SnackbarProps['wrapperStyle'] }
) {
  const { status, setStatus } = useFormikContext();
  const hasError = Boolean(status);
  const onDismiss = () => setStatus(undefined);
  return (
    <Snackbar
      visible={hasError}
      onDismiss={onDismiss}
      message={status}
      wrapperStyle={wrapperStyle}
    />
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
