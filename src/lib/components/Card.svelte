<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Card {
		header?: string;
		children: Snippet;
		footer?: Snippet;
	}

	let {
		header,
		children,
		footer,
	}: Card = $props();
</script>

<div class="card">
	{#if header}
		<header>
			<h3>{header}</h3>
		</header>
	{/if}

	{@render children()}

	{#if footer}
		<footer class="card-footer">
			{@render footer()}
		</footer>
	{/if}
</div>
