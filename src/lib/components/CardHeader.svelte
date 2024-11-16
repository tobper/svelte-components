<script lang="ts">
    import type { Snippet } from 'svelte';

	interface CardHeader {
		text?: string;
		children?: Snippet;
	}

	let {
		text,
		children,
	}: CardHeader = $props();
</script>

<header class="card-header">
	{#if children}
		{@render children()}
	{:else}
		<h3>{text ?? '...'}</h3>
	{/if}
</header>
