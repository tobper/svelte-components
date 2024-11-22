<script lang="ts">
	import type { Snippet } from 'svelte';
	import { classes } from '../classes';
	import CardContent from './CardContent.svelte';
	import CardFooter from './CardFooter.svelte';
	import CardHeader from './CardHeader.svelte';

	interface Card {
		class?: string;
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

<div class={classes('card', card_class)}>
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
