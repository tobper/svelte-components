<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { ClassValue } from 'svelte/elements';
	import CardHeader from './CardHeader.svelte';

	interface CardContent {
		children: Snippet;
		class?: ClassValue;
		horizontal?: boolean;
		header?: string;
		fill?: boolean;
	}

	let {
		children,
		class: element_class,
		horizontal = false,
		header,
		fill = false,
	}: CardContent = $props();
</script>

{#if header}
	<CardHeader text={header} />
{/if}

<div
	class={['card-content', element_class]}
	class:card-content--horizontal={horizontal}
	class:card-content--fill={fill}
>
	{@render children()}
</div>
