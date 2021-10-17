import { ParamListBase } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { IconButton } from 'react-native-paper';

import Layout from '../constants/Layout';
import { Menu } from './styled';

export type OverflowMenuProps = {
  navigation: StackNavigationProp<ParamListBase, keyof ParamListBase>;
  /**
   * Should be OverflowMenu.Item(s), but we can't type check it (
   * https://github.com/microsoft/TypeScript/issues/13618)
   */
  children: React.ReactNode;
};

/**
 * @requires react-native-paper.Provider for the Material Design components
 * @requires react-native-safe-area-context.SafeAreaProvider for insets
 */
export default function OverflowMenu(
  { navigation, children }: OverflowMenuProps
) {
  return (
    <Menu
      anchor={openMenu =>
        <IconButton
          icon="dots-vertical"
          onPress={openMenu}
          style={{ marginRight: Layout.padding }}
          accessibilityLabel="Abrir menú de opciones"
        />
      }
      items={closeMenuAfter =>
        <MenuContext.Provider
          value={{ closeMenuAfter, navigation }}
          /*
           * For some reason we have to directly wrap the children with the
           * context provider. If instead we wrap `Menu` with it, the children
           * get `undefined` as the context value.
           */
        >
          {children}
        </MenuContext.Provider>
      }
    />
  );
}

type MenuContextType = {
  closeMenuAfter: (fn: () => void) => () => void;
  navigation: OverflowMenuProps['navigation'];
};

const MenuContext =
  React.createContext<MenuContextType | undefined>(undefined);

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
