module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/vue3-essential',
    '@vue/airbnb',
  ],
  parserOptions: {
    parser: 'babel-eslint',
  },
  rules: {
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    'no-console': 1,
    'no-unused-vars': 1,
    'max-len': 0,
    'import/prefer-default-export': 0,
    'import/extensions': 0,
    'no-new': 0,
  },
};
