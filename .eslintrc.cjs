module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended-type-checked',
    'plugin:react-hooks/recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime'
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['tsconfig.json']
  },
  plugins: ['react-refresh', '@stylistic'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    '@stylistic/quotes': ['warn', 'single'],
    '@stylistic/no-extra-parens': 'warn',
    '@stylistic/comma-dangle': ['warn', 'always-multiline'],
    '@stylistic/jsx-quotes': 'warn',
    '@stylistic/spaced-comment': 'warn',
    '@stylistic/jsx-self-closing-comp': 'warn',
    '@stylistic/jsx-wrap-multilines': 'warn',
    '@typescript-eslint/consistent-type-imports': 'warn',
    'sort-imports': 'warn'
  },
}
