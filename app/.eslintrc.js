module.exports = {
  extends: [
    // add more generic rulesets here, such as:
    'eslint:recommended',
    'plugin:prettier/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2017,
  },
  env: {
    node: true,
    es6: true,
    jest: true,
  },
  rules: {
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
      },
    ],
  },
};
