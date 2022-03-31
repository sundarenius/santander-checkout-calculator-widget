const errorLevel = process.env.NODE_ENV === 'production' ? 'error' : 'warn';

module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  parser: '@typescript-eslint/parser',
  overrides: [
    {
      files: ['*.ts', '*.tsx'], // Your TypeScript files extension
      parserOptions: {
        project: ['./tsconfig.json'], // Specify it only for TypeScript files
      },
    }
  ],
  extends: [
    'plugin:react/recommended',
    'airbnb',
  ],
  settings: {
    'import/resolver': {
      node: {
        paths: ['src'],
        extensions: [
          '.ts',
          '.tsx',
          '.js',
          '.jsx',
        ],
      },
    },
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    'react',
    '@typescript-eslint',
    'react-hooks',
  ],
  globals: {
    JSX: true,
  },
  rules: {
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    'react/jsx-filename-extension': ['warn', { extensions: ['.tsx'] }],
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': ['error'],

    // Prevent boolean variables without prefix
    '@typescript-eslint/naming-convention': [
      errorLevel,
      {
        selector: 'variable',
        types: ['boolean'],
        format: ['PascalCase'],
        prefix: ['is', 'has', 'should'],
      },
    ],

    'import/extensions': [
      'error',
      'ignorePackages',
      {
        ts: 'never',
        tsx: 'never',
      },
    ],
    'max-len': ['warn', { code: 105 }],
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'react/prop-types': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'no-param-reassign': 'off',
    'import/order': 'off',
    'react/jsx-one-expression-per-line': 'off',
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/consistent-type-imports': 'warn',
    'no-debugger': errorLevel,
    'no-unused-vars': 'warn',
    'consistent-return': 'off',
    'arrow-body-style': 'warn',
    'semi': 'warn',
    'implicit-arrow-linebreak': 'off',
    'import/prefer-default-export': 'off',
  },
};
