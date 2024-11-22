<script lang="ts">
	import type { Snippet } from 'svelte';
	import PageHeader from './PageHeader.svelte';

	interface PageContent {
		id?: string;
		header?: string;
		children: Snippet;
		footer?: Snippet;
	}

	let {
		id,
		header,
		children,
		footer,
	}: PageContent = $props();
</script>

<article class="page-content" {id}>
	{#if header}
		<PageHeader text={header} />
	{/if}

	{@render children()}

	{#if footer}
		<footer class="page-footer">
			{@render footer()}
		</footer>
	{/if}
</article>
