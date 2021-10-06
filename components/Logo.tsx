import React from 'react';
import { FlexStyle, StyleProp } from 'react-native';
import { Headline } from 'react-native-paper';

/**
 * @requires react-native-paper.Provider for the Material Design components
 */
export default ({ style }: { style?: StyleProp<FlexStyle> }) => (
  <Headline style={[{ textAlign: 'center', fontSize: 32 }, style]}>
    OnTime
  </Headline>
);
