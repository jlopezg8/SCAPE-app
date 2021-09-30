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
        screens: {
          Home: '',
          Settings: 'settings',
        },
      },
      Employer: {
        initialRouteName: 'Home',
        screens: {
          Home: '',
          NewEmployee: 'new-employee',
          RecordAttendance: 'record-attendance',
          Settings: 'settings',
        },
      },
      Employee: {
        initialRouteName: 'Home',
        screens: {
          Home: '',
          Settings: 'settings',
        },
      },
      NotFound: '*',
    },
  },
};
