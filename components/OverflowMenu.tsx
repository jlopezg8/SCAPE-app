import { ParamListBase } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconButton, Menu } from 'react-native-paper';

import Layout from '../constants/Layout';
import useVisible from '../hooks/useVisible';

export type OverflowMenuProps = {
  navigation: StackNavigationProp<ParamListBase, keyof ParamListBase>;
  /**
   * Should be OverflowMenu.Item(s), but we can't type check it (
   * https://github.com/microsoft/TypeScript/issues/13618)
   */
  children: React.ReactNode;
};

type MenuContextType = {
  closeMenuAfter: (fn: () => void) => () => void;
  navigation: OverflowMenuProps['navigation'];
}

const MenuContext =
  React.createContext<MenuContextType | undefined>(undefined);

/**
 * @requires react-native-paper.Provider for the Material Design components
 * @requires react-native-safe-area-context.SafeAreaProvider for safe insets
 */
export default function OverflowMenu(
  { navigation, children }: OverflowMenuProps
) {
  const menu = useVisible();
  const insets = useSafeAreaInsets();
  return (
    <Menu
      visible={menu.visible}
      onDismiss={menu.close}
      anchor={
        <IconButton
          icon="dots-vertical"
          onPress={menu.open}
          style={{ marginRight: Layout.padding }}
        />
      }
      statusBarHeight={insets.top}
    >
      <MenuContext.Provider
        value={{ closeMenuAfter: menu.closeAfter, navigation }}
        /*
         * For some reason we have to directly wrap the children with the
         * context provider. If instead we wrap `Menu` with it, the children
         * get `undefined` as the context value.
         */
      >
        {children}
      </MenuContext.Provider>
    </Menu>
  );
}

export type OverflowMenuItemProps = {
  label: string;
  linkTo: string;
};

OverflowMenu.Item = function ({ label, linkTo }: OverflowMenuItemProps) {
  const { closeMenuAfter, navigation } = React.useContext(MenuContext)!;
  return (
    <Menu.Item
      onPress={closeMenuAfter(() => navigation.navigate(linkTo))}
      title={label}
    />
  );
}
