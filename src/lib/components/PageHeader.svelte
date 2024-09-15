<script lang="ts">
	import { toggle_class } from '$lib/css.js';
	import { interaction_observer } from '$lib/html.js';
	import { onMount, type Snippet } from 'svelte';
	import { get_layout_context } from './Layout.svelte';
	import Loading from './Loading.svelte';

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
		let header_observer: ReturnType<typeof interaction_observer> | undefined;

		$effect(() => {
			header_observer?.disconnect();
			header_observer = interaction_observer(
				header_element!,
				intersecting => toggle_class(header_element!, 'scroll-shadow', !intersecting),
				{ top: -layout_context.header_height }
			)
		});

		return function onUnmount() {
			header_observer?.disconnect();
		};
	});
</script>

<header class="page-header" {id} bind:this={header_element}>
	{#if text}
		<div class="text">
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

			{#if sub_text}
				<p>
					{sub_text}
				</p>
			{/if}

			<Loading bars large visible={loading} />
		</div>
	{/if}

	{@render actions()}
</header>

{#snippet actions()}
	{#if children}
		<div class="actions flow-items">
			{@render children()}
		</div>
	{/if}	
{/snippet}

<style>
	.text:has(h2) {
		display: grid;
		grid-template:
			"text status actions"
			/ auto 1fr auto;
	}

	.text:has(p) {
		grid-template:
			"text status actions"
			"sub_text sub_text actions"
			/ auto 1fr auto;
	}

	.text:has(p) h2,
	.text:has(p) > :global([role=status]) {
		align-self: end;
	}

	h2 {
		grid-area: text;
	}

	p {
		align-self: start;
		color: var(--palette__secondary);
		grid-area: sub_text;
	}

	.actions {
		grid-area: actions;
	}

	.page-header > :global([role=status]) {
		color: var(--palette__primary-color);
		grid-area: status;
		margin-left: 1rem;
	}
</style>
