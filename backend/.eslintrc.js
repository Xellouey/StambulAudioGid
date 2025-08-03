module.exports = {
  root: true,
  env: {
    node: true,
    es2021: true,
  },
  extends: ['eslint:recommended', 'prettier'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error',
    'no-unused-vars': 'error',
    'no-console': 'warn',
  },
  overrides: [
    {
      files: ['**/*.test.js'],
      env: {
        jest: true,
      },
    },
    {
      files: ['scripts/**/*.js', '**/seed.js', 'test-*.js', 'verify-*.js'],
      rules: {
        'no-console': 'off',
        'no-undef': 'off',
      },
    },
  ],
  ignorePatterns: [
    'dist/',
    'build/',
    'node_modules/',
    '.strapi/',
    'public/',
    'types/generated/',
    'src/admin/*.example.*',
  ],
};
