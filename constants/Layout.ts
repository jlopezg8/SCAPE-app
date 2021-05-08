import { Dimensions } from 'react-native';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default {
  window: {
    width,
    height,
  },
  // According to https://material.io/design/layout/responsive-layout-grid.html#breakpoints:
  isSmallDevice: width < 720,
  padding: width < 720? 16 : 24,
};
