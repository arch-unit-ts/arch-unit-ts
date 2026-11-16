import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript';
import importX from 'eslint-plugin-import-x';
import prettier from 'eslint-plugin-prettier';
import globals from 'globals';

export default [
  { ignores: ['dist/'] },
  js.configs.recommended,
  ...tsPlugin.configs['flat/recommended'],
  importX.flatConfigs.errors,
  importX.flatConfigs.warnings,
  importX.flatConfigs.typescript,
  {
    languageOptions: {
      parser: tsParser,
      globals: globals.node,
    },
    plugins: {
      prettier,
    },
    rules: {
      quotes: ['error', 'single', { avoidEscape: true }],
      'comma-dangle': [
        'error',
        {
          arrays: 'always-multiline',
          objects: 'always-multiline',
          imports: 'always-multiline',
          exports: 'always-multiline',
          functions: 'never',
        },
      ],
      'import-x/order': [
        'error',
        {
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
          'newlines-between': 'always',
        },
      ],
      'prettier/prettier': [
        'error',
        {
          singleQuote: true,
          trailingComma: 'es5',
          printWidth: 140,
        },
      ],
    },
    settings: {
      'import-x/resolver-next': [createTypeScriptImportResolver({ alwaysTryTypes: true })],
      'import-x/core-modules': ['sinon'],
    },
  },
  {
    files: ['**/__tests__/*.{j,t}s?(x)', '**/*.spec.{j,t}s?(x)'],
    languageOptions: {
      globals: globals.jest,
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      'no-unused-vars': ['off'],
      'no-undef': ['off'],
    },
  },
];
