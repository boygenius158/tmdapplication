import js from '@eslint/js'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'

export default [
  { ignores: ['dist'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    settings: { react: { version: '18.3' } },
    plugins: {
      react,
      'react-hooks': reactHooks,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'react/jsx-no-target-blank': 'off', // Custom rule if needed
      // Allow window and sessionStorage in client-side code
      'no-restricted-globals': [
        'error',
        {
          name: 'event',
          message: 'Use local variables instead of the global "event".',
        },
      ],
    },
    env: {
      browser: true, // This allows access to browser-specific globals like window, document, sessionStorage, etc.
    },
  },
]
