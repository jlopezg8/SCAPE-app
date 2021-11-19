const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  // Customize the config before returning it.

  // https://github.com/react-native-web-community/react-native-web-maps#getting-started
  Object.assign(config.resolve.alias, {
    'react-native': 'react-native-web',
    'react-native-maps': 'react-native-web-maps',
  });

  return config;
};
