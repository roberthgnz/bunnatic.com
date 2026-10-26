import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'

const configDirectory = dirname(fileURLToPath(import.meta.url))

const compat = new FlatCompat({
  baseDirectory: configDirectory,
})

const eslintConfig = [
  {
    ignores: ['.next/**', 'node_modules/**', 'dist/**', '.wrangler/**', 'worker-configuration.d.ts', 'next-env.d.ts'],
  },
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
    },
  },
]

export default eslintConfig
