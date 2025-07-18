<script lang="ts">
	import type { Snippet } from 'svelte';
	import CardHeader from './CardHeader.svelte';

	interface CardContent {
		children: Snippet;
		horizontal?: boolean;
		header?: string;
		fill?: boolean;
	}

	let {
		children,
		horizontal = false,
		header,
		fill = false,
	}: CardContent = $props();
</script>

{#if header}
	<CardHeader text={header} />
{/if}

<div
	class="card-content"
	class:card-content--horizontal={horizontal}
	class:card-content--fill={fill}
>
	{@render children()}
</div>
