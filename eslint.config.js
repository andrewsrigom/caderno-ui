import eslint from '@eslint/js'
import lit from 'eslint-plugin-lit'
import litA11y from 'eslint-plugin-lit-a11y'
import wc from 'eslint-plugin-wc'
import globals from 'globals'
import tseslint from 'typescript-eslint'

const elementFiles = ['packages/elements/src/**/*.ts']

export default tseslint.config(
  {
    ignores: [
      '**/coverage/**',
      '**/dist/**',
      '**/.astro/**',
      '**/.next/**',
      '**/out/**',
      '**/next-env.d.ts',
      '**/.artifacts/**',
      '**/node_modules/**',
      '**/playwright-report/**',
      '**/test-results/**',
      'packages/elements/custom-elements.json',
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    files: ['**/*.{cts,mts,ts,tsx}'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { fixStyle: 'inline-type-imports' },
      ],
      '@typescript-eslint/no-import-type-side-effects': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' },
      ],
    },
  },
  {
    files: elementFiles,
    plugins: {
      ...lit.configs['flat/recommended'].plugins,
      ...litA11y.configs.recommended.plugins,
      ...wc.configs['flat/best-practice'].plugins,
    },
    rules: {
      ...lit.configs['flat/recommended'].rules,
      ...litA11y.configs.recommended.rules,
      ...wc.configs['flat/best-practice'].rules,
      // Lit intentionally binds method listeners to the host element.
      '@typescript-eslint/unbound-method': 'off',
    },
  },
  {
    files: ['fixtures/**/*.{cts,mts,ts,tsx}'],
    ...tseslint.configs.disableTypeChecked,
  },
  {
    files: ['**/*.js', '**/*.mjs'],
    ...tseslint.configs.disableTypeChecked,
    languageOptions: {
      globals: globals.node,
    },
  },
)
