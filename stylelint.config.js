export default {
  extends: ['stylelint-config-standard'],
  ignoreFiles: [
    '**/coverage/**',
    '**/dist/**',
    '**/out/**',
    '**/.next/**',
    '**/.artifacts/**',
    '**/node_modules/**',
    '**/playwright-report/**',
    '**/test-results/**',
  ],
  rules: {
    'custom-property-pattern': [
      '^(cad-|docs-|_)[a-z0-9-]+$',
      {
        message:
          'Library properties use --cad-*, docs properties use --docs-*, and private properties use --_*.',
      },
    ],
    'custom-property-empty-line-before': null,
    'no-descending-specificity': null,
    'value-keyword-case': null,
  },
}
