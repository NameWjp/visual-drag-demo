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
    'import/no-extraneous-dependencies': [2, { devDependencies: true }],
    'no-console': 1,
    'no-unused-vars': 1,
    'max-len': 0,
    'import/prefer-default-export': 0,
    'import/extensions': 0,
    'no-new': 0,
    'prefer-destructuring': 0,
    'no-plusplus': 0,
    'arrow-parens': 0,
    'no-shadow': 0,
    'no-mixed-operators': 0,
    'no-param-reassign': 0,
    'prefer-template': 0,
    'object-curly-newline': 0,
    'no-constant-condition': [2, { checkLoops: false }],
    'no-lonely-if': 0
  },
};
