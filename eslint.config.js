import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

// Файла конфигурации не было вовсе, поэтому `npm run lint` падал с
// "ESLint couldn't find an eslint.config.js" — линтер в проекте не запускался
// ни разу, хотя четыре его пакета стояли в devDependencies.
export default tseslint.config(
  { ignores: ['dist', 'node_modules'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      // Неиспользуемое имя — ошибка, но префикс _ оставляет способ явно
      // отбросить значение (например, `const { id: _id, ...fields } = updates`).
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },
  {
    files: ['*.config.js', 'scripts/**/*.mjs'],
    languageOptions: { globals: globals.node },
  },
)
