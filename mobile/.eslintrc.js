module.exports = {
  extends: ['../.eslintrc.js', '@react-native'],
  env: {
    'react-native/react-native': true,
  },
  plugins: ['react', 'react-native'],
  rules: {
    'react-native/no-unused-styles': 'error',
    'react-native/split-platform-components': 'error',
    'react-native/no-inline-styles': 'warn',
    'react-native/no-color-literals': 'warn',
  },
};