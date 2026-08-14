import js from '@eslint/js'
import svelte from 'eslint-plugin-svelte'
import globals from 'globals'
import ts from 'typescript-eslint'
import svelteConfig from './svelte.config.js'
import stylistic from '@stylistic/eslint-plugin'

// https://sveltejs.github.io/eslint-plugin-svelte/user-guide/#type-script-project

/** @type {import('eslint').Linter.Config[]} */
export default [
	js.configs.recommended,
	...ts.configs.recommended,
	...svelte.configs.recommended,
	{
		plugins: {
   		'@stylistic': stylistic
		}
	},
	{
		rules: {
			'comma-dangle': 'off',
			'semi': ['error', 'never'],
			'quotes': ['error', 'single', {
				allowTemplateLiterals: true
			}],
			// This reports false positives which is hard to get rid of without turning off the rule
			// https://github.com/sveltejs/eslint-plugin-svelte/issues/1353
			'svelte/no-navigation-without-resolve': 'off',
			// This just adds noise to code.
			// https://sveltejs.github.io/eslint-plugin-svelte/rules/prefer-svelte-reactivity/
			'svelte/prefer-svelte-reactivity': 'off',
			'@stylistic/member-delimiter-style': [
				'error',
				{
					'multiline': {
						'delimiter': 'none', // No semicolon or comma
						// 'requireLast': false // No delimiter at the end
					},
					'singleline': {
						'delimiter': 'semi', // Use commas in single-line interfaces
						// 'requireLast': false
					}
				}
			],
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
]
