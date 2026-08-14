<script lang="ts">
	import type { Snippet } from 'svelte'
	import PageHeader from './PageHeader.svelte'
	import Render, { type Content } from './Render.svelte'

	interface PageContent {
		id?: string
		header?: string
		children: Snippet
		footer?: Content
	}

	let {
		id,
		header,
		children,
		footer,
	}: PageContent = $props()
</script>

<article class="page-content" {id}>
	{#if header}
		<PageHeader text={header} />
	{/if}

	{@render children()}

	{#if footer}
		<footer class="page-footer">
			<Render content={footer} />
		</footer>
	{/if}
</article>
