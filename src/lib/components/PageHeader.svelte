<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import { toggle_class } from '../css.js';
	import { interaction_observer } from '../html.js';
	import { get_layout_context } from './Layout.svelte';
	import Loading from './Loading.svelte';
	import Stack from './Stack.svelte';

	interface PageHeader {
		children?: Snippet;
		id?: string;
		loading?: boolean;
		href?: string;
		text?: unknown;
		sub_text?: unknown;
	}

	let {
		children,
		id,
		loading = false,
		href,
		text,
		sub_text,
	}: PageHeader = $props();

	let header_element = $state<HTMLElement>();

	onMount(() => {
		const layout_context = get_layout_context();

		$effect(() => {
			const observer = interaction_observer(
				header_element!,
				intersecting => toggle_class(header_element!, 'scroll-shadow', !intersecting),
				{ top: -layout_context.header_height }
			)

			return () => {
				observer.disconnect();
			}
		});
	});
</script>

<header class="page-header" {id} bind:this={header_element}>
	{#if text}
		<div class="text">
			<Stack horizontal>
				{#if href}
					<a class="link" {href}>
						<h2>
							{text}
						</h2>
					</a>
				{:else}
					<h2>
						{text}
					</h2>
				{/if}

				<div class="loading">
					<Loading bars visible={loading} />
				</div>
			</Stack>

			{#if sub_text}
				<div class="sub_text truncate">
					{sub_text}
				</div>
			{/if}
		</div>

		{#if children}
			<Stack horizontal>
				{@render children()}
			</Stack>
		{/if}
	{:else if children}
		{@render children()}
	{/if}
</header>

<style>
	.text {
		overflow: hidden;
	}

	.sub_text {
		color: var(--palette__secondary-color);
	}

	.loading {
		color: var(--palette__primary-color);
	}
</style>
