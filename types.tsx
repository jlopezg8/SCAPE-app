/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { StackScreenProps } from '@react-navigation/stack';

export type MainStackParamList = {
  Home: undefined;
  NewEmployee: undefined;
  RecordAttendance: undefined;
  Settings: undefined;
};

export type MainStackScreensProps = {
  [Screen in keyof MainStackParamList]:
    StackScreenProps<MainStackParamList, Screen>;
};
