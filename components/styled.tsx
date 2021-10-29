import React from 'react';
import {
  Platform,
  ScrollView,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import {
  Button as DefaultButton,
  FAB as DefaultFAB,
  HelperText as DefaultHelperText,
  IconButton,
  List,
  Menu as DefaultMenu,
  Paragraph,
  ProgressBar,
  Snackbar as DefaultSnackbar,
  Surface as DefaultSurface,
  TextInput,
  Title,
} from 'react-native-paper';
import { DatePickerModal } from 'react-native-paper-dates';
import DefaultDropDown from 'react-native-paper-dropdown';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Layout from '../constants/Layout';
import { useVisible } from '../hooks';

export type AlternativeStateProps = {
  wrapperStyle?: StyleProp<ViewStyle>;
  icon: string;
  title: string;
  tagline: string;
};

/**
 * Can be used for empty and error states.
 * @requires react-native-paper.Provider for the Material Design components
 */
export function AlternativeState(
  { wrapperStyle, icon, title, tagline }: AlternativeStateProps
) {
  return (
    <View style={[styles.alternativeState, wrapperStyle]}>
      <IconButton icon={icon} color="#03dac444" size={125} />
      <Title style={{ opacity: .66 }} >{title}</Title>
      <Paragraph>{tagline}</Paragraph>
    </View>
  );
}

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
  value: Date;
  setValue: (date: Date) => void;
  error?: boolean;
  helperText?: string;
  errorText?: string;
  accessibilityLabel?: string;
};

/**
 * @requires react-native-paper.Provider for the Material Design components
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

export type DropDownProps = {
  value: string;
  setValue: (value: string) => void;
  label: string;
  options: { label: string; value: string }[];
  error?: boolean;
  helperText?: string;
  errorText?: string;
};

/**
 * @requires react-native-paper.Provider for the Material Design components
 */
export function DropDown(
  { value, setValue, label, options, error, helperText, errorText }: DropDownProps
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
 * @requires react-native-paper.Provider for the Material Design components
 */
export function FAB(props: React.ComponentProps<typeof DefaultFAB>) {
  const { icon, label, accessibilityLabel, style, ...otherProps } = props;
  const theAccessibilityLabel =
    accessibilityLabel || label || (typeof icon === 'string' ? icon : undefined);
  return (
    <DefaultFAB
      icon={icon}
      label={Platform.OS === 'web' ? label : undefined}
      accessibilityLabel={theAccessibilityLabel}
      style={[styles.fab, style]} {...otherProps}
    />
  );
}

export const FABSize = 56;

export type HelperTextProps = {
  label?: string;
  error?: boolean;
  helperText?: string;
  errorText?: string;
};

/**
 * @requires react-native-paper.Provider for the Material Design components
 */
export function HelperText(
  { label, error, helperText, errorText }: HelperTextProps
) {
  // Leave ' ' as is. '' makes the HelperText not take space
  helperText = helperText || (label?.endsWith('*') ? '*Requerido' : ' ');
  errorText = errorText || ' ';
  return (
    <DefaultHelperText
      type={error ? 'error' : 'info'}
      style={styles.helperText}
    >
      {error ? errorText : helperText}
    </DefaultHelperText>
  );
}

/**
 * @requires react-native-paper.Provider for the Material Design components
 */
export function ListItem(props: React.ComponentProps<typeof List.Item>) {
  const { style, ...otherProps } = props;
  return <List.Item style={[styles.listItem, style]} {...otherProps} />;
}

ListItem.Icon = List.Icon;

export type MenuProps = {
  anchor: (openMenu: () => void) => React.ReactNode;
  items: (closeMenuAfter: (fn: () => void) => (() => void)) => React.ReactNode;
};

/**
 * @requires react-native-paper.Provider for the Material Design components
 * @requires react-native-safe-area-context.SafeAreaProvider for insets
 */
export function Menu({ anchor, items }: MenuProps) {
  const menu = useVisible();
  const insets = useSafeAreaInsets();
  return (
    <DefaultMenu
      visible={menu.visible}
      onDismiss={menu.close}
      anchor={anchor(menu.open)}
      statusBarHeight={insets.top}
    >
      {items(menu.closeAfter)}
    </DefaultMenu>
  );
}

Menu.Item = DefaultMenu.Item;

/**
 * @requires react-native-paper.Provider for the Material Design components
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
      visible={visible ?? true}
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
  wrapperStyle?: StyleProp<ViewStyle>;
};

/**
 * @requires react-native-paper.Provider for the Material Design components
 */
export function Snackbar(
  { visible, onDismiss, message, wrapperStyle }: SnackbarProps
) {
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
      wrapperStyle={[
        {
          alignSelf: 'center',
          paddingHorizontal: Platform.OS === 'web' ? Layout.padding : 0,
          paddingVertical: Layout.padding,
        },
        wrapperStyle,
      ]}
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

const styles = StyleSheet.create({
  alternativeState: {
    flex: 1,
    alignItems: 'center',
  },
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
  screenProgressBar: {
    position: 'absolute',
    top: -Layout.padding,
    left: -Layout.padding,
    right: -Layout.padding,
  },
});
