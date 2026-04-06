import eslint from '@eslint/js';
import eslintConfigPrettierFlat from 'eslint-config-prettier/flat';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig(
    globalIgnores(['eslint.config.mjs']),
    eslint.configs.recommended,
    tseslint.configs.recommendedTypeChecked,
    tseslint.configs.stylisticTypeChecked,
    {
        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.vitest,
            },
            sourceType: 'commonjs',
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
    },
    {
        files: ['**/*.ts', '**/*.mts', '**/*.cts'],
        rules: {
            '@typescript-eslint/no-unused-vars': 'off',
        },
    },
    {
        files: ['**/*.js', '**/*.mjs', '**/*.cjs'],
        rules: {},
    },
    eslintConfigPrettierFlat
);
