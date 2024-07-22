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
  ignorePatterns: ['dist', '.eslintrc.cjs', 'vite.config.ts'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['tsconfig.json']
  },
  plugins: ['react-refresh', '@stylistic'],
  rules: {
    '@stylistic/quotes': ['warn', 'single'],
    '@stylistic/no-extra-parens': ['warn', 'all', {
      ignoreJSX: 'multi-line'
    }],
    '@stylistic/comma-dangle': ['warn', 'always-multiline'],
    '@stylistic/jsx-quotes': 'warn',
    '@stylistic/spaced-comment': 'warn',
    '@stylistic/jsx-self-closing-comp': 'warn',
    '@stylistic/jsx-wrap-multilines': 'warn',
    '@typescript-eslint/consistent-type-imports': 'warn',
    '@typescript-eslint/no-base-to-string': ['warn', {
      ignoredTypeNames: ['Error', 'FormDataEntryValue', 'RegExp', 'URL', 'URLSearchParams']
    }],
    '@typescript-eslint/no-unused-vars': ['error', {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
      caughtErrorsIgnorePattern: '^_'
    }],
    'sort-imports': ['warn', {
      ignoreDeclarationSort: true,
      ignoreCase: true,
    }]
  },
}
