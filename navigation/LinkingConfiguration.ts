/**
 * Learn more about deep linking with React Navigation
 * https://reactnavigation.org/docs/deep-linking
 * https://reactnavigation.org/docs/configuring-links
 */

import { LinkingOptions } from '@react-navigation/native';
import { makeUrl as makeLinkingURL } from 'expo-linking';

let linking: LinkingOptions;
export default linking = {
  prefixes: [makeLinkingURL('/')],
  config: {
    screens: {
      Login: 'login',
      Admin: {
        initialRouteName: 'Home',
        path: 'admin',
        screens: {
          Home: '',
          Settings: 'settings',
        },
      },
      Employer: {
        initialRouteName: 'Home',        
        path: 'employer',
        screens: {
          Home: '',
          Workplace: {
            path: 'workplace/:id',
            parse: { id: Number },
          },
          CreateEmployee: {
            path: 'workplace/:workplaceId/create-employee',
            parse: { workplaceId: Number },
          },
          RecordAttendance: 'record-attendance',
          EditEmployee: 'edit-employee/:idDoc',
          Settings: 'settings',
        },
      },
      Employee: {
        initialRouteName: 'Home',
        path: 'employee',
        screens: {
          Home: '',
          Settings: 'settings',
        },
      },
      NotFound: '*',
    },
  },
};
