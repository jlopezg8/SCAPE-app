/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { StackScreenProps } from '@react-navigation/stack';

export type RootStackParamList = {
  Login: undefined;
  Admin: undefined;
  Employer: undefined;
  Employee: undefined;
  NotFound: undefined;
};

export type AdminStackParamList = {
  Home: undefined;
  Settings: undefined;
};

export type EmployerStackParamList = {
  Home: undefined;
  CreateEmployee: { workplaceId: number };
  RecordAttendance: undefined;
  Settings: undefined;
  Workplace: { id: number };
};

export type EmployerStackScreensProps = {
  [Screen in keyof EmployerStackParamList]:
    StackScreenProps<EmployerStackParamList, Screen>;
};

export type EmployeeStackParamList = {
  Home: undefined;
  Settings: undefined;
};
