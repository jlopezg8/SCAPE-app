import React from 'react';
import {
  FlexStyle,
  Platform,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import {
  Headline,
  HelperText as DefaultHelperText,
  IconButton,
  List,
  Paragraph,
  ProgressBar,
  Snackbar as DefaultSnackbar,
  Title,
} from 'react-native-paper';

import Layout from '../constants/Layout';

export type AlternativeStateProps = {
  wrapperStyle?: StyleProp<ViewStyle>;
  icon: string;
  title: string;
  tagline: string;
};

/**
 * Can be used for empty and error states.
 * @requires `'react-native-paper'.Provider` for the Material Design components
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

export type HelperTextProps = {
  label?: string;
  error?: boolean;
  helperText?: string;
  errorText?: string;
};

/**
 * @requires `'react-native-paper'.Provider` for the Material Design components
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
 * @requires `'react-native-paper'.Provider` for the Material Design components
 */
export function ListItem(props: React.ComponentProps<typeof List.Item>) {
  const { style, ...otherProps } = props;
  return <List.Item style={[styles.listItem, style]} {...otherProps} />;
}

ListItem.Icon = List.Icon;

/**
 * @requires react-native-paper.Provider for the Material Design components
 */
export function Logo({ style }: { style?: StyleProp<FlexStyle> }) {
  return (
    <Headline style={[{ textAlign: 'center', fontSize: 32 }, style]}>
      OnTime
    </Headline>
  );
}

/**
 * @requires `'react-native-paper'.Provider` for the Material Design components
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

export type SnackbarProps = {
  visible: boolean;
  onDismiss: () => void;
  message: string;
  wrapperStyle?: StyleProp<ViewStyle>;
};

/**
 * @requires `'react-native-paper'.Provider` for the Material Design components
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


const styles = StyleSheet.create({
  alternativeState: {
    flex: 1,
    alignItems: 'center',
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
