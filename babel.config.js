module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json', '.node'],
        alias: {
          '@features': './src/features',
          '@shared': './src/shared',
          '@services': './src/services',
          '@domain': './src/domain',
          '@navigation': './src/navigation',
          '@assets': './src/assets',
          '@store': './src/store',
        },
      },
    ],
    'react-native-reanimated/plugin',
  ],
};
