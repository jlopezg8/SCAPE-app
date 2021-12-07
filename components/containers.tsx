import { useHeaderHeight } from '@react-navigation/stack';
import React from 'react';
import {
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Surface as DefaultSurface } from 'react-native-paper';

import Layout from '../constants/Layout';
import { useRefreshControl } from '../hooks';

/**
 * @requires `'react-native-paper'.Provider` for the Material Design components
 */
export function ScrollViewInSurface(
  {
    style,
    contentContainerStyle,
    children,
    ...otherProps
  }: React.ComponentProps<typeof ScrollView> & { children?: React.ReactNode }
) {
  return (
    <ScrollView
      style={[styles.scrollViewInSurface, style]}
      contentContainerStyle={
        [styles.scrollViewInSurfaceContentContainer, contentContainerStyle]
      }
      {...otherProps}
    >
      {children}
    </ScrollView>
  );
}

/**
 * Why not make `ScrollViewInSurface` accept an optional `refetch` prop and
 * conditionally render a `RefreshControl`? Because `RefreshControl` requires
 * some hooks, and we can't conditionally call those hooks. In theory we could
 * create a component that calls those hooks and returns the `RefreshControl`,
 * and then we could conditionally render that component. However, there's a
 * bug in React Native (https://github.com/facebook/react-native/issues/32144)
 * where if we pass a component to the `refreshControl` prop whose type (name)
 * differs from `RefreshControl`, the children won't render (even on web).
 * @requires `'react-native-paper'.Provider` for the Material Design components
 */
export function ScrollViewInSurfaceWithRefetch(
  {
    refetch,
    progressViewOffset,
    ...otherProps
  }: React.ComponentProps<typeof ScrollViewInSurface> & {
    refetch: () => Promise<unknown>;
    progressViewOffset?: number;
  }
) {
  const [refreshing, onRefresh] = useRefreshControl(refetch);
  return (
    <ScrollViewInSurface
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          progressViewOffset={progressViewOffset}
        />
      }
      {...otherProps}
    />
  );
}

/**
 * @requires `'react-native-paper'.Provider` for the Material Design components
 */
export function Surface(props: React.ComponentProps<typeof DefaultSurface>) {
  const { style, ...otherProps } = props;
  return <DefaultSurface style={[styles.surface, style]} {...otherProps} />;
}

/**
 * @requires `StackNavigator`
 * @requires `'react-native-paper'.Provider` for the Material Design components
 */
 export function SurfaceInStackNav(
  { style, ...otherProps }: React.ComponentProps<typeof DefaultSurface>
  ) {
  const headerHeight = useHeaderHeight();
  const containerStyle = {
    maxHeight: Platform.OS === 'web'
      ? Layout.window.height - headerHeight
      : undefined,
  };
  return (
    <DefaultSurface
      style={[styles.surface, containerStyle, style]}
      {...otherProps}
    />
  );
}

const styles = StyleSheet.create({
  scrollViewInSurface: {
    margin: -Layout.padding,
  },
  scrollViewInSurfaceContentContainer: {
    padding: Layout.padding,
  },
  surface: {
    flex: 1,
    padding: Layout.padding,
  },
});
