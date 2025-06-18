import { includeIgnoreFile } from '@eslint/compat';
import jsPluginEslint from '@eslint/js';
import prettierPluginEslint from 'eslint-config-prettier/flat';
import vuePluginEslint from 'eslint-plugin-vue';
import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import tsPluginEslint from 'typescript-eslint';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const gitignorePath = path.resolve(__dirname, '.gitignore');

export default [
  includeIgnoreFile(gitignorePath),
  /** Global eslint rules */
  {
    name: 'Global rules',
    files: ['**/*.{js,ts,vue}'],
    languageOptions: { ecmaVersion: 'latest' },
    extends: [jsPluginEslint.configs.recommended, ...tsPluginEslint.configs.recommended, prettierPluginEslint],
  },
  /** Client specific eslint rules */
  {
    name: '@fake-coin/client rules',
    files: ['apps/client/**/*.{ts,vue}'],
    languageOptions: { globals: globals.browser },
    extends: [vuePluginEslint.configs['flat/recommended']],
  },
];
