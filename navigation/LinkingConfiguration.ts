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
          NewEmployee: 'new-employee',
          RecordAttendance: 'record-attendance',
          Settings: 'settings',
          Workplace: 'workplace/:id',
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
