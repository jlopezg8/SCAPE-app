import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import {
  Button as DefaultButton,
  FAB as DefaultFAB,
  Menu as DefaultMenu,
} from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Layout from '../constants/Layout';
import { useVisible } from '../hooks';

export type ButtonProps =
  Omit<React.ComponentProps<typeof DefaultButton>, 'children'>
  & { label: string; };

/**
 * @requires `'react-native-paper'.Provider` for the Material Design components
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

/**
 * @requires `'react-native-paper'.Provider` for the Material Design components
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

FAB.Group = DefaultFAB.Group;

export const FABSize = 56;

export interface MenuProps {
  anchor: (openMenu: () => void) => React.ReactNode;
  items: (closeMenuAfter: (fn: () => void) => (() => void)) => React.ReactNode;
}

/**
 * @requires `'react-native-paper'.Provider` for the Material Design components
 * @requires `'react-native-safe-area-context'.SafeAreaProvider` for insets
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

const styles = StyleSheet.create({
  button: {
    alignSelf: 'center',
    marginBottom: 16,
  },
  fab: {
    position: 'absolute',
    end: Layout.padding,
    bottom: Layout.padding,
  },
});
