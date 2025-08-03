module.exports = {
  extends: ['../.eslintrc.js'],
  env: {
    node: true,
    jest: true,
  },
  rules: {
    'no-console': 'off', // Разрешаем console.log в backend
  },
};