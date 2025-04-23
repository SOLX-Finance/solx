import nx from '@nx/eslint-plugin';
import eslint from '@eslint/js';
import tanstackQueryPlugin from '@tanstack/eslint-plugin-query';
import prettierConfig from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import prettierPlugin from 'eslint-plugin-prettier';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import svgJsxPlugin from 'eslint-plugin-svg-jsx';
import tseslint from 'typescript-eslint';

export default [
  // Base configurations
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  eslint.configs.recommended,
  ...tseslint.configs.recommended,

  // Ignore patterns
  {
    ignores: [
      '**/dist',
      '**/.nx',
      '**/vite.config.*.timestamp*',
      '**/vitest.config.*.timestamp*',
    ],
  },

  // Language options configuration
  {
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        window: 'readonly',
        document: 'readonly',
        process: 'readonly',
        module: 'writable',
        require: 'readonly',
        __dirname: 'readonly',
      },
    },
  },

  // Nx module boundaries
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    plugins: { '@nx': nx },
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?js$'],
          depConstraints: [
            {
              sourceTag: '*',
              onlyDependOnLibsWithTags: ['*'],
            },
          ],
        },
      ],
    },
  },

  // Import plugin configuration
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    plugins: { import: importPlugin },
    rules: {
      'import/order': [
        'error',
        {
          groups: [
            'external',
            'builtin',
            'index',
            'sibling',
            'parent',
            'internal',
            'object',
          ],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
    },
  },

  // React configuration
  {
    files: ['**/*.tsx', '**/*.jsx'],
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },

  // TanStack Query plugin configuration
  {
    plugins: { '@tanstack/query': tanstackQueryPlugin },
    rules: tanstackQueryPlugin.configs.recommended.rules,
  },

  // SVG JSX plugin configuration
  {
    plugins: { 'svg-jsx': svgJsxPlugin },
    rules: {
      'svg-jsx/camel-case-dash': 'error',
      'svg-jsx/camel-case-colon': 'error',
      'svg-jsx/no-style-string': 'error',
    },
  },

  // TypeScript-specific rules
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
    },
  },

  // Webpack config override
  {
    files: ['**/webpack.config.js', '**/webpack.config.*.js'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
      'import/no-commonjs': 'off',
      'no-commonjs': 'off',
    },
  },

  // Prettier integration (should be last)
  {
    plugins: { prettier: prettierPlugin },
    rules: {
      ...prettierConfig.rules,
      'prettier/prettier': 'error',
    },
  },
];
