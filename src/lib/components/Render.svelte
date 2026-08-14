<script lang="ts" module>
	export type Content = Component | Snippet
</script>

<script lang="ts">
	import { is_snippet } from '$lib/snippets'
	import type { Component, Snippet } from 'svelte'

	export interface RenderProps {
		content: Content | string
	}

	const { content }: RenderProps = $props()
</script>


{#if typeof content === 'string'}
	{content}
{:else if is_snippet(content)}
	{@render content()}
{:else}
	{const Content = content}
	<Content />
{/if}
