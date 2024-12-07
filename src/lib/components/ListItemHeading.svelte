<script lang="ts">
	import type { Snippet } from 'svelte';

	interface ListItemHeading {
		text?: string;
		children?: Snippet;
	}

	let {
		text,
		children,
	}: ListItemHeading = $props();
</script>

<li class="list-item-heading" role="heading" aria-level={4}>
	{#if text}
		{text}
	{/if}

	{#if children}
		{@render children()}
	{/if}
</li>
