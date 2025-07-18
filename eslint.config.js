import js from '@eslint/js';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';
import ts from 'typescript-eslint';
import svelteConfig from './svelte.config.js';

// https://sveltejs.github.io/eslint-plugin-svelte/user-guide/#type-script-project

/** @type {import('eslint').Linter.Config[]} */
export default [
	js.configs.recommended,
	...ts.configs.recommended,
	...svelte.configs.recommended,
	{
		rules: {
			'comma-dangle': 'off',
			'quotes': ['error', 'single', {
				allowTemplateLiterals: true
			}]
		}
	},
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node
			}
		}
	},
	{
		files: [
			'**/*.svelte',
			'**/*.svelte.ts'
		],
		languageOptions: {
			parserOptions: {
				extraFileExtensions: ['.svelte'],
				parser: ts.parser,
				projectService: true,
				svelteConfig,
			}
		}
	},
	{
		ignores: [
			'.svelte-kit/',
			'build/',
			'dist/'
		]
	}
];
