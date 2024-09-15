<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Card {
		children: Snippet;
		header?: string;
	}

	let {
		children,
		header
	}: Card = $props();
</script>

<div class="card">
	{#if header}
		<h3>{header}</h3>
	{/if}

	{@render children()}
</div>
