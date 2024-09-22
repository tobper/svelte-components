<script lang="ts">
	import { base } from '$app/paths';
	import { page } from '$app/stores';
	import { ElementClickOnMouseDown, Layout, RadioButton, RadioGroup, Theme } from '$lib/index.js';
	import { settings } from './settings.svelte.js';

	let { children, data } = $props();
	let { theme: current_theme } = data;

	const available_themes = [
		{ name: 'lines', text: 'Lines' },
		{ name: 'neomorphism', text: 'Neomorphism' },
	];

	const nav = [
		{ path: 'theme', text: 'Theme' },
		{ path: 'button', text: 'Button' },
		{ path: 'form', text: 'Form' },
		{ path: 'table', text: 'Table' },
	];
</script>

<ElementClickOnMouseDown />

<Theme
	palette={{
		// primary: 'oklch(75% 0.05 150)',
		// secondary: 'oklch(83% 0.1 84)',
		// tertiary: 'oklch(83% 0.075 220)',
		// background_light: '#e5e4e4',
		// background_dark: '#272625'
	}}
	scheme={settings.scheme}
	style={current_theme}
/>

<Layout>
	{#snippet header()}
		<div class="header">
			<nav class="button-group">
				{#each available_themes as available_theme}
					<a
						aria-current={current_theme === available_theme.name ? 'page' : undefined}
						class="button-outlined"
						data-sveltekit-reload
						href={`?theme=${available_theme.name}`}
					>
						{available_theme.text}
					</a>
				{/each}
			</nav>
	
			<RadioGroup bind:selected_value={settings.scheme}>
				<RadioButton text="Dark" value="dark" />
				<RadioButton text="Light" value="light" />
				<RadioButton text="System" value="system" />
			</RadioGroup>
		</div>
	{/snippet}

	{#snippet sidebar()}
		<div class="sidebar">
			<div class="page-header"></div>
			<nav class="flow-items-vertical">
				{#each nav as { path, text }}
					<a class="link"
						aria-current={$page.route.id === `/${path}` ? 'page' : undefined}
						href={`${base}/${path}`}
					>{text}</a>
				{/each}
			</nav>
		</div>
	{/snippet}

	{#snippet main()}
		{@render children()}
	{/snippet}

	{#snippet footer()}
		<div class="footer">
			<a class="link link--underlined" href="https://github.com/tobper/svelte-components" target="_blank">GitHub</a>
		</div>
	{/snippet}
</Layout>

<style>
	:root {
		--layout__max-width: 1000px;
	}

	.header {
		padding-block: 1rem;

		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
	}

	.sidebar {
		width: 150px;
	}

	.footer {
		padding-block: 1rem;
	}
</style>