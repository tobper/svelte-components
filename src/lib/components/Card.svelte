<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { ClassValue } from 'svelte/elements';
	import CardContent from './CardContent.svelte';
	import CardFooter from './CardFooter.svelte';
	import CardHeader from './CardHeader.svelte';

	interface Card {
		class?: ClassValue;
		header?: string;
		children?: Snippet;
		content?: Snippet;
		footer?: Snippet;
	}

	let {
		class: card_class,
		header,
		children,
		content,
		footer,
	}: Card = $props();
</script>

<div class={['card', card_class]}>
	{#if header}
		<CardHeader text={header} />
	{/if}

	{#if content}
		<CardContent>
			{@render content()}
		</CardContent>
	{:else if children}
		{@render children()}
	{/if}

	{#if footer}
		<CardFooter>
			{@render footer()}
		</CardFooter>
	{/if}
</div>
