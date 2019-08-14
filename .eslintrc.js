module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'script',
  },
  env: {
    commonjs: true,
    es6: true,
    node: true,
    mocha: true,
  },
  extends: [
    'airbnb-base',
  ],
  plugins: [
    'chai-friendly',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  rules: {
    strict: ['error', 'global'],
  },
  overrides: [
    {
      files: ['test/*.js'],
      rules: {
        // See https://github.com/lo1tuma/eslint-plugin-mocha/tree/master/docs/rules

        'prefer-arrow-callback': 'off',

        'space-before-function-paren': 'off',
        'func-names': 'off',
        'max-nested-callbacks': ['error', 4],

        // See https://github.com/ihordiachenko/eslint-plugin-chai-friendly#usage
        'no-unused-expressions': 'off',
        'chai-friendly/no-unused-expressions': 2,

        'prefer-destructuring': 'off',
      },
    },
  ],
};
