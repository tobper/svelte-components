<script lang="ts">
	import { Device, device, Layout, ListItemLink, SidebarToggleButton, Theme, ToggleButton, type Scheme } from '$lib/index.js';
	import { IconAlignJustified, IconAppWindow, IconBrandGithub, IconCalendar, IconForms, IconList, IconMenu, IconMenu2, IconMessage, IconMoon, IconPalette, IconRectangle, IconSortAscendingNumbers, IconSun, IconTable, IconTypography, IconX } from '@tabler/icons-svelte';

	let { children, data } = $props();
	let { theme: current_theme } = data;
	let current_scheme = $state<Scheme>('system');

	const available_themes = [
		{ name: 'lines', text: 'Lines' },
		{ name: 'neomorphism', text: 'Neomorphism' },
	];

	const nav_items = [
		[IconTypography, 'Typography'],
		[IconPalette, 'Palette'],
		[IconRectangle, 'Button'],
		[IconMessage, 'Dialog'],
		[IconList, 'List'],
		[IconMenu, 'Menu'],
		[IconCalendar, 'Calendar'],
		[IconSortAscendingNumbers, 'Odometer'],
		[IconForms, 'Form'],
		[IconTable, 'Table'],
		[IconAlignJustified, 'Page content'],
	] as const;

	let header_and_footer_visible = $derived(!device.mobile || device.portrait);
</script>

<!-- <ElementClickOnMouseDown /> -->

<svelte:head>
	<title>Components · {available_themes.find(({ name }) => name === current_theme)!.text}</title>
</svelte:head>

<Theme
	palette={{
		// primary: 'oklch(75% 0.05 150)',
		// secondary: 'oklch(83% 0.1 84)',
		// tertiary: 'oklch(83% 0.075 220)',
		// background_light: '#e5e4e4',
		// background_dark: '#272625'
	}}
	scheme={current_scheme}
	style={current_theme}
/>

<Layout>
	{#snippet header({ sidebar_fixed })}
		{#if header_and_footer_visible}
			<div class="header">
				<div class="flow-items">
					<Device mobile={false}>
						{#if !sidebar_fixed}
							{@render sidebar_toggle()}
						{/if}
					</Device>

					<h1>Components</h1>
				</div>
				<ToggleButton
					animation="rotate"
					options={['light', 'dark', 'system'] as Array<Scheme>}
					value={current_scheme}
					onchange={new_scheme => current_scheme = new_scheme}
				>
					{#snippet content(scheme)}
						{#if scheme === 'light'}
							<IconSun />
						{:else if scheme === 'dark'}
							<IconMoon />
						{:else}
							<IconAppWindow />
						{/if}
					{/snippet}
				</ToggleButton>
			</div>
		{/if}
	{/snippet}

	{#snippet sidebar()}
		<nav>
			<ul>
				{#each nav_items as [Icon, text] (text)}
					<ListItemLink href={`#${text}`} {text}>
						{#snippet icon()}
							<Icon />
						{/snippet}
					</ListItemLink>
				{/each}
			</ul>
			<ul>
				<Device mobile>
					<hr />
				</Device>
				{#each available_themes as { name, text } (name)}
					{@const href = `?theme=${name}`}

					<ListItemLink {href} {text} />
				{/each}
			</ul>
		</nav>
	{/snippet}

	{#snippet main()}
		{@render children()}
	{/snippet}

	{#snippet footer()}
		{#if header_and_footer_visible}
			<div class="footer">
				<a class="link link--underlined" href="https://github.com/tobper/svelte-components" target="_blank">
					<IconBrandGithub />

					<Device mobile={false}>
						GitHub
					</Device>
				</a>

				<Device mobile>
					{@render sidebar_toggle()}
				</Device>
			</div>
		{/if}
	{/snippet}
</Layout>

{#snippet sidebar_toggle()}
	<SidebarToggleButton>
		{#snippet content(open)}
			{@const Icon = open ? IconX : IconMenu2}
			<Icon />
		{/snippet}
	</SidebarToggleButton>
{/snippet}

<style>
	:root {
		--layout__max-width: 1200px;
	}

	h1 {
		font-size: 1.25rem;
	}

	.header, .footer {
		padding-block: 1rem;

		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
	}

	.header {
		/* Do not add extra top padding if layout is already padded */
		padding-top: max(0px, 1rem - var(--layout__padding-top));
	}

	.footer {
		/* Do not add extra bottom padding if layout is already padded */
		padding-bottom: max(0px, 1rem - var(--layout__padding-bottom));
	}
</style>
