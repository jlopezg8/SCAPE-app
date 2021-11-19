module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['react-native-reanimated/plugin'],
    env: {
      production: {
        plugins: [
          // https://callstack.github.io/react-native-paper/getting-started.html
          'react-native-paper/babel',
          // https://github.com/goatandsheep/react-native-dotenv#usage
          ['module:react-native-dotenv', {
            'allowUndefined': false,
            'moduleName': 'react-native-dotenv',
          }],
        ],
      },
    },
  };
};
