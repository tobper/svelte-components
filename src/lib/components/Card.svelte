<script lang="ts">
	import type { Snippet } from 'svelte'
	import type { ClassValue } from 'svelte/elements'
	import CardContent from './CardContent.svelte'
	import CardFooter from './CardFooter.svelte'
	import CardHeader from './CardHeader.svelte'
	import Render, { type Content } from './Render.svelte'

	interface Card {
		class?: ClassValue
		header?: string
		children?: Snippet
		content?: Content
		footer?: Content
	}

	let {
		class: card_class,
		header,
		children,
		content,
		footer,
	}: Card = $props()
</script>

<div class={['card', card_class]}>
	{#if header}
		<CardHeader text={header} />
	{/if}

	{#if content}
		<CardContent>
			<Render {content} />
		</CardContent>
	{:else if children}
		{@render children()}
	{/if}

	{#if footer}
		<CardFooter>
			<Render content={footer} />
		</CardFooter>
	{/if}
</div>
