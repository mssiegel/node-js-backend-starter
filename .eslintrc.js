module.exports = {
  extends: ['airbnb-base', 'plugin:jest/recommended'],
  plugins: ['jest'],
  env: {
    node: true,
    'jest/globals': true,
  },
  rules: {
    'linebreak-style': 0,
    semi: 0,
    'no-console': 0,
    'object-curly-newline': 0,
    'no-underscore-dangle': 0,
    'no-return-await': 0,
    'func-names': 0,
    'prefer-destructuring': 0,
    'no-use-before-define': ['error', { functions: false }],
    'one-var': 0,
    'one-var-declaration-per-line': 0,
    'max-len': ['error', { code: 120 }],
  },
}
