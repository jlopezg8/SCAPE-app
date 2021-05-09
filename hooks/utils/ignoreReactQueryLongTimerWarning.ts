import { Platform } from 'react-native';

if (Platform.OS !== 'web') {
  (async function () {
    const { LogBox } = await import('react-native');
    LogBox.ignoreLogs([
      /Saw setTimeout with duration 300000ms/,
      /datetimepicker/,
      /StatusBar/,
    ]);
  })();
}
